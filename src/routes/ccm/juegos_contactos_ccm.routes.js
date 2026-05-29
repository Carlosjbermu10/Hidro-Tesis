import { Router } from "express";
import {
  getJuegos_Contactos_CCMForId,
  postJuegos_Contactos_CCM,
  deleteJuegos_Contactos_CCM,
  updateJuegos_Contactos_CCM,
} from "../../controllers/ccm/juegos_contactos_ccm.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//no hay mientras

const router = Router();

router.get("/juegos_contacto_ccm/:id", getJuegos_Contactos_CCMForId);
router.post("/juegos_contacto_ccm/add/:id", postJuegos_Contactos_CCM);
router.delete("/juegos_contacto_ccm/delete/:id", deleteJuegos_Contactos_CCM);
router.put("/juegos_contacto_ccm/update/:id", updateJuegos_Contactos_CCM);

export default router;
