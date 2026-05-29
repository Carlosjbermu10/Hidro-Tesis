import { pool } from "../../database/db.js";

//Servicio que busca si ya existe un Generador por su id
export const SearchGeneradorId = async (id_generador) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador WHERE id_generador = ?",
    [id_generador],
  );
  return rows.length;
};

//Servicio que devuelve el Combustible_Lubricante del Generador por el id
export const getOneCombustible_Lubricante_GeneradorForId = async (
  id_generador,
) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador_combustible_lubricante WHERE generador_id_generador = ?",
    [id_generador],
  );
  return rows;
};

//Servicio que devuelve el Combustible_Lubricante del Generador por el id_generador_combustible_lubricante
export const getOneCombustible_Lubricante_GeneradorForid_generador_combustible_lubricante =
  async (id_generador_combustible_lubricante) => {
    const [rows] = await pool.query(
      "SELECT * FROM generador_combustible_lubricante WHERE id_generador_combustible_lubricante = ?",
      [id_generador_combustible_lubricante],
    );
    return rows;
  };

//Servicio que busca si el Generador posse Combustible_Lubricante
export const SearchCombustible_Lubricante_GeneradorId = async (
  id_generador,
) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador_combustible_lubricante WHERE generador_id_generador = ?",
    [id_generador],
  );
  return rows.length;
};

//Servicio para registrar un Combustible_Lubricante del Generador
export const RegisterCombustible_Lubricante_Generador = async (
  nuevosFluidosGenerador,
) => {
  const {
    consumo_combustible,
    cap_aceite_lubricante,
    consumo_lubricante,
    tipo_lubricante,
    generador_id_generador,
  } = nuevosFluidosGenerador;

  const [rows] = await pool.query(
    `INSERT INTO generador_combustible_lubricante (
      consumo_combustible, cap_aceite_lubricante, consumo_lubricante, 
      tipo_lubricante, generador_id_generador
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      consumo_combustible,
      cap_aceite_lubricante,
      consumo_lubricante,
      tipo_lubricante,
      generador_id_generador,
    ],
  );

  return { id: rows.insertId, ...nuevosFluidosGenerador };
};

//Servicio que elimina un Combustible_Lubricante del Generador
export const deleteOneCombustible_Lubricante_GeneradorForid_generador_combustible_lubricante =
  async (id_generador_combustible_lubricante) => {
    const [rows] = await pool.query(
      "DELETE FROM generador_combustible_lubricante WHERE id_generador_combustible_lubricante = ?",
      [id_generador_combustible_lubricante],
    );
    return rows;
  };

//Servicio para modificar un Lubricante_Generador del Generador
export const modificarCombustible_Lubricante_Generador = async (
  fluidosGeneradorAEditar,
) => {
  const id = fluidosGeneradorAEditar.id_generador_combustible_lubricante;
  const {
    consumo_combustible,
    cap_aceite_lubricante,
    consumo_lubricante,
    tipo_lubricante,
    generador_id_generador,
  } = fluidosGeneradorAEditar;

  const [rows] = await pool.query(
    `UPDATE generador_combustible_lubricante SET 
      consumo_combustible = ?, 
      cap_aceite_lubricante = ?, 
      consumo_lubricante = ?, 
      tipo_lubricante = ?, 
      generador_id_generador = ? 
    WHERE id_generador_combustible_lubricante = ?`,
    [
      consumo_combustible,
      cap_aceite_lubricante,
      consumo_lubricante,
      tipo_lubricante,
      generador_id_generador,
      id,
    ],
  );

  return { id, ...fluidosGeneradorAEditar };
};
