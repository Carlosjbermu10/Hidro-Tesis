import bcrypt from "bcryptjs";
import {
  RegisterUser,
  SearchUser,
} from "../../services/usuario/register.services.js";

import { TokenSign } from "../../helpers/GenerateToken.js";

import { cookiesOp } from "../../helpers/GenerateCookie.js";

export const getRegister = (req, res) => {
  res.send("Registrar Usuario");
};

export const postRegister = async (req, res) => {
  try {
    //Se guarda en la variable "body" todos lo valores de "req"
    const { nombre_completo, username, password, rol } = req.body;

    // 1. Validación de campos obligatorios
    if (!nombre_completo || !username || !password) {
      return res.status(400).send({
        status: "mal",
        description:
          "Todos los campos (nombre_completo, username, password) son obligatorios.",
      });
    }

    // 2. Validar que el rol sea uno de los 3 permitidos
    const rolesValidos = ["admin", "supervisor", "operador"];

    // Si el usuario envió un rol, pero ese rol NO está incluido en nuestra lista blanca...
    if (rol && !rolesValidos.includes(rol)) {
      return res.status(409).send({
        status: "mal",
        description: `El rol '${rol}' no es válido. Los únicos roles permitidos son: ${rolesValidos.join(", ")}.`,
      });
    }

    //Se comprueba si ya existe el usuario por su "username"
    const search_us = await SearchUser(username);
    if (search_us > 0) {
      return res.send({ status: "mal", description: "usuario ya registrado" });
    }

    // 4. Encriptamos el password
    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    // Si no viene rol, pasamos null para que MySQL aplique el DEFAULT "operador"
    const rolFinal = rol || null;

    //Se crea un objeto para pasarlo mas adelante
    const nuevoUsuario = {
      nombre_completo,
      username,
      password: passwordEncriptada,
      rol: rolFinal,
    };

    //se invoca el servicio para registrar un usuario
    const reg = await RegisterUser(nuevoUsuario);

    //Inicio de sesion
    //se crea el token
    const token = await TokenSign(reg);
    const cookiesOptions = cookiesOp;
    res.cookie("jwt", token, cookiesOptions);

    res.status(201).send({
      status: "ok",
      description: "usuario registrado correctamente",
      data: reg,
      token: token,
    });
  } catch (error) {
    console.error("Error en el controlador de registro:", error.message);
    return res.status(500).send({
      status: "error",
      description: "Error interno del servidor al procesar el registro.",
    });
  }
};
