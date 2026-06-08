import cloudinary from "cloudinary";

import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../config.js";

//credenciales del Cloudinary
export const cloud = cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

//Metodo que sube la imagen a cloudinary
export const uploadClo = async (filepath) => {
  return await cloudinary.v2.uploader.upload(filepath);
};

export const deleteClo = async (filepath) => {
  return await cloudinary.v2.uploader.destroy(filepath);
};
