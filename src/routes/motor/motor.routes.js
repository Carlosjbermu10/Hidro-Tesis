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

//no hay mientras

const router = Router();

router.get("/motor", getMotor);
router.get("/motor/:id", getMotorForId);
router.get("/motor/estacion/:id", getMotorForIdEstacion);
router.post("/motor/add/:id", postMotor);
router.delete("/motor/delete/:id", deleteMotor);
router.put("/motor/update/:id", updateMotor);

export default router;
