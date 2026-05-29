import { Router } from "express";
import {
  getCCM,
  getCCMForId,
  getCCMForIdEstacion,
  postCCM,
  deleteCCM,
  updateCCM,
} from "../../controllers/ccm/ccm.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get("/ccm", getCCM);
router.get("/ccm/:id", getCCMForId);
router.get("/ccm/estacion/:id", getCCMForIdEstacion);
router.post("/ccm/add/:id", postCCM);
router.delete("/ccm/delete/:id", deleteCCM);
router.put("/ccm/update/:id", updateCCM);

export default router;
