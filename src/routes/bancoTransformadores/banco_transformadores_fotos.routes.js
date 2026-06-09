import { Router } from "express";
import {
  getFoto_Banco_transformadores,
  postFoto_Banco_transformadores,
  deleteFoto_Banco_transformadores,
} from "../../controllers/bancoTransformadores/banco_transformadores_fotos.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//middlware de multer
import { upload } from "../../middleware/multer.middleware.js";

// Importamos tus middlewares de seguridad
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

// RUTA DE LECTURA: Permite a cualquier usuario logueado ver las fotos deL banco de Transformadores
router.get(
  "/foto_banco_transformadores/:id",
  checkAuth,
  getFoto_Banco_transformadores,
);

// RUTA DE CREACIÓN: Permite a administradores y supervisores subir hasta 5 fotos simultáneas
router.post(
  "/foto_banco_transformadores/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  upload.array("image", 5),
  postFoto_Banco_transformadores,
);

// RUTA DE ELIMINACIÓN: Acción estricta. Solo el administrador puede borrar fotos del sistema
router.delete(
  "/foto_banco_transformadores/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteFoto_Banco_transformadores,
);

export default router;
