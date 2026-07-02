import fs from "fs-extra";
import path from "path";

import {
  SearchBombaId,
  SearchFotoBombaId,
  ReturnFotoBombaId_public,
  GetFotosByBombaId,
  RegisterFotoBomba,
  DeleteFotoBombaId,
} from "../../services/bomba/bomba_fotos.service.js";

// 🔗 IMPORTAMOS LA BITÁCORA
import { InsertarBitacora } from "../../services/bitacora/bitacora.service.js";

import { uploadClo, deleteClo } from "../../helpers/cloudinary.js";

//IMPORTAMOS E UTILIZAMOS CLOUDINARY
import { cloud } from "../../helpers/cloudinary.js";

export const getFoto_Bomba = async (req, res) => {
  try {
    const id_bomba = req.params.id;

    //Validamos primero si la Bomba existe
    const search_bo = await SearchBombaId(id_bomba);
    if (search_bo === 0) {
      return res.send({
        status: "mal",
        description: "La Bomba no se encuentra registrada",
      });
    }

    //Traemos todas las fotos asociadas a esa Bomba
    const fotos = await GetFotosByBombaId(id_bomba);

    //Respondemos al Front con el array de imágenes (si no tiene, devolverá un array vacío [])
    res.send({
      status: "ok",
      description: "Imágenes de la Bomba recuperadas con éxito",
      data: fotos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};

export const postFoto_Bomba = async (req, res) => {
  try {
    // se reciben la variable que viene por parametros
    const id_bomba = req.params.id;

    //console.log(req.file.path);
    //Se valida que existan archivos en el arreglo req.files
    if (!req.files || req.files.length === 0) {
      return res.send({
        status: "mal",
        description: "Tiene que seleccionar al menos una imagen",
      });
    }

    //Se Comprueba si la Bomba existe
    const search_bo = await SearchBombaId(id_bomba);
    if (search_bo === 0) {
      // Si no existe la Bomba, se eliminan todas las fotos temporales del servidor
      for (const file of req.files) {
        await fs.unlink(file.path);
      }
      return res.send({
        status: "mal",
        description: "La Bomba no se encuentra registrada",
      });
    }

    const resultadosRegistros = [];

    // Ciclo para procesar y subir cada una de las imágenes enviadas
    for (const file of req.files) {
      // Sube la imagen actual a Cloudinary
      const result = await uploadClo(file.path);

      // Mapeo del objeto con los nombres exactos de tu base de datos relacional
      const foto_bomba_data = {
        bomba_id: id_bomba,
        foto_url: result.secure_url,
        foto_public_id: result.public_id,
      };

      // Invoca tu servicio de registro
      const registro = await RegisterFotoBomba(foto_bomba_data);
      resultadosRegistros.push(registro);

      // Elimina el archivo temporal de la ruta local inmediatamente después de subirlo
      await fs.unlink(file.path);
    }

    // 🌟 REGISTRO EN BITÁCORA: Subida de imágenes a la bomba
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "REGISTRAR",
      "bomba_fotos",
      id_bomba,
      `Subió ${req.files.length} nueva(s) fotografía(s) a la Bomba con ID: ${id_bomba}`,
    );

    res.send({
      status: "ok",
      description: "Material fotográfico de la Bomba registrado correctamente",
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

export const deleteFoto_Bomba = async (req, res) => {
  try {
    const { id } = req.params;

    // Se comprueba si existe el registro de la foto en la base de datos
    const search_bo = await SearchFotoBombaId(id);
    if (search_bo === 0) {
      return res.send({
        status: "mal",
        description: "La imagen no se encuentra registrada",
      });
    }

    // Retorna el public_id almacenado para poder borrar en Cloudinary
    const id_public = await ReturnFotoBombaId_public(id);

    // Elimina el registro de la tabla bomba_fotos
    await DeleteFotoBombaId(id);

    // Elimina el archivo físico de la nube
    await deleteClo(id_public);

    // 🌟 REGISTRO EN BITÁCORA: Eliminación de imagen de la bomba
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "ELIMINAR",
      "bomba_fotos",
      id,
      `Eliminó una fotografía (ID en nube: ${id_public}) de una Bomba`,
    );

    res.send({
      status: "ok",
      description:
        "Imagen de la Bomba borrada correctamente de la base de datos y Cloudinary",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};
