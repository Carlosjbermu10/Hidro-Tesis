import { pool } from "../../database/db.js";

//Servicio que busca si ya existe un CCM por su id
export const SearchCCMId = async (id_ccm) => {
  const [rows] = await pool.query("SELECT * FROM ccm WHERE id_ccm = ?", [
    id_ccm,
  ]);
  return rows.length;
};

//Servicio que devuelve los Juegos de Contactos del CCM por el id
export const getOneJuegos_Contactos_CCMForId = async (id_ccm) => {
  const [rows] = await pool.query(
    "SELECT * FROM juegos_contactos_ccm WHERE ccm_id_ccm = ?",
    [id_ccm],
  );
  return rows;
};

//Servicio que devuelve los Juegos de Contactos del CCM por el id_juegos_contactos_ccm
export const getOneJuegos_Contactos_CCMForid_juegos_contactos_ccm = async (
  id_juegos_contactos_ccm,
) => {
  const [rows] = await pool.query(
    "SELECT * FROM juegos_contactos_ccm WHERE id_juegos_contactos_ccm = ?",
    [id_juegos_contactos_ccm],
  );
  return rows;
};

//Servicio que busca si el CCM posse Juegos de Contactos
export const SearchJuegos_Contactos_CCMId = async (id_ccm) => {
  const [rows] = await pool.query(
    "SELECT * FROM juegos_contactos_ccm WHERE ccm_id_ccm = ?",
    [id_ccm],
  );
  return rows.length;
};

//Servicio para registrar un Juegos de Contactos del CCM
export const RegisterJuegos_Contactos_CCM = async (nuevoJuegoContacto) => {
  const { bipolar, tripolar, tetrapolar, pentapolar, ccm_id_ccm } =
    nuevoJuegoContacto;

  const [rows] = await pool.query(
    `INSERT INTO juegos_contactos_ccm (
      bipolar, tripolar, tetrapolar, pentapolar, ccm_id_ccm
    ) VALUES (?, ?, ?, ?, ?)`,
    [bipolar, tripolar, tetrapolar, pentapolar, ccm_id_ccm],
  );

  return { id: rows.insertId, ...nuevoJuegoContacto };
};

//Servicio que elimina un Juegos de Contactos del CCM
export const deleteOneJuegos_Contactos_CCMForid_juegos_contactos_ccm = async (
  id_juegos_contactos_ccm,
) => {
  const [rows] = await pool.query(
    "DELETE FROM juegos_contactos_ccm WHERE id_juegos_contactos_ccm = ?",
    [id_juegos_contactos_ccm],
  );
  return rows;
};

//Servicio para modificar un Juegos de Contactos del CCM
export const modificarJuegos_Contactos_CCM = async (juegoContactoAEditar) => {
  const id = juegoContactoAEditar.id_juegos_contactos_ccm;
  const { bipolar, tripolar, tetrapolar, pentapolar, ccm_id_ccm } =
    juegoContactoAEditar;

  const [rows] = await pool.query(
    `UPDATE juegos_contactos_ccm SET 
      bipolar = ?, 
      tripolar = ?, 
      tetrapolar = ?, 
      pentapolar = ?, 
      ccm_id_ccm = ? 
    WHERE id_juegos_contactos_ccm = ?`,
    [bipolar, tripolar, tetrapolar, pentapolar, ccm_id_ccm, id],
  );

  return { id, ...juegoContactoAEditar };
};
