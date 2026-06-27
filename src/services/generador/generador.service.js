import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query(
    "SELECT 1 FROM est_bombeo WHERE id_est = ? LIMIT 1",
    [id_bombeo],
  );
  return rows.length;
};

//Servicio que devuelve todas los Generadores
export const getAllGenerador = async () => {
  const [rows] = await pool.query(`SELECT * FROM generador;`);
  return rows;
};

//Servicio que busca si ya existe un Generador por su id
export const SearchGeneradorId = async (id_generador) => {
  const [rows] = await pool.query(
    "SELECT 1 FROM generador WHERE id_generador = ? LIMIT 1",
    [id_generador],
  );
  return rows.length;
};

//Servicio que devuelve los datos del Generador por el id
export const getOneGeneradorForId = async (id_generador) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador WHERE id_generador = ?",
    [id_generador],
  );
  return rows;
};

//Servicio que devuelve los datos de los Generadores que pertenecen a la Estacion de Bombeo por su id
export const SearchGeneradorIdEstacion = async (id_bombeo) => {
  const [rows] = await pool.query(
    "SELECT * FROM generador WHERE est_bombeo_id_est = ?",
    [id_bombeo],
  );
  return rows;
};

//Servicio para registrar un Generador
export const RegisterGenerador = async (nuevoGenerador) => {
  const {
    potencia_principal,
    revolucion,
    voltaje,
    fase,
    cableado,
    factor_potencia,
    corriente,
    conexion,
    frecuencia,
    rodamiento,
    clase_proteccion,
    clase_aislamiento,
    est_bombeo_id_est,
  } = nuevoGenerador;

  const [rows] = await pool.query(
    `INSERT INTO generador (
      potencia_principal, revolucion, voltaje, fase, cableado, 
      factor_potencia, corriente, conexion, frecuencia, rodamiento, 
      clase_proteccion, clase_aislamiento, est_bombeo_id_est
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      potencia_principal,
      revolucion,
      voltaje,
      fase,
      cableado,
      factor_potencia,
      corriente,
      conexion,
      frecuencia,
      rodamiento,
      clase_proteccion,
      clase_aislamiento,
      est_bombeo_id_est,
    ],
  );

  return { id: rows.insertId, ...nuevoGenerador };
};

//Servicio que elimina un Generador por el id
export const deleteOneGeneradorForId = async (id_generador) => {
  const [rows] = await pool.query(
    "DELETE FROM generador WHERE id_generador = ?",
    [id_generador],
  );
  return rows;
};

//Servicio para modificar un Generador
export const modificarGenerador = async (generadorAEditar) => {
  const id = generadorAEditar.id_generador;
  const {
    potencia_principal,
    revolucion,
    voltaje,
    fase,
    cableado,
    factor_potencia,
    corriente,
    conexion,
    frecuencia,
    rodamiento,
    clase_proteccion,
    clase_aislamiento,
    est_bombeo_id_est,
  } = generadorAEditar;

  const [rows] = await pool.query(
    `UPDATE generador SET 
      potencia_principal = ?, 
      revolucion = ?, 
      voltaje = ?, 
      fase = ?, 
      cableado = ?, 
      factor_potencia = ?, 
      corriente = ?, 
      conexion = ?, 
      frecuencia = ?, 
      rodamiento = ?, 
      clase_proteccion = ?, 
      clase_aislamiento = ?, 
      est_bombeo_id_est = ? 
    WHERE id_generador = ?`,
    [
      potencia_principal,
      revolucion,
      voltaje,
      fase,
      cableado,
      factor_potencia,
      corriente,
      conexion,
      frecuencia,
      rodamiento,
      clase_proteccion,
      clase_aislamiento,
      est_bombeo_id_est,
      id,
    ],
  );

  return { id, ...generadorAEditar };
};

//Servicio que extrae todos los datos de los generadores de una estacion de bombeo
export const getGeneradorTotalForIdEstacionn = async (idEstacion) => {
  // 1. Obtener todos los generadores base pertenecientes a esta estación
  const [generadores] = await pool.query(
    "SELECT * FROM generador WHERE est_bombeo_id_est = ?",
    [idEstacion],
  );

  // 2. Iterar sobre cada generador para anexar sus sub-unidades hijas
  for (let generador of generadores) {
    const idGen = generador.id_generador;

    // A. Combinar datos de Combustible y Lubricante
    const [combustible] = await pool.query(
      "SELECT * FROM generador_combustible_lubricante WHERE generador_id_generador = ?",
      [idGen],
    );
    generador.combustible_lubricante = combustible[0] || null;

    // B. Combinar datos de Dimensiones y Peso
    const [dimension] = await pool.query(
      "SELECT * FROM generador_dimension_peso WHERE generador_id_generador = ?",
      [idGen],
    );
    generador.dimension_peso = dimension[0] || null;

    // C. Combinar datos de Especificaciones del Motor
    const [motor] = await pool.query(
      "SELECT * FROM generador_motor WHERE generador_id_generador = ?",
      [idGen],
    );
    generador.motor = motor[0] || null;

    // D. Combinar la Galería de Fotos
    const [fotos] = await pool.query(
      "SELECT * FROM generador_fotos WHERE generador_id = ?",
      [idGen],
    );
    generador.fotos = fotos || [];

    // E. INTERSECCIÓN: Mapear Tanques que alimentan a este generador específico
    const queryTanques = `
        SELECT 
          t.id_tanque, t.volumen, t.material_tanque, t.posicion,
          thg.tipo_suministro, thg.diametro_tuberia, thg.longitud_linea
        FROM tanque_has_generador thg
        INNER JOIN tanque t ON thg.tanque_id_tanque = t.id_tanque
        WHERE thg.generador_id_generador = ?
      `;
    const [tanques] = await pool.query(queryTanques, [idGen]);
    generador.tanques_asociados = tanques || [];
  }

  // Retorna la colección consolidada al controlador
  return generadores;
};
