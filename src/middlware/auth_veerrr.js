import {
  returnID, //Servicio que devuelve los datos del usuario por el id
} from "../services/users/login.services.js";

import { VerifyToken, VerifyToken2 } from "../helpers/GenerateToken.js";

import { cookiesOp } from "../helpers/GenerateCookie.js";

export const checkAuth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (req.cookies.jwt) {
    try {
      const decodificada = await VerifyToken(req);
      const datos = await returnID(decodificada.id);
      if (!datos) {
        return next();
      }
      req.user = datos[0];
      return next();
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      if (req.cookies.jwt) {
        const decodificada = await VerifyToken2(req.cookies.jwt);
        if (decodificada) {
          const cookiesOptions = cookiesOp;
          res.cookie("jwt", req.cookies.jwt, cookiesOptions);
          console.log("sd");
        }
      }
      if (token) {
        const decodificada = await VerifyToken2(token);
        const datos = await returnID(decodificada.id);
        if (!datos) {
          return next();
        }
        req.user = datos[0];
        return next();
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }
};
