import { pool } from "../../database/db.js";

//Servicio que busca si ya existe un Centro de Control de Maquinas
export const SearchCCMId = async (id_ccm) => {
  const [rows] = await pool.query("SELECT * FROM ccm WHERE id_ccm = ?", [
    id_ccm,
  ]);
  return rows.length;
};

//Servicio que busca la imagen de un Centro de Control de Maquinas por su id
export const SearchFotoCCMId = async (id_ccm_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM ccm_fotos WHERE id_ccm_foto = ?",
    [id_ccm_foto],
  );
  return rows.length;
};

//Servicio que retorna el id_public de una foto de un Centro de Control de Maquinas
export const ReturnFotoCCMId_public = async (id_ccm_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM ccm_fotos WHERE id_ccm_foto = ?",
    [id_ccm_foto],
  );
  return rows[0].foto_public_id;
};

// Servicio para obtener todas las fotos de un Centro de Control de Maquinas específico
export const GetFotosByCCMId = async (ccm_id) => {
  const [rows] = await pool.query(
    "SELECT id_ccm_foto, foto_url FROM ccm_fotos WHERE ccm_id = ?",
    [ccm_id],
  );
  return rows;
};

//Servicio para registrar una foto en un Centro de Control de Maquinas
export const RegisterFotoCCM = async (foto_data) => {
  const { ccm_id, foto_url, foto_public_id } = foto_data;

  const [rows] = await pool.query(
    "INSERT INTO ccm_fotos (ccm_id, foto_url, foto_public_id) VALUES(?,?,?)",
    [ccm_id, foto_url, foto_public_id],
  );

  const result = {
    id_ccm_foto: rows.insertId,
    ccm_id,
    foto_url,
    foto_public_id,
  };
  return result;
};

//Servicio para eliminar una foto de un Centro de Control de Maquinas
export const DeleteFotoCCMId = async (id_ccm_foto) => {
  const [rows] = await pool.query(
    "DELETE FROM ccm_fotos WHERE id_ccm_foto = ?",
    [id_ccm_foto],
  );
  return rows;
};
