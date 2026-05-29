import { Router } from "express";
import {
  getDetalle_MotorForId,
  postDetalle_Motor,
  deleteDetalle_Motor,
  updateDetalle_Motor,
} from "../../controllers/motor/detalle_motor.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get("/detalle_motor/:id", getDetalle_MotorForId);
router.post("/detalle_motor/add/:id", postDetalle_Motor);
router.delete("/detalle_motor/delete/:id", deleteDetalle_Motor);
router.put("/detalle_motor/update/:id", updateDetalle_Motor);

export default router;
