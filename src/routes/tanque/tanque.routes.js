import { Router } from "express";
import {
  getTanque,
  getTanqueForId,
  getTanqueForIdEstacion,
  getTanqueTotalForIdEstacion,
  postTanque,
  deleteTanque,
  updateTanque,
} from "../../controllers/tanque/tanque.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTAS DE LECTURA (Acceso para todo el personal logueado)

//RUTA PARA MOSTRAR TODOS LOS TANQUES
router.get("/tanque", checkAuth, getTanque);

//RUTA PARA MOSTRAR UN TANQUE EN ESPECIFICO
router.get("/tanque/:id", checkAuth, getTanqueForId);

//RUTA PARA MOSTRAR TODOS LOS TANQUES EN UNA ESTACION DE BOMBEO
router.get("/tanque/estacion/:id", checkAuth, getTanqueForIdEstacion);

router.get(
  "/tanque/estacion/total/:id",
  checkAuth,
  getTanqueTotalForIdEstacion,
);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/tanque/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postTanque,
);

router.put(
  "/tanque/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateTanque,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/tanque/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteTanque,
);

export default router;
