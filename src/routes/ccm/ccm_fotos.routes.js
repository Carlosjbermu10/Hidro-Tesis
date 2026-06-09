import { Router } from "express";
import {
  getFoto_CCM,
  postFoto_CCM,
  deleteFoto_CCM,
} from "../../controllers/ccm/ccm_fotos.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//middlware de multer
import { upload } from "../../middleware/multer.middleware.js";

// Importamos tus middlewares de seguridad
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

// RUTA DE LECTURA: Permite a cualquier usuario logueado ver las fotos del ccm
router.get("/foto_ccm/:id", checkAuth, getFoto_CCM);

// RUTA DE CREACIÓN: Permite a administradores y supervisores subir hasta 5 fotos simultáneas
router.post(
  "/foto_ccm/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  upload.array("image", 5),
  postFoto_CCM,
);

// RUTA DE ELIMINACIÓN: Acción estricta. Solo el administrador puede borrar fotos del sistema
router.delete(
  "/foto_ccm/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteFoto_CCM,
);

export default router;
