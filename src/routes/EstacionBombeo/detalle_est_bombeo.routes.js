import { Router } from "express";
import {
  getDetalle_EstacionForId,
  postDetalle_Estacion,
  deleteDetalle_Estacion,
  updateDetalle_Estacion,
} from "../../controllers/EstacionBombeo/detalle_est_bombeo.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTA DE LECTURA (Acceso para todo el personal logueado)
router.get("/detalle_estacion/:id", checkAuth, getDetalle_EstacionForId);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/detalle_estacion/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postDetalle_Estacion,
);

router.put(
  "/detalle_estacion/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateDetalle_Estacion,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/detalle_estacion/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteDetalle_Estacion,
);

export default router;
