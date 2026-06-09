import { pool } from "../../database/db.js";

export const getSerRegister = async () => {};

//Servicio que busca si ya existe una Valvula
export const SearchValvulaId = async (id_valvula) => {
  const [rows] = await pool.query(
    "SELECT * FROM valvula WHERE id_valvula = ?",
    [id_valvula],
  );
  return rows.length;
};

//Servicio que busca la imagen de una Valvula por su id
export const SearchFotoValvulaId = async (id_valvula_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM valvula_fotos WHERE id_valvula_foto = ?",
    [id_valvula_foto],
  );
  return rows.length;
};

//Servicio que retorna el id_public de una foto de una Valvula
export const ReturnFotoValvulaId_public = async (id_valvula_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM valvula_fotos WHERE id_valvula_foto = ?",
    [id_valvula_foto],
  );
  return rows[0].foto_public_id;
};

// Servicio para obtener todas las fotos de una Valvula específica
export const GetFotosByValvulaId = async (valvula_id) => {
  const [rows] = await pool.query(
    "SELECT id_valvula_foto, foto_url FROM valvula_fotos WHERE valvula_id = ?",
    [valvula_id],
  );
  return rows;
};

//Servicio para registrar una foto de una Valvula
export const RegisterFotoValvula = async (foto_data) => {
  const { valvula_id, foto_url, foto_public_id } = foto_data;

  const [rows] = await pool.query(
    "INSERT INTO valvula_fotos (valvula_id, foto_url, foto_public_id) VALUES(?,?,?)",
    [valvula_id, foto_url, foto_public_id],
  );

  const result = {
    id_valvula_foto: rows.insertId,
    valvula_id,
    foto_url,
    foto_public_id,
  };
  return result;
};

//Servicio para eliminar una foto de una Valvula
export const DeleteFotoValvulaId = async (id_valvula_foto) => {
  const [rows] = await pool.query(
    "DELETE FROM valvula_fotos WHERE id_valvula_foto = ?",
    [id_valvula_foto],
  );
  return rows;
};
