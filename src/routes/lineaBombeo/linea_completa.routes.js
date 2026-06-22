// lineasBombeoRoutes.js
import { Router } from "express";
import { getArbolOperativo } from "../../controllers/lineaBombeo/linea_completa.controller.js";

// IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

// Definimos la ruta pasándole el parámetro id_est
router.get(
  "/estacion/:id_est/arbol-operativo",
  checkAuth,
  getArbolOperativo, // Llamamos a la función importada directamente
);

export default router;
