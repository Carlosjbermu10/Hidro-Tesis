import { Router } from "express";
import {
  getDimension_Peso_GeneradorForId,
  postDimension_Peso_Generador,
  deleteDimension_Peso_Generador,
  updateDimension_Peso_Generador,
} from "../../controllers/generador/dimension_peso_generador.controller.js";

//IMPORTAMOS LOS MIDDLWARE
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//RUTAS

//RUTA DE LECTURA (Acceso para todo el personal logueado)
router.get(
  "/dimension_peso_generador/:id",
  checkAuth,
  getDimension_Peso_GeneradorForId,
);

//RUTAS DE CREACIÓN Y EDICIÓN (Solo Admin y Supervisor)
router.post(
  "/dimension_peso_generador/add/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postDimension_Peso_Generador,
);

router.put(
  "/dimension_peso_generador/update/:id",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  updateDimension_Peso_Generador,
);

//RUTA DE ELIMINACIÓN (Estricta: Solo Admin)
router.delete(
  "/dimension_peso_generador/delete/:id",
  checkAuth,
  checkRole(["admin"]),
  deleteDimension_Peso_Generador,
);

export default router;
