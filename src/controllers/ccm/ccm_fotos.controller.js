import fs from "fs-extra";
import path from "path";

import {
  SearchCCMId,
  SearchFotoCCMId,
  ReturnFotoCCMId_public,
  GetFotosByCCMId,
  RegisterFotoCCM,
  DeleteFotoCCMId,
} from "../../services/ccm/ccm_fotos.service.js";

// 🔗 IMPORTAMOS LA BITÁCORA
import { InsertarBitacora } from "../../services/bitacora/bitacora.service.js";

import { uploadClo, deleteClo } from "../../helpers/cloudinary.js";

//IMPORTAMOS E UTILIZAMOS CLOUDINARY
import { cloud } from "../../helpers/cloudinary.js";

export const getFoto_CCM = async (req, res) => {
  try {
    const id_ccm = req.params.id;

    //Validamos primero si el Centro de Control de Maquinas existe
    const search_ccm = await SearchCCMId(id_ccm);
    if (search_ccm === 0) {
      return res.send({
        status: "mal",
        description:
          "El Centro de Control de Maquinas no se encuentra registrado",
      });
    }

    //Traemos todas las fotos asociadas a ese Centro de Control de Maquinas
    const fotos = await GetFotosByCCMId(id_ccm);

    //Respondemos al Front con el array de imágenes (si no tiene, devolverá un array vacío [])
    res.send({
      status: "ok",
      description:
        "Imágenes del Centro de Control de Maquinas recuperadas con éxito",
      data: fotos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};

export const postFoto_CCM = async (req, res) => {
  try {
    // se reciben la variable que viene por parametros
    const id_ccm = req.params.id;

    //console.log(req.file.path);
    //Se valida que existan archivos en el arreglo req.files
    if (!req.files || req.files.length === 0) {
      return res.send({
        status: "mal",
        description: "Tiene que seleccionar al menos una imagen",
      });
    }

    //Se Comprueba si el Centro de Control de Maquinas existe
    const search_ccm = await SearchCCMId(id_ccm);
    if (search_ccm === 0) {
      // Si no existe el Centro de Control de Maquinas, se eliminan todas las fotos temporales del servidor
      for (const file of req.files) {
        await fs.unlink(file.path);
      }
      return res.send({
        status: "mal",
        description:
          "El Centro de Control de Maquinas no se encuentra registrado",
      });
    }

    const resultadosRegistros = [];

    // Ciclo para procesar y subir cada una de las imágenes enviadas
    for (const file of req.files) {
      // Sube la imagen actual a Cloudinary
      const result = await uploadClo(file.path);

      // Mapeo del objeto con los nombres exactos de tu base de datos relacional
      const foto_ccm_data = {
        ccm_id: id_ccm,
        foto_url: result.secure_url,
        foto_public_id: result.public_id,
      };

      // Invoca tu servicio de registro
      const registro = await RegisterFotoCCM(foto_ccm_data);
      resultadosRegistros.push(registro);

      // Elimina el archivo temporal de la ruta local inmediatamente después de subirlo
      await fs.unlink(file.path);
    }

    // 🌟 REGISTRO EN BITÁCORA: Subida de imágenes al CCM
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "REGISTRAR",
      "ccm_fotos", // Ajusta el nombre si tu tabla se llama distinto
      id_ccm,
      `Subió ${req.files.length} nueva(s) fotografía(s) al Centro de Control de Máquinas con ID: ${id_ccm}`,
    );

    res.send({
      status: "ok",
      description:
        "Material fotográfico del Centro de Control de Maquinas registrado correctamente",
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

export const deleteFoto_CCM = async (req, res) => {
  try {
    const { id } = req.params;

    // Se comprueba si existe el registro de la foto en la base de datos
    const search_ccm = await SearchFotoCCMId(id);
    if (search_ccm === 0) {
      return res.send({
        status: "mal",
        description: "La imagen no se encuentra registrada",
      });
    }

    // Retorna el public_id almacenado para poder borrar en Cloudinary
    const id_public = await ReturnFotoCCMId_public(id);

    // Elimina el registro de la tabla ccm_fotos
    await DeleteFotoCCMId(id);

    // Elimina el archivo físico de la nube
    await deleteClo(id_public);

    // 🌟 REGISTRO EN BITÁCORA: Eliminación de imagen del CCM
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "ELIMINAR",
      "ccm_fotos",
      id,
      `Eliminó una fotografía (ID en nube: ${id_public}) de un Centro de Control de Máquinas`,
    );

    res.send({
      status: "ok",
      description:
        "Imagen del Centro de Control de Maquinas borrada correctamente de la base de datos y Cloudinary",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};
