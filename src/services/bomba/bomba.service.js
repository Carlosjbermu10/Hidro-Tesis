import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE id_est = ?", [
    id_bombeo,
  ]);
  return rows.length;
};

//Servicio que devuelve todas los motores
export const getAllBomba = async () => {
  const [rows] = await pool.query(`SELECT * FROM bd_beta.bomba;`);
  return rows;
};

//Servicio que busca si ya existe un motor por su id
export const SearchBombaId = async (id_bomba) => {
  const [rows] = await pool.query("SELECT * FROM bomba WHERE id_bomba = ?", [
    id_bomba,
  ]);
  return rows.length;
};

//Servicio que devuelve los datos del motor por el id
export const getOneBombaForId = async (id_bomba) => {
  const [rows] = await pool.query("SELECT * FROM bomba WHERE id_bomba = ?", [
    id_bomba,
  ]);
  return rows;
};

//Servicio que devuelve los datos de las Bombas que pertenecen a Estacion de Bombeo por su id
export const SearchBombaIdEstacion = async (id_bomba) => {
  const [rows] = await pool.query(
    "SELECT * FROM bomba WHERE est_bombeo_id_est = ?",
    [id_bomba],
  );
  return rows;
};

//Servicio para registrar una Bomba
export const RegisterBomba = async (bomba) => {
  const {
    posicion_bomba,
    modelo_bomba,
    marca_bomba,
    tipo_bomba,
    q,
    num_etapa,
    est_bombeo_id_est,
  } = bomba;

  const [rows] = await pool.query(
    `INSERT INTO bomba 
    (posicion_bomba, modelo_bomba, marca_bomba, tipo_bomba, q, num_etapa, est_bombeo_id_est) 
    VALUES(?,?,?,?,?,?,?)`,
    [
      posicion_bomba,
      modelo_bomba,
      marca_bomba,
      tipo_bomba,
      q,
      num_etapa,
      est_bombeo_id_est,
    ],
  );

  const result = {
    id: rows.insertId,
    ...bomba,
  };

  return result;
};

//Servicio que elimina una Bomba por el id
export const deleteOneBombaForId = async (id_bomba) => {
  const [rows] = await pool.query("DELETE FROM bomba WHERE id_bomba = ?", [
    id_bomba,
  ]);
  return rows;
};

//Servicio para modificar una Bomba
export const modificarBomba = async (bomba) => {
  const id_bomba = bomba.id_bomba; // ID necesario para el WHERE
  const {
    posicion_bomba,
    modelo_bomba,
    marca_bomba,
    tipo_bomba,
    q,
    num_etapa,
    est_bombeo_id_est,
  } = bomba;

  const [rows] = await pool.query(
    `UPDATE bomba SET 
      posicion_bomba = ?, 
      modelo_bomba = ?, 
      marca_bomba = ?, 
      tipo_bomba = ?, 
      q = ?, 
      num_etapa = ?, 
      est_bombeo_id_est = ? 
    WHERE id_bomba = ?`,
    [
      posicion_bomba,
      modelo_bomba,
      marca_bomba,
      tipo_bomba,
      q,
      num_etapa,
      est_bombeo_id_est,
      id_bomba,
    ],
  );

  const result = {
    id: id_bomba,
    ...bomba,
  };

  return result;
};
