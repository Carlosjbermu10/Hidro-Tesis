import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query(
    "SELECT 1 FROM est_bombeo WHERE id_est = ? LIMIT 1",
    [id_bombeo],
  );
  return rows.length;
};

//Servicio que verifica si ya existe esta conexión exacta
export const getOneTanqueGenerador = async (id_tanque, id_generador) => {
  const [rows] = await pool.query(
    "SELECT * FROM tanque_has_generador WHERE tanque_id_tanque = ? AND generador_id_generador = ?",
    [id_tanque, id_generador],
  );
  return rows;
};

//Servicio para Obtener a qué estación pertenece un tanque
export const getEstacionDelTanque = async (id_tanque) => {
  const [rows] = await pool.query(
    "SELECT est_bombeo_id_est FROM tanque WHERE id_tanque = ?",
    [id_tanque],
  );
  return rows;
};

//Servicio para Obtener a qué estación pertenece un generador
export const getEstacionDelGenerador = async (id_generador) => {
  const [rows] = await pool.query(
    "SELECT est_bombeo_id_est FROM generador WHERE id_generador = ?",
    [id_generador],
  );
  return rows;
};

//Servicio que devuelve todos los suministros (vínculos tanque-generador) de una estación específica
export const getSuministrosDetalladosPorEstacion = async (id_bombeo) => {
  const [rows] = await pool.query(
    `SELECT 
      sg.tanque_id_tanque,
      t.material_tanque,
      t.volumen AS capacidad_tanque,
      sg.generador_id_generador,
      gm.marca AS marca_generador,
      gm.modelo AS modelo_generador,
      sg.tipo_suministro,
      sg.diametro_tuberia,
      sg.longitud_linea
     FROM tanque_has_generador sg
     INNER JOIN tanque t ON sg.tanque_id_tanque = t.id_tanque
     INNER JOIN generador_motor gm ON sg.generador_id_generador = gm.generador_id_generador
     INNER JOIN generador g ON gm.generador_id_generador = g.id_generador
     WHERE t.est_bombeo_id_est = ? AND g.est_bombeo_id_est = ?`,
    [id_bombeo, id_bombeo],
  );
  return rows;
};

//Servicio para registrar un Motor del Generador
export const RegisterTanque_Generador = async (nuevaConexion) => {
  const {
    tanque_id_tanque,
    generador_id_generador,
    tipo_suministro,
    diametro_tuberia,
    longitud_linea,
  } = nuevaConexion;

  const [rows] = await pool.query(
    `INSERT INTO tanque_has_generador (
      tanque_id_tanque, generador_id_generador, tipo_suministro, diametro_tuberia, longitud_linea
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      tanque_id_tanque,
      generador_id_generador,
      tipo_suministro,
      diametro_tuberia,
      longitud_linea,
    ],
  );

  return nuevaConexion;
};

//Servicio que Elimina la conexion entre un Tanque y un Generador con esos id
export const deleteOneTanque_GeneradorForids = async (
  id_tanque,
  id_generador,
) => {
  const [rows] = await pool.query(
    "DELETE FROM tanque_has_generador WHERE tanque_id_tanque = ? AND generador_id_generador = ?",
    [id_tanque, id_generador],
  );
  return rows;
};

//Servicio para modificar la conexion entre un Tanque y un Generador
export const modificarTanque_Generador = async (conexionAEditar) => {
  const {
    tanque_id_tanque,
    generador_id_generador,
    tipo_suministro,
    diametro_tuberia,
    longitud_linea,
  } = conexionAEditar;

  const [rows] = await pool.query(
    `UPDATE tanque_has_generador SET 
      tipo_suministro = ?, diametro_tuberia = ?, longitud_linea = ? 
    WHERE tanque_id_tanque = ? AND generador_id_generador = ?`,
    [
      tipo_suministro,
      diametro_tuberia,
      longitud_linea,
      tanque_id_tanque,
      generador_id_generador,
    ],
  );

  return conexionAEditar;
};
