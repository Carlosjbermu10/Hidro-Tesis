import { pool } from "../../database/db.js";
import bcryptjs from "bcryptjs";

//Servicio que busca si ya existe un usuario por su "username"
export const SearchUsername = async (username) => {
  const [rows] = await pool.query(
    "SELECT id_usuario, nombre_completo, username, password, rol FROM usuario WHERE username = ?",
    [username],
  );
  if (rows.length === 0) return null;
  return rows[0];
};

//Servicio que valida la contraseña del usuario con la de la bd
export const ValidatePassword = async (username, password) => {
  const [rows] = await pool.query("SELECT * FROM usuario WHERE username = ?", [
    username,
  ]);
  return await bcryptjs.compare(password, rows[0].password);
};
