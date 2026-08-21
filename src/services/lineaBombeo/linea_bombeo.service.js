import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE id_est = ?", [
    id_bombeo,
  ]);
  return rows.length;
};

//Servicio que devuelve todas las Lineas de Bombeo
export const getAllLinea_Bombeo = async () => {
  const [rows] = await pool.query(`SELECT * FROM linea_bombeo;`);
  return rows;
};

//Servicio que busca si ya existe una Linea de Bombeo por su id
export const SearchLinea_BombeoId = async (id_linea_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM linea_bombeo WHERE id_linea_bombeo = ?",
    [id_linea_bombeo],
  );
  return rows.length;
};

//Servicio que devuelve los datos de la Linea de Bombeo por el id
export const getOneLinea_BombeoForId = async (id_linea_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM linea_bombeo WHERE id_linea_bombeo = ?",
    [id_linea_bombeo],
  );
  return rows;
};

//Servicio que devuelve los datos de las Lineas de Bombeo que pertenecen a Estacion de Bombeo por su id
export const SearchLinea_BombeoIdEstacion = async (id_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM linea_bombeo WHERE est_bombeo_id_est = ?",
    [id_bombeo],
  );
  return rows;
};

// Servicio que busca si un número de línea ya existe DENTRO de una misma estación
export const SearchLinea_BombeoNumeroPorEstacion = async (
  numero_linea,
  id_bombeo,
) => {
  const [rows] = await pool.query(
    "SELECT * FROM linea_bombeo WHERE numero_linea = ? AND est_bombeo_id_est = ?",
    [numero_linea, id_bombeo],
  );
  return rows;
};

//Servicio para registrar una Linea de Bombeo
export const RegisterLinea_Bombeo = async (nuevaLinea) => {
  const {
    numero_linea,
    nombre_linea_bombeo,
    estado_linea_bombeo,
    observaciones_linea_bombeo,
    est_bombeo_id_est,
  } = nuevaLinea;

  const [rows] = await pool.query(
    `
    INSERT INTO linea_bombeo 
    (numero_linea, nombre_linea_bombeo, estado_linea_bombeo, observaciones_linea_bombeo, est_bombeo_id_est) 
    VALUES (?, ?, ?, ?, ?)`,
    [
      numero_linea,
      nombre_linea_bombeo,
      estado_linea_bombeo,
      observaciones_linea_bombeo || null, // Si viene como string vacío o indefinido, inserta NULL en MySQL
      est_bombeo_id_est,
    ],
  );

  return {
    id_linea_bombeo: rows.insertId,
    ...nuevaLinea,
  };
};

//Servicio que elimina una Linea de Bombeo por el id
export const deleteOneLinea_BombeoForId = async (id_linea_bombeo) => {
  const [rows] = await pool.query(
    "DELETE FROM linea_bombeo WHERE id_linea_bombeo = ?",
    [id_linea_bombeo],
  );
  return rows;
};

//Servicio para modificar una Linea de Bombeo
export const modificarLinea_Bombeo = async (linea) => {
  const id_linea_bombeo = linea.id_linea_bombeo;
  const {
    numero_linea,
    nombre_linea_bombeo,
    estado_linea_bombeo,
    observaciones_linea_bombeo,
    est_bombeo_id_est,
  } = linea;

  const [rows] = await pool.query(
    `UPDATE linea_bombeo SET 
      numero_linea = ?, 
      nombre_linea_bombeo = ?, 
      estado_linea_bombeo = ?, 
      observaciones_linea_bombeo = ?,
      est_bombeo_id_est = ? 
    WHERE id_linea_bombeo = ?`,
    [
      numero_linea,
      nombre_linea_bombeo,
      estado_linea_bombeo,
      observaciones_linea_bombeo,
      est_bombeo_id_est,
      id_linea_bombeo,
    ],
  );

  return {
    id: id_linea_bombeo,
    ...linea,
  };
};
