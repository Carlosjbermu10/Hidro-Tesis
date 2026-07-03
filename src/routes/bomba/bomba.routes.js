import { Router } from "express";
import {
  getBomba,
  getBombaForId,
  getBombaForIdLineaBombeo,
  getBombaForIdEstacion,
  postBomba,
  deleteBomba,
  updateBomba,
} from "../../controllers/bomba/bomba.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTAS DE LECTURA (Acceso para todos los usuarios logueados)
router.get("/bomba", checkAuth, getBomba);

router.get("/bomba/:id", checkAuth, getBombaForId);

router.get("/bomba/linea_bombeo/:id", checkAuth, getBombaForIdLineaBombeo);

router.get("/bomba/estacion/:id", checkAuth, getBombaForIdEstacion);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/bomba/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postBomba,
);

router.put(
  "/bomba/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateBomba,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/bomba/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteBomba,
);

export default router;
