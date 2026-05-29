import { Router } from "express";
import {
  getGenerador,
  getGeneradorForId,
  getGeneradorForIdEstacion,
  postGenerador,
  deleteGenerador,
  updateGenerador,
} from "../../controllers/generador/generador.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get("/generador", getGenerador);
router.get("/generador/:id", getGeneradorForId);
router.get("/generador/estacion/:id", getGeneradorForIdEstacion);
router.post("/generador/add/:id", postGenerador);
router.delete("/generador/delete/:id", deleteGenerador);
router.put("/generador/update/:id", updateGenerador);

export default router;
