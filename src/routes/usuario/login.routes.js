import { Router } from "express";
import {
  getLogin,
  postLogin,
  postLogout,
} from "../../controllers/usuario/login.controller.js";

//IMPORTAMOS LOS MIDDLWARE

const router = Router();

router.get("/auth/login", getLogin);
router.post("/auth/login", postLogin);
router.post("/auth/logout", postLogout);

export default router;
