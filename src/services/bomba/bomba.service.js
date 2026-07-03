import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE id_est = ?", [
    id_bombeo,
  ]);
  return rows.length;
};

//Servicio que busca si ya existe una Linea de bombeo por su id
export const SearchLinea_BombeoId = async (id_linea_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM linea_bombeo WHERE id_linea_bombeo = ?",
    [id_linea_bombeo],
  );
  return rows.length;
};

//Servicio que devuelve todas los motores
export const getAllBomba = async () => {
  const [rows] = await pool.query(`SELECT * FROM bomba;`);
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

//Servicio que devuelve los datos de las Bombas que pertenecen a una Linea de Bombeo por su id
export const SearchBombaIdLineaBombeo = async (id_linea_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM bomba WHERE linea_bombeo_id_linea_bombeo = ?",
    [id_linea_bombeo],
  );
  return rows;
};

//Servicio para registrar una Bomba
export const RegisterBomba = async (bomba) => {
  const {
    modelo_bomba,
    marca_bomba,
    tipo_bomba,
    q,
    num_etapa,
    linea_bombeo_id_linea_bombeo,
  } = bomba;

  const [rows] = await pool.query(
    `INSERT INTO bomba 
    (modelo_bomba, marca_bomba, tipo_bomba, q, num_etapa, linea_bombeo_id_linea_bombeo) 
    VALUES(?,?,?,?,?,?)`,
    [
      modelo_bomba,
      marca_bomba,
      tipo_bomba,
      q,
      num_etapa,
      linea_bombeo_id_linea_bombeo,
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
    modelo_bomba,
    marca_bomba,
    tipo_bomba,
    q,
    num_etapa,
    linea_bombeo_id_linea_bombeo,
  } = bomba;

  const [rows] = await pool.query(
    `UPDATE bomba SET 
      modelo_bomba = ?, 
      marca_bomba = ?, 
      tipo_bomba = ?, 
      q = ?, 
      num_etapa = ?, 
      linea_bombeo_id_linea_bombeo = ? 
    WHERE id_bomba = ?`,
    [
      modelo_bomba,
      marca_bomba,
      tipo_bomba,
      q,
      num_etapa,
      linea_bombeo_id_linea_bombeo,
      id_bomba,
    ],
  );

  const result = {
    id: id_bomba,
    ...bomba,
  };

  return result;
};

// Servicio que devuelve las Bombas filtradas por el ID de la Estación de Bombeo
export const SearchBombaIdEstacion = async (id_est) => {
  const [rows] = await pool.query(
    `SELECT b.* FROM bomba b
     INNER JOIN linea_bombeo lb ON b.linea_bombeo_id_linea_bombeo = lb.id_linea_bombeo
     WHERE lb.est_bombeo_id_est = ?`,
    [id_est],
  );
  return rows;
};
