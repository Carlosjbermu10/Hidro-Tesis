import {
  SearchEstacionId, //Servicio que busca si ya existe una Estacion de bombeo por su id
  getOneTanqueGenerador, //Servicio que verifica si ya existe esta conexión exacta entre el id_tanque y el id_generador
  getEstacionDelTanque, //Servicio para Obtener a qué estación pertenece un Tanque
  getEstacionDelGenerador, //Servicio para Obtener a qué estación pertenece un Generador
  getSuministrosDetalladosPorEstacion, //Servicio que devuelve todos los suministros (vínculos tanque-generador) de una estación específica
  RegisterTanque_Generador, //Servicio para registrar la conexion entre un Tanque y un Generador
  deleteOneTanque_GeneradorForids, //Servicio que Elimina la conexion entre un Tanque y un Generador con esos id
  modificarTanque_Generador, //Servicio para modiciar la conexion entre un Tanque y un Generador
} from "../../services/tanque/tanque_has_generador.service.js";

//VALIDACIÓN
const validarCamposConexion = (body) => {
  return (
    body.tipo_suministro === undefined ||
    body.diametro_tuberia === undefined ||
    body.longitud_linea === undefined
  );
};

export const getTanque_GeneradorForId = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const { id_tanque, id_generador } = req.params;

    const infoTanque = await getEstacionDelTanque(id_tanque);
    const infoGenerador = await getEstacionDelGenerador(id_generador);

    //Se comprueba si existen el Tanque y el Generador
    if (infoTanque.length === 0)
      return res.status(404).send({
        status: "mal",
        description: "El tanque especificado no existe",
      });
    if (infoGenerador.length === 0)
      return res.status(404).send({
        status: "mal",
        description: "El generador especificado no existe",
      });

    //Se comprueba si existe conexión exacta entre el id_tanque y el id_generador
    const conexion = await getOneTanqueGenerador(id_tanque, id_generador);
    if (!conexion || conexion.length === 0) {
      return res.status(404).send({
        status: "mal",
        description:
          "No existe conexión registrada entre este tanque y generador",
      });
    }

    res.send({
      status: "ok",
      description: "Conexión obtenida con éxito",
      data: conexion[0],
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const getSuministrosEstacion = async (req, res) => {
  try {
    const id_bombeo = req.params.id; // Recibe el ID de la estación por la URL

    //Se comprueba si ya existe la Estacion de bombeo
    const search_es = await SearchEstacionId(id_bombeo);
    if (search_es === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    //Obtener los suministros asociados
    const suministros = await getSuministrosDetalladosPorEstacion(id_bombeo);

    // Nota: Si la estación existe pero no tiene conexiones, devolvemos un arreglo vacío con un estado 200 OK
    res.send({
      status: "ok",
      description: "Suministros de la estación de bombeo obtenidos con éxito",
      data: suministros,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      description:
        "Error interno del servidor al obtener los suministros de la estación",
    });
  }
};

export const postTanque_Generador = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const { id_tanque, id_generador } = req.params;

    //se reciben las variables en el req.body
    const { body } = req;

    // Uso de la función auxiliar de validación
    if (validarCamposConexion(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltan parámetros obligatorios para registrar la conexión",
      });
    }

    const infoTanque = await getEstacionDelTanque(id_tanque);
    const infoGenerador = await getEstacionDelGenerador(id_generador);

    //Se comprueba si existen el Tanque y el Generador
    if (infoTanque.length === 0)
      return res.status(404).send({
        status: "mal",
        description: "El tanque especificado no existe",
      });
    if (infoGenerador.length === 0)
      return res.status(404).send({
        status: "mal",
        description: "El generador especificado no existe",
      });

    //Se valida que ambos pertenezcan a la MISMA estación de bombeo
    if (
      infoTanque[0].est_bombeo_id_est !== infoGenerador[0].est_bombeo_id_est
    ) {
      return res.status(409).send({
        status: "mal",
        description:
          "El tanque y el generador deben pertenecer a la misma estación de bombeo",
      });
    }

    //Se validar la duplicidad, que no exista esa conexion entre el tanque y el generador
    const conexionExistente = await getOneTanqueGenerador(
      id_tanque,
      id_generador,
    );
    if (conexionExistente && conexionExistente.length > 0) {
      return res.status(409).send({
        status: "mal",
        description:
          "Esta conexión de suministro ya está registrada entre este tanque y generador",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const nuevaConexion = {
      tanque_id_tanque: id_tanque,
      generador_id_generador: id_generador,
      tipo_suministro: body.tipo_suministro,
      diametro_tuberia: body.diametro_tuberia,
      longitud_linea: body.longitud_linea,
    };

    //se invoca el servicio para registrar un suministro entre el tanque y el generador
    const tanq_gene = await RegisterTanque_Generador(nuevaConexion);

    res.status(201).send({
      status: "ok",
      description: "Conexión tanque-generador registrada correctamente",
      data: tanq_gene,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno al registrar la conexión",
    });
  }
};

export const deleteTanque_Generador = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const { id_tanque, id_generador } = req.params;

    const infoTanque = await getEstacionDelTanque(id_tanque);
    const infoGenerador = await getEstacionDelGenerador(id_generador);

    //Se comprueba si existen el Tanque y el Generador
    if (infoTanque.length === 0)
      return res.status(404).send({
        status: "mal",
        description: "El tanque especificado no existe",
      });
    if (infoGenerador.length === 0)
      return res.status(404).send({
        status: "mal",
        description: "El generador especificado no existe",
      });

    //Se comprueba si existe conexión exacta entre el id_tanque y el id_generador
    const conexion = await getOneTanqueGenerador(id_tanque, id_generador);
    if (!conexion || conexion.length === 0) {
      return res.status(404).send({
        status: "mal",
        description:
          "No existe conexión registrada entre este tanque y generador",
      });
    }

    //se invoca el servicio que Elimina el Motor con ese id
    await deleteOneTanque_GeneradorForids(id_tanque, id_generador);

    res.send({
      status: "ok",
      description: "Conexión tanque-generador eliminada correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno al eliminar la conexión",
    });
  }
};

export const updateTanque_Generador = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const { id_tanque, id_generador } = req.params;

    //se reciben las variables en el req.body
    const { body } = req;

    // Uso de la función auxiliar de validación
    if (validarCamposConexion(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltan parámetros obligatorios para registrar la conexión",
      });
    }

    const infoTanque = await getEstacionDelTanque(id_tanque);
    const infoGenerador = await getEstacionDelGenerador(id_generador);

    //Se comprueba si existen el Tanque y el Generador
    if (infoTanque.length === 0)
      return res.status(404).send({
        status: "mal",
        description: "El tanque especificado no existe",
      });
    if (infoGenerador.length === 0)
      return res.status(404).send({
        status: "mal",
        description: "El generador especificado no existe",
      });

    //Se valida la duplicidad, que exista esa conexion entre el tanque y el generador
    const conexionActual = await getOneTanqueGenerador(id_tanque, id_generador);
    if (!conexionActual || conexionActual.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "La conexión especificada no existe",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const conexionAEditar = {
      tanque_id_tanque: id_tanque,
      generador_id_generador: id_generador,
      tipo_suministro: body.tipo_suministro,
      diametro_tuberia: body.diametro_tuberia,
      longitud_linea: body.longitud_linea,
    };

    //se invoca el servicio para Modificar la conexion entre un Tanque y un Generador
    const tanque_gene = await modificarTanque_Generador(conexionAEditar);

    res.send({
      status: "ok",
      description:
        "Conexión entre el Tanque y el Generador ha sido actualizada correctamente",
      data: tanque_gene,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno al actualizar la conexión",
    });
  }
};
