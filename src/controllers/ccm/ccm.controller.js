import {
  SearchEstacionId, //Servicio que busca si ya existe una Estacion de bombeo por su id
  getAllCCM, //Servicio que devuelve todos los CCM
  SearchCCMId, //Servicio que busca si ya existe un CCM por su id
  SearchCCMIdEstacion, //Servicio que busca los CCM en una Estacion de bombeo
  getOneCCMForId, //Servicio que devuelve un CCM por su id
  SearchCCMTotalIdEstacion, //Servicio de extraccion total de CCM
  RegisterCCM, // Servicio para registrar un CCM
  deleteOneCCMForId, // Servicio que Elimina el CCM con ese id
  modificarCCM, // Servicio para modiciar un CCM
} from "../../services/ccm/ccm.service.js";

//FUNCIÓN AUXILIAR DE VALIDACIÓN TÉCNICA
const validarCamposCCM = (body) => {
  return (
    body.tipo_ccm === undefined ||
    body.arran_estado_solido === undefined ||
    body.varia_veloc === undefined ||
    body.medidor === undefined ||
    body.plc === undefined ||
    body.rele_contro === undefined ||
    body.supre_pico === undefined ||
    body.transf_distri === undefined ||
    body.prot_falla_tierra === undefined
  );
};

export const getCCM = async (req, res) => {
  try {
    //se invoca el servicio que devuelve todos los CCM
    const ccm = await getAllCCM();

    res.send({
      status: "ok",
      description: "Lista de Centros de Controles de Maquina",
      data: ccm,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener los CCM",
    });
  }
};

export const getCCMForId = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_ccm = req.params.id;

    //se invoca el servicio que devuelve el CCM con ese id
    const centro = await getOneCCMForId(id_ccm);

    //Se comprueba si ya existe la Bomba
    if (!centro || centro.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Centro de Control de Máquinas no registrado",
      });
    }

    res.send({
      status: "ok",
      description: "Centro de Control de Máquina",
      data: centro,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al buscar el CCM",
    });
  }
};

export const getCCMForIdEstacion = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bombeo = req.params.id;

    //Se comprueba si ya existe la Estacion de bombeo
    const search_es = await SearchEstacionId(id_bombeo);
    if (search_es === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    //se invoca el servicio que devuelve los CCM de esa Estacion de Bombeo
    const est_centro = await SearchCCMIdEstacion(id_bombeo);

    res.send({
      status: "ok",
      description:
        "Los Centro de Control de Máquinas que pertencen a esta Estacion de Bombeo",
      data: est_centro,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al buscar CCM por estación",
    });
  }
};

export const getCCMTotalForIdEstacion = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bombeo = req.params.id;

    //Se comprueba si ya existe la Estacion de bombeo
    const search_es = await SearchEstacionId(id_bombeo);
    if (search_es === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    //se invoca el servicio que devuelve los CCM Completoss de esa Estacion de Bombeo
    const est_centro_total = await SearchCCMTotalIdEstacion(id_bombeo);

    res.send({
      status: "ok",
      description:
        "Los Datos completos del Centro de Control de Máquinas que pertencen a esta Estacion de Bombeo",
      data: est_centro_total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al buscar CCM por estación",
    });
  }
};

export const postCCM = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bombeo = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposCCM(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico obligatorio en el registro del Centro de Control de Máquinas",
      });
    }

    //Se comprueba si ya existe la Estacion de bombeo
    const search_Es = await SearchEstacionId(id_bombeo);
    if (search_Es === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const nuevoCCM = {
      tipo_ccm: body.tipo_ccm,
      arran_estado_solido: body.arran_estado_solido,
      varia_veloc: body.varia_veloc,
      medidor: body.medidor,
      plc: body.plc,
      rele_contro: body.rele_contro,
      supre_pico: body.supre_pico,
      transf_distri: body.transf_distri,
      prot_falla_tierra: body.prot_falla_tierra,
      est_bombeo_id_est: id_bombeo,
    };

    //se invoca el servicio para registrar un CCM
    const ccmaq = await RegisterCCM(nuevoCCM);

    res.status(201).send({
      status: "ok",
      description: "Centro de Control de Máquinas registrado correctamente",
      data: ccmaq,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al registrar el CCM",
    });
  }
};

export const deleteCCM = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_ccm = req.params.id;

    //Se comprueba si ya existe el CCM por su Id
    const search_ccm = await SearchCCMId(id_ccm);
    if (search_ccm === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Centro de Control de Máquinas no registrado",
      });
    }

    //se invoca el servicio que Elimina el CCM con ese id
    await deleteOneCCMForId(id_ccm);

    res.send({
      status: "ok",
      description: "Centro de Control de Máquinas eliminado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al eliminar el CCM",
    });
  }
};

export const updateCCM = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_ccm = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposCCM(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico obligatorio para la actualización del CCM",
      });
    }

    //Se invoca el servicio que devuelve el CCM con ese id
    const oneCCM = await getOneCCMForId(id_ccm);

    //Se comprueba si ya existe el CCM por su Id
    if (!oneCCM || oneCCM.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Centro de Control de Máquinas no registrado",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const ccmAEditar = {
      id_ccm: id_ccm, // Obligatorio para el WHERE
      tipo_ccm: body.tipo_ccm,
      arran_estado_solido: body.arran_estado_solido,
      varia_veloc: body.varia_veloc,
      medidor: body.medidor,
      plc: body.plc,
      rele_contro: body.rele_contro,
      supre_pico: body.supre_pico,
      transf_distri: body.transf_distri,
      prot_falla_tierra: body.prot_falla_tierra,
      est_bombeo_id_est: oneCCM[0].est_bombeo_id_est,
    };

    //se invoca el servicio para Modificar un CCM
    const ccmaq = await modificarCCM(ccmAEditar);

    res.send({
      status: "ok",
      description: "Centro de Control de Máquinas modificado correctamente",
      data: ccmaq,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al actualizar el CCM",
    });
  }
};
