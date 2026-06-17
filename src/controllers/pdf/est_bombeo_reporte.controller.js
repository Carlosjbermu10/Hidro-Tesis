import puppeteer from "puppeteer";
import ejs from "ejs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GetAllEstacionesWithDetailsForReport } from "../../services/pdf/est_bombeo_reporte.service.js";

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
