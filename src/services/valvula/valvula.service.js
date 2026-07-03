import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE id_est = ?", [
    id_bombeo,
  ]);
  return rows.length;
};

//Servicio que busca si ya existe una Linea de bombeo por su id
export const SearchLinea_BombeoId = async (id_linea_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM linea_bombeo WHERE id_linea_bombeo = ?",
    [id_linea_bombeo],
  );
  return rows.length;
};

//Servicio que devuelve todas las valvulas
export const getAllValvula = async () => {
  const [rows] = await pool.query(`SELECT * FROM valvula;`);
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

//Servicio que devuelve los datos de las Valvulas que pertenecen a Linea de Bombeo por su id
export const SearchValvulaIdLineaBombeo = async (id_linea_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM valvula WHERE linea_bombeo_id_linea_bombeo = ?",
    [id_linea_bombeo],
  );
  return rows;
};

//Servicio para registrar una Valvula
export const RegisterValvula = async (nuevaValvula) => {
  const {
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
    linea_bombeo_id_linea_bombeo,
  } = nuevaValvula;

  const [rows] = await pool.query(
    `INSERT INTO valvula (
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
      linea_bombeo_id_linea_bombeo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
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
      linea_bombeo_id_linea_bombeo,
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
    linea_bombeo_id_linea_bombeo,
  } = valvula;

  const [rows] = await pool.query(
    `UPDATE valvula SET 
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
      linea_bombeo_id_linea_bombeo = ? 
    WHERE id_valvula = ?`,
    [
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
      linea_bombeo_id_linea_bombeo,
      id_valvula,
    ],
  );

  return {
    id: id_valvula,
    ...valvula,
  };
};

// Servicio que devuelve las Válvulas filtradas por el ID de la Estación de Bombeo
export const SearchValvulaIdEstacion = async (id_est) => {
  const [rows] = await pool.query(
    `SELECT v.* FROM valvula v
     INNER JOIN linea_bombeo lb ON v.linea_bombeo_id_linea_bombeo = lb.id_linea_bombeo
     WHERE lb.est_bombeo_id_est = ?`,
    [id_est],
  );
  return rows;
};
