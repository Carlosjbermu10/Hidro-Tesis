import { Router } from "express";
import {
  getFoto_Generador,
  postFoto_Generador,
  deleteFoto_Generador,
} from "../../controllers/generador/generador_fotos.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//middlware de multer
import { upload } from "../../middleware/multer.middleware.js";

// Importamos tus middlewares de seguridad
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

// RUTA DE LECTURA: Permite a cualquier usuario logueado ver las fotos del Generador
router.get("/foto_generador/:id", checkAuth, getFoto_Generador);

// RUTA DE CREACIÓN: Permite a administradores y supervisores subir hasta 5 fotos simultáneas
router.post(
  "/foto_generador/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  upload.array("image", 5),
  postFoto_Generador,
);

// RUTA DE ELIMINACIÓN: Acción estricta. Solo el administrador puede borrar fotos del sistema
router.delete(
  "/foto_generador/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteFoto_Generador,
);

export default router;
