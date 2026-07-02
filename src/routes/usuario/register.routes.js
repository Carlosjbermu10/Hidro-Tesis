import { Router } from "express";
import {
  getRegister,
  postRegister,
} from "../../controllers/usuario/register.controller.js";

// Importamos los miiddelwares
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

//Mostrar todos los usuarios registrados
router.get(
  "/auth/register",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  getRegister,
);

//Registrar usuario nuevo
router.post("/auth/register", checkAuth, checkRole(["admin"]), postRegister);

export default router;
