import { Router } from "express";
import {
  getTanque,
  getTanqueForId,
  getTanqueForIdEstacion,
  postTanque,
  deleteTanque,
  updateTanque,
} from "../../controllers/tanque/tanque.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get("/tanque", getTanque);
router.get("/tanque/:id", getTanqueForId);
router.get("/tanque/estacion/:id", getTanqueForIdEstacion);
router.post("/tanque/add/:id", postTanque);
router.delete("/tanque/delete/:id", deleteTanque);
router.put("/tanque/update/:id", updateTanque);

export default router;
