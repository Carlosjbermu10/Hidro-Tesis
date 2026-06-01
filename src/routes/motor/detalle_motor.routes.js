import { Router } from "express";
import {
  getDetalle_MotorForId,
  postDetalle_Motor,
  deleteDetalle_Motor,
  updateDetalle_Motor,
} from "../../controllers/motor/detalle_motor.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTA DE LECTURA (Acceso para todo el personal logueado)
router.get("/detalle_motor/:id", checkAuth, getDetalle_MotorForId);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/detalle_motor/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postDetalle_Motor,
);

router.put(
  "/detalle_motor/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateDetalle_Motor,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/detalle_motor/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteDetalle_Motor,
);

export default router;
