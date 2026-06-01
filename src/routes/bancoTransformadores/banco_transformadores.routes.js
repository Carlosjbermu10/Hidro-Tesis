import { Router } from "express";
import {
  getBanco_transformadores,
  getBanco_transformadoresForId,
  getBanco_transformadoresForIdEstacion,
  postBanco_transformadores,
  deleteBanco_transformadores,
  updateBanco_transformadores,
} from "../../controllers/bancoTransformadores/banco_transformadores.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTAS DE LECTURA (Cualquier usuario logueado puede ver)
router.get("/banco_transformadores", checkAuth, getBanco_transformadores);

router.get(
  "/banco_transformadores/:id",
  checkAuth,
  getBanco_transformadoresForId,
);

router.get(
  "/banco_transformadores/estacion/:id",
  checkAuth,
  getBanco_transformadoresForIdEstacion,
);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/banco_transformadores/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postBanco_transformadores,
);

router.put(
  "/banco_transformadores/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateBanco_transformadores,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/banco_transformadores/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteBanco_transformadores,
);

export default router;
