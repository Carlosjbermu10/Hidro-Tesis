import fs from "fs-extra";
import path from "path";

import {
  SearchEstacionId,
  SearchFotoEstacionId,
  ReturnFotoEstacionId_public,
  GetFotosByEstacionId,
  RegisterFotoEstacion,
  DeleteFotoEstacionId,
} from "../../services/EstacionBombeo/est_bombeo_fotos.service.js";

import { uploadClo, deleteClo } from "../../helpers/cloudinary.js";

//IMPORTAMOS E UTILIZAMOS CLOUDINARY
import { cloud } from "../../helpers/cloudinary.js";

// 🔗 IMPORTAMOS LA BITÁCORA
import { InsertarBitacora } from "../../services/bitacora/bitacora.service.js";

export const getFoto_Est_Bombeo = async (req, res) => {
  try {
    const id_bombeo = req.params.id;

    //Validamos primero si la estación de bombeo existe
    const search_es = await SearchEstacionId(id_bombeo);
    if (search_es === 0) {
      return res.send({
        status: "mal",
        description: "La Estación de Bombeo no se encuentra registrada",
      });
    }

    //Traemos todas las fotos asociadas a esa estación
    const fotos = await GetFotosByEstacionId(id_bombeo);

    //Respondemos al Front con el array de imágenes (si no tiene, devolverá un array vacío [])
    res.send({
      status: "ok",
      description: "Imágenes de la estación recuperadas con éxito",
      data: fotos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};

export const postFoto_Est_Bombeo = async (req, res) => {
  try {
    // se reciben la variable que viene por parametros
    const id_bombeo = req.params.id;

    //Se valida que existan archivos en el arreglo req.files
    if (!req.files || req.files.length === 0) {
      return res.send({
        status: "mal",
        description: "Tiene que seleccionar al menos una imagen",
      });
    }

    //Se Comprueba si la Estación de bombeo existe
    const search_es = await SearchEstacionId(id_bombeo);
    if (search_es === 0) {
      // Si no existe la estación, se eliminan todas las fotos temporales del servidor
      for (const file of req.files) {
        await fs.unlink(file.path);
      }
      return res.send({
        status: "mal",
        description: "La Estación de Bombeo no se encuentra registrada",
      });
    }

    const resultadosRegistros = [];

    // Ciclo para procesar y subir cada una de las imágenes enviadas
    for (const file of req.files) {
      // Sube la imagen actual a Cloudinary
      const result = await uploadClo(file.path);

      // Mapeo del objeto con los nombres exactos de tu base de datos relacional
      const foto_estacion_data = {
        est_bombeo_id: id_bombeo,
        foto_url: result.secure_url,
        foto_public_id: result.public_id,
      };

      // Invoca tu servicio de registro
      const registro = await RegisterFotoEstacion(foto_estacion_data);
      resultadosRegistros.push(registro);

      // Elimina el archivo temporal de la ruta local inmediatamente después de subirlo
      await fs.unlink(file.path);
    }

    // 🌟 REGISTRO EN BITÁCORA: Subida de imágenes
    const idUsuario = req.user ? req.user.id_usuario : 1;

    await InsertarBitacora(
      idUsuario,
      "REGISTRAR",
      "est_bombeo_fotos",
      id_bombeo,
      `Subió ${req.files.length} nueva(s) fotografía(s) a la estación de bombeo con ID: ${id_bombeo}`,
    );

    res.send({
      status: "ok",
      description:
        "Material fotográfico de la estación registrado correctamente",
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

export const deleteFoto_Est_Bombeo = async (req, res) => {
  try {
    const { id } = req.params;

    // Se comprueba si existe el registro de la foto en la base de datos
    const search = await SearchFotoEstacionId(id);
    if (search === 0) {
      return res.send({
        status: "mal",
        description: "La imagen no se encuentra registrada",
      });
    }

    // Retorna el public_id almacenado para poder borrar en Cloudinary
    const id_public = await ReturnFotoEstacionId_public(id);

    // Elimina el registro de la tabla est_bombeo_fotos
    await DeleteFotoEstacionId(id);

    // Elimina el archivo físico de la nube
    await deleteClo(id_public);

    // 🌟 REGISTRO EN BITÁCORA: Eliminación de imagen
    const idUsuario = req.user ? req.user.id_usuario : 1;

    await InsertarBitacora(
      idUsuario,
      "ELIMINAR",
      "est_bombeo_fotos",
      id,
      `Eliminó una fotografía (ID en nube: ${id_public}) del sistema`,
    );

    res.send({
      status: "ok",
      description:
        "Imagen de la estación borrada correctamente de la base de datos y Cloudinary",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};
