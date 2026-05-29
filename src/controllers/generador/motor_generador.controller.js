import {
  SearchGeneradorId, //Servicio que busca si ya existe un Generador por su id
  getOneMotor_GeneradorForId, //Servicio que devuelve el Motor de un Generador por su id
  SearchMotor_GeneradorId, // Servicio que busca si el Generador posee Motor
  getOneMotor_GeneradorForid_generador_motor, // Servicio que devuelve el Motor del Generador por el id_generador_Motor
  RegisterMotor_Generador, // Servicio para registrar Motor para un Generador
  deleteOneMotor_GeneradorForid_generador_motor, // Servicio que Elimina Motor para un Generador con ese id
  modificarMotor_Generador, // Servicio para modiciar Motor de un Generador
} from "../../services/generador/motor_generador.service.js";

export const getMotor_GeneradorForId = async (req, res) => {
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

    //Se comprueba si el Generador posee Motor
    const search_motor = await SearchMotor_GeneradorId(id_generador);
    if (search_motor === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Generador no posee datos del Motor",
      });
    }

    //Se invoca el servicio que devuelve el Motor del Generador con ese id
    const ge_motor = await getOneMotor_GeneradorForId(id_generador);
    const id_generador_motor = ge_motor[0].id_generador_motor;

    //Se invoca el servicio que devuelve el id_generador_motor con el id_generador
    const mot =
      await getOneMotor_GeneradorForid_generador_motor(id_generador_motor);

    res.send({
      status: "ok",
      description: "Motor del Generador",
      data: mot,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const postMotor_Generador = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_generador = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (
      !body.modelo ||
      !body.marca ||
      !body.aspiracion ||
      body.refrigeracion === undefined ||
      body.num_cilindros === undefined ||
      body.potencia_motor === undefined ||
      body.velocidad_nominal === undefined ||
      !body.tipo_regulacion ||
      !body.sistema_arranque ||
      body.circuito_electrico === undefined ||
      body.regulador_velocidad === undefined ||
      body.combistible === undefined
    ) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar algún dato o especificación técnica del motor del generador",
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

    //Se comprueba si el Generador posee Motor
    const search_motor = await SearchMotor_GeneradorId(id_generador);
    if (search_motor != 0) {
      return res.status(409).send({
        status: "mal",
        description: "El Generador ya posee un registro del Motor asignado",
      });
    }

    //Se crea un objeto para pasarlo mas adelante
    const nuevoMotorGenerador = {
      modelo: body.modelo,
      marca: body.marca,
      aspiracion: body.aspiracion,
      refrigeracion: body.refrigeracion,
      num_cilindros: body.num_cilindros,
      potencia_motor: body.potencia_motor,
      velocidad_nominal: body.velocidad_nominal,
      tipo_regulacion: body.tipo_regulacion,
      sistema_arranque: body.sistema_arranque,
      circuito_electrico: body.circuito_electrico,
      regulador_velocidad: body.regulador_velocidad,
      combistible: body.combistible,
      generador_id_generador: id_generador,
    };

    //se invoca el servicio para registrar Motor para un Generador
    const motor_gene = await RegisterMotor_Generador(nuevoMotorGenerador);

    res.status(201).send({
      status: "ok",
      description: "Motor registrado correctamente",
      data: motor_gene,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const deleteMotor_Generador = async (req, res) => {
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

    //Se comprueba si el Generador posee Motor
    const search_motor = await SearchMotor_GeneradorId(id_generador);
    if (search_motor === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Generador no posee datos del Motor para elimiar",
      });
    }

    //Se invoca el servicio que devuelve el Motor del Generador con ese id
    const motor_gene = await getOneMotor_GeneradorForId(id_generador);
    const id_generador_motor = motor_gene[0].id_generador_motor;

    //se invoca el servicio que Elimina el Motor con ese id
    const del =
      await deleteOneMotor_GeneradorForid_generador_motor(id_generador_motor);

    res.send({
      status: "ok",
      description: "Eliminado Motor",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};

export const updateMotor_Generador = async (req, res) => {
  try {
    // se reciben la variable que viene por parametro
    const id_generador = req.params.id;

    //se reciben las variables en el req.body
    const { body } = req;
    if (
      !body.modelo ||
      !body.marca ||
      !body.aspiracion ||
      body.refrigeracion === undefined ||
      body.num_cilindros === undefined ||
      body.potencia_motor === undefined ||
      body.velocidad_nominal === undefined ||
      !body.tipo_regulacion ||
      !body.sistema_arranque ||
      body.circuito_electrico === undefined ||
      body.regulador_velocidad === undefined ||
      body.combistible === undefined
    ) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltó ingresar algún dato o especificación técnica del motor del generador",
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

    //Se comprueba si el Generador posee Motor
    const search_motor = await SearchMotor_GeneradorId(id_generador);
    if (search_motor === 0) {
      return res.status(400).send({
        status: "mal",
        description: "Generador no posee un registro del Motor para modificar",
      });
    }

    //Se invoca el servicio que devuelve Motor del Generador con ese id
    const motor_gene = await getOneMotor_GeneradorForId(id_generador);
    const id_generador_motor = motor_gene[0].id_generador_motor;

    //Se crea un objeto para pasarlo mas adelante
    const motorGeneradorAEditar = {
      id_generador_motor: id_generador_motor, // Obligatorio para el WHERE
      modelo: body.modelo,
      marca: body.marca,
      aspiracion: body.aspiracion,
      refrigeracion: body.refrigeracion,
      num_cilindros: body.num_cilindros,
      potencia_motor: body.potencia_motor,
      velocidad_nominal: body.velocidad_nominal,
      tipo_regulacion: body.tipo_regulacion,
      sistema_arranque: body.sistema_arranque,
      circuito_electrico: body.circuito_electrico,
      regulador_velocidad: body.regulador_velocidad,
      combistible: body.combistible,
      generador_id_generador: id_generador,
    };

    //se invoca el servicio para Modificar Motor del Generador
    const de_motor_gene = await modificarMotor_Generador(motorGeneradorAEditar);

    res.send({
      status: "ok",
      description: "Motor modificado correctamente",
      data: de_motor_gene,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error interno del servidor" });
  }
};
