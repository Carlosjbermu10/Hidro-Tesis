import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  GetAllEstacionesWithDetailsForReport,
  obtenerDossierPorId,
} from "../../services/pdf/est_bombeo_reporte.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const exportEstacionesPDF = async (req, res) => {
  try {
    // 1. Obtener los datos cruzados con el nuevo query relacional
    const estaciones = await GetAllEstacionesWithDetailsForReport();

    // 2. Localizar plantilla EJS
    const templatePath = path.join(
      __dirname,
      "../../views/reports/est_bombeo.ejs",
    );

    // 3. Rutas exactas provistas de tus imágenes
    const logoGobiernoPath = path.join(
      process.cwd(),
      "src/public/pdf/logo_gobierno.jpg",
    );
    const logoMinaguasPath = path.join(
      process.cwd(),
      "src/public/pdf/logo_minaguas.png",
    );

    let logoGobiernoBase64 = "";
    let logoMinaguasBase64 = "";

    // 4. Convertir imágenes a Base64 de forma segura
    if (fs.existsSync(logoGobiernoPath)) {
      logoGobiernoBase64 = `data:image/jpeg;base64,${fs.readFileSync(logoGobiernoPath).toString("base64")}`;
    }
    if (fs.existsSync(logoMinaguasPath)) {
      logoMinaguasBase64 = `data:image/png;base64,${fs.readFileSync(logoMinaguasPath).toString("base64")}`;
    }

    // 5. Obtener marca de tiempo de generación
    const fechaActual = new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // 6. Compilar HTML
    const htmlRenderizado = await ejs.renderFile(templatePath, {
      estaciones: estaciones,
      fecha: fechaActual,
      logoGobierno: logoGobiernoBase64,
      logoMinaguas: logoMinaguasBase64,
    });

    // 7. Iniciar Renderizador en segundo plano (Puppeteer)
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlRenderizado, { waitUntil: "networkidle0" });

    // 8. Generar el PDF físico en formato Horizontal
    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm",
      },
    });

    // Cerrar instancia de procesamiento para cuidar la RAM
    await browser.close();

    // 9. Servir el archivo directamente a la pantalla del operador
    res.contentType("application/pdf");
    res.setHeader(
      "Content-Disposition",
      "inline; filename=Fichas_Tecnicas_Estaciones.pdf",
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error crítico en la generación del PDF:", error);
    res.status(500).send({
      status: "error",
      description:
        "Error interno del servidor al procesar la exportación del reporte técnico",
      error: error.message,
    });
  }
};

//Genera y exporta el Dossier Técnico PDF de una estación de bombeo específica
export const generarPdfEstacion = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Obtener toda la data consolidada desde el servicio
    const dossierData = await obtenerDossierPorId(id);

    // Si la estación no existe, retornamos error seguro
    // Si la data viene nula, indefinida, o es un arreglo vacío
    if (
      !dossierData ||
      (Array.isArray(dossierData) && dossierData.length === 0)
    ) {
      return res.status(200).json({
        success: false,
        message: `La estación de bombeo con ID ${id} no existe o no tiene datos registrados.`,
        data: null,
      });
    }

    // 2. Rutas exactas provistas de tus imágenes
    const logoGobiernoPath = path.join(
      process.cwd(),
      "src/public/pdf/logo_gobierno.jpg",
    );
    const logoMinaguasPath = path.join(
      process.cwd(),
      "src/public/pdf/logo_minaguas.png",
    );

    let logoGobierno = "";
    let logoMinaguas = "";

    if (fs.existsSync(logoGobiernoPath)) {
      logoGobierno = `data:image/png;base64,${fs.readFileSync(logoGobiernoPath, "base64")}`;
    }
    if (fs.existsSync(logoMinaguasPath)) {
      logoMinaguas = `data:image/png;base64,${fs.readFileSync(logoMinaguasPath, "base64")}`;
    }

    // 3. Renderizar la plantilla EJS pasando toda la estructura de datos unificada
    // Usamos res.render para compilar el HTML antes de enviarlo a Puppeteer
    res.render(
      "reports/one_est_bombeo.ejs",
      {
        data: dossierData,
        logoGobierno,
        logoMinaguas,
        fechaReporte: new Date().toLocaleDateString("es-VE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
      async (err, htmlContenido) => {
        if (err) {
          console.error("Error al compilar la plantilla EJS:", err);
          return res
            .status(500)
            .send("Error al procesar la plantilla del reporte.");
        }

        // 4. Inicializar Puppeteer para la conversión a PDF de alta fidelidad
        const browser = await puppeteer.launch({
          headless: "new",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();

        // Seteamos el HTML compilado por EJS
        await page.setContent(htmlContenido, { waitUntil: "networkidle0" });

        // Generamos el PDF con orientación horizontal para mantener la uniformidad
        const pdfBuffer = await page.pdf({
          format: "A4",
          landscape: true,
          printBackground: true,
          margin: {
            top: "0mm",
            right: "0mm",
            bottom: "0mm",
            left: "0mm",
          },
        });

        await browser.close();

        // 5. Configurar cabeceras de descarga y transmitir el PDF binario
        const nombreArchivo = `Ficha_Tecnica_${dossierData.estacion.nombre_est.replace(/\s+/g, "_")}.pdf`;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `inline; filename="${nombreArchivo}"`,
        );

        return res.send(pdfBuffer);
      },
    );
  } catch (error) {
    console.error(
      "Error crítico en el controlador de reporte específico:",
      error,
    );
    return res.status(500).send("Error interno al generar el archivo PDF.");
  }
};
