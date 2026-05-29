import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE id_est = ?", [
    id_bombeo,
  ]);
  return rows.length;
};

//Servicio que devuelve los detalles de la Estación de bombeo por el id
export const getOneDetalle_EstacionForId = async (id_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM detalle_est_bombeo WHERE est_bombeo_id_est = ?",
    [id_bombeo],
  );
  return rows;
};

//Servicio que devuelve los detalles de la Estación de bombeo por el id_detalle
export const getOneDetalle_EstacionForId_Detalle = async (id_detalle) => {
  const [rows] = await pool.query(
    "SELECT * FROM detalle_est_bombeo WHERE id_detalle_est = ?",
    [id_detalle],
  );
  return rows;
};

//Servicio que busca si la estacion de bombeo posse detalles
export const SearchDetalle_EstacionId = async (id_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM detalle_est_bombeo WHERE est_bombeo_id_est = ?",
    [id_bombeo],
  );
  return rows.length;
};

//Servicio para registrar Detalle para una Estación de Bombeo
export const RegisterDetalle_Estacion = async (det_est) => {
  const municipio = det_est.municipio;
  const ubicacion = det_est.ubicacion;
  const coordenada_norte = det_est.coordenada_norte;
  const coordenada_este = det_est.coordenada_este;
  const coordenada_gps = det_est.coordenada_gps;
  const cota = det_est.cota;
  const caudal_diseño = det_est.caudal_diseño;
  const poblacion_bene = det_est.poblacion_bene;
  const caudal_diseño_entrada = det_est.caudal_diseño_entrada;
  const caudal_diseño_salida = det_est.caudal_diseño_salida;
  const caudal_operacion = det_est.caudal_operacion;
  const consumo = det_est.consumo;
  const aduccion = det_est.aduccion;
  const sistema_bombeo = det_est.sistema_bombeo;
  const linea_bombeo = det_est.linea_bombeo;
  const grupo_bombeo = det_est.grupo_bombeo;
  const est_bombeo_id_est = det_est.est_bombeo_id_est;

  const [rows] = await pool.query(
    `INSERT INTO detalle_est_bombeo 
    (municipio, ubicacion, coordenada_norte, coordenada_este, coordenada_gps, cota, caudal_diseño, 
    poblacion_bene, caudal_diseño_entrada, caudal_diseño_salida, caudal_operacion, consumo, aduccion,
    sistema_bombeo, linea_bombeo, grupo_bombeo, est_bombeo_id_est) 
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      municipio,
      ubicacion,
      coordenada_norte,
      coordenada_este,
      coordenada_gps,
      cota,
      caudal_diseño,
      poblacion_bene,
      caudal_diseño_entrada,
      caudal_diseño_salida,
      caudal_operacion,
      consumo,
      aduccion,
      sistema_bombeo,
      linea_bombeo,
      grupo_bombeo,
      est_bombeo_id_est,
    ],
  );
  const result = {
    id: rows.insertId,
    municipio,
    ubicacion,
    coordenada_norte,
    coordenada_este,
    coordenada_gps,
    cota,
    caudal_diseño,
    poblacion_bene,
    caudal_diseño_entrada,
    caudal_diseño_salida,
    caudal_operacion,
    consumo,
    aduccion,
    sistema_bombeo,
    linea_bombeo,
    grupo_bombeo,
    est_bombeo_id_est,
  };
  return result;
};

//Servicio que elimina los Detalles para una Estación de Bombeo
export const deleteOneDetalleEstacionForId_Detalle = async (id_detalle) => {
  const [rows] = await pool.query(
    "DELETE FROM detalle_est_bombeo WHERE id_detalle_est = ?",
    [id_detalle],
  );
  return rows;
};

//Servicio para modificar los Detalles de una Estación de Bombeo
export const modificarDetalleEstacion = async (detalleEst) => {
  const id_detalle = detalleEst.est_bombeo_id_est; // Usamos el ID de la estación para el WHERE
  const {
    ubicacion,
    municipio,
    coordenada_norte,
    coordenada_este,
    coordenada_gps,
    cota,
    caudal_diseño,
    poblacion_bene,
    caudal_diseño_entrada,
    caudal_diseño_salida,
    caudal_operacion,
    consumo,
    aduccion,
    sistema_bombeo,
    linea_bombeo,
    grupo_bombeo,
  } = detalleEst;

  const [rows] = await pool.query(
    `UPDATE detalle_est_bombeo SET 
      ubicacion = ?, 
      municipio = ?, 
      coordenada_norte = ?, 
      coordenada_este = ?, 
      coordenada_gps = ?, 
      cota = ?, 
      caudal_diseño = ?, 
      poblacion_bene = ?, 
      caudal_diseño_entrada = ?, 
      caudal_diseño_salida = ?, 
      caudal_operacion = ?, 
      consumo = ?, 
      aduccion = ?, 
      sistema_bombeo = ?, 
      linea_bombeo = ?, 
      grupo_bombeo = ? 
    WHERE est_bombeo_id_est = ?`,
    [
      ubicacion,
      municipio,
      coordenada_norte,
      coordenada_este,
      coordenada_gps,
      cota,
      caudal_diseño,
      poblacion_bene,
      caudal_diseño_entrada,
      caudal_diseño_salida,
      caudal_operacion,
      consumo,
      aduccion,
      sistema_bombeo,
      linea_bombeo,
      grupo_bombeo,
      id_detalle,
    ],
  );

  const result = {
    id: id_detalle,
    ...detalleEst,
  };

  return result;
};
