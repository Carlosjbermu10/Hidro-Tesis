import {
  SearchEstacionId, //Servicio que busca si ya existe una Estacion de bombeo por su id
  getAllTanque, //Servicio que devuelve todos los Tanques
  SearchTanqueId, //Servicio que busca si ya existe un Tanque por su id
  SearchTanqueIdEstacion, //Servicio que busca los Tanques en una Estacion de bombeo
  getOneTanqueForId, //Servicio que devuelve un Tanque por su id
  RegisterTanque, // Servicio para registrar un Tanque
  deleteOneTanqueForId, // Servicio que Elimina un Tanque con ese id
  modificarTanque, // Servicio para modiciar un Tanque
} from "../../services/tanque/tanque.service.js";

// --- VALIDACIÓN DRY ---
const validarCamposTanque = (body) => {
  // Se validan los campos, incluso los que admiten NULL en BD, para asegurar
  // que el frontend envíe el objeto completo (pueden venir como null explícito).
  return (
    body.volumen === undefined ||
    body.geometria === undefined ||
    body.posicion === undefined ||
    body.largo === undefined ||
    body.ancho === undefined ||
    body.espesor === undefined ||
    body.total_litros === undefined ||
    body.cap_max_tanque === undefined ||
    body.extintor === undefined ||
    body.material_tanque === undefined ||
    body.area_cercada === undefined ||
    body.tipo_cerramiento === undefined
  );
};

export const getTanque = async (req, res) => {
  try {
    //se invoca el servicio que devuelve todos los Tanques
    const tan = await getAllTanque();

    res.send({
      status: "ok",
      description: "Lista de Tanques",
      data: tan,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const getTanqueForId = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_tanque = req.params.id;

    //Se comprueba si ya existe el Tanque
    const search_tan = await SearchTanqueId(id_tanque);
    if (search_tan === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Tanque no registrado",
      });
    }

    //se invoca el servicio que devuelve el Tanque con ese id
    const tanq = await getOneTanqueForId(id_tanque);

    res.send({
      status: "ok",
      description: "Tanque",
      data: tanq,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const getTanqueForIdEstacion = async (req, res) => {
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

    //se invoca el servicio que devuelve los Tanques de esa Estacion de Bombeo
    const est_tanque = await SearchTanqueIdEstacion(id_bombeo);

    res.send({
      status: "ok",
      description: "Los Tanques que pertencen a esta Estacion de Bombeo",
      data: est_tanque,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const postTanque = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bombeo = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;

    // Uso de la función auxiliar de validación
    if (validarCamposTanque(body)) {
      return res.status(400).send({
        status: "mal",
        description: "Faltó ingresar un dato técnico en el registro del tanque",
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
    const nuevoTanque = {
      volumen: body.volumen,
      geometria: body.geometria,
      posicion: body.posicion,
      largo: body.largo,
      ancho: body.ancho,
      espesor: body.espesor,
      total_litros: body.total_litros,
      cap_max_tanque: body.cap_max_tanque,
      extintor: body.extintor,
      material_tanque: body.material_tanque,
      area_cercada: body.area_cercada,
      tipo_cerramiento: body.tipo_cerramiento,
      est_bombeo_id_est: id_bombeo,
    };

    //se invoca el servicio para registrar un Tanque
    const tanque = await RegisterTanque(nuevoTanque);

    res.status(201).send({
      status: "ok",
      description: "Tanque registrado correctamente",
      data: tanque,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno al registrar el tanque",
    });
  }
};

export const deleteTanque = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_tanque = req.params.id;

    //Se comprueba si ya existe el Tanque por su Id
    const search_gene = await SearchTanqueId(id_tanque);
    if (search_gene === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Tanque no registrado",
      });
    }

    //se invoca el servicio que Elimina el Tanque con ese id
    await deleteOneTanqueForId(id_tanque);

    res.send({
      status: "ok",
      description: "Eliminado el Tanque",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno al eliminar el tanque",
    });
  }
};

export const updateTanque = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_tanque = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;

    // Uso de la función auxiliar de validación
    if (validarCamposTanque(body)) {
      return res.status(400).send({
        status: "mal",
        description: "Faltó ingresar un dato técnico en el registro del Tanque",
      });
    }

    //Se comprueba si ya existe el Tanque por su Id
    const search_gene = await SearchTanqueId(id_tanque);
    if (search_gene === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Tanque no registrado",
      });
    }

    //Se invoca el servicio que devuelve el Tanque con ese id
    const oneTanque = await getOneTanqueForId(id_tanque);

    //Se crea un objeto para pasarlo mas adelante
    const tanqueAEditar = {
      id_tanque: id_tanque, // Primary Key para el WHERE
      volumen: body.volumen,
      geometria: body.geometria,
      posicion: body.posicion,
      largo: body.largo,
      ancho: body.ancho,
      espesor: body.espesor,
      total_litros: body.total_litros,
      cap_max_tanque: body.cap_max_tanque,
      extintor: body.extintor,
      material_tanque: body.material_tanque,
      area_cercada: body.area_cercada,
      tipo_cerramiento: body.tipo_cerramiento,
      est_bombeo_id_est: oneTanque[0].est_bombeo_id_est, // Conservamos la llave foránea
    };

    //se invoca el servicio para Modificar un Tanque
    const ta = await modificarTanque(tanqueAEditar);

    res.send({
      status: "ok",
      description: "Tanque modificado correctamente",
      data: ta,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno al modificar el tanque",
    });
  }
};
