import { pool } from "../../database/db.js";

export const getSerRegister = async () => {};

//Servicio que busca si ya existe una Estacion de Bombeo
export const SearchBanco_transformadoresId = async (
  id_banco_transformadores,
) => {
  const [rows] = await pool.query(
    "SELECT * FROM banco_transformadores WHERE id_banco_transformadores = ?",
    [id_banco_transformadores],
  );
  return rows.length;
};

//Servicio que busca la imagen de un Banco de transformadores por su id
export const SearchFotoBanco_transformadoresId = async (
  id_banco_transformadores_foto,
) => {
  const [rows] = await pool.query(
    "SELECT * FROM banco_transformadores_fotos WHERE id_banco_transformadores_foto = ?",
    [id_banco_transformadores_foto],
  );
  return rows.length;
};

//Servicio que retorna el id_public de una foto de un Banco de transformadores
export const ReturnFotoBanco_transformadoresId_public = async (
  id_banco_transformadores_foto,
) => {
  const [rows] = await pool.query(
    "SELECT * FROM banco_transformadores_fotos WHERE id_banco_transformadores_foto = ?",
    [id_banco_transformadores_foto],
  );
  return rows[0].foto_public_id;
};

// Servicio para obtener todas las fotos de un Banco de transformadores específica
export const GetFotosByBanco_transformadoresId = async (
  banco_transformadores_id,
) => {
  const [rows] = await pool.query(
    "SELECT id_banco_transformadores_foto, foto_url FROM banco_transformadores_fotos WHERE banco_transformadores_id = ?",
    [banco_transformadores_id],
  );
  return rows;
};

//Servicio para registrar una foto en un Banco de transformadores
export const RegisterFotoBanco_transformadores = async (foto_data) => {
  const { banco_transformadores_id, foto_url, foto_public_id } = foto_data;

  const [rows] = await pool.query(
    "INSERT INTO banco_transformadores_fotos (banco_transformadores_id, foto_url, foto_public_id) VALUES(?,?,?)",
    [banco_transformadores_id, foto_url, foto_public_id],
  );

  const result = {
    id_banco_transformadores_foto: rows.insertId,
    banco_transformadores_id,
    foto_url,
    foto_public_id,
  };
  return result;
};

//Servicio para eliminar una foto de un Banco de transformadores
export const DeleteFotoBanco_transformadoresId = async (
  id_banco_transformadores_foto,
) => {
  const [rows] = await pool.query(
    "DELETE FROM banco_transformadores_fotos WHERE id_banco_transformadores_foto = ?",
    [id_banco_transformadores_foto],
  );
  return rows;
};
