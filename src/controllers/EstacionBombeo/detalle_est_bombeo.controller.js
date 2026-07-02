import {
  SearchEstacionId, //Servicio que busca si ya existe una Estacion de bombeo por su id
  getOneDetalle_EstacionForId, //Servicio que devuelve los detalles de una Estacion de bombeo por su id
  SearchDetalle_EstacionId, // Servicio que busca si la estacion de bombeo posse detalles
  getOneDetalle_EstacionForId_Detalle, // Servicio que devuelve los detalles de la estacion por el id_detalle
  RegisterDetalle_Estacion, // Servicio para registrar Detalles para una Estación de Bombeo
  deleteOneDetalleEstacionForId_Detalle, // Servicio que Elimina Detalles para una Estación de bombeo con ese id
  modificarDetalleEstacion, // Servicio para modiciar una Estación de bombeo
} from "../../services/EstacionBombeo/detalle_est_bombeo.service.js";

// 🔗 IMPORTAMOS LA BITÁCORA
import { InsertarBitacora } from "../../services/bitacora/bitacora.service.js";

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

// 🛡️ Función auxiliar para validar la coordenada GPS antes de guardar o modificar
const validarCoordenadaGPS = (coordenada) => {
  if (!coordenada || typeof coordenada !== "string") {
    return { valido: false, msg: "La coordenada GPS es obligatoria" };
  }

  const regexGPS = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
  if (!regexGPS.test(coordenada.trim())) {
    return {
      valido: false,
      msg: "Formato GPS inválido. Use grados decimales (Ej: '10.997100, -63.911500')",
    };
  }

  const [latStr, lngStr] = coordenada.split(",");
  const lat = parseFloat(latStr.trim());
  const lng = parseFloat(lngStr.trim());

  const LAT_MIN = 10.7;
  const LAT_MAX = 11.3;
  const LNG_MIN = -64.5;
  const LNG_MAX = -63.6;

  if (lat < LAT_MIN || lat > LAT_MAX || lng < LNG_MIN || lng > LNG_MAX) {
    return {
      valido: false,
      msg: "La coordenada se encuentra fuera del rango asignado para el Estado Nueva Esparta",
    };
  }

  return { valido: true };
};

export const getDetalle_EstacionForId = async (req, res) => {
  try {
    const id_bombeo = req.params.id;

    const search_es = await SearchEstacionId(id_bombeo);
    if (search_es === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    const search_detalle = await SearchDetalle_EstacionId(id_bombeo);
    if (search_detalle === 0) {
      return res.status(404).send({
        status: "mal",
        description:
          "Estación de bombeo no posee detalles técnicos registrados",
      });
    }

    const est = await getOneDetalle_EstacionForId(id_bombeo);
    const id_detalle = est[0].id_detalle_est;

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
    const id_bombeo = req.params.id;
    const { body } = req;

    if (validarCamposDetalle(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltan ingresar campos obligatorios de los detalles técnicos",
      });
    }

    const checkGPS = validarCoordenadaGPS(body.coordenada_gps);
    if (!checkGPS.valido) {
      return res.status(400).send({
        status: "mal",
        description: checkGPS.msg,
      });
    }

    const search_es = await SearchEstacionId(id_bombeo);
    if (search_es === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    const search_detalle = await SearchDetalle_EstacionId(id_bombeo);
    if (search_detalle !== 0) {
      return res.status(409).send({
        status: "mal",
        description:
          "La estación de bombeo ya posee una ficha de detalles técnicos asignada",
      });
    }

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

    const de_es = await RegisterDetalle_Estacion(det_est);

    // 🌟 REGISTRO EN BITÁCORA: CREAR DETALLES
    const idUsuario = req.user ? req.user.id_usuario : 1;

    await InsertarBitacora(
      idUsuario,
      "REGISTRAR",
      "detalle_estacion",
      id_bombeo,
      `Creó la ficha técnica inicial en el municipio ${body.municipio} (${body.ubicacion}) para la estación ID: ${id_bombeo}`,
    );

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
    const id_bombeo = req.params.id;

    const search_es = await SearchEstacionId(id_bombeo);
    if (search_es === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    const searchDetalle = await SearchDetalle_EstacionId(id_bombeo);
    if (searchDetalle === 0) {
      return res.status(404).send({
        status: "mal",
        description:
          "La estación de bombeo no cuenta con detalles técnicos para eliminar",
      });
    }

    const est = await getOneDetalle_EstacionForId(id_bombeo);
    const id_detalle = est[0].id_detalle_est;
    const municipioEliminado = est[0].municipio; // Salvamos el municipio antes de borrar

    await deleteOneDetalleEstacionForId_Detalle(id_detalle);

    // 🌟 REGISTRO EN BITÁCORA: ELIMINAR DETALLES
    const idUsuario = req.user ? req.user.id_usuario : 1;

    await InsertarBitacora(
      idUsuario,
      "ELIMINAR",
      "detalle_estacion",
      id_bombeo,
      `Eliminó permanentemente la ficha de detalles técnicos de la estación ID: ${id_bombeo} (Municipio original: ${municipioEliminado})`,
    );

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
    const id_bombeo = req.params.id;
    const { body } = req;

    if (validarCamposDetalle(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltan ingresar datos requeridos para la actualización técnica",
      });
    }

    const { coordenada_gps } = req.body;

    const checkGPS = validarCoordenadaGPS(coordenada_gps);
    if (!checkGPS.valido) {
      return res.status(400).send({
        status: "mal",
        description: checkGPS.msg,
      });
    }

    const search_es = await SearchEstacionId(id_bombeo);
    if (search_es === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    const searchDetalle = await SearchDetalle_EstacionId(id_bombeo);
    if (searchDetalle === 0) {
      return res.status(404).send({
        status: "mal",
        description:
          "La estación de bombeo no cuenta con detalles técnicos para modificar",
      });
    }

    const estExistente = await getOneDetalle_EstacionForId(id_bombeo);
    const id_detalle_est = estExistente[0].id_detalle_est;

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
      est_bombeo_id_est: id_bombeo,
    };

    const de = await modificarDetailEstacion(detalleEst);

    // 🌟 REGISTRO EN BITÁCORA: MODIFICAR DETALLES (El corazón del mapa interactivo)
    const idUsuario = req.user ? req.user.id_usuario : 1;

    await InsertarBitacora(
      idUsuario,
      "MODIFICAR",
      "detalle_estacion",
      id_bombeo,
      `Actualizó la ficha técnica. Ubicación: ${body.ubicacion}, GPS: [${body.coordenada_gps}], Caudal Operación: ${body.caudal_operacion} L/s.`,
    );

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
