import { Router } from "express";
import {
  getDimension_Peso_GeneradorForId,
  postDimension_Peso_Generador,
  deleteDimension_Peso_Generador,
  updateDimension_Peso_Generador,
} from "../../controllers/generador/dimension_peso_generador.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get("/dimension_peso_generador/:id", getDimension_Peso_GeneradorForId);
router.post("/dimension_peso_generador/add/:id", postDimension_Peso_Generador);
router.delete(
  "/dimension_peso_generador/delete/:id",
  deleteDimension_Peso_Generador,
);
router.put(
  "/dimension_peso_generador/update/:id",
  updateDimension_Peso_Generador,
);

export default router;
