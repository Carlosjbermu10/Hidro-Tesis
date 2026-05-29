import {
  SearchCCMId, //Servicio que busca si ya existe un CCM por su id
  getOneArrancadores_CCMForId, //Servicio que devuelve el Tipo de Arrancadores del CCM por su id
  SearchArrancadores_CCMId, // Servicio que busca si el CCM posse Tipo de Arrancadores
  getOneArrancadores_CCMForId_Detalle, // Servicio que devuelve el Tipo de Arrancadores del CCM por el id_tipo_Arrancadores_ccm
  RegisterArrancadores_CCM, // Servicio para registrar Tipo de Arrancadores para un CCM
  deleteOneArrancadores_CCMForId_Detalle, // Servicio que Elimina Tipo de Arrancadores del CCM con ese id
  modificarArrancadores_CCM, // Servicio para modiciar Tipo de Arrancadores de un CCM
} from "../../services/ccm/tipo_arrancadores_ccm.service.js";

//FUNCIÓN AUXILIAR DE VALIDACIÓN TÉCNICA
const validarCamposArrancadores = (body) => {
  return (
    body.c_e_s === undefined ||
    body.c_a_estrella_triangulo === undefined ||
    body.c_a_directo === undefined ||
    body.c_a_con_reversion === undefined ||
    body.c_a_sin_reversion === undefined ||
    body.c_a_compen_transformador === undefined ||
    body.c_a_arrancador_suave === undefined ||
    body.c_convertidor_frecuencia === undefined ||
    body.bobinas_magneticas === undefined ||
    body.fusible === undefined ||
    body.interruptor === undefined ||
    body.interruptor_limitador_corriente === undefined
  );
};

export const getArrancadores_CCMForId = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_ccm = req.params.id;

    //Se comprueba si ya existe el CCM
    const search_ccm = await SearchCCMId(id_ccm);
    if (search_ccm === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Centro de Control de Máquinas no registrado",
      });
    }

    //Se invoca el servicio que devuelve el Tipo de Arrancadores del CCM con ese id
    const tipo_arr = await getOneArrancadores_CCMForId(id_ccm);

    //Se comprueba si el CCM posee Tipo de Arrancadores
    if (!tipo_arr || tipo_arr.length === 0) {
      return res.send({
        status: "mal",
        description: "Centro de Control de Máquinas no posee Tipo de Circuito",
      });
    }

    const id_tipo_arrancadores_ccm = tipo_arr[0].id_tipo_arrancadores_ccm;

    //Se invoca el servicio que devuelve el id_tipo_arrancadores_ccm con el id_ccm
    const arr = await getOneArrancadores_CCMForId_Detalle(
      id_tipo_arrancadores_ccm,
    );

    res.send({
      status: "ok",
      description: "Tipo de Arrancadores del Centro de Control de Máquinas",
      data: arr,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al buscar los arrancadores",
    });
  }
};

export const postArrancadores_CCM = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_ccm = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposArrancadores(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un tipo de arrancador o protección obligatorio en el módulo del CCM",
      });
    }

    //Se comprueba si ya existe el CCM
    const search_ccm = await SearchCCMId(id_ccm);
    if (search_ccm === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Centro de Control de Máquinas no registrado",
      });
    }

    //Se comprueba si el CCM posee Tipo de Arrancadores
    const search_tipo = await SearchArrancadores_CCMId(id_ccm);
    if (search_tipo !== 0) {
      return res.status(409).send({
        status: "mal",
        description:
          "Centro de Control de Máquinas ya posee Tipo de Arrancadores registrado",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const nuevoTipoArrancador = {
      c_e_s: body.c_e_s,
      c_a_estrella_triangulo: body.c_a_estrella_triangulo,
      c_a_directo: body.c_a_directo,
      c_a_con_reversion: body.c_a_con_reversion,
      c_a_sin_reversion: body.c_a_sin_reversion,
      c_a_compen_transformador: body.c_a_compen_transformador,
      c_a_arrancador_suave: body.c_a_arrancador_suave,
      c_convertidor_frecuencia: body.c_convertidor_frecuencia,
      bobinas_magneticas: body.bobinas_magneticas,
      fusible: body.fusible,
      interruptor: body.interruptor,
      interruptor_limitador_corriente: body.interruptor_limitador_corriente,
      ccm_id_ccm: id_ccm,
    };

    //se invoca el servicio para registrar un Tipo de Arrancador para un CCM
    const ar_ccm = await RegisterArrancadores_CCM(nuevoTipoArrancador);

    res.status(201).send({
      status: "ok",
      description: "Tipo de Arrancadores registrado correctamente",
      data: ar_ccm,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al registrar los arrancadores",
    });
  }
};

export const deleteArrancadores_CCM = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_ccm = req.params.id;

    //Se comprueba si ya existe el CCM
    const search_ccm = await SearchCCMId(id_ccm);
    if (search_ccm === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Centro de Control de Máquinas no registrado",
      });
    }

    //Se comprueba si el CCM posee Tipo de Arrancadores
    const search_arra = await SearchArrancadores_CCMId(id_ccm);
    if (search_arra === 0) {
      return res.status(409).send({
        status: "mal",
        description:
          "Centro de Control de Máquinas no posee Tipo de Arrancadores",
      });
    }

    //Se invoca el servicio que devuelve Tipo de Arrancadores del CCM con ese id
    const arrancador = await getOneArrancadores_CCMForId(id_ccm);
    const id_tipo_arrancadores_ccm = arrancador[0].id_tipo_arrancadores_ccm;

    //se invoca el servicio que Elimina Tipo de Arrancadores con ese id
    await deleteOneArrancadores_CCMForId_Detalle(id_tipo_arrancadores_ccm);

    res.send({
      status: "ok",
      description: "Tipo de Arrancadores eliminado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al eliminar los arrancadores",
    });
  }
};

export const updateArrancadores_CCM = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_ccm = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposArrancadores(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar un tipo de arrancador o protección obligatorio en el módulo del CCM",
      });
    }

    //Se comprueba si ya existe el CCM
    const search_ccm = await SearchCCMId(id_ccm);
    if (search_ccm === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Centro de Control de Máquinas no registrado",
      });
    }

    //Se comprueba si el CCM posee Tipo de Arrancadores
    const search_ar = await SearchArrancadores_CCMId(id_ccm);
    if (search_ar === 0) {
      return res.status(409).send({
        status: "mal",
        description:
          "Centro de Control de Máquinas no posee Tipo de Arrancadores",
      });
    }

    //Se invoca el servicio que devuelve Tipo de Arrancadores del CCM con ese id
    const arran = await getOneArrancadores_CCMForId(id_ccm);
    const id_tipo_arrancadores_ccm = arran[0].id_tipo_arrancadores_ccm;

    //Se crea un objeto para pasarlo mas adelante
    const tipoArrancadorAEditar = {
      id_tipo_arrancadores_ccm: id_tipo_arrancadores_ccm,
      c_e_s: body.c_e_s,
      c_a_estrella_triangulo: body.c_a_estrella_triangulo,
      c_a_directo: body.c_a_directo,
      c_a_con_reversion: body.c_a_con_reversion,
      c_a_sin_reversion: body.c_a_sin_reversion,
      c_a_compen_transformador: body.c_a_compen_transformador,
      c_a_arrancador_suave: body.c_a_arrancador_suave,
      c_convertidor_frecuencia: body.c_convertidor_frecuencia,
      bobinas_magneticas: body.bobinas_magneticas,
      fusible: body.fusible,
      interruptor: body.interruptor,
      interruptor_limitador_corriente: body.interruptor_limitador_corriente,
      ccm_id_ccm: id_ccm,
    };

    //se invoca el servicio para Modificar Tipo de Arrancadores del CCM
    const de_arranca = await modificarArrancadores_CCM(tipoArrancadorAEditar);

    res.send({
      status: "ok",
      description: "Detalles del Tipo de Arrancadores modificado correctamente",
      data: de_arranca,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error interno del servidor al actualizar los arrancadores",
    });
  }
};
