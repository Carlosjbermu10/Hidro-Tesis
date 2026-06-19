import { Router } from "express";
import {
  getFoto_Linea_Bombeo,
  postFoto_Linea_Bombeo,
  deleteFoto_Linea_Bombeo,
} from "../../controllers/lineaBombeo/linea_bombeo_fotos.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//middlware de multer
import { upload } from "../../middleware/multer.middleware.js";

// Importamos tus middlewares de seguridad
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

// RUTA DE LECTURA: Permite a cualquier usuario logueado ver las fotos de la Linea de Bombeo
router.get("/foto_linea_bombeo/:id", checkAuth, getFoto_Linea_Bombeo);

// RUTA DE CREACIÓN: Permite a administradores y supervisores subir hasta 5 fotos simultáneas
router.post(
  "/foto_linea_bombeo/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  upload.array("image", 5),
  postFoto_Linea_Bombeo,
);

// RUTA DE ELIMINACIÓN: Acción estricta. Solo el administrador puede borrar fotos del sistema
router.delete(
  "/foto_linea_bombeo/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteFoto_Linea_Bombeo,
);

export default router;
