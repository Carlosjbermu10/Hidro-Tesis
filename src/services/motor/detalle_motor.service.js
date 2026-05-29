import { pool } from "../../database/db.js";

//Servicio que busca si ya existe un Motor por su id
export const SearchMotorId = async (id_motor) => {
  const [rows] = await pool.query("SELECT * FROM motor WHERE id_motor = ?", [
    id_motor,
  ]);
  return rows.length;
};

//Servicio que devuelve los detalles del Motor por el id
export const getOneDetalle_MotorForId = async (id_motor) => {
  const [rows] = await pool.query(
    "SELECT * FROM detalle_motor WHERE motor_id_motor = ?",
    [id_motor],
  );
  return rows;
};

//Servicio que devuelve los detalles del Motor por el id_detalle
export const getOneDetalle_MotorForId_Detalle = async (id_detalle) => {
  const [rows] = await pool.query(
    "SELECT * FROM detalle_motor WHERE id_detalle_motor = ?",
    [id_detalle],
  );
  return rows;
};

//Servicio que busca si el Motor posse detalles
export const SearchDetalle_MotorId = async (id_motor) => {
  const [rows] = await pool.query(
    "SELECT * FROM detalle_motor WHERE motor_id_motor = ?",
    [id_motor],
  );
  return rows.length;
};

//Servicio para registrar Detalle para un Motor
export const RegisterDetalle_Motor = async (det_mot) => {
  const {
    pot_nom_motor_hp,
    pot_nom_motor_kw,
    tens_nom_operacion_v,
    tens_nom_operacion_amp,
    eficencia,
    vel_nom_motor_rpm,
    tam_carcaza,
    frecuencia,
    factor_potencia,
    factor_servicio,
    tipo_aislamiento,
    grado_proteccion,
    temp_ambiente_max,
    peso_motor,
    altitud_ambiente_max,
    rodamiento,
    motor_id_motor,
  } = det_mot;

  const [rows] = await pool.query(
    `INSERT INTO detalle_motor 
    (pot_nom_motor_hp, pot_nom_motor_kw, tens_nom_operacion_v, tens_nom_operacion_amp, 
    eficencia, vel_nom_motor_rpm, tam_carcaza, frecuencia, factor_potencia, 
    factor_servicio, tipo_aislamiento, grado_proteccion, temp_ambiente_max, 
    peso_motor, altitud_ambiente_max, rodamiento, motor_id_motor) 
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      pot_nom_motor_hp,
      pot_nom_motor_kw,
      tens_nom_operacion_v,
      tens_nom_operacion_amp,
      eficencia,
      vel_nom_motor_rpm,
      tam_carcaza,
      frecuencia,
      factor_potencia,
      factor_servicio,
      tipo_aislamiento,
      grado_proteccion,
      temp_ambiente_max,
      peso_motor,
      altitud_ambiente_max,
      rodamiento,
      motor_id_motor,
    ],
  );

  const result = {
    id: rows.insertId,
    ...det_mot, // Usamos spread operator para devolver todas las propiedades enviadas + el nuevo ID
  };

  return result;
};

//Servicio que elimina los Detalles para un Motor
export const deleteOneDetalleMotorForId_Detalle = async (id_detalle) => {
  const [rows] = await pool.query(
    "DELETE FROM detalle_motor WHERE id_detalle_motor = ?",
    [id_detalle],
  );
  return rows;
};

//Servicio para modificar los Detalles de un Motor
export const modificarDetalleMotor = async (detalle_mot) => {
  const id_detalle = detalle_mot.id_detalle; // Usamos el ID del detalle para el WHERE
  const {
    pot_nom_motor_hp,
    pot_nom_motor_kw,
    tens_nom_operacion_v,
    tens_nom_operacion_amp,
    eficencia,
    vel_nom_motor_rpm,
    tam_carcaza,
    frecuencia,
    factor_potencia,
    factor_servicio,
    tipo_aislamiento,
    grado_proteccion,
    temp_ambiente_max,
    peso_motor,
    altitud_ambiente_max,
    rodamiento,
    motor_id_motor,
  } = detalle_mot;

  const [rows] = await pool.query(
    `UPDATE detalle_motor SET 
      pot_nom_motor_hp = ?, 
      pot_nom_motor_kw = ?, 
      tens_nom_operacion_v = ?, 
      tens_nom_operacion_amp = ?, 
      eficencia = ?, 
      vel_nom_motor_rpm = ?, 
      tam_carcaza = ?, 
      frecuencia = ?, 
      factor_potencia = ?, 
      factor_servicio = ?, 
      tipo_aislamiento = ?, 
      grado_proteccion = ?, 
      temp_ambiente_max = ?, 
      peso_motor = ?, 
      altitud_ambiente_max = ?, 
      rodamiento = ?, 
      motor_id_motor = ? 
    WHERE id_detalle_motor = ?`,
    [
      pot_nom_motor_hp,
      pot_nom_motor_kw,
      tens_nom_operacion_v,
      tens_nom_operacion_amp,
      eficencia,
      vel_nom_motor_rpm,
      tam_carcaza,
      frecuencia,
      factor_potencia,
      factor_servicio,
      tipo_aislamiento,
      grado_proteccion,
      temp_ambiente_max,
      peso_motor,
      altitud_ambiente_max,
      rodamiento,
      motor_id_motor,
      id_detalle,
    ],
  );

  const result = {
    id: id_detalle,
    ...detalle_mot,
  };

  return result;
};
