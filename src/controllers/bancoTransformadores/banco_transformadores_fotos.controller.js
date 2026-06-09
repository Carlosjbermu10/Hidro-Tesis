import fs from "fs-extra";
import path from "path";

import {
  SearchBanco_transformadoresId,
  SearchFotoBanco_transformadoresId,
  ReturnFotoBanco_transformadoresId_public,
  GetFotosByBanco_transformadoresId,
  RegisterFotoBanco_transformadores,
  DeleteFotoBanco_transformadoresId,
} from "../../services/bancoTransformadores/banco_transformadores_fotos.service.js";

import { uploadClo, deleteClo } from "../../helpers/cloudinary.js";

//IMPORTAMOS E UTILIZAMOS CLOUDINARY
import { cloud } from "../../helpers/cloudinary.js";

export const getFoto_Banco_transformadores = async (req, res) => {
  try {
    const id_banco_transformadores = req.params.id;

    //Validamos primero si el Banco de transformadores existe
    const search_trans = await SearchBanco_transformadoresId(
      id_banco_transformadores,
    );
    if (search_trans === 0) {
      return res.send({
        status: "mal",
        description: "El Banco de transformadores no se encuentra registrada",
      });
    }

    //Traemos todas las fotos asociadas a ese Banco de transformadores
    const fotos = await GetFotosByBanco_transformadoresId(
      id_banco_transformadores,
    );

    //Respondemos al Front con el array de imágenes (si no tiene, devolverá un array vacío [])
    res.send({
      status: "ok",
      description:
        "Imágenes del Banco de transformadores recuperadas con éxito",
      data: fotos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};

export const postFoto_Banco_transformadores = async (req, res) => {
  try {
    // se reciben la variable que viene por parametros
    const id_banco_transformadores = req.params.id;

    //console.log(req.file.path);
    //Se valida que existan archivos en el arreglo req.files
    if (!req.files || req.files.length === 0) {
      return res.send({
        status: "mal",
        description: "Tiene que seleccionar al menos una imagen",
      });
    }

    //Se Comprueba si el Banco de transformadores existe
    const search_trans = await SearchBanco_transformadoresId(
      id_banco_transformadores,
    );
    if (search_trans === 0) {
      // Si no existe el Banco de transformadores, se eliminan todas las fotos temporales del servidor
      for (const file of req.files) {
        await fs.unlink(file.path);
      }
      return res.send({
        status: "mal",
        description: "El Banco de transformadores no se encuentra registrada",
      });
    }

    const resultadosRegistros = [];

    // Ciclo para procesar y subir cada una de las imágenes enviadas
    for (const file of req.files) {
      // Sube la imagen actual a Cloudinary
      const result = await uploadClo(file.path);

      // Mapeo del objeto con los nombres exactos de tu base de datos relacional
      const foto_banco_transformadores_data = {
        banco_transformadores_id: id_banco_transformadores,
        foto_url: result.secure_url,
        foto_public_id: result.public_id,
      };

      // Invoca tu servicio de registro
      const registro = await RegisterFotoBanco_transformadores(
        foto_banco_transformadores_data,
      );
      resultadosRegistros.push(registro);

      // Elimina el archivo temporal de la ruta local inmediatamente después de subirlo
      await fs.unlink(file.path);
    }

    res.send({
      status: "ok",
      description:
        "Material fotográfico del Banco de transformadores registrado correctamente",
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

export const deleteFoto_Banco_transformadores = async (req, res) => {
  try {
    const { id } = req.params;

    // Se comprueba si existe el registro de la foto en la base de datos
    const search_trans = await SearchFotoBanco_transformadoresId(id);
    if (search_trans === 0) {
      return res.send({
        status: "mal",
        description: "La imagen no se encuentra registrada",
      });
    }

    // Retorna el public_id almacenado para poder borrar en Cloudinary
    const id_public = await ReturnFotoBanco_transformadoresId_public(id);

    // Elimina el registro de la tabla banco_transformadores_fotos
    await DeleteFotoBanco_transformadoresId(id);

    // Elimina el archivo físico de la nube
    await deleteClo(id_public);

    res.send({
      status: "ok",
      description:
        "Imagen del Banco de transformadores borrada correctamente de la base de datos y Cloudinary",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};
