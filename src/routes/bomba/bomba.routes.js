import { Router } from "express";
import {
  getBomba,
  getBombaForId,
  getBombaForIdEstacion,
  postBomba,
  deleteBomba,
  updateBomba,
} from "../../controllers/bomba/bomba.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get("/bomba", getBomba);
router.get("/bomba/:id", getBombaForId);
router.get("/bomba/estacion/:id", getBombaForIdEstacion);
router.post("/bomba/add/:id", postBomba);
router.delete("/bomba/delete/:id", deleteBomba);
router.put("/bomba/update/:id", updateBomba);

export default router;
