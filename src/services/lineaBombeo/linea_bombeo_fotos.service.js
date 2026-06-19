import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Linea de Bombeo
export const SearchLinea_BombeoId = async (id_linea_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM linea_bombeo WHERE id_linea_bombeo = ?",
    [id_linea_bombeo],
  );
  return rows.length;
};

//Servicio que busca la imagen de una Linea de Bombeo por su id
export const SearchFotoLinea_BombeoId = async (id_linea_bombeo_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM linea_bombeo_fotos WHERE id_linea_bombeo_foto = ?",
    [id_linea_bombeo_foto],
  );
  return rows.length;
};

//Servicio que retorna el id_public de una foto de una Linea de Bombeo
export const ReturnFotoLinea_BombeoId_public = async (id_linea_bombeo_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM linea_bombeo_fotos WHERE id_linea_bombeo_foto = ?",
    [id_linea_bombeo_foto],
  );
  return rows[0].foto_public_id;
};

// Servicio para obtener todas las fotos de una Linea de Bombeo específica
export const GetFotosByLinea_BombeoId = async (linea_bombeo_id) => {
  const [rows] = await pool.query(
    "SELECT id_linea_bombeo_foto, foto_url FROM linea_bombeo_fotos WHERE linea_bombeo_id = ?",
    [linea_bombeo_id],
  );
  return rows;
};

//Servicio para registrar una foto de una Linea de Bombeo
export const RegisterFotoLinea_Bombeo = async (foto_data) => {
  const { linea_bombeo_id, foto_url, foto_public_id } = foto_data;

  const [rows] = await pool.query(
    "INSERT INTO linea_bombeo_fotos (linea_bombeo_id, foto_url, foto_public_id) VALUES(?,?,?)",
    [linea_bombeo_id, foto_url, foto_public_id],
  );

  const result = {
    id_linea_bombeo_foto: rows.insertId,
    linea_bombeo_id,
    foto_url,
    foto_public_id,
  };
  return result;
};

//Servicio para eliminar una foto de una Linea de Bombeo
export const DeleteFotoLinea_BombeoId = async (id_linea_bombeo_foto) => {
  const [rows] = await pool.query(
    "DELETE FROM linea_bombeo_fotos WHERE id_linea_bombeo_foto = ?",
    [id_linea_bombeo_foto],
  );
  return rows;
};
