import { pool } from "../../database/db.js";

export const getSerRegister = async () => {};

//Servicio que busca si ya existe el Motor
export const SearchMotorId = async (id_motor) => {
  const [rows] = await pool.query("SELECT * FROM motor WHERE id_motor = ?", [
    id_motor,
  ]);
  return rows.length;
};

//Servicio que busca la imagen de un Motor por su id
export const SearchFotoMotorId = async (id_motor_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM motor_fotos WHERE id_motor_foto = ?",
    [id_motor_foto],
  );
  return rows.length;
};

//Servicio que retorna el id_public de una foto de un Motor
export const ReturnFotoMotorId_public = async (id_motor_foto) => {
  const [rows] = await pool.query(
    "SELECT * FROM motor_fotos WHERE id_motor_foto = ?",
    [id_motor_foto],
  );
  return rows[0].foto_public_id;
};

// Servicio para obtener todas las fotos de un Motor específica
export const GetFotosByMotorId = async (motor_id) => {
  const [rows] = await pool.query(
    "SELECT id_motor_foto, foto_url FROM motor_fotos WHERE motor_id = ?",
    [motor_id],
  );
  return rows;
};

//Servicio para registrar una foto en un Motor
export const RegisterFotoMotor = async (foto_data) => {
  const { motor_id, foto_url, foto_public_id } = foto_data;

  const [rows] = await pool.query(
    "INSERT INTO motor_fotos (motor_id, foto_url, foto_public_id) VALUES(?,?,?)",
    [motor_id, foto_url, foto_public_id],
  );

  const result = {
    id_motor_foto: rows.insertId,
    motor_id,
    foto_url,
    foto_public_id,
  };
  return result;
};

//Servicio para eliminar una foto de una Motor
export const DeleteFotoMotorId = async (id_motor_foto) => {
  const [rows] = await pool.query(
    "DELETE FROM motor_fotos WHERE id_motor_foto = ?",
    [id_motor_foto],
  );
  return rows;
};
