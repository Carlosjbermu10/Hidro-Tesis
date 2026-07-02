import {
  SearchCCMId, //Servicio que busca si ya existe un CCM por su id
  getOneJuegos_Contactos_CCMForId, //Servicio que devuelve los Juegos de Contactos de un CCM por su id
  SearchJuegos_Contactos_CCMId, // Servicio que busca si el CCM posse Juegos de Contactos
  getOneJuegos_Contactos_CCMForid_juegos_contactos_ccm, // Servicio que devuelve los Juegos de Contactos del CCM por el id_juegos_contactos_ccm
  RegisterJuegos_Contactos_CCM, // Servicio para registrar Juegos de Contactos para un CCM
  deleteOneJuegos_Contactos_CCMForid_juegos_contactos_ccm, // Servicio que Elimina Juegos de Contactos para un CCM con ese id
  modificarJuegos_Contactos_CCM, // Servicio para modiciar Juegos de Contactos de un CCM
} from "../../services/ccm/juegos_contactos_ccm.service.js";

// 🔗 IMPORTAMOS LA BITÁCORA
import { InsertarBitacora } from "../../services/bitacora/bitacora.service.js";

//FUNCIÓN AUXILIAR DE VALIDACIÓN TÉCNICA
const validarCamposContactos = (body) => {
  return (
    body.bipolar === undefined ||
    body.tripolar === undefined ||
    body.tetrapolar === undefined ||
    body.pentapolar === undefined
  );
};

export const getJuegos_Contactos_CCMForId = async (req, res) => {
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

    //Se invoca el servicio que devuelve los Juegos de Contactos del CCM con ese id
    const juego_con = await getOneJuegos_Contactos_CCMForId(id_ccm);

    //Se comprueba si el CCM posee Juegos de Contactos
    if (!juego_con || juego_con.length === 0) {
      return res.status(404).send({
        status: "mal",
        description:
          "El Centro de Control de Máquinas no posee Juegos de Contactos registrados",
      });
    }

    const id_juegos_contactos_ccm = juego_con[0].id_juegos_contactos_ccm;

    //Se invoca el servicio que devuelve el id_juegos_contactos_ccm con el id_ccm
    const jue = await getOneJuegos_Contactos_CCMForid_juegos_contactos_ccm(
      id_juegos_contactos_ccm,
    );

    res.send({
      status: "ok",
      description: "Juegos de Contactos del Centro de Control de Máquinas",
      data: jue,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description:
        "Error interno del servidor al buscar los juegos de contactos",
    });
  }
};

export const postJuegos_Contactos_CCM = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_ccm = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposContactos(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar la configuración de los juegos de contactos en el módulo del CCM",
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

    //Se comprueba si el CCM posee Juegos de Contactos
    const search_jue = await SearchJuegos_Contactos_CCMId(id_ccm);
    if (search_jue != 0) {
      return res.status(409).send({
        status: "mal",
        description:
          "El Centro de Control de Máquinas ya posee Juegos de Contactos registrados",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const nuevoJuegoContacto = {
      bipolar: body.bipolar,
      tripolar: body.tripolar,
      tetrapolar: body.tetrapolar,
      pentapolar: body.pentapolar,
      ccm_id_ccm: id_ccm,
    };

    //se invoca el servicio para registrar Juegos de Contactos para un CCM
    const jue_ccm = await RegisterJuegos_Contactos_CCM(nuevoJuegoContacto);

    // 🌟 REGISTRO EN BITÁCORA: CREAR JUEGOS DE CONTACTOS
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "REGISTRAR",
      "juegos_contactos_ccm",
      id_ccm,
      `Registró la configuración de Juegos de Contactos (Bipolar: ${body.bipolar}, Tripolar: ${body.tripolar}) para el CCM ID: ${id_ccm}`,
    );

    res.status(201).send({
      status: "ok",
      description: "Juegos de Contactos registrado correctamente",
      data: jue_ccm,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description:
        "Error interno del servidor al registrar los juegos de contactos",
    });
  }
};

export const deleteJuegos_Contactos_CCM = async (req, res) => {
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

    //Se comprueba si el CCM posee Juegos de Contactos
    const search_jue = await SearchJuegos_Contactos_CCMId(id_ccm);
    if (search_jue === 0) {
      return res.status(409).send({
        status: "mal",
        description:
          "Centro de Control de Máquinas no posee Juegos de Contactos",
      });
    }

    //Se invoca el servicio que devuelve Juegos de Contactos del CCM con ese id
    const juego_co = await getOneJuegos_Contactos_CCMForId(id_ccm);
    const id_juegos_contactos_ccm = juego_co[0].id_juegos_contactos_ccm;

    // 💡 Rescatamos los valores de los contactos antes de eliminarlos
    const tripolarEliminado = juego_co[0].tripolar;
    const tetrapolarEliminado = juego_co[0].tetrapolar;

    //se invoca el servicio que Elimina Juegos de Contactos con ese id
    await deleteOneJuegos_Contactos_CCMForid_juegos_contactos_ccm(
      id_juegos_contactos_ccm,
    );

    // 🌟 REGISTRO EN BITÁCORA: ELIMINAR JUEGOS DE CONTACTOS
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "ELIMINAR",
      "juegos_contactos_ccm",
      id_juegos_contactos_ccm,
      `Eliminó permanentemente los Juegos de Contactos (Cantidades originales -> Tripolar: ${tripolarEliminado}, Tetrapolar: ${tetrapolarEliminado}) del CCM ID: ${id_ccm}`,
    );

    res.send({
      status: "ok",
      description: "Juegos de Contactos eliminados correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description:
        "Error interno del servidor al eliminar los juegos de contactos",
    });
  }
};

export const updateJuegos_Contactos_CCM = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_ccm = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (validarCamposContactos(body)) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar la configuración de los juegos de contactos en el módulo del CCM",
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

    //Se comprueba si el CCM posee Juegos de Contactos
    const search_jue = await SearchJuegos_Contactos_CCMId(id_ccm);
    if (search_jue === 0) {
      console.log(search_jue);
      return res.status(409).send({
        status: "mal",
        description:
          "Centro de Control de Máquinas no posee Juegos de Contactos",
      });
    }

    //Se invoca el servicio que devuelve Juegos de Contactos del CCM con ese id
    const jueg = await getOneJuegos_Contactos_CCMForId(id_ccm);
    const id_juegos_contactos_ccm = jueg[0].id_juegos_contactos_ccm;

    //Se crea un objeto para pasarlo mas adelante
    const juegoContactoAEditar = {
      id_juegos_contactos_ccm: id_juegos_contactos_ccm, // Obligatorio para el WHERE
      bipolar: body.bipolar,
      tripolar: body.tripolar,
      tetrapolar: body.tetrapolar,
      pentapolar: body.pentapolar,
      ccm_id_ccm: id_ccm,
    };

    //se invoca el servicio para Modificar Juegos de Contactos del CCM
    const de_juegos = await modificarJuegos_Contactos_CCM(juegoContactoAEditar);

    // 🌟 REGISTRO EN BITÁCORA: MODIFICAR JUEGOS DE CONTACTOS
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "MODIFICAR",
      "juegos_contactos_ccm",
      id_juegos_contactos_ccm,
      `Actualizó la configuración de Juegos de Contactos del CCM ID: ${id_ccm} (Nuevas cantidades -> Bipolar: ${body.bipolar}, Tripolar: ${body.tripolar})`,
    );

    res.send({
      status: "ok",
      description: "Juegos de Contactos modificado correctamente",
      data: de_juegos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description:
        "Error interno del servidor al actualizar los juegos de contactos",
    });
  }
};
