import {
  SearchGeneradorId, //Servicio que busca si ya existe un Generador por su id
  getOneDimension_Peso_GeneradorForId, //Servicio que devuelve el Dimension_Peso de un Generador por su id
  SearchDimension_Peso_GeneradorId, // Servicio que busca si el Generador posse Dimension_Peso
  getOneDimension_Peso_GeneradorForid_generador_dimension_peso, // Servicio que devuelve el Dimension_Peso del Generador por el id_generador_dimension_peso
  RegisterDimension_Peso_Generador, // Servicio para registrar Dimension_Peso para un Generador
  deleteOneDimension_Peso_GeneradorForid_generador_dimension_peso, // Servicio que Elimina Dimension_Peso para un Generador con ese id
  modificarDimension_Peso_Generador, // Servicio para modiciar Dimension_Peso de un Generador
} from "../../services/generador/dimension_peso_generador.service.js";

export const getDimension_Peso_GeneradorForId = async (req, res) => {
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

    //Se comprueba si el Generador posee Dimension y Peso
    const search_dim_pe = await SearchDimension_Peso_GeneradorId(id_generador);
    if (search_dim_pe === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Generador no posee datos de Dimension y Peso",
      });
    }

    //Se invoca el servicio que devuelve los Dimension y Peso del Generador con ese id
    const dim_peso = await getOneDimension_Peso_GeneradorForId(id_generador);
    const id_generador_dimension_peso = dim_peso[0].id_generador_dimension_peso;

    //Se invoca el servicio que devuelve el id_generador_dimension_peso con el id_generador
    const di_p =
      await getOneDimension_Peso_GeneradorForid_generador_dimension_peso(
        id_generador_dimension_peso,
      );

    res.send({
      status: "ok",
      description: "Dimension y Peso del Generador obtenidos con éxito",
      data: di_p,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const postDimension_Peso_Generador = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_generador = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (
      body.largo === undefined ||
      body.ancho === undefined ||
      body.alto === undefined ||
      body.peso === undefined ||
      body.cap_deposito_combustible_propio === undefined ||
      body.autonomia === undefined
    ) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar una dimensión, peso o dato de autonomía del generador",
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

    //Se comprueba si el Generador posee Dimension_Peso
    const search_dim_pe = await SearchDimension_Peso_GeneradorId(id_generador);
    if (search_dim_pe != 0) {
      return res.status(409).send({
        status: "mal",
        description:
          "El Generador ya posee un registro de Dimension y Peso asignado",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const nuevaDimensionPeso = {
      largo: body.largo,
      ancho: body.ancho,
      alto: body.alto,
      peso: body.peso,
      cap_deposito_combustible_propio: body.cap_deposito_combustible_propio,
      autonomia: body.autonomia,
      generador_id_generador: id_generador,
    };

    //se invoca el servicio para registrar Dimension_Peso para un Generador
    const di_pe_gene =
      await RegisterDimension_Peso_Generador(nuevaDimensionPeso);

    res.status(201).send({
      status: "ok",
      description: "Dimension y Peso registrado correctamente",
      data: di_pe_gene,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const deleteDimension_Peso_Generador = async (req, res) => {
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

    //Se comprueba si el Generador posee Dimension_Peso
    const search_dim_pe = await SearchDimension_Peso_GeneradorId(id_generador);
    if (search_dim_pe === 0) {
      return res.status(404).send({
        status: "mal",
        description:
          "Generador no posee datos de Dimension y Peso para elimiar",
      });
    }

    //Se invoca el servicio que devuelve Dimension_Peso del Generador con ese id
    const dime_peso = await getOneDimension_Peso_GeneradorForId(id_generador);
    const id_generador_dimension_peso =
      dime_peso[0].id_generador_dimension_peso;

    //se invoca el servicio que Elimina el Dimension_Peso con ese id
    const del =
      await deleteOneDimension_Peso_GeneradorForid_generador_dimension_peso(
        id_generador_dimension_peso,
      );

    res.send({
      status: "ok",
      description: "Dimension y Peso eliminados correctamente",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const updateDimension_Peso_Generador = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_generador = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (
      body.largo === undefined ||
      body.ancho === undefined ||
      body.alto === undefined ||
      body.peso === undefined ||
      body.cap_deposito_combustible_propio === undefined ||
      body.autonomia === undefined
    ) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar una dimensión, peso o dato de autonomía del generador",
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

    //Se comprueba si el Generador posee Dimension_Peso
    const search_dim_pe = await SearchDimension_Peso_GeneradorId(id_generador);
    if (search_dim_pe === 0) {
      return res.status(400).send({
        status: "mal",
        description: "Generador no posee Dimension_Peso",
      });
    }

    //Se invoca el servicio que devuelve Dimension_Peso del Generador con ese id
    const dim_pe = await getOneDimension_Peso_GeneradorForId(id_generador);
    const id_generador_dimension_peso = dim_pe[0].id_generador_dimension_peso;

    //Se crea un objeto para pasarlo mas adelante
    const dimensionPesoAEditar = {
      id_generador_dimension_peso: id_generador_dimension_peso, // Obligatorio para el WHERE
      largo: body.largo,
      ancho: body.ancho,
      alto: body.alto,
      peso: body.peso,
      cap_deposito_combustible_propio: body.cap_deposito_combustible_propio,
      autonomia: body.autonomia,
      generador_id_generador: id_generador,
    };

    //se invoca el servicio para Modificar Dimension_Peso del Generador
    const de_dim_pe =
      await modificarDimension_Peso_Generador(dimensionPesoAEditar);

    res.send({
      status: "ok",
      description: "Dimension y Peso modificado correctamente",
      data: de_dim_pe,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};
