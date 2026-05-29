import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE id_est = ?", [
    id_bombeo,
  ]);
  return rows.length;
};

//Servicio que devuelve todas las valvulas
export const getAllValvula = async () => {
  const [rows] = await pool.query(`SELECT * FROM bd_beta.valvula;`);
  return rows;
};

//Servicio que busca si ya existe una valvula por su id
export const SearchValvulaId = async (id_valvula) => {
  const [rows] = await pool.query(
    "SELECT * FROM valvula WHERE id_valvula = ?",
    [id_valvula],
  );
  return rows.length;
};

//Servicio que devuelve los datos de la valvula por el id
export const getOneValvulaForId = async (id_valvula) => {
  const [rows] = await pool.query(
    "SELECT * FROM valvula WHERE id_valvula = ?",
    [id_valvula],
  );
  return rows;
};

//Servicio que devuelve los datos de las Valvulas que pertenecen a Estacion de Bombeo por su id
export const SearchValvulaIdEstacion = async (id_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM valvula WHERE est_bombeo_id_est = ?",
    [id_bombeo],
  );
  return rows;
};

//Servicio para registrar una Valvula
export const RegisterValvula = async (nuevaValvula) => {
  const {
    num_valvula,
    modelo_valvula,
    marca_valvula,
    tipo_valvula,
    pn,
    norma_brida,
    clase_valvula,
    diametro_tornillo,
    longitud_tornillo,
    grado_tornillo,
    tipo_asiento,
    tipo_compuerta,
    forma_operacion,
    est_bombeo_id_est,
  } = nuevaValvula;

  const [rows] = await pool.query(
    `INSERT INTO valvula (
      num_valvula, 
      modelo_valvula, 
      marca_valvula, 
      tipo_valvula, 
      pn, 
      norma_brida, 
      clase_valvula, 
      diametro_tornillo, 
      longitud_tornillo, 
      grado_tornillo, 
      tipo_asiento, 
      tipo_compuerta, 
      forma_operacion, 
      est_bombeo_id_est
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      num_valvula,
      modelo_valvula,
      marca_valvula,
      tipo_valvula,
      pn,
      norma_brida,
      clase_valvula,
      diametro_tornillo,
      longitud_tornillo,
      grado_tornillo,
      tipo_asiento,
      tipo_compuerta,
      forma_operacion,
      est_bombeo_id_est,
    ],
  );

  return {
    id: rows.insertId,
    ...nuevaValvula,
  };
};

//Servicio que elimina una Valvula por el id
export const deleteOneValvulaForId = async (id_valvula) => {
  const [rows] = await pool.query("DELETE FROM valvula WHERE id_valvula = ?", [
    id_valvula,
  ]);
  return rows;
};

//Servicio para modificar una Valvula
export const modificarValvula = async (valvula) => {
  const id_valvula = valvula.id_valvula;
  const {
    num_valvula,
    modelo_valvula,
    marca_valvula,
    tipo_valvula,
    pn,
    norma_brida,
    clase_valvula,
    diametro_tornillo,
    longitud_tornillo,
    grado_tornillo,
    tipo_asiento,
    tipo_compuerta,
    forma_operacion,
    est_bombeo_id_est,
  } = valvula;

  const [rows] = await pool.query(
    `UPDATE valvula SET 
      num_valvula = ?, 
      modelo_valvula = ?, 
      marca_valvula = ?, 
      tipo_valvula = ?, 
      pn = ?, 
      norma_brida = ?, 
      clase_valvula = ?, 
      diametro_tornillo = ?, 
      longitud_tornillo = ?, 
      grado_tornillo = ?, 
      tipo_asiento = ?, 
      tipo_compuerta = ?, 
      forma_operacion = ?, 
      est_bombeo_id_est = ? 
    WHERE id_valvula = ?`,
    [
      num_valvula,
      modelo_valvula,
      marca_valvula,
      tipo_valvula,
      pn,
      norma_brida,
      clase_valvula,
      diametro_tornillo,
      longitud_tornillo,
      grado_tornillo,
      tipo_asiento,
      tipo_compuerta,
      forma_operacion,
      est_bombeo_id_est,
      id_valvula,
    ],
  );

  return {
    id: id_valvula,
    ...valvula,
  };
};
