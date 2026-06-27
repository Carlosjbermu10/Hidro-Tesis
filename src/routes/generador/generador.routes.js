import { Router } from "express";
import {
  getGenerador,
  getGeneradorForId,
  getGeneradorForIdEstacion,
  getGeneradorTotalForIdEstacion,
  postGenerador,
  deleteGenerador,
  updateGenerador,
} from "../../controllers/generador/generador.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTAS DE LECTURA (Acceso para todo el personal logueado)
router.get("/generador", checkAuth, getGenerador);

router.get("/generador/:id", checkAuth, getGeneradorForId);

router.get("/generador/estacion/:id", checkAuth, getGeneradorForIdEstacion);

router.get(
  "/generador/estacion/total/:id",
  checkAuth,
  getGeneradorTotalForIdEstacion,
);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/generador/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postGenerador,
);

router.put(
  "/generador/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateGenerador,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/generador/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteGenerador,
);

export default router;
