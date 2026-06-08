import { Router } from "express";
import {
  getFoto_Est_Bombeo,
  postFoto_Est_Bombeo,
  deleteFoto_Est_Bombeo,
} from "../../controllers/EstacionBombeo/est_bombeo_fotos.controller.js";

//IMPORTAMOS LOS MIDDLWARE

//middlware de multer
import { upload } from "../../middleware/multer.middleware.js";

const router = Router();

router.get("/foto_Estacion/:id", getFoto_Est_Bombeo);
router.post(
  "/foto_Estacion/add/:id",
  upload.array("image", 5),
  postFoto_Est_Bombeo,
);
router.delete("/foto_Estacion/delete/:id", deleteFoto_Est_Bombeo);

export default router;
