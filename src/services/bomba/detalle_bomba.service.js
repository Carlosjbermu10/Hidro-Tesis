import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Bomba por su id
export const SearchBombaId = async (id_bomba) => {
  const [rows] = await pool.query("SELECT * FROM bomba WHERE id_bomba = ?", [
    id_bomba,
  ]);
  return rows.length;
};

//Servicio que devuelve los detalles de la Bomba por el id
export const getOneDetalle_BombaForId = async (id_bomba) => {
  const [rows] = await pool.query(
    "SELECT * FROM detalle_bomba WHERE bomba_id_bomba = ?",
    [id_bomba],
  );
  return rows;
};

//Servicio que devuelve los detalles de la Bomba por el id_detalle
export const getOneDetalle_BombaForId_Detalle = async (id_detalle) => {
  const [rows] = await pool.query(
    "SELECT * FROM detalle_bomba WHERE id_detalle_bomba = ?",
    [id_detalle],
  );
  return rows;
};

//Servicio que busca si la Bomba posse detalles
export const SearchDetalle_BombaId = async (id_bomba) => {
  const [rows] = await pool.query(
    "SELECT * FROM detalle_bomba WHERE bomba_id_bomba = ?",
    [id_bomba],
  );
  return rows.length;
};

//Servicio para registrar Detalle para una Bomba
export const RegisterDetalle_Bomba = async (det_bom) => {
  const {
    pot_nom_bomba_hp,
    presion_descarga,
    alt_elevacion_bomba,
    vel_nom_bomba_rpm,
    dimensiones_impulsor,
    diametro_succion,
    diametro_carga,
    peso_bomba,
    acomplamiento,
    tipo_acople,
    tipo_cabezal,
    diametro_succion_cabezal,
    diametro_descarga_cabezal,
    lubricacion,
    rodamiento,
    bomba_id_bomba,
  } = det_bom;

  const [rows] = await pool.query(
    `INSERT INTO detalle_bomba 
    (pot_nom_bomba_hp, presion_descarga, alt_elevacion_bomba, vel_nom_bomba_rpm, 
    dimensiones_impulsor, diametro_succion, diametro_carga, peso_bomba, 
    acomplamiento, tipo_acople, tipo_cabezal, 
    diametro_succion_cabezal, diametro_descarga_cabezal, lubricacion, 
    rodamiento, bomba_id_bomba) 
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      pot_nom_bomba_hp,
      presion_descarga,
      alt_elevacion_bomba,
      vel_nom_bomba_rpm,
      dimensiones_impulsor,
      diametro_succion,
      diametro_carga,
      peso_bomba,
      acomplamiento,
      tipo_acople,
      tipo_cabezal,
      diametro_succion_cabezal,
      diametro_descarga_cabezal,
      lubricacion,
      rodamiento,
      bomba_id_bomba,
    ],
  );

  return {
    id: rows.insertId,
    ...det_bom,
  };
};

//Servicio que elimina los Detalles para una Bomba
export const deleteOneDetalleBombaForId_Detalle = async (id_detalle) => {
  const [rows] = await pool.query(
    "DELETE FROM detalle_bomba WHERE id_detalle_bomba = ?",
    [id_detalle],
  );
  return rows;
};

//Servicio para modificar los Detalles de una Bomba
export const modificarDetalleBomba = async (det_bom) => {
  const id_detalle = det_bom.id_detalle;
  const {
    pot_nom_bomba_hp,
    presion_descarga,
    alt_elevacion_bomba,
    vel_nom_bomba_rpm,
    dimensiones_impulsor,
    diametro_succion,
    diametro_carga,
    peso_bomba,
    acomplamiento,
    tipo_acople,
    tipo_cabezal,
    diametro_succion_cabezal,
    diametro_descarga_cabezal,
    lubricacion,
    rodamiento,
    bomba_id_bomba,
  } = det_bom;

  const [rows] = await pool.query(
    `UPDATE detalle_bomba SET 
      pot_nom_bomba_hp = ?, presion_descarga = ?, alt_elevacion_bomba = ?, vel_nom_bomba_rpm = ?, 
      dimensiones_impulsor = ?, diametro_succion = ?, diametro_carga = ?, peso_bomba = ?, 
      acomplamiento = ?, tipo_acople = ?, tipo_cabezal = ?,  
      diametro_succion_cabezal = ?, diametro_descarga_cabezal = ?, lubricacion = ?, 
      rodamiento = ?, bomba_id_bomba = ? 
    WHERE id_detalle_bomba = ?`,
    [
      pot_nom_bomba_hp,
      presion_descarga,
      alt_elevacion_bomba,
      vel_nom_bomba_rpm,
      dimensiones_impulsor,
      diametro_succion,
      diametro_carga,
      peso_bomba,
      acomplamiento,
      tipo_acople,
      tipo_cabezal,
      diametro_succion_cabezal,
      diametro_descarga_cabezal,
      lubricacion,
      rodamiento,
      bomba_id_bomba,
      id_detalle,
    ],
  );

  return {
    id: id_detalle,
    ...det_bom,
  };

  return result;
};
