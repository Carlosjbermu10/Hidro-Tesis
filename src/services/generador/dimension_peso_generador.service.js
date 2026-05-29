import { pool } from "../../database/db.js";

//Servicio que busca si ya existe un Generador por su id
export const SearchGeneradorId = async (id_generador) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador WHERE id_generador = ?",
    [id_generador],
  );
  return rows.length;
};

//Servicio que devuelve el Dimension_Peso del Generador por el id
export const getOneDimension_Peso_GeneradorForId = async (id_generador) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador_dimension_peso WHERE generador_id_generador = ?",
    [id_generador],
  );
  return rows;
};

//Servicio que devuelve los Dimension_Peso del Generador por el id_generador_dimension_peso
export const getOneDimension_Peso_GeneradorForid_generador_dimension_peso =
  async (id_generador_dimension_peso) => {
    const [rows] = await pool.query(
      "SELECT * FROM generador_dimension_peso WHERE id_generador_dimension_peso = ?",
      [id_generador_dimension_peso],
    );
    return rows;
  };

//Servicio que busca si el Generador posse Dimension_Peso
export const SearchDimension_Peso_GeneradorId = async (id_generador) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador_dimension_peso WHERE generador_id_generador = ?",
    [id_generador],
  );
  return rows.length;
};

//Servicio para registrar un Dimension_Peso del Generador
export const RegisterDimension_Peso_Generador = async (nuevaDimensionPeso) => {
  const {
    largo,
    ancho,
    alto,
    peso,
    cap_deposito_combustible_propio,
    autonomia,
    generador_id_generador,
  } = nuevaDimensionPeso;

  const [rows] = await pool.query(
    `INSERT INTO generador_dimension_peso (
      largo, ancho, alto, peso, cap_deposito_combustible_propio, autonomia, generador_id_generador
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      largo,
      ancho,
      alto,
      peso,
      cap_deposito_combustible_propio,
      autonomia,
      generador_id_generador,
    ],
  );

  return { id: rows.insertId, ...nuevaDimensionPeso };
};

//Servicio que elimina un Dimension_Peso del Generador
export const deleteOneDimension_Peso_GeneradorForid_generador_dimension_peso =
  async (id_generador_dimension_peso) => {
    const [rows] = await pool.query(
      "DELETE FROM generador_dimension_peso WHERE id_generador_dimension_peso = ?",
      [id_generador_dimension_peso],
    );
    return rows;
  };

//Servicio para modificar un Dimension_Peso del Generador
export const modificarDimension_Peso_Generador = async (
  dimensionPesoAEditar,
) => {
  const id = dimensionPesoAEditar.id_generador_dimension_peso;
  const {
    largo,
    ancho,
    alto,
    peso,
    cap_deposito_combustible_propio,
    autonomia,
    generador_id_generador,
  } = dimensionPesoAEditar;

  const [rows] = await pool.query(
    `UPDATE generador_dimension_peso SET 
      largo = ?, 
      ancho = ?, 
      alto = ?, 
      peso = ?, 
      cap_deposito_combustible_propio = ?, 
      autonomia = ?, 
      generador_id_generador = ? 
    WHERE id_generador_dimension_peso = ?`,
    [
      largo,
      ancho,
      alto,
      peso,
      cap_deposito_combustible_propio,
      autonomia,
      generador_id_generador,
      id,
    ],
  );

  return { id, ...dimensionPesoAEditar };
};
