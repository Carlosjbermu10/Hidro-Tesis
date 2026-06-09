import { Router } from "express";
import {
  getFoto_Tanque,
  postFoto_Tanque,
  deleteFoto_Tanque,
} from "../../controllers/tanque/tanque_fotos.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//middlware de multer
import { upload } from "../../middleware/multer.middleware.js";

// Importamos tus middlewares de seguridad
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

// RUTA DE LECTURA: Permite a cualquier usuario logueado ver las fotos del Tanque
router.get("/foto_tanque/:id", checkAuth, getFoto_Tanque);

// RUTA DE CREACIÓN: Permite a administradores y supervisores subir hasta 5 fotos simultáneas
router.post(
  "/foto_tanque/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  upload.array("image", 5),
  postFoto_Tanque,
);

// RUTA DE ELIMINACIÓN: Acción estricta. Solo el administrador puede borrar fotos del sistema
router.delete(
  "/foto_tanque/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteFoto_Tanque,
);

export default router;
