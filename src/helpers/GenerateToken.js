import jwt from "jsonwebtoken";
import { promisify } from "util";

import { JWT_SECRET, JWT_TIEMPO_EXPIRA } from "../config.js";

//Firma y genera un nuevo JWT al hacer Login
export const TokenSign = async (user) => {
  return jwt.sign(
    {
      id_usuario: user.id_usuario,
      username: user.username,
      rol: user.rol,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_TIEMPO_EXPIRA || "8h",
    },
  );
};

//Recibe el string del token (venga de cookies o de headers) y lo descifra.
export const VerifyToken = async (token) => {
  try {
    return await promisify(jwt.verify)(token, JWT_SECRET);
  } catch (error) {
    console.error("Error al decodificar el JWT:", error.message);
    return null; // Si el token expiró o fue manipulado, retorna null
  }
};
