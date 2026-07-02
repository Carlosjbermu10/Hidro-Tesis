import {
  SearchCCMId, //Servicio que busca si ya existe un CCM por su id
  getOneCircuito_CCMForId, //Servicio que devuelve el Tipo de Circuito del CCM por su id
  SearchCircuito_CCMId, // Servicio que busca si el CCM posse Tipo de Circuito
  getOneCircuito_CCMForId_Detalle, // Servicio que devuelve los Tipo de Circuito del CCM por el id_tipo_circuito_ccm
  RegisterCircuito_CCM, // Servicio para registrar Tipo de Circuito para un CCM
  deleteOneCircuito_CCMForId_Detalle, // Servicio que Elimina Tipo de Circuito para un CCM con ese id
  modificarCircuito_CCM, // Servicio para modiciar Tipo de Circuito de un CCM
} from "../../services/ccm/tipo_circuito_ccm.service.js";

// 🔗 IMPORTAMOS LA BITÁCORA
import { InsertarBitacora } from "../../services/bitacora/bitacora.service.js";

//FUNCIÓN AUXILIAR DE VALIDACIÓN TÉCNICA
const validarCamposCircuito = (body) => {
  return (
    !body.e_s_cables ||
    !body.clase_tension ||
    body.tension_nominal_red === undefined ||
    body.tension_mando === undefined ||
    body.frecuencia_nominal === undefined ||
    body.corriente_nominal === undefined ||
    body.corriente_corta_duracion === undefined ||
    body.nbi === undefined ||
    body.temp_ambiente === undefined ||
    body.interruptor_principal === undefined ||
    body.elevacion_temp === undefined ||
    body.barra_ramales === undefined ||
    body.altitud_max === undefined ||
    body.voltaje_aislamiento === undefined ||
    body.barras_principales === undefined ||
    body.cap_corto_circuito === undefined ||
    body.barras === undefined ||
    body.voltaje_trabajo === undefined ||
    body.voltaje_control === undefined ||
    body.cap_interrupcion_max === undefined
  );
};

export const getCircuito_CCMForId = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_ccm = req.params.id;

    //Se comprueba si ya existe el CCM
    const search_ccm = await SearchCCMId(id_ccm);
    if (search_ccm === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Centro de Control de Máquinas no registrado",
      });
    }

    //Se invoca el servicio que devuelve los Tipo de Circuito del CCM con ese id
    const tipo_cir = await getOneCircuito_CCMForId(id_ccm);

    //Se comprueba si el CCM posee Tipo de Circuito
    if (!tipo_cir || tipo_cir.length === 0) {
      return res.status(404).send({
        status: "mal",
        description:
          "Centro de Control de Máquinas no posee configuraciones de Tipo de Circuito",
      });
    }

    const id_tipo_circuito_ccm = tipo_cir[0].id_tipo_circuito_ccm;

    //Se invoca el servicio que devuelve el id_tipo_circuito_ccm con el id_ccm
    const cir = await getOneCircuito_CCMForId_Detalle(id_tipo_circuito_ccm);

    res.send({
      status: "ok",
      description: "Tipo de Circuito del Centro de Control de Máquinas",
      data: cir,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener el circuito",
    });
  }
};

export const postCircuito_CCM = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_ccm = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposCircuito(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un parámetro eléctrico obligatorio del circuito CCM",
      });
    }

    //Se comprueba si ya existe el CCM
    const search_ccm = await SearchCCMId(id_ccm);
    if (search_ccm === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Centro de Control de Máquinas no registrado",
      });
    }

    //Se comprueba si el CCM posee Tipo de Circuito
    const search_tipo = await SearchCircuito_CCMId(id_ccm);
    if (search_tipo !== 0) {
      return res.status(409).send({
        status: "mal",
        description:
          "El Centro de Control de Máquinas ya posee un Tipo de Circuito registrado",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const nuevoCircuitoCCM = {
      e_s_cables: body.e_s_cables,
      clase_tension: body.clase_tension,
      tension_nominal_red: body.tension_nominal_red,
      tension_mando: body.tension_mando,
      frecuencia_nominal: body.frecuencia_nominal,
      corriente_nominal: body.corriente_nominal,
      corriente_corta_duracion: body.corriente_corta_duracion,
      nbi: body.nbi,
      temp_ambiente: body.temp_ambiente,
      interruptor_principal: body.interruptor_principal,
      elevacion_temp: body.elevacion_temp,
      barra_ramales: body.barra_ramales,
      altitud_max: body.altitud_max,
      voltaje_aislamiento: body.voltaje_aislamiento,
      barras_principales: body.barras_principales,
      cap_corto_circuito: body.cap_corto_circuito,
      barras: body.barras,
      voltaje_trabajo: body.voltaje_trabajo,
      voltaje_control: body.voltaje_control,
      cap_interrupcion_max: body.cap_interrupcion_max,
      ccm_id_ccm: id_ccm,
    };

    //se invoca el servicio para registrar un Tipo de Circuito para un CCM
    const ci_ccm = await RegisterCircuito_CCM(nuevoCircuitoCCM);

    // 🌟 REGISTRO EN BITÁCORA: CREAR CIRCUITO CCM
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "REGISTRAR",
      "circuito_ccm",
      id_ccm,
      `Registró los parámetros del circuito (Tensión de Red: ${body.tension_nominal_red}V, Corriente Nominal: ${body.corriente_nominal}A) para el CCM ID: ${id_ccm}`,
    );

    res.status(201).send({
      status: "ok",
      description: "Tipo de Circuito registrado correctamente",
      data: ci_ccm,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteCircuito_CCM = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_ccm = req.params.id;

    //Se comprueba si ya existe el CCM
    const search_ccm = await SearchCCMId(id_ccm);
    if (search_ccm === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Centro de Control de Máquinas no registrado",
      });
    }

    //Se comprueba si el CCM posee Tipo de Circuito
    const search_cir = await SearchCircuito_CCMId(id_ccm);
    if (search_cir === 0) {
      return res.status(409).send({
        status: "mal",
        description: "Centro de Control de Máquinas no posee Tipo de Circuito",
      });
    }

    //Se invoca el servicio que devuelve Tipo de Circuito del CCM con ese id
    const circuito = await getOneCircuito_CCMForId(id_ccm);
    const id_tipo_circuito_ccm = circuito[0].id_tipo_circuito_ccm;

    // 💡 Rescatamos datos importantes del circuito antes de eliminarlo
    const tensionEliminada = circuito[0].tension_nominal_red;
    const corrienteEliminada = circuito[0].corriente_nominal;

    //se invoca el servicio que Elimina Tipo de Circuito con ese id
    await deleteOneCircuito_CCMForId_Detalle(id_tipo_circuito_ccm);

    // 🌟 REGISTRO EN BITÁCORA: ELIMINAR CIRCUITO CCM
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "ELIMINAR",
      "circuito_ccm",
      id_tipo_circuito_ccm,
      `Eliminó permanentemente el Tipo de Circuito (Tensión original: ${tensionEliminada}V, Corriente: ${corrienteEliminada}A) asociado al CCM ID: ${id_ccm}`,
    );

    res.send({
      status: "ok",
      description: "Tipo de Circuito eliminado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al eliminar el circuito",
    });
  }
};

export const updateCircuito_CCM = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_ccm = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposCircuito(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un parámetro eléctrico obligatorio para la actualización del circuito CCM",
      });
    }

    //Se comprueba si ya existe el CCM
    const search_ccm = await SearchCCMId(id_ccm);
    if (search_ccm === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Centro de Control de Máquinas no registrado",
      });
    }

    //Se comprueba si el CCM posee Tipo de Circuito
    const search_cir = await SearchCircuito_CCMId(id_ccm);
    if (search_cir === 0) {
      return res.status(409).send({
        status: "mal",
        description: "Centro de Control de Máquinas no posee Tipo de Circuito",
      });
    }

    //Se invoca el servicio que devuelve Tipo de Circuito del CCM con ese id
    const circ = await getOneCircuito_CCMForId(id_ccm);
    const id_tipo_circuito_ccm = circ[0].id_tipo_circuito_ccm;

    //Se crea un objeto para pasarlo mas adelante
    const circuitoCCMAEditar = {
      id_tipo_circuito_ccm: id_tipo_circuito_ccm, // Llave primaria
      e_s_cables: body.e_s_cables,
      clase_tension: body.clase_tension,
      tension_nominal_red: body.tension_nominal_red,
      tension_mando: body.tension_mando,
      frecuencia_nominal: body.frecuencia_nominal,
      corriente_nominal: body.corriente_nominal,
      corriente_corta_duracion: body.corriente_corta_duracion,
      nbi: body.nbi,
      temp_ambiente: body.temp_ambiente,
      interruptor_principal: body.interruptor_principal,
      elevacion_temp: body.elevacion_temp,
      barra_ramales: body.barra_ramales,
      altitud_max: body.altitud_max,
      voltaje_aislamiento: body.voltaje_aislamiento,
      barras_principales: body.barras_principales,
      cap_corto_circuito: body.cap_corto_circuito,
      barras: body.barras,
      voltaje_trabajo: body.voltaje_trabajo,
      voltaje_control: body.voltaje_control,
      cap_interrupcion_max: body.cap_interrupcion_max,
      ccm_id_ccm: id_ccm,
    };

    //se invoca el servicio para Modificar Tipo de Circuito del CCM
    const de_circuito = await modificarCircuito_CCM(circuitoCCMAEditar);

    // 🌟 REGISTRO EN BITÁCORA: MODIFICAR CIRCUITO CCM
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "MODIFICAR",
      "circuito_ccm",
      id_tipo_circuito_ccm,
      `Actualizó los parámetros eléctricos del circuito en el CCM ID: ${id_ccm} (Nueva Tensión de Red: ${body.tension_nominal_red}V, Corriente Nominal: ${body.corriente_nominal}A)`,
    );

    res.send({
      status: "ok",
      description: "Detalles del Tipo de Circuito modificado correctamente",
      data: de_circuito,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al actualizar el circuito",
    });
  }
};
