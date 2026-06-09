import { pool } from "../../database/db.js";

export const getSerRegister = async () => {};

//Servicio que busca si ya existe un Generador
export const SearchGeneradorId = async (id_generador) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador WHERE id_generador = ?",
    [id_generador],
  );
  return rows.length;
};

//Servicio que busca la imagen de un Generador por su id
export const SearchFotoGeneradorId = async (id_generador_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador_fotos WHERE id_generador_foto = ?",
    [id_generador_foto],
  );
  return rows.length;
};

//Servicio que retorna el id_public de una foto de un Generador
export const ReturnFotoGeneradorId_public = async (id_generador_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador_fotos WHERE id_generador_foto = ?",
    [id_generador_foto],
  );
  return rows[0].foto_public_id;
};

// Servicio para obtener todas las fotos de un Generador específica
export const GetFotosByGeneradorId = async (generador_id) => {
  const [rows] = await pool.query(
    "SELECT id_generador_foto, foto_url FROM generador_fotos WHERE generador_id = ?",
    [generador_id],
  );
  return rows;
};

//Servicio para registrar una foto de un Generador
export const RegisterFotoGenerador = async (foto_data) => {
  const { generador_id, foto_url, foto_public_id } = foto_data;

  const [rows] = await pool.query(
    "INSERT INTO generador_fotos (generador_id, foto_url, foto_public_id) VALUES(?,?,?)",
    [generador_id, foto_url, foto_public_id],
  );

  const result = {
    id_generador_foto: rows.insertId,
    generador_id,
    foto_url,
    foto_public_id,
  };
  return result;
};

//Servicio para eliminar una foto de un Generador
export const DeleteFotoGeneradorId = async (id_generador_foto) => {
  const [rows] = await pool.query(
    "DELETE FROM generador_fotos WHERE id_generador_foto = ?",
    [id_generador_foto],
  );
  return rows;
};
