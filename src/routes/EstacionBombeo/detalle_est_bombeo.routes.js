import { Router } from "express";
import {
  getDetalle_EstacionForId,
  postDetalle_Estacion,
  deleteDetalle_Estacion,
  updateDetalle_Estacion,
} from "../../controllers/EstacionBombeo/detalle_est_bombeo.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get("/detalle_estacion/:id", getDetalle_EstacionForId);
router.post("/detalle_estacion/add/:id", postDetalle_Estacion);
router.delete("/detalle_estacion/delete/:id", deleteDetalle_Estacion);
router.put("/detalle_estacion/update/:id", updateDetalle_Estacion);

export default router;
