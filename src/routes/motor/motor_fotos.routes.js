import { Router } from "express";
import {
  getFoto_Motor,
  postFoto_Motor,
  deleteFoto_Motor,
} from "../../controllers/motor/motor_fotos.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//middlware de multer
import { upload } from "../../middleware/multer.middleware.js";

// Importamos tus middlewares de seguridad
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

// RUTA DE LECTURA: Permite a cualquier usuario logueado ver las fotos del Motor
router.get("/foto_motor/:id", checkAuth, getFoto_Motor);

// RUTA DE CREACIÓN: Permite a administradores y supervisores subir hasta 5 fotos simultáneas
router.post(
  "/foto_motor/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  upload.array("image", 5),
  postFoto_Motor,
);

// RUTA DE ELIMINACIÓN: Acción estricta. Solo el administrador puede borrar fotos del sistema
router.delete(
  "/foto_motor/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteFoto_Motor,
);

export default router;
