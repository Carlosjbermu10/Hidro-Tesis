import {
  SearchUsername, //Servicio que busca si ya existe un usuario por su "username"
  ValidatePassword, //Servicio que valida la contraseña del usuario con la de la bd
} from "../../services/usuario/login.services.js";

import { TokenSign } from "../../helpers/GenerateToken.js";

import { cookiesOp } from "../../helpers/GenerateCookie.js";

export const getLogin = async (req, res) => {
  res.send("login");
};

export const postLogin = async (req, res) => {
  try {
    //se reciben las variables en el req.body
    const { username, password } = req.body;

    //Validación de campos obligatorios en la petición
    if (!username || !password) {
      return res.status(400).send({
        status: "mal",
        description: "El nombre de usuario y la contraseña son obligatorios.",
      });
    }

    //Se comprueba si ya existe el usuario
    const usuario = await SearchUsername(username);
    if (!usuario) {
      return res.status(401).send({
        status: "mal",
        description: "Nombre de usuario o contraseña incorrectos.",
      });
    }

    // Comprobamos si el usuario está inactivo
    // Asumimos que 1 es Activo y 0 es Inactivo/Suspendido
    if (usuario.estado === 0) {
      return res.status(403).send({
        status: "mal",
        description:
          "Acceso denegado. Este usuario ha sido suspendido por un administrador.",
      });
    }

    //Comparamos las claves directamente usando los datos que ya tenemos en memoria
    const claveCorrecta = await ValidatePassword(username, password);
    if (!claveCorrecta) {
      return res.status(401).send({
        status: "mal",
        description: "Nombre de usuario o contraseña incorrectos.",
      });
    }

    //Genera el Token (JWT) con los datos del usuario
    // Pasamos el objeto 'usuario' completo que ya tiene 'id_usuario' y 'rol'
    const token = await TokenSign(usuario);

    //Se crea e inyecta la cookie en la respuesta
    const cookiesOptions = cookiesOp;
    res.cookie("jwt", token, cookiesOptions);

    return res.send({
      status: "ok",
      description: "usuario logueado exitosamente",
      data: {
        id_usuario: usuario.id_usuario,
        nombre_completo: usuario.nombre_completo,
        username: usuario.username,
        rol: usuario.rol,
        estado: usuario.estado,
      },
      token: token,
    });
  } catch (error) {
    console.error("Error crítico en el controlador de login:", error.message);
    return res.status(500).send({
      status: "error",
      description:
        "Error interno del servidor al procesar el inicio de sesión.",
    });
  }
};

export const postLogout = async (req, res, next) => {
  // 1. Borra la cookie 'jwt' del navegador o cliente
  res.clearCookie("jwt");

  // 2. Si en el futuro usas vistas renderizadas en el servidor (EJS, Pug),
  // descomentas la redirección:
  // return res.redirect('/');

  // 3. Respuesta estándar en formato JSON para tu API
  return res.status(200).send({
    status: "ok",
    description:
      "Sesión cerrada correctamente. Cookie de autenticación eliminada.",
  });
};
