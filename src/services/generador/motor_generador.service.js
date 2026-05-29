import { pool } from "../../database/db.js";

//Servicio que busca si ya existe un Generador por su id
export const SearchGeneradorId = async (id_generador) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador WHERE id_generador = ?",
    [id_generador],
  );
  return rows.length;
};

//Servicio que devuelve el Motor del Generador por el id
export const getOneMotor_GeneradorForId = async (id_generador) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador_motor WHERE generador_id_generador = ?",
    [id_generador],
  );
  return rows;
};

//Servicio que devuelve los Motor del Generador por el id_generador_motor
export const getOneMotor_GeneradorForid_generador_motor = async (
  id_generador_motor,
) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador_motor WHERE id_generador_motor = ?",
    [id_generador_motor],
  );
  return rows;
};

//Servicio que busca si el Generador posse Motor
export const SearchMotor_GeneradorId = async (id_generador) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador_motor WHERE generador_id_generador = ?",
    [id_generador],
  );
  return rows.length;
};

//Servicio para registrar un Motor del Generador
export const RegisterMotor_Generador = async (nuevoMotorGenerador) => {
  const {
    modelo,
    marca,
    aspiracion,
    refrigeracion,
    num_cilindros,
    potencia_motor,
    velocidad_nominal,
    tipo_regulacion,
    sistema_arranque,
    circuito_electrico,
    regulador_velocidad,
    combistible,
    generador_id_generador,
  } = nuevoMotorGenerador;

  const [rows] = await pool.query(
    `INSERT INTO generador_motor (
      modelo, marca, aspiracion, refrigeracion, num_cilindros, 
      potencia_motor, velocidad_nominal, tipo_regulacion, sistema_arranque, 
      circuito_electrico, regulador_velocidad, combistible, generador_id_generador
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      modelo,
      marca,
      aspiracion,
      refrigeracion,
      num_cilindros,
      potencia_motor,
      velocidad_nominal,
      tipo_regulacion,
      sistema_arranque,
      circuito_electrico,
      regulador_velocidad,
      combistible,
      generador_id_generador,
    ],
  );

  return { id: rows.insertId, ...nuevoMotorGenerador };
};

//Servicio que elimina un Motor del Generador
export const deleteOneMotor_GeneradorForid_generador_motor = async (
  id_generador_motor,
) => {
  const [rows] = await pool.query(
    "DELETE FROM generador_motor WHERE id_generador_motor = ?",
    [id_generador_motor],
  );
  return rows;
};

//Servicio para modificar un Motor del Generador
export const modificarMotor_Generador = async (motorGeneradorAEditar) => {
  const id = motorGeneradorAEditar.id_generador_motor;
  const {
    modelo,
    marca,
    aspiracion,
    refrigeracion,
    num_cilindros,
    potencia_motor,
    velocidad_nominal,
    tipo_regulacion,
    sistema_arranque,
    circuito_electrico,
    regulador_velocidad,
    combistible,
    generador_id_generador,
  } = motorGeneradorAEditar;

  const [rows] = await pool.query(
    `UPDATE generador_motor SET 
      modelo = ?, 
      marca = ?, 
      aspiracion = ?, 
      refrigeracion = ?, 
      num_cilindros = ?, 
      potencia_motor = ?, 
      velocidad_nominal = ?, 
      tipo_regulacion = ?, 
      sistema_arranque = ?, 
      circuito_electrico = ?, 
      regulador_velocidad = ?, 
      combistible = ?, 
      generador_id_generador = ? 
    WHERE id_generador_motor = ?`,
    [
      modelo,
      marca,
      aspiracion,
      refrigeracion,
      num_cilindros,
      potencia_motor,
      velocidad_nominal,
      tipo_regulacion,
      sistema_arranque,
      circuito_electrico,
      regulador_velocidad,
      combistible,
      generador_id_generador,
      id,
    ],
  );

  return { id, ...motorGeneradorAEditar };
};
