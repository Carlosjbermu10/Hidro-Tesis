import { Router } from "express";
import {
  getLinea_Bombeo,
  getLinea_BombeoForId,
  getLinea_BombeoForIdEstacion,
  postLinea_Bombeo,
  deleteLinea_Bombeo,
  updateLinea_Bombeo,
} from "../../controllers/lineaBombeo/linea_bombeo.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS DE LECTURA (Acceso para todo el personal logueado)
router.get("/linea_bombeo", checkAuth, getLinea_Bombeo);

router.get("/linea_bombeo/:id", checkAuth, getLinea_BombeoForId);

router.get(
  "/linea_bombeo/estacion/:id",
  checkAuth,
  getLinea_BombeoForIdEstacion,
);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/linea_bombeo/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postLinea_Bombeo,
);

router.put(
  "/linea_bombeo/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateLinea_Bombeo,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/linea_Bombeo/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteLinea_Bombeo,
);

export default router;
