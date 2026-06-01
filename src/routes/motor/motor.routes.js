import { Router } from "express";
import {
  getMotor,
  getMotorForId,
  getMotorForIdEstacion,
  postMotor,
  deleteMotor,
  updateMotor,
} from "../../controllers/motor/motor.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTAS DE LECTURA (Acceso para todo el personal logueado)
router.get("/motor", checkAuth, getMotor);

router.get("/motor/:id", checkAuth, getMotorForId);

router.get("/motor/estacion/:id", checkAuth, getMotorForIdEstacion);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/motor/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postMotor,
);

router.put(
  "/motor/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateMotor,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/motor/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteMotor,
);

export default router;
