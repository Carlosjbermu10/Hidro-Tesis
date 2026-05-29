import { pool } from "../../database/db.js";

//Servicio que busca si ya existe un CCM por su id
export const SearchCCMId = async (id_ccm) => {
  const [rows] = await pool.query("SELECT * FROM ccm WHERE id_ccm = ?", [
    id_ccm,
  ]);
  return rows.length;
};

//Servicio que devuelve los detalles del Tipo de Arrancadores del CCM por el id
export const getOneArrancadores_CCMForId = async (id_ccm) => {
  const [rows] = await pool.query(
    "SELECT * FROM tipo_arrancadores_ccm WHERE ccm_id_ccm = ?",
    [id_ccm],
  );
  return rows;
};

//Servicio que devuelve el Tipo de Arrancadores del CCM por el id_tipo_arrancadores_ccm
export const getOneArrancadores_CCMForId_Detalle = async (
  id_tipo_arrancadores_ccm,
) => {
  const [rows] = await pool.query(
    "SELECT * FROM tipo_arrancadores_ccm WHERE id_tipo_arrancadores_ccm = ?",
    [id_tipo_arrancadores_ccm],
  );
  return rows;
};

//Servicio que busca si el CCM posse Tipo de Arrancadores
export const SearchArrancadores_CCMId = async (id_ccm) => {
  const [rows] = await pool.query(
    "SELECT * FROM tipo_arrancadores_ccm WHERE ccm_id_ccm = ?",
    [id_ccm],
  );
  return rows.length;
};

//Servicio para registrar un Tipo de Arrancadores del CCM
export const RegisterArrancadores_CCM = async (nuevoTipoArrancador) => {
  const {
    c_e_s,
    c_a_estrella_triangulo,
    c_a_directo,
    c_a_con_reversion,
    c_a_sin_reversion,
    c_a_compen_transformador,
    c_a_arrancador_suave,
    c_convertidor_frecuencia,
    bobinas_magneticas,
    fusible,
    interruptor,
    interruptor_limitador_corriente,
    ccm_id_ccm,
  } = nuevoTipoArrancador;

  const [rows] = await pool.query(
    `INSERT INTO tipo_arrancadores_ccm (
      c_e_s, c_a_estrella_triangulo, c_a_directo, c_a_con_reversion, c_a_sin_reversion, 
      c_a_compen_transformador, c_a_arrancador_suave, c_convertidor_frecuencia, bobinas_magneticas, 
      fusible, interruptor, interruptor_limitador_corriente, ccm_id_ccm
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      c_e_s,
      c_a_estrella_triangulo,
      c_a_directo,
      c_a_con_reversion,
      c_a_sin_reversion,
      c_a_compen_transformador,
      c_a_arrancador_suave,
      c_convertidor_frecuencia,
      bobinas_magneticas,
      fusible,
      interruptor,
      interruptor_limitador_corriente,
      ccm_id_ccm,
    ],
  );
  return { id: rows.insertId, ...nuevoTipoArrancador };
};

//Servicio que elimina un Tipo de Arrancadores del CCM
export const deleteOneArrancadores_CCMForId_Detalle = async (
  id_tipo_arrancadores_ccm,
) => {
  const [rows] = await pool.query(
    "DELETE FROM tipo_arrancadores_ccm WHERE id_tipo_arrancadores_ccm = ?",
    [id_tipo_arrancadores_ccm],
  );
  return rows;
};

//Servicio para modificar un Tipo de Arrancadores del CCM
export const modificarArrancadores_CCM = async (tipoArrancadorAEditar) => {
  const id = tipoArrancadorAEditar.id_tipo_arrancadores_ccm;
  const {
    c_e_s,
    c_a_estrella_triangulo,
    c_a_directo,
    c_a_con_reversion,
    c_a_sin_reversion,
    c_a_compen_transformador,
    c_a_arrancador_suave,
    c_convertidor_frecuencia,
    bobinas_magneticas,
    fusible,
    interruptor,
    interruptor_limitador_corriente,
    ccm_id_ccm,
  } = tipoArrancadorAEditar;

  const [rows] = await pool.query(
    `UPDATE tipo_arrancadores_ccm SET 
      c_e_s = ?, c_a_estrella_triangulo = ?, c_a_directo = ?, c_a_con_reversion = ?, c_a_sin_reversion = ?, 
      c_a_compen_transformador = ?, c_a_arrancador_suave = ?, c_convertidor_frecuencia = ?, bobinas_magneticas = ?, 
      fusible = ?, interruptor = ?, interruptor_limitador_corriente = ?, ccm_id_ccm = ? 
    WHERE id_tipo_arrancadores_ccm = ?`,
    [
      c_e_s,
      c_a_estrella_triangulo,
      c_a_directo,
      c_a_con_reversion,
      c_a_sin_reversion,
      c_a_compen_transformador,
      c_a_arrancador_suave,
      c_convertidor_frecuencia,
      bobinas_magneticas,
      fusible,
      interruptor,
      interruptor_limitador_corriente,
      ccm_id_ccm,
      id,
    ],
  );
  return { id, ...tipoArrancadorAEditar };
};
