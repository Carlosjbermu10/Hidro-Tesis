import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query(
    "SELECT 1 FROM est_bombeo WHERE id_est = ? LIMIT 1",
    [id_bombeo],
  );
  return rows.length;
};

//Servicio que devuelve todas los Tanques
export const getAllTanque = async () => {
  const [rows] = await pool.query(`SELECT * FROM tanque;`);
  return rows;
};

//Servicio que busca si ya existe un Tanque por su id
export const SearchTanqueId = async (id_tanque) => {
  const [rows] = await pool.query(
    "SELECT 1 FROM tanque WHERE id_tanque = ? LIMIT 1",
    [id_tanque],
  );
  return rows.length;
};

//Servicio que devuelve los datos del Tanque por el id
export const getOneTanqueForId = async (id_tanque) => {
  const [rows] = await pool.query("SELECT * FROM tanque WHERE id_tanque = ?", [
    id_tanque,
  ]);
  return rows;
};

//Servicio que devuelve los datos de los Tanques que pertenecen a la Estacion de Bombeo por su id
export const SearchTanqueIdEstacion = async (id_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM tanque WHERE est_bombeo_id_est = ?",
    [id_bombeo],
  );
  return rows;
};

//Servicio para registrar un Tanque
export const RegisterTanque = async (nuevoTanque) => {
  const {
    volumen,
    geometria,
    posicion,
    largo,
    ancho,
    espesor,
    total_litros,
    cap_max_tanque,
    extintor,
    material_tanque,
    area_cercada,
    tipo_cerramiento,
    est_bombeo_id_est,
  } = nuevoTanque;

  const [rows] = await pool.query(
    `INSERT INTO tanque (
      volumen, geometria, posicion, largo, ancho, espesor, 
      total_litros, cap_max_tanque, extintor, material_tanque, 
      area_cercada, tipo_cerramiento, est_bombeo_id_est
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      volumen,
      geometria,
      posicion,
      largo,
      ancho,
      espesor,
      total_litros,
      cap_max_tanque,
      extintor,
      material_tanque,
      area_cercada,
      tipo_cerramiento,
      est_bombeo_id_est,
    ],
  );

  return { id_tanque: rows.insertId, ...nuevoTanque };
};

//Servicio que elimina un Tanque por el id
export const deleteOneTanqueForId = async (id_tanque) => {
  const [rows] = await pool.query("DELETE FROM tanque WHERE id_tanque = ?", [
    id_tanque,
  ]);
  return rows;
};

//Servicio para modificar un Tanque
export const modificarTanque = async (tanqueAEditar) => {
  const id = tanqueAEditar.id_tanque;
  const {
    volumen,
    geometria,
    posicion,
    largo,
    ancho,
    espesor,
    total_litros,
    cap_max_tanque,
    extintor,
    material_tanque,
    area_cercada,
    tipo_cerramiento,
    est_bombeo_id_est,
  } = tanqueAEditar;

  await pool.query(
    `UPDATE tanque SET 
      volumen = ?, geometria = ?, posicion = ?, largo = ?, ancho = ?, 
      espesor = ?, total_litros = ?, cap_max_tanque = ?, extintor = ?, 
      material_tanque = ?, area_cercada = ?, tipo_cerramiento = ?, est_bombeo_id_est = ? 
    WHERE id_tanque = ?`,
    [
      volumen,
      geometria,
      posicion,
      largo,
      ancho,
      espesor,
      total_litros,
      cap_max_tanque,
      extintor,
      material_tanque,
      area_cercada,
      tipo_cerramiento,
      est_bombeo_id_est,
      id,
    ],
  );

  return { id, ...tanqueAEditar };
};

//Servicio que extrae el tanque con sus fotos de una estacion de bombeo
export const getTanquesTotalForIdEstacion = async (idEstacion) => {
  // 1. Obtener todos los tanques base que pertenecen a esta estación de bombeo
  const [tanques] = await pool.query(
    "SELECT * FROM tanque WHERE est_bombeo_id_est = ?",
    [idEstacion],
  );

  // 2. Iterar sobre cada tanque para anexar sus dependencias (Fotos y Generadores vinculados)
  for (let tanque of tanques) {
    const idTanque = tanque.id_tanque;

    // A. Buscar la Galería de Fotos de este tanque
    const [fotos] = await pool.query(
      "SELECT * FROM tanque_fotos WHERE tanque_id = ?",
      [idTanque],
    );
    tanque.fotos = fotos || [];

    // B. Buscar qué Generadores están siendo alimentados por este tanque (Intersección)
    const queryGeneradores = `
      SELECT 
        g.id_generador, 
        g.potencia_principal,
        thg.tipo_suministro, 
        thg.diametro_tuberia, 
        thg.longitud_linea
      FROM tanque_has_generador thg
      INNER JOIN generador g ON thg.generador_id_generador = g.id_generador
      WHERE thg.tanque_id_tanque = ?
    `;
    const [generadoresVinculados] = await pool.query(queryGeneradores, [
      idTanque,
    ]);
    tanque.generadores_asociados = generadoresVinculados || [];
  }

  // 3. Retornar el objeto consolidado al controlador
  return tanques;
};
