import {
  SearchMotorId, //Servicio que busca si ya existe un Motor por su id
  getOneDetalle_MotorForId, //Servicio que devuelve los detalles de un Motor por su id
  SearchDetalle_MotorId, // Servicio que busca si el Motor posse detalles
  getOneDetalle_MotorForId_Detalle, // Servicio que devuelve los detalles del Motor por el id_detalle
  RegisterDetalle_Motor, // Servicio para registrar Detalles para un Motor
  deleteOneDetalleMotorForId_Detalle, // Servicio que Elimina Detalles para un Motor con ese id
  modificarDetalleMotor, // Servicio para modiciar los detalles de un Motor
} from "../../services/motor/detalle_motor.service.js";

//FUNCIÓN AUXILIAR DE VALIDACIÓN TÉCNICA
const validarCamposDetalleMotor = (body) => {
  return (
    body.pot_nom_motor_hp === undefined ||
    body.pot_nom_motor_kw === undefined ||
    body.tens_nom_operacion_v === undefined ||
    body.tens_nom_operacion_amp === undefined ||
    body.eficencia === undefined ||
    body.vel_nom_motor_rpm === undefined ||
    body.tam_carcaza === undefined ||
    body.frecuencia === undefined ||
    body.factor_potencia === undefined ||
    body.factor_servicio === undefined ||
    !body.tipo_aislamiento ||
    !body.grado_proteccion ||
    body.temp_ambiente_max === undefined ||
    body.peso_motor === undefined ||
    body.altitud_ambiente_max === undefined ||
    body.rodamiento === undefined
  );
};

export const getDetalle_MotorForId = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_motor = req.params.id;

    //Se comprueba si ya existe el Motor
    const search_mo = await SearchMotorId(id_motor);
    if (search_mo === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Motor no registrado",
      });
    }

    //Se invoca el servicio que devuelve los detalles del Motor con ese id
    const det_mot = await getOneDetalle_MotorForId(id_motor);

    //Se comprueba si el Motor posee detalles
    if (!det_mot || det_mot.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Motor no posee detalles técnicos registrados",
      });
    }

    const id_detalle = det_mot[0].id_detalle_motor;

    //Se invoca el servicio que devuelve el id_detalles con el id_bombeo
    const deta = await getOneDetalle_MotorForId_Detalle(id_detalle);

    res.send({
      status: "ok",
      description: "Detalles del Motor",
      data: deta,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al buscar detalles del motor",
    });
  }
};

export const postDetalle_Motor = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_motor = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposDetalleMotor(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico obligatorio en los detalles del motor",
      });
    }

    //Se comprueba si ya existe el motor
    const search_mo = await SearchMotorId(id_motor);
    if (search_mo === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Motor no registrado",
      });
    }

    //Se comprueba si el Motor posee detalles
    const search_detalle = await SearchDetalle_MotorId(id_motor);
    if (search_detalle !== 0) {
      return res.status(409).send({
        status: "mal",
        description: "Motor ya posee detalles registrados",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const det_mot = {
      pot_nom_motor_hp: body.pot_nom_motor_hp,
      pot_nom_motor_kw: body.pot_nom_motor_kw,
      tens_nom_operacion_v: body.tens_nom_operacion_v,
      tens_nom_operacion_amp: body.tens_nom_operacion_amp,
      eficencia: body.eficencia,
      vel_nom_motor_rpm: body.vel_nom_motor_rpm,
      tam_carcaza: body.tam_carcaza,
      frecuencia: body.frecuencia,
      factor_potencia: body.factor_potencia,
      factor_servicio: body.factor_servicio,
      tipo_aislamiento: body.tipo_aislamiento,
      grado_proteccion: body.grado_proteccion,
      temp_ambiente_max: body.temp_ambiente_max,
      peso_motor: body.peso_motor,
      altitud_ambiente_max: body.altitud_ambiente_max,
      rodamiento: body.rodamiento,
      motor_id_motor: id_motor,
    };

    //se invoca el servicio para registrar un detalle para un Motor
    const de_mo = await RegisterDetalle_Motor(det_mot);

    res.status(201).send({
      status: "ok",
      description: "Detalles del motor registrados correctamente",
      data: de_mo,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        status: "error",
        description: "Error interno del servidor al registrar detalles",
      });
  }
};

export const deleteDetalle_Motor = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_motor = req.params.id;

    //Se comprueba si ya existe el Motor
    const search = await SearchMotorId(id_motor);
    if (search === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Motor no registrado",
      });
    }

    //Se comprueba si el Motor cuenta con detalles
    const searchDetalle = await SearchDetalle_MotorId(id_motor);
    if (searchDetalle === 0) {
      return res.status(409).send({
        status: "mal",
        description: "Motor no cuenta con detalles registrados",
      });
    }

    //Se invoca el servicio que devuelve los detalles del Motor con ese id
    const mot = await getOneDetalle_MotorForId(id_motor);
    const id_detalle = mot[0].id_detalle_motor;

    //se invoca el servicio que Elimina el Motor con ese id
    await deleteOneDetalleMotorForId_Detalle(id_detalle);

    res.send({
      status: "ok",
      description: "Detalles del Motor eliminados correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al eliminar detalles",
    });
  }
};

export const updateDetalle_Motor = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_motor = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposDetalleMotor(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico obligatorio para actualizar el motor",
      });
    }

    //Se comprueba si ya existe el Motor por su id
    const search_mo = await SearchMotorId(id_motor);
    if (search_mo === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Motor no registrado",
      });
    }

    //Se comprueba si el Motor cuenta con detalles
    const searchDetalle = await SearchDetalle_MotorId(id_motor);
    if (searchDetalle === 0) {
      return res.status(409).send({
        status: "mal",
        description: "Motor no cuenta con detalles registrados",
      });
    }

    //Se invoca el servicio que devuelve los detalles del Motor con ese id
    const mot = await getOneDetalle_MotorForId(id_motor);
    const id_detalle = mot[0].id_detalle_motor;

    //Se crea un objeto para pasarlo mas adelante
    const det_moto = {
      id_detalle: id_detalle,
      pot_nom_motor_hp: body.pot_nom_motor_hp,
      pot_nom_motor_kw: body.pot_nom_motor_kw,
      tens_nom_operacion_v: body.tens_nom_operacion_v,
      tens_nom_operacion_amp: body.tens_nom_operacion_amp,
      eficencia: body.eficencia,
      vel_nom_motor_rpm: body.vel_nom_motor_rpm,
      tam_carcaza: body.tam_carcaza,
      frecuencia: body.frecuencia,
      factor_potencia: body.factor_potencia,
      factor_servicio: body.factor_servicio,
      tipo_aislamiento: body.tipo_aislamiento,
      grado_proteccion: body.grado_proteccion,
      temp_ambiente_max: body.temp_ambiente_max,
      peso_motor: body.peso_motor,
      altitud_ambiente_max: body.altitud_ambiente_max,
      rodamiento: body.rodamiento,
      motor_id_motor: id_motor,
    };

    //se invoca el servicio para Modificar los Detalles de un Motor
    const de_motor = await modificarDetalleMotor(det_moto);

    res.send({
      status: "ok",
      description: "Detalles del Motor modificados correctamente",
      data: de_motor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al actualizar detalles",
    });
  }
};
