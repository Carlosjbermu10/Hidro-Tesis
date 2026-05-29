import { Router } from "express";
import {
  getMotor_GeneradorForId,
  postMotor_Generador,
  deleteMotor_Generador,
  updateMotor_Generador,
} from "../../controllers/generador/motor_generador.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get("/motor_generador/:id", getMotor_GeneradorForId);
router.post("/motor_generador/add/:id", postMotor_Generador);
router.delete("/motor_generador/delete/:id", deleteMotor_Generador);
router.put("/motor_generador/update/:id", updateMotor_Generador);

export default router;
