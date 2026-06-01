import { Router } from "express";
import {
  getCircuito_CCMForId,
  postCircuito_CCM,
  deleteCircuito_CCM,
  updateCircuito_CCM,
} from "../../controllers/ccm/tipo_circuito_ccm.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTA DE LECTURA (Acceso para todo el personal logueado)
router.get("/circuito_ccm/:id", checkAuth, getCircuito_CCMForId);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/circuito_ccm/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postCircuito_CCM,
);

router.put(
  "/circuito_ccm/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateCircuito_CCM,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/circuito_ccm/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteCircuito_CCM,
);

export default router;
