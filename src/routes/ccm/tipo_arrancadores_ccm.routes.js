import { Router } from "express";
import {
  getArrancadores_CCMForId,
  postArrancadores_CCM,
  deleteArrancadores_CCM,
  updateArrancadores_CCM,
} from "../../controllers/ccm/tipo_arrancadores_ccm.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get("/arrancadores_ccm/:id", getArrancadores_CCMForId);
router.post("/arrancadores_ccm/add/:id", postArrancadores_CCM);
router.delete("/arrancadores_ccm/delete/:id", deleteArrancadores_CCM);
router.put("/arrancadores_ccm/update/:id", updateArrancadores_CCM);

export default router;
