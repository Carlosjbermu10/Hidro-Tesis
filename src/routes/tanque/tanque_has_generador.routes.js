import { Router } from "express";
import {
  getTanque_GeneradorForId,
  getSuministrosEstacion,
  postTanque_Generador,
  deleteTanque_Generador,
  updateTanque_Generador,
} from "../../controllers/tanque/tanque_has_generador.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTAS DE LECTURA (Acceso para todo el personal logueado)
router.get(
  "/tanque_generador/:id_tanque/:id_generador",
  checkAuth,
  getTanque_GeneradorForId,
);

router.get("/suministro/:id", checkAuth, getSuministrosEstacion);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/tanque_generador/add/:id_tanque/:id_generador",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postTanque_Generador,
);

router.put(
  "/tanque_generador/update/:id_tanque/:id_generador",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateTanque_Generador,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/tanque_generador/delete/:id_tanque/:id_generador",
  checkAuth,
  checkRole(["admin"]),
  deleteTanque_Generador,
);

export default router;
