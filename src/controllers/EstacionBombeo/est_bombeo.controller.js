import {
  getAllEstacion, //Servicio que devuelve todas las Estaciones de bombeo
  SearchEstacionId, //Servicio que busca si ya existe una Estacion de bombeo por su id
  getOneEstacionForId, //Servicio que devuelve una Estacion de bombeo por su id
  SearchEstacionCodigo, //Servicio que busca si ya existe una Estacion de bombeo por su codigo
  RegisterEstacion, // Servicio para registrar una Estacion de bombeo
  deleteOneEstacionForId, // Servicio que Elimina la Estación de bombeo con ese id
  modificarEstacion, // Servicio para modiciar una Estación de bombeo
  SearchEstacionCodigoId, // Servicio que compara el id de una Estación de bombeo con el codigo
} from "../../services/EstacionBombeo/est_bombeo.service.js";

//FUNCIÓN AUXILIAR PARA VALIDAR CAMPOS REQUERIDOS---
const validarCamposEstacion = (body) => {
  return (
    !body.codigo ||
    !body.nombre_sistema ||
    !body.nombre_est ||
    !body.tipo_est ||
    body.tipo_succion === undefined
  );
};

export const getEstacion = async (req, res) => {
  try {
    //se invoca el servicio que devuelve todos las Estaciones de bombeo
    const est = await getAllEstacion();

    res.send({
      status: "ok",
      description: "Lista de Estaciones de bombeo",
      data: est,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al obtener las estaciones",
    });
  }
};

export const getEstacionForId = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bombeo = req.params.id;

    //se invoca el servicio que devuelve la Estación de bombeo con ese id
    const est = await getOneEstacionForId(id_bombeo);

    //Se comprueba si ya existe la Estaciones de bombeo
    if (!est || est.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    res.send({
      status: "ok",
      description: "Estación de bombeo",
      data: est,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al buscar la estación",
    });
  }
};

export const postEstacion = async (req, res) => {
  try {
    const { body } = req;

    // Validación unificada para asegurar consistencia con la base de datos
    if (validarCamposEstacion(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltan ingresar datos obligatorios de la Estación de Bombeo",
      });
    }

    //Se comprueba si ya existe la Estación de Bombeo con ese mismo código único
    const search_co = await SearchEstacionCodigo(body.codigo);
    if (search_co > 0) {
      return res.status(409).send({
        status: "mal",
        description:
          "El código de la Estación de Bombeo ya se encuentra registrado",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const est = {
      codigo: body.codigo,
      nombre_sistema: body.nombre_sistema,
      nombre_est: body.nombre_est,
      tipo_est: body.tipo_est,
      tipo_succion: body.tipo_succion,
    };

    //se invoca el servicio para registrar una Estacion de Bombeo
    const es = await RegisterEstacion(est);

    res.status(201).send({
      status: "ok",
      description: "Estación de Bombeo registrada correctamente",
      data: es,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al registrar la estación",
    });
  }
};

export const deleteEstacion = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bombeo = req.params.id;

    //Se comprueba si ya existe la Estaciones de bombeo
    const search = await SearchEstacionId(id_bombeo);
    if (search === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    //se invoca el servicio que Elimina la Estación de bombeo con ese id
    await deleteOneEstacionForId(id_bombeo);

    res.send({
      status: "ok",
      description: "Estación de bombeo eliminada correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al eliminar la estación",
    });
  }
};

export const updateEstacion = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_bombeo = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposEstacion(body)) {
      return res.status(400).send({
        status: "mal",
        description: "Faltan ingresar datos obligatorios para la actualización",
      });
    }

    //Se comprueba si la estación que se quiere editar realmente existe
    const one = await getOneEstacionForId(id_bombeo);
    if (!one || one.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    //Solo validamos el código si el usuario lo cambió en el formulario
    if (body.codigo !== one[0].codigo) {
      const searchCodigoId = await SearchEstacionCodigoId(body.codigo);
      if (searchCodigoId && searchCodigoId.length > 0) {
        return res.status(409).send({
          status: "mal",
          description:
            "No se puede actualizar: El nuevo código ya pertenece a otra Estación de Bombeo",
        });
      }
    }

    //Se crea un objeto para pasarlo mas adelante
    const est = {
      id: id_bombeo,
      codigo: body.codigo,
      nombre_sistema: body.nombre_sistema,
      nombre_est: body.nombre_est,
      tipo_est: body.tipo_est,
      tipo_succion: body.tipo_succion,
    };

    //se invoca el servicio para Modificar una Estacion de Bombeo
    const es = await modificarEstacion(est);

    res.send({
      status: "ok",
      description: "Estación de Bombeo modificada correctamente",
      data: es,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al actualizar la estación",
    });
  }
};
