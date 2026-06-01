import { Router } from "express";
import {
  getCombustible_Lubricante_GeneradorForId,
  postCombustible_Lubricante_Generador,
  deleteCombustible_Lubricante_Generador,
  updateCombustible_Lubricante_Generador,
} from "../../controllers/generador/combustible_lubricante_generador.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTA DE LECTURA (Acceso para todo el personal logueado)
router.get(
  "/combustible_lubricante_generador/:id",
  checkAuth,
  getCombustible_Lubricante_GeneradorForId,
);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/combustible_lubricante_generador/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postCombustible_Lubricante_Generador,
);

router.put(
  "/combustible_lubricante_generador/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateCombustible_Lubricante_Generador,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/combustible_lubricante_generador/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteCombustible_Lubricante_Generador,
);

export default router;
