import { pool } from "../../database/db.js";

//Servicio que busca si ya existe un Tanque
export const SearchTanqueId = async (id_tanque) => {
  const [rows] = await pool.query("SELECT * FROM tanque WHERE id_tanque = ?", [
    id_tanque,
  ]);
  return rows.length;
};

//Servicio que busca la imagen de un Tanque por su id
export const SearchFotoTanqueId = async (id_tanque_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM tanque_fotos WHERE id_tanque_foto = ?",
    [id_tanque_foto],
  );
  return rows.length;
};

//Servicio que retorna el id_public de una foto de un Tanque
export const ReturnFotoTanqueId_public = async (id_tanque_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM tanque_fotos WHERE id_tanque_foto = ?",
    [id_tanque_foto],
  );
  return rows[0].foto_public_id;
};

// Servicio para obtener todas las fotos de un Tanque específica
export const GetFotosByTanqueId = async (tanque_id) => {
  const [rows] = await pool.query(
    "SELECT id_tanque_foto, foto_url FROM tanque_fotos WHERE tanque_id = ?",
    [tanque_id],
  );
  return rows;
};

//Servicio para registrar una foto de un Tanque
export const RegisterFotoTanque = async (foto_data) => {
  const { tanque_id, foto_url, foto_public_id } = foto_data;

  const [rows] = await pool.query(
    "INSERT INTO tanque_fotos (tanque_id, foto_url, foto_public_id) VALUES(?,?,?)",
    [tanque_id, foto_url, foto_public_id],
  );

  const result = {
    id_tanque_foto: rows.insertId,
    tanque_id,
    foto_url,
    foto_public_id,
  };
  return result;
};

//Servicio para eliminar una foto de un Tanque
export const DeleteFotoTanqueId = async (id_tanque_foto) => {
  const [rows] = await pool.query(
    "DELETE FROM tanque_fotos WHERE id_tanque_foto = ?",
    [id_tanque_foto],
  );
  return rows;
};
