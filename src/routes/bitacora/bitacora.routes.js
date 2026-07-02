import { Router } from "express";
import { getBitacora } from "../../controllers/bitacora/bitacora.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

// Ruta para que el frontend pida el historial
// GET: /api/bitacora
router.get("/bitacora", checkAuth, getBitacora);

export default router;
