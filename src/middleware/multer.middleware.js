import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Asegurarnos de que la carpeta temporal exista para que no de error
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  dest: path.join(__dirname, "../public/uploads"),
  limits: { fileSize: 10000000 }, //10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|jfif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: Archivo no soportado");
  },
}); // El input del Front se llamará "image"
