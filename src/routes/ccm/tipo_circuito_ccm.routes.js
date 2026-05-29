import { Router } from "express";
import {
  getCircuito_CCMForId,
  postCircuito_CCM,
  deleteCircuito_CCM,
  updateCircuito_CCM,
} from "../../controllers/ccm/tipo_circuito_ccm.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get("/circuito_ccm/:id", getCircuito_CCMForId);
router.post("/circuito_ccm/add/:id", postCircuito_CCM);
router.delete("/circuito_ccm/delete/:id", deleteCircuito_CCM);
router.put("/circuito_ccm/update/:id", updateCircuito_CCM);

export default router;
