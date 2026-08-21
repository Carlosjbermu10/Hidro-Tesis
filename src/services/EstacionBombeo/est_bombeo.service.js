import { pool } from "../../database/db.js";

//Servicio que devuelve todas las Estaciones de bombeo activas
export const getAllEstacion = async () => {
  const [rows] = await pool.query(`
    SELECT 
      e.id_est, 
      e.nombre_est, 
      e.codigo, 
      e.nombre_sistema,
      e.tipo_est,
      e.tipo_succion,
      e.estado_actividad,
      d.coordenada_gps
    FROM est_bombeo e
    LEFT JOIN detalle_est_bombeo d ON e.id_est = d.est_bombeo_id_est
    WHERE e.estado_actividad = 1;
  `);

  return rows;
};

//Servicio que devuelve las Estaciones de bombeo inactivas
export const getEstacionesInactivas = async () => {
  const [rows] = await pool.query(`
    SELECT 
      e.id_est, 
      e.nombre_est, 
      e.codigo, 
      e.nombre_sistema,
      e.tipo_est,
      e.tipo_succion,
      e.estado_actividad,
      d.coordenada_gps
    FROM est_bombeo e
    LEFT JOIN detalle_est_bombeo d ON e.id_est = d.est_bombeo_id_est
    WHERE e.estado_actividad = 0;
  `);

  return rows;
};

// Servicio que reactiva una Estación de bombeo por su id
export const enableOneEstacionForId = async (id_bombeo) => {
  const [rows] = await pool.query(
    "UPDATE est_bombeo SET estado_actividad = 1 WHERE id_est = ?",
    [id_bombeo],
  );
  return rows;
};

//Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE id_est = ?", [
    id_bombeo,
  ]);
  return rows.length;
};

//Servicio que devuelve los datos de la Estación de bombeo por el id
export const getOneEstacionForId = async (id_bombeo) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE id_est = ?", [
    id_bombeo,
  ]);
  return rows;
};

//Servicio que busca si ya existe una Estación de bombeo por su codigo
export const SearchEstacionCodigo = async (codigo) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE codigo = ?", [
    codigo,
  ]);
  return rows.length;
};

//Servicio para registrar una Estación de Bombeo
export const RegisterEstacion = async (est) => {
  const codigo = est.codigo;
  const nombre_sistema = est.nombre_sistema;
  const nombre_est = est.nombre_est;
  const tipo_est = est.tipo_est;
  const tipo_succion = est.tipo_succion;

  const [rows] = await pool.query(
    "INSERT INTO est_bombeo (codigo, nombre_sistema, nombre_est, tipo_est, tipo_succion) VALUES(?,?,?,?,?)",
    [codigo, nombre_sistema, nombre_est, tipo_est, tipo_succion],
  );
  const result = {
    id: rows.insertId,
    codigo,
    nombre_sistema,
    nombre_est,
    tipo_est,
    tipo_succion,
  };
  return result;
};

//Servicio que elimina una Estación de bombeo por el id
export const deleteOneEstacionForId = async (id_bombeo) => {
  const [rows] = await pool.query("DELETE FROM est_bombeo WHERE id_est = ?", [
    id_bombeo,
  ]);
  return rows;
};

// Servicio que deshabilita (borrado lógico) una Estación de bombeo por su id
export const disableOneEstacionForId = async (id_bombeo) => {
  const [rows] = await pool.query(
    "UPDATE est_bombeo SET estado_actividad = 0 WHERE id_est = ?",
    [id_bombeo],
  );
  return rows;
};

//Servicio para modificar una Estación de Bombeo
export const modificarEstacion = async (est) => {
  const id_bombeo = est.id;
  const codigo = est.codigo;
  const nombre_sistema = est.nombre_sistema;
  const nombre_est = est.nombre_est;
  const tipo_est = est.tipo_est;
  const tipo_succion = est.tipo_succion;

  const [rows] = await pool.query(
    "UPDATE est_bombeo SET codigo = ?, nombre_sistema= ?, nombre_est= ?, tipo_est= ?, tipo_succion= ? WHERE id_est = ?",
    [codigo, nombre_sistema, nombre_est, tipo_est, tipo_succion, id_bombeo],
  );
  const result = {
    id: id_bombeo,
    codigo,
    nombre_sistema,
    nombre_est,
    tipo_est,
    tipo_succion,
  };
  return result;
};

//Servicio que compara el id de una Estación de bombeo con el codigo
export const SearchEstacionCodigoId = async (codigo) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE codigo = ?", [
    codigo,
  ]);
  return rows;
};
