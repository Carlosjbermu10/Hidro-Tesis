import { pool } from "../../database/db.js";

export const getSerRegister = async () => {};

//Servicio que busca si ya existe una Bomba
export const SearchBombaId = async (id_bomba) => {
  const [rows] = await pool.query("SELECT * FROM bomba WHERE id_bomba = ?", [
    id_bomba,
  ]);
  return rows.length;
};

//Servicio que busca la imagen de una Bomba por su id
export const SearchFotoBombaId = async (id_bomba_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM bomba_fotos WHERE id_bomba_foto = ?",
    [id_bomba_foto],
  );
  return rows.length;
};

//Servicio que retorna el id_public de una foto de un Bomba
export const ReturnFotoBombaId_public = async (id_bomba_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM bomba_fotos WHERE id_bomba_foto = ?",
    [id_bomba_foto],
  );
  return rows[0].foto_public_id;
};

// Servicio para obtener todas las fotos de una estación específica
export const GetFotosByBombaId = async (bomba_id) => {
  const [rows] = await pool.query(
    "SELECT id_bomba_foto, foto_url FROM bomba_fotos WHERE bomba_id = ?",
    [bomba_id],
  );
  return rows;
};

//Servicio para registrar una foto en una Bomba
export const RegisterFotoBomba = async (foto_data) => {
  const { bomba_id, foto_url, foto_public_id } = foto_data;

  const [rows] = await pool.query(
    "INSERT INTO bomba_fotos (bomba_id, foto_url, foto_public_id) VALUES(?,?,?)",
    [bomba_id, foto_url, foto_public_id],
  );

  const result = {
    id_bomba_foto: rows.insertId,
    bomba_id,
    foto_url,
    foto_public_id,
  };
  return result;
};

//Servicio para eliminar una foto de una Bomba
export const DeleteFotoBombaId = async (id_bomba_foto) => {
  const [rows] = await pool.query(
    "DELETE FROM bomba_fotos WHERE id_bomba_foto = ?",
    [id_bomba_foto],
  );
  return rows;
};
