import {
  SearchEstacionId, //Servicio que busca si ya existe una Estacion de bombeo por su id
  getAllBancosTransformadores, //Servicio que devuelve todos los Bancos de Transformadores
  SearchBancoTransformadoresId, //Servicio que busca si ya existe un Banco de Transformadores por su id
  SearchBancoTransformadoresIdEstacion, //Servicio que busca los Bancos de Transformadores en una Estacion de bombeo
  getOneBancoTransformadoresForId, //Servicio que devuelve un Banco Transformadores por su id
  RegisterBancoTransformadores, // Servicio para registrar un Banco de Transformadores
  deleteOneBancoTransformadoresForId, // Servicio que Elimina un Banco de Transformadores con ese id
  modificarBancoTransformadores, // Servicio para modiciar un Banco de Trasnformadores
} from "../../services/bancoTransformadores/banco_transformadores.service.js";

//FUNCIÓN AUXILIAR DE VALIDACIÓN TÉCNICA ---
const validarCamposTransformador = (body) => {
  return (
    !body.tipo ||
    !body.norma ||
    body.potencia_nominal === undefined ||
    body.año === undefined ||
    body.nivel_aislamiento === undefined ||
    body.num_fases === undefined ||
    body.frecuencia === undefined ||
    !body.clase_aislamiento ||
    body.tension_primaria === undefined ||
    body.tension_secundaria === undefined ||
    body.conexion === undefined ||
    body.corriente_primaria === undefined ||
    body.refrigeracion === undefined ||
    body.tension_c_c === undefined ||
    body.peso_act === undefined ||
    !body.tipo_aceite ||
    body.temp_ambiente === undefined ||
    body.peso_total === undefined ||
    body.vol_aceite_total === undefined ||
    body.impedancia_voltios === undefined ||
    body.calentamiento === undefined ||
    !body.marca ||
    !body.lugar_fabricado
  );
};

export const getBanco_transformadores = async (req, res) => {
  try {
    //se invoca el servicio que devuelve todos los Bancos de Transformadores
    const ban = await getAllBancosTransformadores();

    res.send({
      status: "ok",
      description: "Lista de Bancos de Transformadores",
      data: ban,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener los transformadores",
    });
  }
};

export const getBanco_transformadoresForId = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_banco_transformadores = req.params.id;

    //Se comprueba si ya existe el Banco de Transformadores
    const transfo = await getOneBancoTransformadoresForId(
      id_banco_transformadores,
    );
    if (!transfo || transfo.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Banco de Transformadores no registrado",
      });
    }

    res.send({
      status: "ok",
      description: "Banco de Transformardor",
      data: transfo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener los transformadores",
    });
  }
};

export const getBanco_transformadoresForIdEstacion = async (req, res) => {
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

    //se invoca el servicio que devuelve los Bancos de Transformadores de esa Estacion de Bombeo
    const est_banco = await SearchBancoTransformadoresIdEstacion(id_bombeo);

    res.send({
      status: "ok",
      description:
        "Los Bancos de Transformadores que pertencen a esta Estacion de Bombeo",
      data: est_banco,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener los transformadores",
    });
  }
};

export const postBanco_transformadores = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bombeo = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposTransformador(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico obligatorio en el registro del banco de transformadores",
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
    const nuevoTransformador = {
      tipo: body.tipo,
      norma: body.norma,
      potencia_nominal: body.potencia_nominal,
      año: body.año,
      nivel_aislamiento: body.nivel_aislamiento,
      num_fases: body.num_fases,
      frecuencia: body.frecuencia,
      clase_aislamiento: body.clase_aislamiento,
      tension_primaria: body.tension_primaria,
      tension_secundaria: body.tension_secundaria,
      conexion: body.conexion,
      corriente_primaria: body.corriente_primaria,
      refrigeracion: body.refrigeracion,
      tension_c_c: body.tension_c_c,
      peso_act: body.peso_act,
      tipo_aceite: body.tipo_aceite,
      temp_ambiente: body.temp_ambiente,
      peso_total: body.peso_total,
      vol_aceite_total: body.vol_aceite_total,
      impedancia_voltios: body.impedancia_voltios,
      calentamiento: body.calentamiento,
      marca: body.marca,
      lugar_fabricado: body.lugar_fabricado,
      est_bombeo_id_est: id_bombeo,
    };

    //se invoca el servicio para registrar un Banco de Transformadores
    const ba = await RegisterBancoTransformadores(nuevoTransformador);

    res.status(201).send({
      status: "ok",
      description: "Banco de Transformadores registrado correctamente",
      data: ba,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener los transformadores",
    });
  }
};

export const deleteBanco_transformadores = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_banco_transformadores = req.params.id;

    //Se comprueba si ya existe el Banco de Transformadores por su Id
    const search_ba = await SearchBancoTransformadoresId(
      id_banco_transformadores,
    );
    if (search_ba === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Banco de Transformadores no registrada",
      });
    }

    //se invoca el servicio que Elimina el Banco de Transformadores con ese id
    await deleteOneBancoTransformadoresForId(id_banco_transformadores);

    res.send({
      status: "ok",
      description: "Banco de Transformadores eliminado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener los transformadores",
    });
  }
};

export const updateBanco_transformadores = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_banco_transformadores = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposTransformador(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico obligatorio para la actualización del banco de transformadores",
      });
    }

    // Buscamos directamente el registro para validar existencia y obtener su FK real de una vez
    const oneBanco = await getOneBancoTransformadoresForId(
      id_banco_transformadores,
    );
    if (!oneBanco || oneBanco.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Banco de Transformadores no registrado",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const transformador = {
      id_banco_transformadores: id_banco_transformadores, // Clave principal para el WHERE
      tipo: body.tipo,
      norma: body.norma,
      potencia_nominal: body.potencia_nominal,
      año: body.año,
      nivel_aislamiento: body.nivel_aislamiento,
      num_fases: body.num_fases,
      frecuencia: body.frecuencia,
      clase_aislamiento: body.clase_aislamiento,
      tension_primaria: body.tension_primaria,
      tension_secundaria: body.tension_secundaria,
      conexion: body.conexion,
      corriente_primaria: body.corriente_primaria,
      refrigeracion: body.refrigeracion,
      tension_c_c: body.tension_c_c,
      peso_act: body.peso_act,
      tipo_aceite: body.tipo_aceite,
      temp_ambiente: body.temp_ambiente,
      peso_total: body.peso_total,
      vol_aceite_total: body.vol_aceite_total,
      impedancia_voltios: body.impedancia_voltios,
      calentamiento: body.calentamiento,
      marca: body.marca,
      lugar_fabricado: body.lugar_fabricado,
      est_bombeo_id_est: oneBanco[0].est_bombeo_id_est,
    };

    //se invoca el servicio para Modificar un Banco de Transformadores
    const trasf = await modificarBancoTransformadores(transformador);

    res.send({
      status: "ok",
      description: "Banco de Transformadores modificado correctamente",
      data: trasf,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener los transformadores",
    });
  }
};
