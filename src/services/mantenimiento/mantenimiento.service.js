import { pool } from "../../database/db.js";

// ==========================================
// SERVICIOS PARA ÓRDENES DE MANTENIMIENTO
// ==========================================

export const RegisterOrdenMantenimiento = async (orden) => {
  const query = `
    INSERT INTO ordenes_mantenimiento 
    (tipo_equipo, equipo_id, tipo_mantenimiento, estado, criticidad, fecha_programada, descripcion_falla) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.query(query, [
    orden.tipo_equipo,
    orden.equipo_id,
    orden.tipo_mantenimiento,
    orden.estado,
    orden.criticidad,
    orden.fecha_programada,
    orden.descripcion_falla,
  ]);
  return result;
};

export const GetOrdenesByEquipo = async (tipo_equipo, equipo_id) => {
  const query = `SELECT * FROM ordenes_mantenimiento WHERE tipo_equipo = ? AND equipo_id = ? ORDER BY fecha_programada DESC`;
  const [rows] = await pool.query(query, [tipo_equipo, equipo_id]);
  return rows;
};

export const GetOneOrdenById = async (id_orden) => {
  const query = `SELECT * FROM ordenes_mantenimiento WHERE id_orden = ?`;
  const [rows] = await pool.query(query, [id_orden]);
  return rows;
};

export const UpdateEstadoOrden = async (
  id_orden,
  estado,
  fecha_ejecucion,
  trabajo_realizado,
) => {
  const query = `
    UPDATE ordenes_mantenimiento 
    SET estado = ?, fecha_ejecucion = ?, trabajo_realizado = ? 
    WHERE id_orden = ?
  `;
  const [result] = await pool.query(query, [
    estado,
    fecha_ejecucion,
    trabajo_realizado,
    id_orden,
  ]);
  return result;
};

// ==========================================
// SERVICIOS PARA REGISTRO DE HORÓMETROS
// ==========================================

export const RegisterHorometro = async (lectura) => {
  const query = `
    INSERT INTO registro_horometros (tipo_equipo, equipo_id, horas_acumuladas) 
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.query(query, [
    lectura.tipo_equipo,
    lectura.equipo_id,
    lectura.horas_acumuladas,
  ]);
  return result;
};

export const GetHorometrosByEquipo = async (tipo_equipo, equipo_id) => {
  const query = `SELECT * FROM registro_horometros WHERE tipo_equipo = ? AND equipo_id = ? ORDER BY fecha_lectura DESC`;
  const [rows] = await pool.query(query, [tipo_equipo, equipo_id]);
  return rows;
};
