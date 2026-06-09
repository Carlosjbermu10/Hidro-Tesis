import fs from "fs-extra";
import path from "path";

import {
  SearchMotorId,
  SearchFotoMotorId,
  ReturnFotoMotorId_public,
  GetFotosByMotorId,
  RegisterFotoMotor,
  DeleteFotoMotorId,
} from "../../services/motor/motor_fotos.service.js";

import { uploadClo, deleteClo } from "../../helpers/cloudinary.js";

//IMPORTAMOS E UTILIZAMOS CLOUDINARY
import { cloud } from "../../helpers/cloudinary.js";

export const getFoto_Motor = async (req, res) => {
  try {
    const id_motor = req.params.id;

    //Validamos primero si el Motor existe
    const search_mo = await SearchMotorId(id_motor);
    if (search_mo === 0) {
      return res.send({
        status: "mal",
        description: "El motor no se encuentra registrada",
      });
    }

    //Traemos todas las fotos asociadas de ese Motor
    const fotos = await GetFotosByMotorId(id_motor);

    //Respondemos al Front con el array de imágenes (si no tiene, devolverá un array vacío [])
    res.send({
      status: "ok",
      description: "Imágenes del Motor recuperadas con éxito",
      data: fotos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};

export const postFoto_Motor = async (req, res) => {
  try {
    // se reciben la variable que viene por parametros
    const id_motor = req.params.id;

    //Se valida que existan archivos en el arreglo req.files
    if (!req.files || req.files.length === 0) {
      return res.send({
        status: "mal",
        description: "Tiene que seleccionar al menos una imagen",
      });
    }

    //Se Comprueba si el Motor existe
    const search_mo = await SearchMotorId(id_motor);
    if (search_mo === 0) {
      // Si no existe el Motor, se eliminan todas las fotos temporales del servidor
      for (const file of req.files) {
        await fs.unlink(file.path);
      }
      return res.send({
        status: "mal",
        description: "El Motor no se encuentra registrado",
      });
    }

    const resultadosRegistros = [];

    // Ciclo para procesar y subir cada una de las imágenes enviadas
    for (const file of req.files) {
      // Sube la imagen actual a Cloudinary
      const result = await uploadClo(file.path);

      // Mapeo del objeto con los nombres exactos de tu base de datos relacional
      const foto_motor_data = {
        motor_id: id_motor,
        foto_url: result.secure_url,
        foto_public_id: result.public_id,
      };

      // Invoca tu servicio de registro
      const registro = await RegisterFotoMotor(foto_motor_data);
      resultadosRegistros.push(registro);

      // Elimina el archivo temporal de la ruta local inmediatamente después de subirlo
      await fs.unlink(file.path);
    }

    res.send({
      status: "ok",
      description: "Material fotográfico del motor registrado correctamente",
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

export const deleteFoto_Motor = async (req, res) => {
  try {
    const { id } = req.params;

    // Se comprueba si existe el registro de la foto en la base de datos
    const search_mo = await SearchFotoMotorId(id);
    if (search_mo === 0) {
      return res.send({
        status: "mal",
        description: "La imagen no se encuentra registrada",
      });
    }

    // Retorna el public_id almacenado para poder borrar en Cloudinary
    const id_public = await ReturnFotoMotorId_public(id);

    // Elimina el registro de la tabla motor_fotos
    await DeleteFotoMotorId(id);

    // Elimina el archivo físico de la nube
    await deleteClo(id_public);

    res.send({
      status: "ok",
      description:
        "Imagen del Motor borrada correctamente de la base de datos y Cloudinary",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", description: error.message });
  }
};
