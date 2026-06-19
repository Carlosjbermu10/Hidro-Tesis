import {
  SearchEstacionId, //Servicio que busca si ya existe una Estacion de bombeo por su id
  getAllLinea_Bombeo, //Servicio que devuelve todos las Lineas de Bombeo
  SearchLinea_BombeoId, //Servicio que busca si ya existe una Linea de Bombeo por su id
  SearchLinea_BombeoIdEstacion, //Servicio que busca las Lineas de Bombeo en una Estacion de bombeo
  getOneLinea_BombeoForId, //Servicio que devuelve una Linea de Bombeo por su id
  RegisterLinea_Bombeo, // Servicio para registrar una Linea de Bombeo
  deleteOneLinea_BombeoForId, // Servicio que Elimina la Linea de Bombeo con ese id
  modificarLinea_Bombeo, // Servicio para modiciar una Linea de Bombeo
} from "../../services/lineaBombeo/linea_bombeo.service.js";

//FUNCIÓN AUXILIAR DE VALIDACIÓN TÉCNICA
const validarCamposLinea_Bombeo = (body) => {
  return (
    body.numero_linea === undefined ||
    !body.nombre_linea_bombeo ||
    !body.estado_linea_bombeo ||
    !body.observaciones_linea_bombeo
  );
};

export const getLinea_Bombeo = async (req, res) => {
  try {
    //se invoca el servicio que devuelve todos las Lineas de Bombeo
    const lin = await getAllLinea_Bombeo();

    res.send({
      status: "ok",
      description: "Lista de Lineas de Bombeo",
      data: lin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener las Linea de Bombeo",
    });
  }
};

export const getLinea_BombeoForId = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_linea_bombeo = req.params.id;

    //se invoca el servicio que devuelve la Linea de Bombeo con ese id
    const linea = await getOneLinea_BombeoForId(id_linea_bombeo);

    //Se comprueba si ya existe la Linea de Bombeo
    if (!linea || linea.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Linea de Bombeo no registrada",
      });
    }

    res.send({
      status: "ok",
      description: "Linea de Bombeo encontrada",
      data: linea,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener las Lineas de Bombeo",
    });
  }
};

export const getLinea_BombeoForIdEstacion = async (req, res) => {
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

    //se invoca el servicio que devuelve las Lineas de Bombeo de esa Estacion de Bombeo
    const est_linea = await SearchLinea_BombeoIdEstacion(id_bombeo);

    res.send({
      status: "ok",
      description:
        "Las Lineas de Bombeo que pertencen a esta Estacion de Bombeo",
      data: est_linea,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener las Lineas de Bombeo",
    });
  }
};

export const postLinea_Bombeo = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bombeo = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposLinea_Bombeo(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico obligatorio en el registro de la Linea de Bombeo",
      });
    }

    //Se comprueba si ya existe la Estacion de bombeo
    const search_es = await SearchEstacionId(id_bombeo);
    if (search_es === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const nuevaLinea = {
      numero_linea: body.numero_linea,
      nombre_linea_bombeo: body.nombre_linea_bombeo,
      estado_linea_bombeo: body.estado_linea_bombeo,
      observaciones_linea_bombeo: body.observaciones_linea_bombeo,
      est_bombeo_id_est: id_bombeo,
    };

    //se invoca el servicio para registrar una Linea de Bombeo
    const line = await RegisterLinea_Bombeo(nuevaLinea);

    res.status(201).send({
      status: "ok",
      description: "Linea de Bombeo registrada correctamente",
      data: line,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al registrar la Linea de Bombeo",
    });
  }
};

export const deleteLinea_Bombeo = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_linea_bombeo = req.params.id;

    //Se comprueba si ya existe la Lineas de Bombeo por su Id
    const search_li = await SearchLinea_BombeoId(id_linea_bombeo);
    if (search_li === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Linea de Bombeo no registrada",
      });
    }

    //se invoca el servicio que Elimina la Lineas de Bombeo con ese id
    await deleteOneLinea_BombeoForId(id_linea_bombeo);

    res.send({
      status: "ok",
      description: "Eliminada la Lineas de Bombeo",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al eliminar la Linea de Bombeo",
    });
  }
};

export const updateLinea_Bombeo = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_linea_bombeo = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposLinea_Bombeo(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico obligatorio para la actualización de la Linea de Bombeo",
      });
    }

    //Se invoca el servicio que devuelve la Linea de Bombeo con ese id
    const oneLinea = await getOneLinea_BombeoForId(id_linea_bombeo);

    //Se comprueba si ya existe la Linea de Bombeo por su Id
    if (!oneLinea || oneLinea.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Linea de Bombeo no registrada",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const linea = {
      id_linea_bombeo: id_linea_bombeo, // Obligatorio para identificar la fila a actualizar
      numero_linea: body.numero_linea,
      nombre_linea_bombeo: body.nombre_linea_bombeo,
      estado_linea_bombeo: body.estado_linea_bombeo,
      observaciones_linea_bombeo: body.observaciones_linea_bombeo,
      est_bombeo_id_est: oneLinea[0].est_bombeo_id_est,
    };

    //se invoca el servicio para Modificar una Linea de Bombeo
    const li = await modificarLinea_Bombeo(linea);

    res.send({
      status: "ok",
      description: "Linea de Bombeo modificada correctamente",
      data: li,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al modificar la Linea de Bombeo",
    });
  }
};
