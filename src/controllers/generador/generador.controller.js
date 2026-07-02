import {
  SearchEstacionId, //Servicio que busca si ya existe una Estacion de bombeo por su id
  getAllGenerador, //Servicio que devuelve todos los Generadores
  SearchGeneradorId, //Servicio que busca si ya existe un Generador por su id
  SearchGeneradorIdEstacion, //Servicio que busca los Generadores en una Estacion de bombeo
  getOneGeneradorForId, //Servicio que devuelve un Generador por su id
  RegisterGenerador, // Servicio para registrar un Generador
  deleteOneGeneradorForId, // Servicio que Elimina un Generador con ese id
  modificarGenerador, // Servicio para modiciar un Generador
  getGeneradorTotalForIdEstacionn, //Servicio para extraeer completo todo del generador
} from "../../services/generador/generador.service.js";

// 🔗 IMPORTAMOS LA BITÁCORA
import { InsertarBitacora } from "../../services/bitacora/bitacora.service.js";

//FUNCIÓN AUXILIAR PARA VALIDACIÓN
const validarDatosGenerador = (body) => {
  return (
    body.potencia_principal === undefined ||
    body.revolucion === undefined ||
    body.voltaje === undefined ||
    body.fase === undefined ||
    !body.cableado ||
    body.factor_potencia === undefined ||
    body.corriente === undefined ||
    body.conexion === undefined ||
    body.frecuencia === undefined ||
    !body.rodamiento ||
    !body.clase_proteccion ||
    body.clase_aislamiento === undefined
  );
};

export const getGenerador = async (req, res) => {
  try {
    //se invoca el servicio que devuelve todos los Generadores
    const gene = await getAllGenerador();

    res.send({
      status: "ok",
      description: "Lista de Generadores",
      data: gene,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const getGeneradorForId = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_generador = req.params.id;

    //Se comprueba si ya existe el Generador
    const search_gene = await SearchGeneradorId(id_generador);
    if (search_gene === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Generador no registrado",
      });
    }

    //se invoca el servicio que devuelve el Generador con ese id
    const gene = await getOneGeneradorForId(id_generador);

    res.send({
      status: "ok",
      description: "Generador",
      data: gene,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const getGeneradorForIdEstacion = async (req, res) => {
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

    //se invoca el servicio que devuelve los Generadores de esa Estacion de Bombeo
    const est_generador = await SearchGeneradorIdEstacion(id_bombeo);

    res.send({
      status: "ok",
      description: "Los Generadores que pertencen a esta Estacion de Bombeo",
      data: est_generador,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const getGeneradorTotalForIdEstacion = async (req, res) => {
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

    //se invoca el servicio que devuelve todos los datos del Generadores de esa Estacion de Bombeo
    const est_generador_total =
      await getGeneradorTotalForIdEstacionn(id_bombeo);

    res.send({
      status: "ok",
      description:
        "Los Datos completos de los Generadores que pertencen a esta Estacion de Bombeo",
      data: est_generador_total,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const postGenerador = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bombeo = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    // Uso de la función auxiliar de validación
    if (validarDatosGenerador(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico en el registro del generador",
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
    const nuevoGenerador = {
      potencia_principal: body.potencia_principal,
      revolucion: body.revolucion,
      voltaje: body.voltaje,
      fase: body.fase,
      cableado: body.cableado,
      factor_potencia: body.factor_potencia,
      corriente: body.corriente,
      conexion: body.conexion,
      frecuencia: body.frecuencia,
      rodamiento: body.rodamiento,
      clase_proteccion: body.clase_proteccion,
      clase_aislamiento: body.clase_aislamiento,
      est_bombeo_id_est: id_bombeo,
    };

    //se invoca el servicio para registrar un Generador
    const generador = await RegisterGenerador(nuevoGenerador);

    // 🌟 REGISTRO EN BITÁCORA: CREAR GENERADOR
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "REGISTRAR",
      "generadores",
      id_bombeo, // Referencia a la estación
      `Registró un nuevo Generador (Potencia: ${body.potencia_principal}, Voltaje: ${body.voltaje}V) en la Estación ID: ${id_bombeo}`,
    );

    res.status(201).send({
      status: "ok",
      description: "Generador registrado correctamente",
      data: generador,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const deleteGenerador = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_generador = req.params.id;

    // 💡 CAMBIO CLAVE: Usamos getOneGeneradorForId en lugar de Search para rescatar datos antes de borrar
    const oneGenerador = await getOneGeneradorForId(id_generador);
    if (!oneGenerador || oneGenerador.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Generador no registrado",
      });
    }

    // Rescatamos los datos del generador antes de eliminarlo
    const potenciaEliminada = oneGenerador[0].potencia_principal;
    const voltajeEliminado = oneGenerador[0].voltaje;
    const idEstacionAsociada = oneGenerador[0].est_bombeo_id_est;

    //se invoca el servicio que Elimina el Generador con ese id
    await deleteOneGeneradorForId(id_generador);

    // 🌟 REGISTRO EN BITÁCORA: ELIMINAR GENERADOR
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "ELIMINAR",
      "generadores",
      id_generador,
      `Eliminó permanentemente un Generador (Potencia original: ${potenciaEliminada}, Voltaje: ${voltajeEliminado}V) de la Estación ID: ${idEstacionAsociada}`,
    );

    res.send({
      status: "ok",
      description: "Eliminado el Generador",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const updateGenerador = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_generador = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    // Uso de la función auxiliar de validación

    if (validarDatosGenerador(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico en el registro del generador",
      });
    }

    //Se invoca el servicio que devuelve el Generador con ese id
    const oneGenerador = await getOneGeneradorForId(id_generador);

    //Se comprueba si ya existe el Generador por su Id (validando la consulta anterior)
    if (!oneGenerador || oneGenerador.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Generador no registrado",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const generadorAEditar = {
      id_generador: id_generador, // Clave primaria para el WHERE
      potencia_principal: body.potencia_principal,
      revolucion: body.revolucion,
      voltaje: body.voltaje,
      fase: body.fase,
      cableado: body.cableado,
      factor_potencia: body.factor_potencia,
      corriente: body.corriente,
      conexion: body.conexion,
      frecuencia: body.frecuencia,
      rodamiento: body.rodamiento,
      clase_proteccion: body.clase_proteccion,
      clase_aislamiento: body.clase_aislamiento,
      est_bombeo_id_est: oneGenerador[0].est_bombeo_id_est,
    };

    //se invoca el servicio para Modificar un Generador
    const gener = await modificarGenerador(generadorAEditar);

    // 🌟 REGISTRO EN BITÁCORA: MODIFICAR GENERADOR
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "MODIFICAR",
      "generadores",
      id_generador,
      `Actualizó las especificaciones técnicas del Generador (Nueva Potencia: ${body.potencia_principal}, Voltaje: ${body.voltaje}V)`,
    );

    res.send({
      status: "ok",
      description: "Generador modificado correctamente",
      data: gener,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};
