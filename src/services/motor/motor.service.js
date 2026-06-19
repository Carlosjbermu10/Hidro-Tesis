import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Bomba por su id
export const SearchBombaId = async (id_bomba) => {
  const [rows] = await pool.query("SELECT * FROM bomba WHERE id_bomba = ?", [
    id_bomba,
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

//Servicio que devuelve los datos de los motores que pertenecen a una Bomba por su id
export const SearchMotorIdBomba = async (bomba_id_bomba) => {
  const [rows] = await pool.query(
    "SELECT * FROM motor WHERE bomba_id_bomba = ?",
    [bomba_id_bomba],
  );
  return rows;
};

//Servicio que busca si ya existe un Motor por su codigo
export const SearchMotorCodigo = async (codigo) => {
  const [rows] = await pool.query(
    "SELECT * FROM motor WHERE codigo_motor = ?",
    [codigo],
  );
  return rows.length;
};

//Servicio para registrar un Motor
export const RegisterMotor = async (motor) => {
  const codigo_motor = motor.codigo_motor;
  const marca_motor = motor.marca_motor;
  const tipo_motor = motor.tipo_motor;
  const tipo_corriente = motor.tipo_corriente;
  const mono_tri = motor.mono_tri;
  const asin_sin = motor.asin_sin;
  const universal = motor.universal;
  const soporte_tec = motor.soporte_tec;
  const num_fases = motor.num_fases;
  const bomba_id_bomba = motor.bomba_id_bomba;

  const [rows] = await pool.query(
    `INSERT INTO motor (codigo_motor, 
    marca_motor, tipo_motor, tipo_corriente, mono_tri, asin_sin, universal, 
    soporte_tec, num_fases, bomba_id_bomba) 
    VALUES(?,?,?,?,?,?,?,?,?,?)`,
    [
      codigo_motor,
      marca_motor,
      tipo_motor,
      tipo_corriente,
      mono_tri,
      asin_sin,
      universal,
      soporte_tec,
      num_fases,
      bomba_id_bomba,
    ],
  );
  const result = {
    id: rows.insertId,
    codigo_motor,
    marca_motor,
    tipo_motor,
    tipo_corriente,
    mono_tri,
    asin_sin,
    universal,
    soporte_tec,
    num_fases,
    bomba_id_bomba,
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
    codigo_motor,
    marca_motor,
    tipo_motor,
    tipo_corriente,
    mono_tri,
    asin_sin,
    universal,
    soporte_tec,
    num_fases,
    bomba_id_bomba,
  } = motorData;

  const [rows] = await pool.query(
    `UPDATE motor SET 
      codigo_motor = ?, 
      marca_motor = ?, 
      tipo_motor = ?, 
      tipo_corriente = ?, 
      mono_tri = ?,
      asin_sin = ?, 
      universal = ?, 
      soporte_tec = ?, 
      num_fases = ?, 
      bomba_id_bomba = ? 
    WHERE id_motor = ?`,
    [
      codigo_motor,
      marca_motor,
      tipo_motor,
      tipo_corriente,
      mono_tri,
      asin_sin,
      universal,
      soporte_tec,
      num_fases,
      bomba_id_bomba,
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
