import { Router } from "express";
import {
  postOrdenMantenimiento,
  getHistorialHorometro,
  getHistorialMantenimiento,
  updateEstadoOrden,
  postLecturaHorometro,
} from "../../controllers/mantenimiento/mantenimiento.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTAS DE LECTURA (Acceso para todo el personal logueado)
router.get(
  "/mantenimiento/historial/:tipo_equipo/:equipo_id",
  checkAuth,
  getHistorialMantenimiento,
);

router.get(
  "/horometro/historial/:tipo_equipo/:equipo_id",
  checkAuth,
  getHistorialHorometro,
);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/mantenimiento/add",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postOrdenMantenimiento,
);

router.put(
  "/mantenimiento/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateEstadoOrden,
);

router.post(
  "/horometro/add",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postLecturaHorometro,
);

export default router;
