import {
  SearchLinea_BombeoId, //Servicio que busca si ya existe una Linea de bombeo por su id
  getAllBomba, //Servicio que devuelve todos las Bombas
  SearchBombaId, //Servicio que busca si ya existe un motor por su id
  SearchBombaIdLineaBombeo, //Servicio que busca las bombas en una Linea de bombeo
  getOneBombaForId, //Servicio que devuelve una Bomba por su id
  RegisterBomba, // Servicio para registrar una Bomba
  deleteOneBombaForId, // Servicio que Elimina la Bomba con ese id
  modificarBomba, // Servicio para modiciar una Bomba
} from "../../services/bomba/bomba.service.js";

// 🔗 IMPORTAMOS LA BITÁCORA
import { InsertarBitacora } from "../../services/bitacora/bitacora.service.js";

//FUNCIÓN AUXILIAR DE VALIDACIÓN TÉCNICA
const validarCamposBomba = (body) => {
  return (
    !body.modelo_bomba ||
    !body.marca_bomba ||
    !body.tipo_bomba ||
    body.q === undefined ||
    body.num_etapa === undefined
  );
};

export const getBomba = async (req, res) => {
  try {
    //se invoca el servicio que devuelve todos las Bombas
    const bom = await getAllBomba();

    res.send({
      status: "ok",
      description: "Lista de Bombas",
      data: bom,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener las bombas",
    });
  }
};

export const getBombaForId = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bomba = req.params.id;

    //se invoca el servicio que devuelve la Bomba con ese id
    const bomba = await getOneBombaForId(id_bomba);

    //Se comprueba si ya existe la Bomba
    if (!bomba || bomba.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Bomba no registrada",
      });
    }

    res.send({
      status: "ok",
      description: "Bomba",
      data: bomba,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al buscar la bomba",
    });
  }
};

export const getBombaForIdLineaBombeo = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_linea_bombeo = req.params.id;

    //Se comprueba si ya existe la Linea de bombeo
    const search_li = await SearchLinea_BombeoId(id_linea_bombeo);
    if (search_li === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Linea de bombeo no registrada",
      });
    }

    //se invoca el servicio que devuelve las Bombas de esa Linea de bombeo
    const est_bomba = await SearchBombaIdLineaBombeo(id_linea_bombeo);

    res.send({
      status: "ok",
      description: "Las Bombas que pertencen a esta Linea de bombeo",
      data: est_bomba,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al buscar bombas por estación",
    });
  }
};

export const postBomba = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_linea_bombeo = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposBomba(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico en el registro de la bomba",
      });
    }

    //Se comprueba si ya existe la Linea de bombeo
    const search_li = await SearchLinea_BombeoId(id_linea_bombeo);
    if (search_li === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Linea de bombeo no registrada",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const bomba = {
      modelo_bomba: body.modelo_bomba,
      marca_bomba: body.marca_bomba,
      tipo_bomba: body.tipo_bomba,
      q: body.q,
      num_etapa: body.num_etapa,
      linea_bombeo_id_linea_bombeo: id_linea_bombeo,
    };

    //se invoca el servicio para registrar una Bomba
    const bo = await RegisterBomba(bomba);

    // 🌟 REGISTRO EN BITÁCORA: CREAR BOMBA
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "REGISTRAR",
      "bombas",
      id_linea_bombeo, // Referencia a la línea donde se instaló
      `Registró una nueva Bomba (Marca: ${body.marca_bomba}, Modelo: ${body.modelo_bomba}, Tipo: ${body.tipo_bomba}) en la Línea de Bombeo ID: ${id_linea_bombeo}`,
    );

    res.status(201).send({
      status: "ok",
      description: "Bomba registrado correctamente",
      data: bo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al registrar la bomba",
    });
  }
};

export const deleteBomba = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bomba = req.params.id;

    // Usamos getOneBombaForId para rescatar la información antes de eliminarla
    const oneBomba = await getOneBombaForId(id_bomba);
    if (!oneBomba || oneBomba.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Bomba no registrada",
      });
    }

    // Rescatamos los datos clave de la bomba a eliminar
    const marcaEliminada = oneBomba[0].marca_bomba;
    const modeloEliminado = oneBomba[0].modelo_bomba;

    //se invoca el servicio que Elimina la Bomba con ese id
    await deleteOneBombaForId(id_bomba);

    // 🌟 REGISTRO EN BITÁCORA: ELIMINAR BOMBA
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "ELIMINAR",
      "bombas",
      id_bomba,
      `Eliminó permanentemente la Bomba (Marca original: ${marcaEliminada}, Modelo: ${modeloEliminado})`,
    );

    res.send({
      status: "ok",
      description: "Bomba eliminada correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al eliminar la bomba",
    });
  }
};

export const updateBomba = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bomba = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;

    if (validarCamposBomba(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico para la actualización de la bomba",
      });
    }

    //Se invoca el servicio que devuelve la Bomba con ese id
    const oneBomba = await getOneBombaForId(id_bomba);

    //Se comprueba si ya existe la Bomba por su Id
    if (!oneBomba || oneBomba.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Bomba no registrada",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const bomba = {
      id_bomba: id_bomba,
      modelo_bomba: body.modelo_bomba,
      marca_bomba: body.marca_bomba,
      tipo_bomba: body.tipo_bomba,
      q: body.q,
      num_etapa: body.num_etapa,
      linea_bombeo_id_linea_bombeo: oneBomba[0].linea_bombeo_id_linea_bombeo,
    };

    //se invoca el servicio para Modificar una Bomba
    const bo = await modificarBomba(bomba);

    // 🌟 REGISTRO EN BITÁCORA: MODIFICAR BOMBA
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "MODIFICAR",
      "bombas",
      id_bomba,
      `Actualizó las especificaciones técnicas de la Bomba (Marca: ${body.marca_bomba}, Modelo: ${body.modelo_bomba}, Caudal Q: ${body.q})`,
    );

    res.send({
      status: "ok",
      description: "Bomba modificada correctamente",
      data: bo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al actualizar la bomba",
    });
  }
};
