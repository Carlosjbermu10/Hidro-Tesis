import { Router } from "express";
import {
  getJuegos_Contactos_CCMForId,
  postJuegos_Contactos_CCM,
  deleteJuegos_Contactos_CCM,
  updateJuegos_Contactos_CCM,
} from "../../controllers/ccm/juegos_contactos_ccm.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTA DE LECTURA (Acceso para todo el personal logueado)
router.get("/juegos_contacto_ccm/:id", checkAuth, getJuegos_Contactos_CCMForId);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/juegos_contacto_ccm/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postJuegos_Contactos_CCM,
);

router.put(
  "/juegos_contacto_ccm/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateJuegos_Contactos_CCM,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/juegos_contacto_ccm/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteJuegos_Contactos_CCM,
);

export default router;
