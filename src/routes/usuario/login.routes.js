import { Router } from "express";
import {
  getLogin,
  postLogin,
  getLogout,
} from "../../controllers/usuario/login.controller.js";

//IMPORTAMOS LOS MIDDLWARE

/*
//middlware de auth
import { checkAuth } from "../../middlware/auth.js";
import { checkRolAdmin, checkRolUser } from "../../middlware/roleAuth.js";
//middlware de multer
import { upload } from "../../middlware/multer.js";

//IMPORTAMOS E UTILIZAMOS CLOUDINARY
import { cloud } from "../../helpers/cloudinary.js";
import cloudinary from "cloudinary";
*/

const router = Router();

router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/logout", getLogout);

/*
router.get("/a", checkAuth, (req, res) => {
  res.send("hola aaaaaaaaa");
});
router.get("/i", checkAuth, checkRolUser, (req, res) => {
  res.send("hola iiiiii");
});
router.get("/u", checkAuth, checkRolAdmin, (req, res) => {
  res.send("hola uuuuuuuuuuu");
});
router.post("/ima", upload, async (req, res) => {
  try {
    //console.log(req.file)
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    console.log(result);
    res.send("imagen subida");
  } catch (error) {
    console.log(error);
  }
});
router.get("/", (req, res) => {
  res.send("ASDAdasfdsdfasadfasdf");
});
*/

export default router;
