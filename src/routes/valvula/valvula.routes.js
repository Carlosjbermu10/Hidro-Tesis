import { Router } from "express";
import {
  getValvula,
  getValvulaForId,
  getValvulaForIdEstacion,
  postValvula,
  deleteValvula,
  updateValvula,
} from "../../controllers/valvula/valvula.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS DE LECTURA (Acceso para todo el personal logueado)
router.get("/valvula", checkAuth, getValvula);

router.get("/valvula/:id", checkAuth, getValvulaForId);

router.get("/valvula/estacion/:id", checkAuth, getValvulaForIdEstacion);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/valvula/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postValvula,
);

router.put(
  "/valvula/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateValvula,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/valvula/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteValvula,
);

export default router;
