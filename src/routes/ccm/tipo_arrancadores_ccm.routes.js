import { Router } from "express";
import {
  getArrancadores_CCMForId,
  postArrancadores_CCM,
  deleteArrancadores_CCM,
  updateArrancadores_CCM,
} from "../../controllers/ccm/tipo_arrancadores_ccm.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTA DE LECTURA (Acceso para todo el personal logueado)
router.get("/arrancadores_ccm/:id", checkAuth, getArrancadores_CCMForId);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/arrancadores_ccm/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postArrancadores_CCM,
);

router.put(
  "/arrancadores_ccm/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateArrancadores_CCM,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/arrancadores_ccm/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteArrancadores_CCM,
);

export default router;
