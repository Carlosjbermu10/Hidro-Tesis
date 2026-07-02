import { pool } from "../../database/db.js";

export const getSerRegister = async () => {};

//Servicio que busca si ya existe un usuario por su "username"
export const SearchUser = async (username) => {
  const [rows] = await pool.query("SELECT * FROM usuario WHERE username = ?", [
    username,
  ]);
  return rows.length;
};

//Servicio para registrar un usuario
export const RegisterUser = async (nuevoUsuario) => {
  const name = nuevoUsuario.nombre_completo; // o nuevoUsuario.name según uses
  const user = nuevoUsuario.username; // o nuevoUsuario.user según uses
  const password = nuevoUsuario.password;
  const rol = nuevoUsuario.rol;

  let rows;

  // SI EL ROL EXISTE (admin o supervisor), lo incluimos en el INSERT
  if (rol) {
    const [result] = await pool.query(
      "INSERT INTO usuario (nombre_completo, username, password, rol) VALUES(?,?,?,?)",
      [name, user, password, rol],
    );
    rows = result;
  }
  // SI EL ROL ES NULL O UNDEFINED, no lo mencionamos en el INSERT para que MySQL aplique el DEFAULT
  else {
    const [result] = await pool.query(
      "INSERT INTO usuario (nombre_completo, username, password) VALUES(?,?,?)",
      [name, user, password],
    );
    rows = result;
  }

  // Para retornar el objeto correcto, si no había rol, sabemos que la BD le puso 'operador'
  const result = {
    id_usuario: rows.insertId,
    nombre_completo: name,
    username: user,
    rol: rol || "operador",
  };

  return result;
};

export const getUsuariosRegistrados = async () => {
  // Extraemos los datos necesarios para la gestión, protegiendo el campo 'password'
  const query = `
    SELECT 
      id_usuario, 
      nombre_completo, 
      username, 
      rol, 
      estado, 
      created_at 
    FROM usuario 
    ORDER BY created_at DESC
  `;

  const [usuarios] = await pool.query(query);
  return usuarios;
};
