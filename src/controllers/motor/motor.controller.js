import {
  SearchBombaId, //Servicio que busca si ya existe una Bomba por su id
  getAllMotor, //Servicio que devuelve todos los motores
  SearchMotorId, //Servicio que busca si ya existe un motor por su id
  SearchMotorIdBomba, //Servicio que busca los motores en una Bomba
  getOneMotorForId, //Servicio que devuelve un motor por su id
  SearchMotorCodigo, //Servicio que busca si ya existe un motor por su codigo
  RegisterMotor, // Servicio para registrar un Motor
  deleteOneMotorForId, // Servicio que Elimina el motor con ese id
  modificarMotor, // Servicio para modiciar un Motor
  SearchMotorCodigoId, // Servicio que compara el id de un Motor con el codigo
} from "../../services/motor/motor.service.js";

// 🔗 IMPORTAMOS LA BITÁCORA
import { InsertarBitacora } from "../../services/bitacora/bitacora.service.js";

//FUNCIÓN AUXILIAR DE VALIDACIÓN TÉCNICA
const validarCamposMotor = (body) => {
  return (
    !body.codigo_motor ||
    !body.marca_motor ||
    !body.tipo_motor ||
    body.tipo_corriente === undefined ||
    body.asin_sin === undefined ||
    body.universal === undefined ||
    body.soporte_tec === undefined ||
    body.num_fases === undefined
  );
};

export const getMotor = async (req, res) => {
  try {
    //se invoca el servicio que devuelve todos los motores
    const mot = await getAllMotor();

    res.send({
      status: "ok",
      description: "Lista de Motores",
      data: mot,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener los motores",
    });
  }
};

export const getMotorForId = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_motor = req.params.id;

    //se invoca el servicio que devuelve el motor con ese id
    const motor = await getOneMotorForId(id_motor);

    //Se comprueba si ya existe el motor
    if (!motor || motor.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Motor no registrado",
      });
    }

    res.send({
      status: "ok",
      description: "Motor",
      data: motor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al buscar el motor",
    });
  }
};

export const getMotorForIdBomba = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bomba = req.params.id;

    //Se comprueba si ya existe la Bomba
    const search_bom = await SearchBombaId(id_bomba);
    if (search_bom === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Bomba no registrada",
      });
    }
    //se invoca el servicio que devuelve los motores de esa Bomba
    const bom_motor = await SearchMotorIdBomba(id_bomba);

    res.send({
      status: "ok",
      description: "Los motores que pertencen a esta Bomba",
      data: bom_motor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al buscar motores por su Bomba",
    });
  }
};

export const postMotor = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bomba = req.params.id;
    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposMotor(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato obligatorio en el registro del motor",
      });
    }

    //Se comprueba si ya existe la Bomba
    const search_bom = await SearchBombaId(id_bomba);
    if (search_bom === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Bomba no registrada",
      });
    }

    //Se comprueba si ya existe el motor por el codigo
    const search_Co = await SearchMotorCodigo(body.codigo_motor);
    if (search_Co > 0) {
      return res.status(409).send({
        status: "mal",
        description: "Codigo del Motor ya registrado",
      });
    }

    //se invoca el servicio que devuelve el Motor de esa Bomba
    const bom_motor = await SearchMotorIdBomba(id_bomba);

    //Se comprueba si la bomba ya tiene registrado un Motor
    if (bom_motor.length !== 0) {
      return res.status(409).send({
        status: "mal",
        description: "La Bomba ya posee Motor registrado",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const motor = {
      codigo_motor: body.codigo_motor,
      marca_motor: body.marca_motor,
      tipo_motor: body.tipo_motor,
      tipo_corriente: body.tipo_corriente,
      mono_tri: body.mono_tri,
      asin_sin: body.asin_sin,
      universal: body.universal,
      soporte_tec: body.soporte_tec,
      num_fases: body.num_fases,
      bomba_id_bomba: id_bomba,
    };

    //se invoca el servicio para registrar un Motor
    const mo = await RegisterMotor(motor);

    // 🌟 REGISTRO EN BITÁCORA: CREAR MOTOR
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "REGISTRAR",
      "motores",
      body.codigo_motor, // Usamos el código de inventario del motor como clave visual
      `Registró el Motor (Código: ${body.codigo_motor}, Marca: ${body.marca_motor}, Tipo: ${body.tipo_motor}) asignado a la Bomba ID: ${id_bomba}`,
    );

    res.status(201).send({
      status: "ok",
      description: "Motor registrado correctamente",
      data: mo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al registrar el motor",
    });
  }
};

export const deleteMotor = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_motor = req.params.id;

    // 💡 CAMBIO CLAVE: Usamos getOneMotorForId para extraer los datos técnicos antes de la eliminación física
    const oneMotor = await getOneMotorForId(id_motor);
    if (!oneMotor || oneMotor.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Motor no registrado",
      });
    }

    // Rescatamos los datos clave del motor antes de borrarlo
    const codigoEliminado = oneMotor[0].codigo_motor;
    const marcaEliminada = oneMotor[0].marca_motor;

    //se invoca el servicio que Elimina el Motor con ese id
    await deleteOneMotorForId(id_motor);

    // 🌟 REGISTRO EN BITÁCORA: ELIMINAR MOTOR
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "ELIMINAR",
      "motores",
      id_motor,
      `Eliminó permanentemente el Motor (Código original: ${codigoEliminado}, Marca: ${marcaEliminada})`,
    );

    res.send({
      status: "ok",
      description: "Eliminado el Motor",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al eliminar el motor",
    });
  }
};

export const updateMotor = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_motor = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;

    if (validarCamposMotor(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato obligatorio para la actualización del motor",
      });
    }

    //Se invoca el servicio que devuelve el motor con ese id
    const oneMotor = await getOneMotorForId(id_motor);

    //Se comprueba si ya existe el Motor por su Id (Ajustado para usar la consulta de arriba y evitar doble viaje a la BD)
    if (!oneMotor || oneMotor.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Motor no registrado",
      });
    }

    // comprobamos si el código está duplicado si el usuario lo cambió
    if (body.codigo_motor !== oneMotor[0].codigo_motor) {
      const search_Co = await SearchMotorCodigo(body.codigo_motor);
      if (search_Co > 0) {
        return res.status(409).send({
          status: "mal",
          description:
            "No se puede actualizar: El nuevo código de Motor ya está en uso",
        });
      }
    }

    //Se crea un objeto para pasarlo mas adelante
    const motorDat = {
      id_motor: id_motor, // ID necesario para el WHERE en el UPDATE
      codigo_motor: body.codigo_motor,
      marca_motor: body.marca_motor,
      tipo_motor: body.tipo_motor,
      tipo_corriente: body.tipo_corriente,
      mono_tri: body.mono_tri,
      asin_sin: body.asin_sin,
      universal: body.universal,
      soporte_tec: body.soporte_tec,
      num_fases: body.num_fases,
      bomba_id_bomba: oneMotor[0].bomba_id_bomba,
    };

    //se invoca el servicio para Modificar una Bomba
    const mo = await modificarMotor(motorDat);

    // 🌟 REGISTRO EN BITÁCORA: MODIFICAR MOTOR
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "MODIFICAR",
      "motores",
      id_motor,
      `Actualizó las especificaciones del Motor (Código: ${body.codigo_motor}, Marca: ${body.marca_motor}, Fases: ${body.num_fases})`,
    );

    res.send({
      status: "ok",
      description: "Motor modified correctamente",
      data: mo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al actualizar el motor",
    });
  }
};
