import { Router } from "express";
import {
  getMotor_GeneradorForId,
  postMotor_Generador,
  deleteMotor_Generador,
  updateMotor_Generador,
} from "../../controllers/generador/motor_generador.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTA DE LECTURA (Acceso para todo el personal logueado)
router.get("/motor_generador/:id", checkAuth, getMotor_GeneradorForId);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/motor_generador/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postMotor_Generador,
);

router.put(
  "/motor_generador/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateMotor_Generador,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/motor_generador/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteMotor_Generador,
);

export default router;
