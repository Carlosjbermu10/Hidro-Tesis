import { Router } from "express";
import {
  getCombustible_Lubricante_GeneradorForId,
  postCombustible_Lubricante_Generador,
  deleteCombustible_Lubricante_Generador,
  updateCombustible_Lubricante_Generador,
} from "../../controllers/generador/combustible_lubricante_generador.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get(
  "/combustible_lubricante_generador/:id",
  getCombustible_Lubricante_GeneradorForId,
);
router.post(
  "/combustible_lubricante_generador/add/:id",
  postCombustible_Lubricante_Generador,
);
router.delete(
  "/combustible_lubricante_generador/delete/:id",
  deleteCombustible_Lubricante_Generador,
);
router.put(
  "/combustible_lubricante_generador/update/:id",
  updateCombustible_Lubricante_Generador,
);

export default router;
