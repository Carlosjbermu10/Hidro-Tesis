import { pool } from "../../database/db.js";

// 1. Servicio para GUARDAR silenciosamente
export const InsertarBitacora = async (
  id_usuario,
  accion,
  tabla_afectada,
  registro_id,
  descripcion,
) => {
  try {
    const query = `
      INSERT INTO bitacora_operaciones 
      (id_usuario, accion, tabla_afectada, registro_id, descripcion) 
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.query(query, [
      id_usuario,
      accion,
      tabla_afectada,
      registro_id,
      descripcion,
    ]);
  } catch (error) {
    // Si la bitácora falla, solo lo imprimimos, no detenemos el sistema
    console.error("Error silencioso al registrar en bitácora:", error);
  }
};

// 2. Servicio para MOSTRAR al administrador
export const ObtenerBitacora = async () => {
  // Hacemos un JOIN para que el frontend reciba el nombre del usuario, no solo el número 15
  const query = `
    SELECT b.id_log, b.accion, b.tabla_afectada, b.registro_id, b.descripcion, b.fecha_hora, u.username, u.nombre_completo 
    FROM bitacora_operaciones b
    INNER JOIN usuario u ON b.id_usuario = u.id_usuario
    ORDER BY b.fecha_hora DESC
    LIMIT 50; -- Limitamos para no colapsar la memoria si hay miles de registros
  `;
  const [rows] = await pool.query(query);
  return rows;
};
