import { Router } from "express";
import {
  getFoto_Bomba,
  postFoto_Bomba,
  deleteFoto_Bomba,
} from "../../controllers/bomba/bomba_fotos.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//middlware de multer
import { upload } from "../../middleware/multer.middleware.js";

// Importamos tus middlewares de seguridad
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

// RUTA DE LECTURA: Permite a cualquier usuario logueado ver las fotos de las Bombas
router.get("/foto_bomba/:id", checkAuth, getFoto_Bomba);

// RUTA DE CREACIÓN: Permite a administradores y supervisores subir hasta 5 fotos simultáneas
router.post(
  "/foto_bomba/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  upload.array("image", 5),
  postFoto_Bomba,
);

// RUTA DE ELIMINACIÓN: Acción estricta. Solo el administrador puede borrar fotos del sistema
router.delete(
  "/foto_bomba/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteFoto_Bomba,
);

export default router;
