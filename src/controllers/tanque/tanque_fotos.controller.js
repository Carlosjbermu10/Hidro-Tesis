import fs from "fs-extra";
import path from "path";

import {
  SearchTanqueId,
  SearchFotoTanqueId,
  ReturnFotoTanqueId_public,
  GetFotosByTanqueId,
  RegisterFotoTanque,
  DeleteFotoTanqueId,
} from "../../services/tanque/tanque_fotos.service.js";

import { uploadClo, deleteClo } from "../../helpers/cloudinary.js";

//IMPORTAMOS E UTILIZAMOS CLOUDINARY
import { cloud } from "../../helpers/cloudinary.js";

export const getFoto_Tanque = async (req, res) => {
  try {
    const id_tanque = req.params.id;

    //Validamos primero si El Tanque existe
    const search_tan = await SearchTanqueId(id_tanque);
    if (search_tan === 0) {
      return res.send({
        status: "mal",
        description: "El Tanque no se encuentra registrada",
      });
    }

    //Traemos todas las fotos asociadas a ese Tanque
    const fotos = await GetFotosByTanqueId(id_tanque);

    //Respondemos al Front con el array de imágenes (si no tiene, devolverá un array vacío [])
    res.send({
      status: "ok",
      description: "Imágenes del Tanque recuperadas con éxito",
      data: fotos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};

export const postFoto_Tanque = async (req, res) => {
  try {
    // se reciben la variable que viene por parametros
    const id_tanque = req.params.id;

    //console.log(req.file.path);
    //Se valida que existan archivos en el arreglo req.files
    if (!req.files || req.files.length === 0) {
      return res.send({
        status: "mal",
        description: "Tiene que seleccionar al menos una imagen",
      });
    }

    //Se Comprueba si el Tanque existe
    const search_tan = await SearchTanqueId(id_tanque);
    if (search_tan === 0) {
      // Si no existe el Tanque, se eliminan todas las fotos temporales del servidor
      for (const file of req.files) {
        await fs.unlink(file.path);
      }
      return res.send({
        status: "mal",
        description: "El Tanque no se encuentra registrado",
      });
    }

    const resultadosRegistros = [];

    // Ciclo para procesar y subir cada una de las imágenes enviadas
    for (const file of req.files) {
      // Sube la imagen actual a Cloudinary
      const result = await uploadClo(file.path);

      // Mapeo del objeto con los nombres exactos de tu base de datos relacional
      const foto_tanque_data = {
        tanque_id: id_tanque,
        foto_url: result.secure_url,
        foto_public_id: result.public_id,
      };

      // Invoca tu servicio de registro
      const registro = await RegisterFotoTanque(foto_tanque_data);
      resultadosRegistros.push(registro);

      // Elimina el archivo temporal de la ruta local inmediatamente después de subirlo
      await fs.unlink(file.path);
    }

    res.send({
      status: "ok",
      description: "Material fotográfico del Tanque registrado correctamente",
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

export const deleteFoto_Tanque = async (req, res) => {
  try {
    const { id } = req.params;

    // Se comprueba si existe el registro de la foto en la base de datos
    const search_tan = await SearchFotoTanqueId(id);
    if (search_tan === 0) {
      return res.send({
        status: "mal",
        description: "La imagen no se encuentra registrada",
      });
    }

    // Retorna el public_id almacenado para poder borrar en Cloudinary
    const id_public = await ReturnFotoTanqueId_public(id);

    // Elimina el registro de la tabla Tanque_fotos
    await DeleteFotoTanqueId(id);

    // Elimina el archivo físico de la nube
    await deleteClo(id_public);

    res.send({
      status: "ok",
      description:
        "Imagen del Tanque borrada correctamente de la base de datos y Cloudinary",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};
