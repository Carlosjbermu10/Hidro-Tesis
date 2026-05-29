import { Router } from "express";
import {
  getTanque_GeneradorForId,
  getSuministrosEstacion,
  postTanque_Generador,
  deleteTanque_Generador,
  updateTanque_Generador,
} from "../../controllers/tanque/tanque_has_generador.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get(
  "/tanque_generador/:id_tanque/:id_generador",
  getTanque_GeneradorForId,
);
router.get("/suministro/:id", getSuministrosEstacion);
router.post(
  "/tanque_generador/add/:id_tanque/:id_generador",
  postTanque_Generador,
);
router.delete(
  "/tanque_generador/delete/:id_tanque/:id_generador",
  deleteTanque_Generador,
);
router.put(
  "/tanque_generador/update/:id_tanque/:id_generador",
  updateTanque_Generador,
);

export default router;
