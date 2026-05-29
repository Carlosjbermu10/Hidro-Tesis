import { Router } from "express";
import {
  getValvula,
  getValvulaForId,
  getValvulaForIdEstacion,
  postValvula,
  deleteValvula,
  updateValvula,
} from "../../controllers/valvula/valvula.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get("/valvula", getValvula);
router.get("/valvula/:id", getValvulaForId);
router.get("/valvula/estacion/:id", getValvulaForIdEstacion);
router.post("/valvula/add/:id", postValvula);
router.delete("/valvula/delete/:id", deleteValvula);
router.put("/valvula/update/:id", updateValvula);

export default router;
