import { config } from "dotenv";

config({ path: "env/.env" });

//Port
export const PORT = process.env.PORT || 3000;

//bd
export const BD_USER = process.env.DB_USER || "root";
export const BD_PASSWORD = process.env.DB_PASSWORD;
export const BD_HOST = process.env.DB_HOST;
export const BD_DATABASE = process.env.DB_DATABASE;
export const BD_PORT = process.env.DB_PORT;

//jwt
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_TIEMPO_EXPIRA = process.env.JWT_TIEMPO_EXPIRA;
export const JWT_COOKIE_EXPIRES = process.env.JWT_COOKIE_EXPIRES;

//cloudinary
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

//paypal
export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT;
export const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET;
export const PAYPAL_API = process.env.PAYPAL_API;
