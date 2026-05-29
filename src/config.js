import { config } from "dotenv";

config({ path: "env/.env" });

//Port
export const PORT = process.env.PORT || 3000;

//bd
export const BD_USER = process.env.BD_USER || "root";
export const BD_PASSWORD = process.env.DB_PASSWORD;
export const BD_HOST = process.env.DB_HOST;
export const BD_DATABASE = process.env.DB_DATABASE;
export const BD_PORT = process.env.DB_PORT;
