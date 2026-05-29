import { Router } from "express";
import {
  getEstacion,
  getEstacionForId,
  postEstacion,
  deleteEstacion,
  updateEstacion,
} from "../../controllers/EstacionBombeo/est_bombeo.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get("/estacion", getEstacion);
router.get("/estacion/:id", getEstacionForId);
router.post("/estacion/add", postEstacion);
router.delete("/estacion/delete/:id", deleteEstacion);
router.put("/estacion/update/:id", updateEstacion);

export default router;
