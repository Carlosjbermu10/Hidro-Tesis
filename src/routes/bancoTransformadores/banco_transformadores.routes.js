import { Router } from "express";
import {
  getBanco_transformadores,
  getBanco_transformadoresForId,
  getBanco_transformadoresForIdEstacion,
  postBanco_transformadores,
  deleteBanco_transformadores,
  updateBanco_transformadores,
} from "../../controllers/bancoTransformadores/banco_transformadores.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get("/banco_transformadores", getBanco_transformadores);
router.get("/banco_transformadores/:id", getBanco_transformadoresForId);
router.get(
  "/banco_transformadores/estacion/:id",
  getBanco_transformadoresForIdEstacion,
);
router.post("/banco_transformadores/add/:id", postBanco_transformadores);
router.delete("/banco_transformadores/delete/:id", deleteBanco_transformadores);
router.put("/banco_transformadores/update/:id", updateBanco_transformadores);

export default router;
