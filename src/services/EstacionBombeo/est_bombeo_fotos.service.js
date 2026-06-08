import { pool } from "../../database/db.js";

export const getSerRegister = async () => {};

//Servicio que busca si ya existe una Estacion de Bombeo
export const SearchEstacionId = async (id_est) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE id_est = ?", [
    id_est,
  ]);
  return rows.length;
};

//Servicio que busca la imagen de una Estacion de Bombeo por su id
export const SearchFotoEstacionId = async (id_est_bombeo_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM est_bombeo_fotos WHERE id_est_bombeo_foto = ?",
    [id_est_bombeo_foto],
  );
  return rows.length;
};

//Servicio que retorna el id_public de una foto de un Estacion de Bombeo
export const ReturnFotoEstacionId_public = async (id_est_bombeo_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM est_bombeo_fotos WHERE id_est_bombeo_foto = ?",
    [id_est_bombeo_foto],
  );
  return rows[0].foto_public_id;
};

// Servicio para obtener todas las fotos de una estación específica
export const GetFotosByEstacionId = async (id_est) => {
  const [rows] = await pool.query(
    "SELECT id_est_bombeo_foto, foto_url FROM est_bombeo_fotos WHERE est_bombeo_id = ?",
    [id_est],
  );
  return rows;
};

//Servicio para registrar una foto en una Estacion de Bombeo
export const RegisterFotoEstacion = async (foto_data) => {
  const { est_bombeo_id, foto_url, foto_public_id } = foto_data;

  const [rows] = await pool.query(
    "INSERT INTO est_bombeo_fotos (est_bombeo_id, foto_url, foto_public_id) VALUES(?,?,?)",
    [est_bombeo_id, foto_url, foto_public_id],
  );

  const result = {
    id_est_bombeo_foto: rows.insertId,
    est_bombeo_id,
    foto_url,
    foto_public_id,
  };
  return result;
};

//Servicio para eliminar una foto de una Estacion de Bombeo
export const DeleteFotoEstacionId = async (id_est_bombeo_foto) => {
  const [rows] = await pool.query(
    "DELETE FROM est_bombeo_fotos WHERE id_est_bombeo_foto = ?",
    [id_est_bombeo_foto],
  );
  return rows;
};
