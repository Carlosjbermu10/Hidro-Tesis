import {
  SearchGeneradorId, //Servicio que busca si ya existe un Generador por su id
  getOneCombustible_Lubricante_GeneradorForId, //Servicio que devuelve los Combustible_Lubricante de un Generador por su id
  SearchCombustible_Lubricante_GeneradorId, // Servicio que busca si el Generador posse Combustible_Lubricante
  getOneCombustible_Lubricante_GeneradorForid_generador_combustible_lubricante, // Servicio que devuelve los Combustible_Lubricante del Generador por el id_generador_combustible_lubricante
  RegisterCombustible_Lubricante_Generador, // Servicio para registrar Combustible_Lubricante para un Generador
  deleteOneCombustible_Lubricante_GeneradorForid_generador_combustible_lubricante, // Servicio que Elimina Combustible_Lubricante para un Generador con ese id
  modificarCombustible_Lubricante_Generador, // Servicio para modiciar Combustible_Lubricante de un Generador
} from "../../services/generador/combustible_lubricante_generador.service.js";

// 🔗 IMPORTAMOS LA BITÁCORA
import { InsertarBitacora } from "../../services/bitacora/bitacora.service.js";

export const getCombustible_Lubricante_GeneradorForId = async (req, res) => {
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

    //Se comprueba si el Generador posee Combustible_Lubricante
    const search_com_lu =
      await SearchCombustible_Lubricante_GeneradorId(id_generador);
    if (search_com_lu === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Generador no posee datos de Combustible y Lubricante",
      });
    }

    //Se invoca el servicio que devuelve los Combustible_Lubricante del Generador con ese id
    const com_lu =
      await getOneCombustible_Lubricante_GeneradorForId(id_generador);
    const id_generador_combustible_lubricante =
      com_lu[0].id_generador_combustible_lubricante;

    //Se invoca el servicio que devuelve el id_generador_combustible_lubricante con el id_generador
    const comb =
      await getOneCombustible_Lubricante_GeneradorForid_generador_combustible_lubricante(
        id_generador_combustible_lubricante,
      );

    res.send({
      status: "ok",
      description: "Combustible y Lubricante del Generador obtenidos con éxito",
      data: comb,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

// Asegúrate de importar el servicio de la bitácora en la parte superior
// import { InsertarBitacora } from "../../services/bitacora/bitacora.service.js";

export const postCombustible_Lubricante_Generador = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_generador = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (
      body.consumo_combustible === undefined ||
      body.cap_aceite_lubricante === undefined ||
      body.consumo_lubricante === undefined ||
      !body.tipo_lubricante
    ) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar los datos de fluidos y consumibles del generador",
      });
    }

    //Se comprueba si ya existe el Generador
    const search_gene = await SearchGeneradorId(id_generador);
    if (search_gene === 0) {
      return res.status(400).send({
        status: "mal",
        description: "Generador no registrado",
      });
    }

    //Se comprueba si el Generador posee Combustible_Lubricante
    const search_com_lu =
      await SearchCombustible_Lubricante_GeneradorId(id_generador);
    if (search_com_lu != 0) {
      return res.status(409).send({
        status: "mal",
        description:
          "El Generador ya posee un registro de Combustible y Lubricante asignado",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const nuevosFluidosGenerador = {
      consumo_combustible: body.consumo_combustible,
      cap_aceite_lubricante: body.cap_aceite_lubricante,
      consumo_lubricante: body.consumo_lubricante,
      tipo_lubricante: body.tipo_lubricante,
      generador_id_generador: id_generador,
    };

    //se invoca el servicio para registrar Combustible_Lubricante para un Generador
    const com_lu_gene = await RegisterCombustible_Lubricante_Generador(
      nuevosFluidosGenerador,
    );

    // 🌟 REGISTRO EN BITÁCORA: CREAR FLUIDOS
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "REGISTRAR",
      "generador_combustible_lubricante", // Ajusta el nombre si tu tabla se llama distinto
      id_generador,
      `Registró la ficha de fluidos (Consumo Combustible: ${body.consumo_combustible}, Tipo Lubricante: ${body.tipo_lubricante}) para el Generador ID: ${id_generador}`,
    );

    res.status(201).send({
      status: "ok",
      description: "Combustible y Lubricante registrado correctamente",
      data: com_lu_gene,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const deleteCombustible_Lubricante_Generador = async (req, res) => {
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

    //Se comprueba si el Generador posee Combustible_Lubricante
    const search_com_lu =
      await SearchCombustible_Lubricante_GeneradorId(id_generador);
    if (search_com_lu === 0) {
      return res.status(404).send({
        status: "mal",
        description:
          "Generador no posee datos de Combustible y Lubricante para elimiar",
      });
    }

    //Se invoca el servicio que devuelve Combustible_Lubricante del Generador con ese id
    const comb_lubr =
      await getOneCombustible_Lubricante_GeneradorForId(id_generador);
    const id_generador_combustible_lubricante =
      comb_lubr[0].id_generador_combustible_lubricante;

    // 💡 Rescatamos el tipo de lubricante antes de borrar el registro
    const tipoLubricanteEliminado =
      comb_lubr[0].tipo_lubricante || "Desconocido";

    //se invoca el servicio que Elimina Combustible_Lubricante con ese id
    await deleteOneCombustible_Lubricante_GeneradorForid_generador_combustible_lubricante(
      id_generador_combustible_lubricante,
    );

    // 🌟 REGISTRO EN BITÁCORA: ELIMINAR FLUIDOS
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "ELIMINAR",
      "generador_combustible_lubricante",
      id_generador_combustible_lubricante,
      `Eliminó permanentemente la ficha de fluidos y consumibles (Tipo Lubricante original: ${tipoLubricanteEliminado}) del Generador ID: ${id_generador}`,
    );

    res.send({
      status: "ok",
      description: "Combustible y Lubricante eliminados correctamente",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const updateCombustible_Lubricante_Generador = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_generador = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (
      body.consumo_combustible === undefined ||
      body.cap_aceite_lubricante === undefined ||
      body.consumo_lubricante === undefined ||
      !body.tipo_lubricante
    ) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar los datos de fluidos y consumibles del generador",
      });
    }

    //Se comprueba si ya existe el Generador
    const search_gene = await SearchGeneradorId(id_generador);
    if (search_gene === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Generador no registrado",
      });
    }

    //Se comprueba si el Generador posee Combustible_Lubricante
    const search_com_lu =
      await SearchCombustible_Lubricante_GeneradorId(id_generador);
    if (search_com_lu === 0) {
      return res.status(400).send({
        status: "mal",
        description:
          "Generador no posee un registro de Combustible y Lubricante para modificar",
      });
    }

    //Se invoca el servicio que devuelve Combustible y Lubricante del Generador con ese id
    const comb_lu =
      await getOneCombustible_Lubricante_GeneradorForId(id_generador);
    const id_generador_combustible_lubricante =
      comb_lu[0].id_generador_combustible_lubricante;

    //Se crea un objeto para pasarlo mas adelante
    const fluidosGeneradorAEditar = {
      id_generador_combustible_lubricante: id_generador_combustible_lubricante, // Obligatorio para el WHERE
      consumo_combustible: body.consumo_combustible,
      cap_aceite_lubricante: body.cap_aceite_lubricante,
      consumo_lubricante: body.consumo_lubricante,
      tipo_lubricante: body.tipo_lubricante,
      generador_id_generador: id_generador,
    };
    //se invoca el servicio para Modificar Combustible_Lubricante del Generador
    const de_com_lu = await modificarCombustible_Lubricante_Generador(
      fluidosGeneradorAEditar,
    );

    // 🌟 REGISTRO EN BITÁCORA: MODIFICAR FLUIDOS
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "MODIFICAR",
      "generador_combustible_lubricante",
      id_generador_combustible_lubricante,
      `Actualizó los parámetros de fluidos del Generador ID: ${id_generador} (Nuevo Consumo Combustible: ${body.consumo_combustible}, Tipo Lubricante: ${body.tipo_lubricante})`,
    );

    res.send({
      status: "ok",
      description: "Combustible y Lubricante modificado correctamente",
      data: de_com_lu,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};
