import fs from "fs-extra";
import path from "path";

import {
  SearchLinea_BombeoId,
  SearchFotoLinea_BombeoId,
  ReturnFotoLinea_BombeoId_public,
  GetFotosByLinea_BombeoId,
  RegisterFotoLinea_Bombeo,
  DeleteFotoLinea_BombeoId,
} from "../../services/lineaBombeo/linea_bombeo_fotos.service.js";

// 🔗 IMPORTAMOS LA BITÁCORA
import { InsertarBitacora } from "../../services/bitacora/bitacora.service.js";

import { uploadClo, deleteClo } from "../../helpers/cloudinary.js";

//IMPORTAMOS E UTILIZAMOS CLOUDINARY
import { cloud } from "../../helpers/cloudinary.js";

export const getFoto_Linea_Bombeo = async (req, res) => {
  try {
    const id_linea_bombeo = req.params.id;

    //Validamos primero si la Linea de Bombeo existe
    const search_li = await SearchLinea_BombeoId(id_linea_bombeo);
    if (search_li === 0) {
      return res.send({
        status: "mal",
        description: "La Linea de Bombeo no se encuentra registrada",
      });
    }

    //Traemos todas las fotos asociadas a esa Linea de Bombeo
    const fotos = await GetFotosByLinea_BombeoId(id_linea_bombeo);
    console.log(fotos);

    //Respondemos al Front con el array de imágenes (si no tiene, devolverá un array vacío [])
    res.send({
      status: "ok",
      description: "Imágenes de la Linea de Bombeo recuperadas con éxito",
      data: fotos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};

export const postFoto_Linea_Bombeo = async (req, res) => {
  try {
    // se reciben la variable que viene por parametros
    const id_linea_bombeo = req.params.id;

    //console.log(req.file.path);
    //Se valida que existan archivos en el arreglo req.files
    if (!req.files || req.files.length === 0) {
      return res.send({
        status: "mal",
        description: "Tiene que seleccionar al menos una imagen",
      });
    }

    //Se Comprueba si la Linea de Bombeo existe
    const search_li = await SearchLinea_BombeoId(id_linea_bombeo);
    if (search_li === 0) {
      // Si no existe la Linea de Bombeo, se eliminan todas las fotos temporales del servidor
      for (const file of req.files) {
        await fs.unlink(file.path);
      }
      return res.send({
        status: "mal",
        description: "La Linea de Bombeo no se encuentra registrada",
      });
    }

    const resultadosRegistros = [];

    // Ciclo para procesar y subir cada una de las imágenes enviadas
    for (const file of req.files) {
      // Sube la imagen actual a Cloudinary
      const result = await uploadClo(file.path);

      // Mapeo del objeto con los nombres exactos de tu base de datos relacional
      const foto_data = {
        linea_bombeo_id: id_linea_bombeo,
        foto_url: result.secure_url,
        foto_public_id: result.public_id,
      };

      // Invoca tu servicio de registro
      const registro = await RegisterFotoLinea_Bombeo(foto_data);
      resultadosRegistros.push(registro);

      // Elimina el archivo temporal de la ruta local inmediatamente después de subirlo
      await fs.unlink(file.path);
    }

    // 🌟 REGISTRO EN BITÁCORA: Subida de imágenes a la línea de bombeo
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "REGISTRAR",
      "linea_bombeo_fotos", // Ajusta el nombre si tu tabla en la BD se llama distinto
      id_linea_bombeo,
      `Subió ${req.files.length} nueva(s) fotografía(s) a la línea de bombeo con ID: ${id_linea_bombeo}`,
    );

    res.send({
      status: "ok",
      description:
        "Material fotográfico de la Linea de Bombeo registrado correctamente",
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

export const deleteFoto_Linea_Bombeo = async (req, res) => {
  try {
    const { id } = req.params;

    // Se comprueba si existe el registro de la foto en la base de datos
    const search_li = await SearchFotoLinea_BombeoId(id);
    if (search_li === 0) {
      return res.send({
        status: "mal",
        description: "La imagen no se encuentra registrada",
      });
    }

    // Retorna el public_id almacenado para poder borrar en Cloudinary
    const id_public = await ReturnFotoLinea_BombeoId_public(id);

    // Elimina el registro de la tabla linea_bombeo_fotos
    await DeleteFotoLinea_BombeoId(id);

    // Elimina el archivo físico de la nube
    await deleteClo(id_public);

    // 🌟 REGISTRO EN BITÁCORA: Eliminación de imagen de la línea de bombeo
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "ELIMINAR",
      "linea_bombeo_fotos",
      id,
      `Eliminó una fotografía (ID en nube: ${id_public}) de una línea de bombeo`,
    );

    res.send({
      status: "ok",
      description:
        "Imagen de la Linea de Bombeo borrada correctamente de la base de datos y Cloudinary",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};
