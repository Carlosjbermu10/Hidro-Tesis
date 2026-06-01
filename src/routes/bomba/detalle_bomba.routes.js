import { Router } from "express";
import {
  getDetalle_BombaForId,
  postDetalle_Bomba,
  deleteDetalle_Bomba,
  updateDetalle_Bomba,
} from "../../controllers/bomba/detalle_bomba.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTA DE LECTURA (Cualquier rol logueado)
router.get("/detalle_bomba/:id", checkAuth, getDetalle_BombaForId);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/detalle_bomba/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postDetalle_Bomba,
);

router.put(
  "/detalle_bomba/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateDetalle_Bomba,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/detalle_bomba/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteDetalle_Bomba,
);

export default router;
