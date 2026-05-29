import { Router } from "express";
import {
  getDetalle_BombaForId,
  postDetalle_Bomba,
  deleteDetalle_Bomba,
  updateDetalle_Bomba,
} from "../../controllers/bomba/detalle_bomba.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get("/detalle_bomba/:id", getDetalle_BombaForId);
router.post("/detalle_bomba/add/:id", postDetalle_Bomba);
router.delete("/detalle_bomba/delete/:id", deleteDetalle_Bomba);
router.put("/detalle_bomba/update/:id", updateDetalle_Bomba);

export default router;
