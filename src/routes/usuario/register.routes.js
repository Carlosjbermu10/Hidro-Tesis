import { Router } from "express";
import {
  getRegister,
  postRegister,
} from "../../controllers/usuario/register.controller.js";

// Importamos los miiddelwares
import { checkAuth, checkRole } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/register", getRegister);
router.post(
  "/register",
  checkAuth,
  checkRole(["admin", "supervisor"]),
  postRegister,
);

export default router;
