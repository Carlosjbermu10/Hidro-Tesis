import { Router } from "express";
import {
  getFoto_Valvula,
  postFoto_Valvula,
  deleteFoto_Valvula,
} from "../../controllers/valvula/valvula_fotos.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//middlware de multer
import { upload } from "../../middleware/multer.middleware.js";

// Importamos tus middlewares de seguridad
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

// RUTA DE LECTURA: Permite a cualquier usuario logueado ver las fotos de la Valvula
router.get("/foto_valvula/:id", checkAuth, getFoto_Valvula);

// RUTA DE CREACIÓN: Permite a administradores y supervisores subir hasta 5 fotos simultáneas
router.post(
  "/foto_valvula/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  upload.array("image", 5),
  postFoto_Valvula,
);

// RUTA DE ELIMINACIÓN: Acción estricta. Solo el administrador puede borrar fotos del sistema
router.delete(
  "/foto_valvula/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteFoto_Valvula,
);

export default router;
