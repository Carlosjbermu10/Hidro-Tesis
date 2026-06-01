import { JWT_COOKIE_EXPIRES } from "../config.js";

export const cookiesOp = {
  // 1. Estándar de Express: 'expires'
  expires: new Date(
    Date.now() + Number(JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000,
  ),

  // 2. Mantenemos la seguridad extrema para que no sea clonada por JS
  httpOnly: true,

  // 3. Recomendado para producción (solo viaja en HTTPS)
  secure: process.env.NODE_ENV === "production",

  // 4. Protege contra ataques CSRF (Falsificación de peticiones en sitios cruzados)
  sameSite: "lax",
};
