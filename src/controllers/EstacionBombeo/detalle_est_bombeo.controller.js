import {
  SearchEstacionId, //Servicio que busca si ya existe una Estacion de bombeo por su id
  getOneDetalle_EstacionForId, //Servicio que devuelve los detalles de una Estacion de bombeo por su id
  SearchDetalle_EstacionId, // Servicio que busca si la estacion de bombeo posse detalles
  getOneDetalle_EstacionForId_Detalle, // Servicio que devuelve los detalles de la estacion por el id_detalle
  RegisterDetalle_Estacion, // Servicio para registrar Detalles para una Estación de Bombeo
  deleteOneDetalleEstacionForId_Detalle, // Servicio que Elimina Detalles para una Estación de bombeo con ese id
  modificarDetalleEstacion, // Servicio para modiciar una Estación de bombeo
} from "../../services/EstacionBombeo/detalle_est_bombeo.service.js";

//FUNCIÓN AUXILIAR DE VALIDACIÓN DE CAMPOS TÉCNICOS ---
const validarCamposDetalle = (body) => {
  return (
    !body.ubicacion ||
    !body.municipio ||
    !body.coordenada_norte ||
    !body.coordenada_este ||
    !body.coordenada_gps ||
    !body.cota ||
    !body.caudal_diseño ||
    body.poblacion_bene === undefined ||
    body.caudal_diseño_entrada === undefined ||
    body.caudal_diseño_salida === undefined ||
    body.caudal_operacion === undefined ||
    body.consumo === undefined ||
    body.aduccion === undefined ||
    body.sistema_bombeo === undefined ||
    body.linea_bombeo === undefined ||
    body.grupo_bombeo === undefined
  );
};

export const getDetalle_EstacionForId = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bombeo = req.params.id;

    //Se comprueba si ya existe la Estaciones de bombeo
    const search_es = await SearchEstacionId(id_bombeo);
    if (search_es === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    //Se comprueba si la Estacion de bombeo posee detalles
    const search_detalle = await SearchDetalle_EstacionId(id_bombeo);
    if (search_detalle === 0) {
      return res.status(404).send({
        status: "mal",
        description:
          "Estación de bombeo no posee detalles técnicos registrados",
      });
    }

    //Se invoca el servicio que devuelve los detalles de la Estación de bombeo con ese id
    const est = await getOneDetalle_EstacionForId(id_bombeo);
    const id_detalle = est[0].id_detalle_est;

    //Se invoca el servicio que devuelve el id_detalles con el id_bombeo
    const deta = await getOneDetalle_EstacionForId_Detalle(id_detalle);

    res.send({
      status: "ok",
      description: "Detalles técnicos de la Estación de bombeo",
      data: deta,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener los detalles",
    });
  }
};

export const postDetalle_Estacion = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bombeo = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;

    // Validación consistente
    if (validarCamposDetalle(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltan ingresar campos obligatorios de los detalles técnicos",
      });
    }

    //Se comprueba si ya existe la Estaciones de bombeo
    const search_es = await SearchEstacionId(id_bombeo);
    if (search_es === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    //Se comprueba si la Estacion de bombeo posee detalles
    const search_detalle = await SearchDetalle_EstacionId(id_bombeo);
    if (search_detalle !== 0) {
      return res.status(409).send({
        status: "mal",
        description:
          "La estación de bombeo ya posee una ficha de detalles técnicos asignada",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const det_est = {
      municipio: body.municipio,
      ubicacion: body.ubicacion,
      coordenada_norte: body.coordenada_norte,
      coordenada_este: body.coordenada_este,
      coordenada_gps: body.coordenada_gps,
      cota: body.cota,
      caudal_diseño: body.caudal_diseño,
      poblacion_bene: body.poblacion_bene,
      caudal_diseño_entrada: body.caudal_diseño_entrada,
      caudal_diseño_salida: body.caudal_diseño_salida,
      caudal_operacion: body.caudal_operacion,
      consumo: body.consumo,
      aduccion: body.aduccion,
      sistema_bombeo: body.sistema_bombeo,
      linea_bombeo: body.linea_bombeo,
      grupo_bombeo: body.grupo_bombeo,
      est_bombeo_id_est: id_bombeo,
    };

    //se invoca el servicio para registrar un usuario
    const de_es = await RegisterDetalle_Estacion(det_est);

    res.status(201).send({
      status: "ok",
      description:
        "Detalles de la Estación de Bombeo registrados correctamente",
      data: de_es,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener los detalles",
    });
  }
};

export const deleteDetalle_Estacion = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bombeo = req.params.id;

    //Se comprueba si ya existe la Estaciones de bombeo
    const search_es = await SearchEstacionId(id_bombeo);
    if (search_es === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    //Se comprueba si la estacion de bombeo cuenta con detalles
    const searchDetalle = await SearchDetalle_EstacionId(id_bombeo);
    if (searchDetalle === 0) {
      return res.status(404).send({
        status: "mal",
        description:
          "La estación de bombeo no cuenta con detalles técnicos para eliminar",
      });
    }

    //Se invoca el servicio que devuelve los detalles de la Estación de bombeo con ese id
    const est = await getOneDetalle_EstacionForId(id_bombeo);
    const id_detalle = est[0].id_detalle_est;

    //se invoca el servicio que Elimina la Estación de bombeo con ese id
    const del = await deleteOneDetalleEstacionForId_Detalle(id_detalle);

    res.send({
      status: "ok",
      description:
        "Detalles técnicos de la Estacion de bombeo eliminados correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener los detalles",
    });
  }
};

export const updateDetalle_Estacion = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bombeo = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposDetalle(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltan ingresar datos requeridos para la actualización técnica",
      });
    }

    //Se comprueba si ya existe la Estaciones de bombeo por su id
    const search_es = await SearchEstacionId(id_bombeo);
    if (search_es === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    //Se comprueba si la estacion de bombeo cuenta con detalles
    const searchDetalle = await SearchDetalle_EstacionId(id_bombeo);
    if (searchDetalle === 0) {
      return res.status(404).send({
        status: "mal",
        description:
          "La estación de bombeo no cuenta con detalles técnicos para modificar",
      });
    }

    //Obtenemos el registro existente para extraer la PK real del detalle
    const estExistente = await getOneDetalle_EstacionForId(id_bombeo);
    const id_detalle_est = estExistente[0].id_detalle_est;

    //Se crea un objeto para pasarlo mas adelante
    const detalleEst = {
      id_detalle_est: id_detalle_est,
      ubicacion: body.ubicacion,
      municipio: body.municipio,
      coordenada_norte: body.coordenada_norte,
      coordenada_este: body.coordenada_este,
      coordenada_gps: body.coordenada_gps,
      cota: body.cota,
      caudal_diseño: body.caudal_diseño,
      poblacion_bene: body.poblacion_bene,
      caudal_diseño_entrada: body.caudal_diseño_entrada,
      caudal_diseño_salida: body.caudal_diseño_salida,
      caudal_operacion: body.caudal_operacion,
      consumo: body.consumo,
      aduccion: body.aduccion,
      sistema_bombeo: body.sistema_bombeo,
      linea_bombeo: body.linea_bombeo,
      grupo_bombeo: body.grupo_bombeo,
      est_bombeo_id_est: id_bombeo, // Esta es la llave foránea
    };

    //se invoca el servicio para Modificar los Detalles de una Estacion de Bombeo
    const de = await modificarDetalleEstacion(detalleEst);

    res.send({
      status: "ok",
      description:
        "Detalles técnicos de la Estación de Bombeo modificados correctamente",
      data: de,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener los detalles",
    });
  }
};
