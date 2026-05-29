import { pool } from "../../database/db.js";

//Servicio que busca si ya existe un CCM por su id
export const SearchCCMId = async (id_ccm) => {
  const [rows] = await pool.query("SELECT * FROM ccm WHERE id_ccm = ?", [
    id_ccm,
  ]);
  return rows.length;
};

//Servicio que devuelve los detalles del Tipo de Circuito del CCM por el id
export const getOneCircuito_CCMForId = async (id_ccm) => {
  const [rows] = await pool.query(
    "SELECT * FROM tipo_circuito_ccm WHERE ccm_id_ccm = ?",
    [id_ccm],
  );
  return rows;
};

//Servicio que devuelve los Tipo de Circuito del CCM por el id_tipo_circuito_ccm
export const getOneCircuito_CCMForId_Detalle = async (id_tipo_circuito_ccm) => {
  const [rows] = await pool.query(
    "SELECT * FROM tipo_circuito_ccm WHERE id_tipo_circuito_ccm = ?",
    [id_tipo_circuito_ccm],
  );
  return rows;
};

//Servicio que busca si el CCM posse Tipo de Circuito
export const SearchCircuito_CCMId = async (id_ccm) => {
  const [rows] = await pool.query(
    "SELECT * FROM tipo_circuito_ccm WHERE ccm_id_ccm = ?",
    [id_ccm],
  );
  return rows.length;
};

//Servicio para registrar un Tipo de Circuito del CCM
export const RegisterCircuito_CCM = async (nuevoCircuitoCCM) => {
  const {
    e_s_cables,
    clase_tension,
    tension_nominal_red,
    tension_mando,
    frecuencia_nominal,
    corriente_nominal,
    corriente_corta_duracion,
    nbi,
    temp_ambiente,
    interruptor_principal,
    elevacion_temp,
    barra_ramales,
    altitud_max,
    voltaje_aislamiento,
    barras_principales,
    cap_corto_circuito,
    barras,
    voltaje_trabajo,
    voltaje_control,
    cap_interrupcion_max,
    ccm_id_ccm,
  } = nuevoCircuitoCCM;

  const [rows] = await pool.query(
    `INSERT INTO tipo_circuito_ccm (
      e_s_cables, clase_tension, tension_nominal_red, tension_mando, frecuencia_nominal, 
      corriente_nominal, corriente_corta_duracion, nbi, temp_ambiente, interruptor_principal, 
      elevacion_temp, barra_ramales, altitud_max, voltaje_aislamiento, barras_principales, 
      cap_corto_circuito, barras, voltaje_trabajo, voltaje_control, cap_interrupcion_max, ccm_id_ccm
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      e_s_cables,
      clase_tension,
      tension_nominal_red,
      tension_mando,
      frecuencia_nominal,
      corriente_nominal,
      corriente_corta_duracion,
      nbi,
      temp_ambiente,
      interruptor_principal,
      elevacion_temp,
      barra_ramales,
      altitud_max,
      voltaje_aislamiento,
      barras_principales,
      cap_corto_circuito,
      barras,
      voltaje_trabajo,
      voltaje_control,
      cap_interrupcion_max,
      ccm_id_ccm,
    ],
  );
  return { id: rows.insertId, ...nuevoCircuitoCCM };
};

//Servicio que elimina un Tipo de Circuito del CCM
export const deleteOneCircuito_CCMForId_Detalle = async (
  id_tipo_circuito_ccm,
) => {
  const [rows] = await pool.query(
    "DELETE FROM tipo_circuito_ccm WHERE id_tipo_circuito_ccm = ?",
    [id_tipo_circuito_ccm],
  );
  return rows;
};

//Servicio para modificar un Tipo de Circuito del CCM
export const modificarCircuito_CCM = async (circuitoCCMAEditar) => {
  const id = circuitoCCMAEditar.id_tipo_circuito_ccm;
  const {
    e_s_cables,
    clase_tension,
    tension_nominal_red,
    tension_mando,
    frecuencia_nominal,
    corriente_nominal,
    corriente_corta_duracion,
    nbi,
    temp_ambiente,
    interruptor_principal,
    elevacion_temp,
    barra_ramales,
    altitud_max,
    voltaje_aislamiento,
    barras_principales,
    cap_corto_circuito,
    barras,
    voltaje_trabajo,
    voltaje_control,
    cap_interrupcion_max,
    ccm_id_ccm,
  } = circuitoCCMAEditar;

  const [rows] = await pool.query(
    `UPDATE tipo_circuito_ccm SET 
      e_s_cables = ?, clase_tension = ?, tension_nominal_red = ?, tension_mando = ?, frecuencia_nominal = ?, 
      corriente_nominal = ?, corriente_corta_duracion = ?, nbi = ?, temp_ambiente = ?, interruptor_principal = ?, 
      elevacion_temp = ?, barra_ramales = ?, altitud_max = ?, voltaje_aislamiento = ?, barras_principales = ?, 
      cap_corto_circuito = ?, barras = ?, voltaje_trabajo = ?, voltaje_control = ?, cap_interrupcion_max = ?, 
      ccm_id_ccm = ? 
    WHERE id_tipo_circuito_ccm = ?`,
    [
      e_s_cables,
      clase_tension,
      tension_nominal_red,
      tension_mando,
      frecuencia_nominal,
      corriente_nominal,
      corriente_corta_duracion,
      nbi,
      temp_ambiente,
      interruptor_principal,
      elevacion_temp,
      barra_ramales,
      altitud_max,
      voltaje_aislamiento,
      barras_principales,
      cap_corto_circuito,
      barras,
      voltaje_trabajo,
      voltaje_control,
      cap_interrupcion_max,
      ccm_id_ccm,
      id,
    ],
  );
  return { id, ...circuitoCCMAEditar };
};
