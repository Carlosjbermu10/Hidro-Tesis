import {
  SearchBombaId, //Servicio que busca si ya existe una Bomba por su id
  getOneDetalle_BombaForId, //Servicio que devuelve los detalles de una Bomba por su id
  SearchDetalle_BombaId, // Servicio que busca si la Bomba posse detalles
  getOneDetalle_BombaForId_Detalle, // Servicio que devuelve los detalles de la Bomba por el id_detalle
  RegisterDetalle_Bomba, // Servicio para registrar Detalles para una Bomba
  deleteOneDetalleBombaForId_Detalle, // Servicio que Elimina Detalles para una Bomba con ese id
  modificarDetalleBomba, // Servicio para modiciar los detalles de una Bomba
} from "../../services/bomba/detalle_bomba.service.js";

//FUNCIÓN AUXILIAR DE VALIDACIÓN TÉCNICA
const validarCamposDetalleBomba = (body) => {
  return (
    body.pot_nom_bomba_hp === undefined ||
    body.presion_descarga === undefined ||
    body.alt_elevacion_bomba === undefined ||
    body.vel_nom_bomba_rpm === undefined ||
    body.dimensiones_impulsor === undefined ||
    body.diametro_succion === undefined ||
    body.diametro_carga === undefined ||
    body.peso_bomba === undefined ||
    body.acomplamiento === undefined ||
    !body.tipo_acople ||
    !body.tipo_cabezal ||
    body.diametro_succion_cabezal === undefined ||
    body.diametro_descarga_cabezal === undefined ||
    body.lubricacion === undefined ||
    body.rodamiento === undefined
  );
};

export const getDetalle_BombaForId = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bomba = req.params.id;

    //Se comprueba si ya existe la Bomba
    const search_bo = await SearchBombaId(id_bomba);
    if (search_bo === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Bomba no registrada",
      });
    }

    //Se invoca el servicio que devuelve los detalles de la Bomba con ese id
    const det_bom = await getOneDetalle_BombaForId(id_bomba);

    //Se comprueba si la Bomba posee detalles
    if (!det_bom || det_bom.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "La Bomba no posee detalles técnicos registrados",
      });
    }

    const id_detalle = det_bom[0].id_detalle_bomba;

    //Se invoca el servicio que devuelve el id_detalles con el id_bombeo
    const deta = await getOneDetalle_BombaForId_Detalle(id_detalle);

    res.send({
      status: "ok",
      description: "Detalles de la Bomba",
      data: deta,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al buscar detalles de la bomba",
    });
  }
};

export const postDetalle_Bomba = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bomba = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposDetalleBomba(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico obligatorio en los detalles de la bomba",
      });
    }

    //Se comprueba si ya existe la Bomba
    const search_bo = await SearchBombaId(id_bomba);
    if (search_bo === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Bomba no registrada",
      });
    }

    //Se comprueba si la Bomba posee detalles
    const search_detalle = await SearchDetalle_BombaId(id_bomba);
    if (search_detalle !== 0) {
      return res.status(409).send({
        status: "mal",
        description: "Bomba ya posee detalles registrados",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const det_bom = {
      pot_nom_bomba_hp: body.pot_nom_bomba_hp,
      presion_descarga: body.presion_descarga,
      alt_elevacion_bomba: body.alt_elevacion_bomba,
      vel_nom_bomba_rpm: body.vel_nom_bomba_rpm,
      dimensiones_impulsor: body.dimensiones_impulsor,
      diametro_succion: body.diametro_succion,
      diametro_carga: body.diametro_carga,
      peso_bomba: body.peso_bomba,
      acomplamiento: body.acomplamiento,
      tipo_acople: body.tipo_acople,
      tipo_cabezal: body.tipo_cabezal,
      diametro_succion_cabezal: body.diametro_succion_cabezal,
      diametro_descarga_cabezal: body.diametro_descarga_cabezal,
      lubricacion: body.lubricacion,
      rodamiento: body.rodamiento,
      bomba_id_bomba: id_bomba,
    };

    //se invoca el servicio para registrar un detalle para una Bomba
    const de_bo = await RegisterDetalle_Bomba(det_bom);

    res.status(201).send({
      status: "ok",
      description: "Detalles de la bomba registrados correctamente",
      data: de_bo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description:
        "Error interno del servidor al registrar detalles de la bomba",
    });
  }
};

export const deleteDetalle_Bomba = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bomba = req.params.id;

    //Se comprueba si ya existe la Bomba
    const search_bo = await SearchBombaId(id_bomba);
    if (search_bo === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Bomba no registrada",
      });
    }

    //Se comprueba si la Bomba cuenta con detalles
    const searchDetalle = await SearchDetalle_BombaId(id_bomba);
    if (searchDetalle === 0) {
      return res.status(409).send({
        status: "mal",
        description: "Bomba no cuenta con detalles",
      });
    }

    //Se invoca el servicio que devuelve los detalles de la Bomba con ese id
    const bom = await getOneDetalle_BombaForId(id_bomba);
    const id_detalle = bom[0].id_detalle_bomba;

    //se invoca el servicio que Elimina la Bomba con ese id
    await deleteOneDetalleBombaForId_Detalle(id_detalle);

    res.send({
      status: "ok",
      description: "Detalles de la Bomba eliminados correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description:
        "Error interno del servidor al eliminar detalles de la bomba",
    });
  }
};

export const updateDetalle_Bomba = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bomba = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposDetalleBomba(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico obligatorio para actualizar la bomba",
      });
    }

    //Se comprueba si ya existe la Bomba por su id
    const search_bo = await SearchBombaId(id_bomba);
    if (search_bo === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Bomba no registrada",
      });
    }

    //Se comprueba si la Bomba cuenta con detalles
    const searchDetalle = await SearchDetalle_BombaId(id_bomba);
    if (searchDetalle === 0) {
      return res.status(409).send({
        status: "mal",
        description: "Bomba no cuenta con detalles",
      });
    }

    //Se invoca el servicio que devuelve los detalles de la Bomba con ese id
    const bom = await getOneDetalle_BombaForId(id_bomba);
    const id_detalle = bom[0].id_detalle_bomba;

    //Se crea un objeto para pasarlo mas adelante
    const det_bom = {
      id_detalle: id_detalle,
      pot_nom_bomba_hp: body.pot_nom_bomba_hp,
      presion_descarga: body.presion_descarga,
      alt_elevacion_bomba: body.alt_elevacion_bomba,
      vel_nom_bomba_rpm: body.vel_nom_bomba_rpm,
      dimensiones_impulsor: body.dimensiones_impulsor,
      diametro_succion: body.diametro_succion,
      diametro_carga: body.diametro_carga,
      peso_bomba: body.peso_bomba,
      acomplamiento: body.acomplamiento,
      tipo_acople: body.tipo_acople,
      tipo_cabezal: body.tipo_cabezal,
      diametro_succion_cabezal: body.diametro_succion_cabezal,
      diametro_descarga_cabezal: body.diametro_descarga_cabezal,
      lubricacion: body.lubricacion,
      rodamiento: body.rodamiento,
      bomba_id_bomba: id_bomba,
    };

    //se invoca el servicio para Modificar los Detalles de una Bomba
    const de_bomba = await modificarDetalleBomba(det_bom);

    res.send({
      status: "ok",
      description: "Detalles de la Bomba modificado correctamente",
      data: de_bomba,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        status: "error",
        description:
          "Error interno del servidor al actualizar detalles de la bomba",
      });
  }
};
