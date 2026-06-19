import {
  SearchLinea_BombeoId, //Servicio que busca si ya existe una Linea de bombeo por su id
  getAllValvula, //Servicio que devuelve todos las Valvulas
  SearchValvulaId, //Servicio que busca si ya existe una valvula por su id
  SearchValvulaIdLineaBombeo, //Servicio que busca las Valvulas en una Linea de bombeo
  getOneValvulaForId, //Servicio que devuelve una Valvula por su id
  RegisterValvula, // Servicio para registrar una Valvula
  deleteOneValvulaForId, // Servicio que Elimina la Valvula con ese id
  modificarValvula, // Servicio para modiciar una Valvula
} from "../../services/valvula/valvula.service.js";

//FUNCIÓN AUXILIAR DE VALIDACIÓN TÉCNICA
const validarCamposValvula = (body) => {
  return (
    !body.modelo_valvula ||
    !body.marca_valvula ||
    !body.tipo_valvula ||
    body.pn === undefined ||
    !body.norma_brida ||
    !body.clase_valvula ||
    body.diametro_tornillo === undefined ||
    body.longitud_tornillo === undefined ||
    body.grado_tornillo === undefined ||
    !body.tipo_asiento ||
    !body.tipo_compuerta ||
    !body.forma_operacion
  );
};

export const getValvula = async (req, res) => {
  try {
    //se invoca el servicio que devuelve todos las valvulas
    const val = await getAllValvula();

    res.send({
      status: "ok",
      description: "Lista de Valvulas",
      data: val,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener las válvulas",
    });
  }
};

export const getValvulaForId = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_valvula = req.params.id;

    //se invoca el servicio que devuelve la Valvula con ese id
    const valvula = await getOneValvulaForId(id_valvula);

    //Se comprueba si ya existe la Valvula
    if (!valvula || valvula.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Valvula no registrada",
      });
    }

    res.send({
      status: "ok",
      description: "Valvula encontrada",
      data: valvula,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener las válvulas",
    });
  }
};

export const getValvulaForIdLineaBombeo = async (req, res) => {
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

    //se invoca el servicio que devuelve las valvulas de esa Linea de Bombeo
    const linea_valvu = await SearchValvulaIdLineaBombeo(id_linea_bombeo);

    res.send({
      status: "ok",
      description: "Las Valvulas que pertencen a esta Linea de Bombeo",
      data: linea_valvu,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener las válvulas",
    });
  }
};

export const postValvula = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_linea_bombeo = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposValvula(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico obligatorio en el registro de la válvula",
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
    const nuevaValvula = {
      modelo_valvula: body.modelo_valvula,
      marca_valvula: body.marca_valvula,
      tipo_valvula: body.tipo_valvula,
      pn: body.pn,
      norma_brida: body.norma_brida,
      clase_valvula: body.clase_valvula,
      diametro_tornillo: body.diametro_tornillo,
      longitud_tornillo: body.longitud_tornillo,
      grado_tornillo: body.grado_tornillo,
      tipo_asiento: body.tipo_asiento,
      tipo_compuerta: body.tipo_compuerta,
      forma_operacion: body.forma_operacion,
      linea_bombeo_id_linea_bombeo: id_linea_bombeo,
    };

    //se invoca el servicio para registrar una Valvula
    const val = await RegisterValvula(nuevaValvula);

    res.status(201).send({
      status: "ok",
      description: "Valvula registrada correctamente",
      data: val,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener las válvulas",
    });
  }
};

export const deleteValvula = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_valvula = req.params.id;

    //Se comprueba si ya existe la Valvula por su Id
    const search_va = await SearchValvulaId(id_valvula);
    if (search_va === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Valvula no registrada",
      });
    }

    //se invoca el servicio que Elimina la Valvula con ese id
    await deleteOneValvulaForId(id_valvula);

    res.send({
      status: "ok",
      description: "Eliminada la Valvula",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener las válvulas",
    });
  }
};

export const updateValvula = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_valvula = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposValvula(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un dato técnico obligatorio para la actualización de la válvula",
      });
    }

    //Se invoca el servicio que devuelve la Valvula con ese id
    const oneValvula = await getOneValvulaForId(id_valvula);

    //Se comprueba si ya existe la Valvula por su Id
    if (!oneValvula || oneValvula.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Valvula no registrada",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const valvula = {
      id_valvula: id_valvula, // Obligatorio para identificar la fila a actualizar
      modelo_valvula: body.modelo_valvula,
      marca_valvula: body.marca_valvula,
      tipo_valvula: body.tipo_valvula,
      pn: body.pn,
      norma_brida: body.norma_brida,
      clase_valvula: body.clase_valvula,
      diametro_tornillo: body.diametro_tornillo,
      longitud_tornillo: body.longitud_tornillo,
      grado_tornillo: body.grado_tornillo,
      tipo_asiento: body.tipo_asiento,
      tipo_compuerta: body.tipo_compuerta,
      forma_operacion: body.forma_operacion,
      linea_bombeo_id_linea_bombeo: oneValvula[0].linea_bombeo_id_linea_bombeo,
    };

    //se invoca el servicio para Modificar una Linea de bombeo
    const valvu = await modificarValvula(valvula);

    res.send({
      status: "ok",
      description: "Valvula modificada correctamente",
      data: valvu,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener las válvulas",
    });
  }
};
