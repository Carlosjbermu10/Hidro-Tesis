import fs from "fs-extra";
import path from "path";

import {
  SearchGeneradorId,
  SearchFotoGeneradorId,
  ReturnFotoGeneradorId_public,
  GetFotosByGeneradorId,
  RegisterFotoGenerador,
  DeleteFotoGeneradorId,
} from "../../services/generador/generador_fotos.service.js";

// 🔗 IMPORTAMOS LA BITÁCORA
import { InsertarBitacora } from "../../services/bitacora/bitacora.service.js";

import { uploadClo, deleteClo } from "../../helpers/cloudinary.js";

//IMPORTAMOS E UTILIZAMOS CLOUDINARY
import { cloud } from "../../helpers/cloudinary.js";

export const getFoto_Generador = async (req, res) => {
  try {
    const id_generador = req.params.id;

    //Validamos primero si El Generador existe
    const search_gene = await SearchGeneradorId(id_generador);
    if (search_gene === 0) {
      return res.send({
        status: "mal",
        description: "El Generador no se encuentra registrada",
      });
    }

    //Traemos todas las fotos asociadas a ese Generador
    const fotos = await GetFotosByGeneradorId(id_generador);

    //Respondemos al Front con el array de imágenes (si no tiene, devolverá un array vacío [])
    res.send({
      status: "ok",
      description: "Imágenes del Generador recuperadas con éxito",
      data: fotos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};

export const postFoto_Generador = async (req, res) => {
  try {
    // se reciben la variable que viene por parametros
    const id_generador = req.params.id;

    //console.log(req.file.path);
    //Se valida que existan archivos en el arreglo req.files
    if (!req.files || req.files.length === 0) {
      return res.send({
        status: "mal",
        description: "Tiene que seleccionar al menos una imagen",
      });
    }

    //Se Comprueba si El Generador existe
    const search_gene = await SearchGeneradorId(id_generador);
    if (search_gene === 0) {
      // Si no existe el Generador, se eliminan todas las fotos temporales del servidor
      for (const file of req.files) {
        await fs.unlink(file.path);
      }
      return res.send({
        status: "mal",
        description: "El Generador no se encuentra registrada",
      });
    }

    const resultadosRegistros = [];

    // Ciclo para procesar y subir cada una de las imágenes enviadas
    for (const file of req.files) {
      // Sube la imagen actual a Cloudinary
      const result = await uploadClo(file.path);

      // Mapeo del objeto con los nombres exactos de tu base de datos relacional
      const foto_generador_data = {
        generador_id: id_generador,
        foto_url: result.secure_url,
        foto_public_id: result.public_id,
      };

      // Invoca tu servicio de registro
      const registro = await RegisterFotoGenerador(foto_generador_data);
      resultadosRegistros.push(registro);

      // Elimina el archivo temporal de la ruta local inmediatamente después de subirlo
      await fs.unlink(file.path);
    }

    // 🌟 REGISTRO EN BITÁCORA: Subida de imágenes al Generador
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "REGISTRAR",
      "generador_fotos",
      id_generador,
      `Subió ${req.files.length} nueva(s) fotografía(s) al Generador con ID: ${id_generador}`,
    );

    res.send({
      status: "ok",
      description:
        "Material fotográfico del Generador registrado correctamente",
      data: resultadosRegistros,
    });
  } catch (error) {
    console.log(error);
    // Si ocurre un error inesperado, se intenta limpiar cualquier residuo en el servidor local
    if (req.files) {
      for (const file of req.files) {
        await fs.unlink(file.path).catch(() => {});
      }
    }
    res.status(500).send({ status: "error", description: error.message });
  }
};

export const deleteFoto_Generador = async (req, res) => {
  try {
    const { id } = req.params;

    // Se comprueba si existe el registro de la foto en la base de datos
    const search_gene = await SearchFotoGeneradorId(id);
    if (search_gene === 0) {
      return res.send({
        status: "mal",
        description: "La imagen no se encuentra registrada",
      });
    }

    // Retorna el public_id almacenado para poder borrar en Cloudinary
    const id_public = await ReturnFotoGeneradorId_public(id);

    // Elimina el registro de la tabla generador_fotos
    await DeleteFotoGeneradorId(id);

    // Elimina el archivo físico de la nube
    await deleteClo(id_public);

    // 🌟 REGISTRO EN BITÁCORA: Eliminación de imagen del Generador
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "ELIMINAR",
      "generador_fotos",
      id,
      `Eliminó una fotografía (ID en nube: ${id_public}) de un Generador`,
    );

    res.send({
      status: "ok",
      description:
        "Imagen del Generador borrada correctamente de la base de datos y Cloudinary",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};
