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
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTAS DE LECTURA (Acceso para todo el personal logueado)
router.get("/ccm", checkAuth, getCCM);

router.get("/ccm/:id", checkAuth, getCCMForId);

router.get("/ccm/estacion/:id", checkAuth, getCCMForIdEstacion);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/ccm/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postCCM,
);

router.put(
  "/ccm/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateCCM,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete("/ccm/delete/:id", checkAuth, checkRole(["admin"]), deleteCCM);

export default router;
