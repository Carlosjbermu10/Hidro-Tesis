import { Router } from "express";
import {
  exportEstacionesPDF,
  generarPdfEstacion,
} from "../../controllers/pdf/est_bombeo_reporte.controller.js";
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

// Endpoint restringido a Admin y Supervisor para exportar la data
router.get(
  "/estacion/exportar/pdf",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  exportEstacionesPDF,
);

// Endpoint restringido a Admin y Supervisor para exportar la data
router.get(
  "/estacion/exportar/pdf/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  generarPdfEstacion,
);

export default router;
