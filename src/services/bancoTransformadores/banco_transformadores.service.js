import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE id_est = ?", [
    id_bombeo,
  ]);
  return rows.length;
};

//Servicio que devuelve todas los Bancos de Transformadores
export const getAllBancosTransformadores = async () => {
  const [rows] = await pool.query(
    `SELECT * FROM bd_beta.banco_transformadores;`,
  );
  return rows;
};

//Servicio que busca si ya existe un Banco de Transformadores por su id
export const SearchBancoTransformadoresId = async (
  id_banco_transformadores,
) => {
  const [rows] = await pool.query(
    "SELECT * FROM banco_transformadores WHERE id_banco_transformadores = ?",
    [id_banco_transformadores],
  );
  return rows.length;
};

//Servicio que devuelve los datos de un Banco de Transformadores por el id
export const getOneBancoTransformadoresForId = async (
  id_banco_transformadores,
) => {
  const [rows] = await pool.query(
    "SELECT * FROM banco_transformadores WHERE id_banco_transformadores = ?",
    [id_banco_transformadores],
  );
  return rows;
};

//Servicio que devuelve los datos de los Bancos de Transformadores que pertenecen a Estacion de Bombeo por su id
export const SearchBancoTransformadoresIdEstacion = async (id_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM banco_transformadores WHERE est_bombeo_id_est = ?",
    [id_bombeo],
  );
  return rows;
};
//
//Servicio para registrar un Banco de Transformadores
export const RegisterBancoTransformadores = async (nuevoTransformador) => {
  const {
    tipo,
    norma,
    potencia_nominal,
    año,
    nivel_aislamiento,
    num_fases,
    frecuencia,
    clase_aislamiento,
    tension_primaria,
    tension_secundaria,
    conexion,
    corriente_primaria,
    refrigeracion,
    tension_c_c,
    peso_act,
    tipo_aceite,
    temp_ambiente,
    peso_total,
    vol_aceite_total,
    impedancia_voltios,
    calentamiento,
    marca,
    lugar_fabricado,
    est_bombeo_id_est,
  } = nuevoTransformador;

  const [rows] = await pool.query(
    `INSERT INTO banco_transformadores (
      tipo, norma, potencia_nominal, año, nivel_aislamiento, 
      num_fases, frecuencia, clase_aislamiento, tension_primaria, tension_secundaria, 
      conexion, corriente_primaria, refrigeracion, tension_c_c, peso_act, 
      tipo_aceite, temp_ambiente, peso_total, vol_aceite_total, impedancia_voltios, 
      calentamiento, marca, lugar_fabricado, est_bombeo_id_est
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      tipo,
      norma,
      potencia_nominal,
      año,
      nivel_aislamiento,
      num_fases,
      frecuencia,
      clase_aislamiento,
      tension_primaria,
      tension_secundaria,
      conexion,
      corriente_primaria,
      refrigeracion,
      tension_c_c,
      peso_act,
      tipo_aceite,
      temp_ambiente,
      peso_total,
      vol_aceite_total,
      impedancia_voltios,
      calentamiento,
      marca,
      lugar_fabricado,
      est_bombeo_id_est,
    ],
  );

  return { id: rows.insertId, ...nuevoTransformador };
};

//Servicio que elimina un Banco de Transformadores por el id
export const deleteOneBancoTransformadoresForId = async (
  id_banco_transformadores,
) => {
  const [rows] = await pool.query(
    "DELETE FROM banco_transformadores WHERE id_banco_transformadores = ?",
    [id_banco_transformadores],
  );
  return rows;
};

//Servicio para modificar un Banco de Transformadores
export const modificarBancoTransformadores = async (transformador) => {
  const id_banco_transformadores = transformador.id_banco_transformadores;
  const {
    tipo,
    norma,
    potencia_nominal,
    año,
    nivel_aislamiento,
    num_fases,
    frecuencia,
    clase_aislamiento,
    tension_primaria,
    tension_secundaria,
    conexion,
    corriente_primaria,
    refrigeracion,
    tension_c_c,
    peso_act,
    tipo_aceite,
    temp_ambiente,
    peso_total,
    vol_aceite_total,
    impedancia_voltios,
    calentamiento,
    marca,
    lugar_fabricado,
    est_bombeo_id_est,
  } = transformador;

  const [rows] = await pool.query(
    `UPDATE banco_transformadores SET 
      tipo = ?, norma = ?, potencia_nominal = ?, año = ?, nivel_aislamiento = ?, 
      num_fases = ?, frecuencia = ?, clase_aislamiento = ?, tension_primaria = ?, tension_secundaria = ?, 
      conexion = ?, corriente_primaria = ?, refrigeracion = ?, tension_c_c = ?, peso_act = ?, 
      tipo_aceite = ?, temp_ambiente = ?, peso_total = ?, vol_aceite_total = ?, impedancia_voltios = ?, 
      calentamiento = ?, marca = ?, lugar_fabricado = ?, est_bombeo_id_est = ? 
    WHERE id_banco_transformadores = ?`,
    [
      tipo,
      norma,
      potencia_nominal,
      año,
      nivel_aislamiento,
      num_fases,
      frecuencia,
      clase_aislamiento,
      tension_primaria,
      tension_secundaria,
      conexion,
      corriente_primaria,
      refrigeracion,
      tension_c_c,
      peso_act,
      tipo_aceite,
      temp_ambiente,
      peso_total,
      vol_aceite_total,
      impedancia_voltios,
      calentamiento,
      marca,
      lugar_fabricado,
      est_bombeo_id_est,
      id_banco_transformadores,
    ],
  );

  return { id: id_banco_transformadores, ...transformador };
};
