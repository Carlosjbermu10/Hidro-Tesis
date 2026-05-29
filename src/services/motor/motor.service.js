import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE id_est = ?", [
    id_bombeo,
  ]);
  return rows.length;
};

//Servicio que devuelve todas los motores
export const getAllMotor = async () => {
  const [rows] = await pool.query(`SELECT * FROM bd_beta.motor;`);
  return rows;
};

//Servicio que busca si ya existe un motor por su id
export const SearchMotorId = async (id_motor) => {
  const [rows] = await pool.query("SELECT * FROM motor WHERE id_motor = ?", [
    id_motor,
  ]);
  return rows.length;
};

//Servicio que devuelve los datos del motor por el id
export const getOneMotorForId = async (id_motor) => {
  const [rows] = await pool.query("SELECT * FROM motor WHERE id_motor = ?", [
    id_motor,
  ]);
  return rows;
};

//Servicio que devuelve los datos de los motores que pertenecen a Estacion de Bombeo por su id
export const SearchMotorIdEstacion = async (id_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM motor WHERE est_bombeo_id_est = ?",
    [id_bombeo],
  );
  return rows;
};

//Servicio que busca si ya existe una Estación de bombeo por su codigo
export const SearchMotorCodigo = async (codigo) => {
  const [rows] = await pool.query(
    "SELECT * FROM motor WHERE codigo_motor = ?",
    [codigo],
  );
  return rows.length;
};

//Servicio para registrar un Motor
export const RegisterMotor = async (motor) => {
  const num_motor = motor.num_motor;
  const posicion_motor = motor.posicion_motor;
  const codigo_motor = motor.codigo_motor;
  const marca_motor = motor.marca_motor;
  const tipo_motor = motor.tipo_motor;
  const tipo_corriente = motor.tipo_corriente;
  const asin_sin = motor.asin_sin;
  const universal = motor.universal;
  const soporte_tec = motor.soporte_tec;
  const num_fases = motor.num_fases;
  const est_bombeo_id_est = motor.est_bombeo_id_est;

  const [rows] = await pool.query(
    `INSERT INTO motor (num_motor, posicion_motor, codigo_motor, 
    marca_motor, tipo_motor, tipo_corriente, asin_sin, universal, 
    soporte_tec, num_fases, est_bombeo_id_est) 
    VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
    [
      num_motor,
      posicion_motor,
      codigo_motor,
      marca_motor,
      tipo_motor,
      tipo_corriente,
      asin_sin,
      universal,
      soporte_tec,
      num_fases,
      est_bombeo_id_est,
    ],
  );
  const result = {
    id: rows.insertId,
    num_motor,
    posicion_motor,
    codigo_motor,
    marca_motor,
    tipo_motor,
    tipo_corriente,
    asin_sin,
    universal,
    soporte_tec,
    num_fases,
    est_bombeo_id_est,
  };
  return result;
};

//Servicio que elimina un Motor por el id
export const deleteOneMotorForId = async (id_motor) => {
  const [rows] = await pool.query("DELETE FROM motor WHERE id_motor = ?", [
    id_motor,
  ]);
  return rows;
};

//Servicio para modificar un Motor
export const modificarMotor = async (motorData) => {
  const id_motor = motorData.id_motor; // El ID que viene del JSON para el WHERE
  const {
    num_motor,
    posicion_motor,
    codigo_motor,
    marca_motor,
    tipo_motor,
    tipo_corriente,
    asin_sin,
    universal,
    soporte_tec,
    num_fases,
    est_bombeo_id_est,
  } = motorData;

  const [rows] = await pool.query(
    `UPDATE motor SET 
      num_motor = ?, 
      posicion_motor = ?, 
      codigo_motor = ?, 
      marca_motor = ?, 
      tipo_motor = ?, 
      tipo_corriente = ?, 
      asin_sin = ?, 
      universal = ?, 
      soporte_tec = ?, 
      num_fases = ?, 
      est_bombeo_id_est = ? 
    WHERE id_motor = ?`,
    [
      num_motor,
      posicion_motor,
      codigo_motor,
      marca_motor,
      tipo_motor,
      tipo_corriente,
      asin_sin,
      universal,
      soporte_tec,
      num_fases,
      est_bombeo_id_est,
      id_motor,
    ],
  );

  const result = {
    id: id_motor,
    ...motorData,
  };

  return result;
};

//Servicio que compara el id de un Motor con el codigo
export const SearchMotorCodigoId = async (codigo) => {
  const [rows] = await pool.query(
    "SELECT * FROM motor WHERE codigo_motor = ?",
    [codigo],
  );
  return rows;
};
