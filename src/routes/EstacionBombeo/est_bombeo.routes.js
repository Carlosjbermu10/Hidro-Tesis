import { Router } from "express";
import {
  getEstacion,
  getInactivas,
  getEstacionForId,
  postEstacion,
  deleteEstacion,
  reactivateEstacion,
  updateEstacion,
} from "../../controllers/EstacionBombeo/est_bombeo.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTAS DE LECTURA (Acceso para todo el personal logueado)
router.get("/estaciones", checkAuth, getEstacion);

// Obtener estaciones inactivas
router.get("/estacion/inactivas", checkAuth, getInactivas);

router.get("/estacion/gestion/:id", checkAuth, getEstacionForId);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/estacion/add",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postEstacion,
);

router.put(
  "/estacion/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateEstacion,
);

// RUTA DE REACTIVACIÓN (Solo Admin )
router.patch(
  "/estacion/reactivar/:id",
  checkAuth,
  checkRole(["admin"]),
  reactivateEstacion,
);

//RUTA DE DESAHABILITACION (Estricta: Solo Admin)
router.delete(
  "/estacion/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteEstacion,
);

export default router;
