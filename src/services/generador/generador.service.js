import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query(
    "SELECT 1 FROM est_bombeo WHERE id_est = ? LIMIT 1",
    [id_bombeo],
  );
  return rows.length;
};

//Servicio que devuelve todas los Generadores
export const getAllGenerador = async () => {
  const [rows] = await pool.query(`SELECT * FROM generador;`);
  return rows;
};

//Servicio que busca si ya existe un Generador por su id
export const SearchGeneradorId = async (id_generador) => {
  const [rows] = await pool.query(
    "SELECT 1 FROM generador WHERE id_generador = ? LIMIT 1",
    [id_generador],
  );
  return rows.length;
};

//Servicio que devuelve los datos del Generador por el id
export const getOneGeneradorForId = async (id_generador) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador WHERE id_generador = ?",
    [id_generador],
  );
  return rows;
};

//Servicio que devuelve los datos de los Generadores que pertenecen a la Estacion de Bombeo por su id
export const SearchGeneradorIdEstacion = async (id_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador WHERE est_bombeo_id_est = ?",
    [id_bombeo],
  );
  return rows;
};

//Servicio para registrar un Generador
export const RegisterGenerador = async (nuevoGenerador) => {
  const {
    potencia_principal,
    revolucion,
    voltaje,
    fase,
    cableado,
    factor_potencia,
    corriente,
    conexion,
    frecuencia,
    rodamiento,
    clase_proteccion,
    clase_aislamiento,
    est_bombeo_id_est,
  } = nuevoGenerador;

  const [rows] = await pool.query(
    `INSERT INTO generador (
      potencia_principal, revolucion, voltaje, fase, cableado, 
      factor_potencia, corriente, conexion, frecuencia, rodamiento, 
      clase_proteccion, clase_aislamiento, est_bombeo_id_est
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      potencia_principal,
      revolucion,
      voltaje,
      fase,
      cableado,
      factor_potencia,
      corriente,
      conexion,
      frecuencia,
      rodamiento,
      clase_proteccion,
      clase_aislamiento,
      est_bombeo_id_est,
    ],
  );

  return { id: rows.insertId, ...nuevoGenerador };
};

//Servicio que elimina un Generador por el id
export const deleteOneGeneradorForId = async (id_generador) => {
  const [rows] = await pool.query(
    "DELETE FROM generador WHERE id_generador = ?",
    [id_generador],
  );
  return rows;
};

//Servicio para modificar un Generador
export const modificarGenerador = async (generadorAEditar) => {
  const id = generadorAEditar.id_generador;
  const {
    potencia_principal,
    revolucion,
    voltaje,
    fase,
    cableado,
    factor_potencia,
    corriente,
    conexion,
    frecuencia,
    rodamiento,
    clase_proteccion,
    clase_aislamiento,
    est_bombeo_id_est,
  } = generadorAEditar;

  const [rows] = await pool.query(
    `UPDATE generador SET 
      potencia_principal = ?, 
      revolucion = ?, 
      voltaje = ?, 
      fase = ?, 
      cableado = ?, 
      factor_potencia = ?, 
      corriente = ?, 
      conexion = ?, 
      frecuencia = ?, 
      rodamiento = ?, 
      clase_proteccion = ?, 
      clase_aislamiento = ?, 
      est_bombeo_id_est = ? 
    WHERE id_generador = ?`,
    [
      potencia_principal,
      revolucion,
      voltaje,
      fase,
      cableado,
      factor_potencia,
      corriente,
      conexion,
      frecuencia,
      rodamiento,
      clase_proteccion,
      clase_aislamiento,
      est_bombeo_id_est,
      id,
    ],
  );

  return { id, ...generadorAEditar };
};
