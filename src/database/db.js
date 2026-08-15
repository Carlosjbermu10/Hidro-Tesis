import { createPool } from "mysql2/promise";

import {
  BD_HOST,
  BD_PASSWORD,
  BD_USER,
  BD_PORT,
  BD_DATABASE,
} from "../config.js";

export const pool = createPool({
  host: BD_HOST,
  user: BD_USER,
  password: BD_PASSWORD,
  port: BD_PORT,
  database: BD_DATABASE,
  connectionLimit: 4, // Limita a máximo 4 conexiones (para no superar las 5 de Clever Cloud)
  waitForConnections: true, // Si se ocupan las 4, las demás peticiones esperan su turno
  queueLimit: 0, // Sin límite de cola de espera
});
