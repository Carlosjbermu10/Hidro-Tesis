import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE id_est = ?", [
    id_bombeo,
  ]);
  return rows.length;
};

//Servicio que devuelve todas los CCM
export const getAllCCM = async () => {
  const [rows] = await pool.query(`SELECT * FROM ccm;`);
  return rows;
};

//Servicio que busca si ya existe un CCM por su id
export const SearchCCMId = async (id_ccm) => {
  const [rows] = await pool.query("SELECT * FROM ccm WHERE id_ccm = ?", [
    id_ccm,
  ]);
  return rows.length;
};

//Servicio que devuelve los datos del CCM por el id
export const getOneCCMForId = async (id_ccm) => {
  const [rows] = await pool.query("SELECT * FROM ccm WHERE id_ccm = ?", [
    id_ccm,
  ]);
  return rows;
};

//Servicio que devuelve los datos de los CCM que pertenecen a Estacion de Bombeo por su id
export const SearchCCMIdEstacion = async (id_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM ccm WHERE est_bombeo_id_est = ?",
    [id_bombeo],
  );
  return rows;
};

//Servicio para registrar un CCM
export const RegisterCCM = async (nuevoCCM) => {
  const {
    tipo_ccm,
    arran_estado_solido,
    varia_veloc,
    medidor,
    plc,
    rele_contro,
    supre_pico,
    transf_distri,
    prot_falla_tierra,
    est_bombeo_id_est,
  } = nuevoCCM;

  const [rows] = await pool.query(
    `INSERT INTO ccm (
      tipo_ccm,  arran_estado_solido, varia_veloc, medidor, 
      plc, rele_contro, supre_pico, transf_distri, prot_falla_tierra, est_bombeo_id_est
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      tipo_ccm,
      arran_estado_solido,
      varia_veloc,
      medidor,
      plc,
      rele_contro,
      supre_pico,
      transf_distri,
      prot_falla_tierra,
      est_bombeo_id_est,
    ],
  );

  return { id: rows.insertId, ...nuevoCCM };
};

//Servicio que elimina un CCM por el id
export const deleteOneCCMForId = async (id_ccm) => {
  const [rows] = await pool.query("DELETE FROM ccm WHERE id_ccm = ?", [id_ccm]);
  return rows;
};

//Servicio para modificar un CCM
export const modificarCCM = async (ccmAEditar) => {
  const id_ccm = ccmAEditar.id_ccm;
  const {
    tipo_ccm,
    arran_estado_solido,
    varia_veloc,
    medidor,
    plc,
    rele_contro,
    supre_pico,
    transf_distri,
    prot_falla_tierra,
    est_bombeo_id_est,
  } = ccmAEditar;

  const [rows] = await pool.query(
    `UPDATE ccm SET 
      tipo_ccm = ?, 
      arran_estado_solido = ?, 
      varia_veloc = ?, 
      medidor = ?, 
      plc = ?, 
      rele_contro = ?, 
      supre_pico = ?, 
      transf_distri = ?, 
      prot_falla_tierra = ?, 
      est_bombeo_id_est = ? 
    WHERE id_ccm = ?`,
    [
      tipo_ccm,
      arran_estado_solido,
      varia_veloc,
      medidor,
      plc,
      rele_contro,
      supre_pico,
      transf_distri,
      prot_falla_tierra,
      est_bombeo_id_est,
      id_ccm,
    ],
  );

  return { id: id_ccm, ...ccmAEditar };
};
