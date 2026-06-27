import { pool } from "../../database/db.js";

//Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE id_est = ?", [
    id_bombeo,
  ]);
  return rows.length;
};

//Servicio que devuelve todas los Bancos de Transformadores
export const getAllBancosTransformadores = async () => {
  const [rows] = await pool.query(
    `SELECT * FROM bd_beta.banco_transformadores;`,
  );
  return rows;
};

//Servicio que busca si ya existe un Banco de Transformadores por su id
export const SearchBancoTransformadoresId = async (
  id_banco_transformadores,
) => {
  const [rows] = await pool.query(
    "SELECT * FROM banco_transformadores WHERE id_banco_transformadores = ?",
    [id_banco_transformadores],
  );
  return rows.length;
};

//Servicio que devuelve los datos de un Banco de Transformadores por el id
export const getOneBancoTransformadoresForId = async (
  id_banco_transformadores,
) => {
  const [rows] = await pool.query(
    "SELECT * FROM banco_transformadores WHERE id_banco_transformadores = ?",
    [id_banco_transformadores],
  );
  return rows;
};

// Servicio que devuelve los datos de los Bancos de Transformadores con sus respectivas fotos agrupadas
export const SearchBancoTransformadoresIdEstacion = async (id_bombeo) => {
  const [rows] = await pool.query(
    `SELECT 
      bt.*,
      f.id_banco_transformadores_foto,
      f.foto_url,
      f.foto_public_id
     FROM banco_transformadores bt
     LEFT JOIN banco_transformadores_fotos f 
       ON bt.id_banco_transformadores = f.banco_transformadores_id
     WHERE bt.est_bombeo_id_est = ?`,
    [id_bombeo],
  );

  // Mapeador inteligente para agrupar las imágenes en un array interno
  const transformadoresMap = {};

  rows.forEach((row) => {
    const idTransformador = row.id_banco_transformadores;

    // Si el banco de transformadores no ha sido registrado en el mapa, lo creamos
    if (!transformadoresMap[idTransformador]) {
      transformadoresMap[idTransformador] = {
        ...row,
        fotos_transformador: [], // Arreglo donde se acumularán sus fotos
      };

      // Limpiamos las propiedades planas del JOIN para que el objeto quede impecable
      delete transformadoresMap[idTransformador].id_banco_transformadores_foto;
      delete transformadoresMap[idTransformador].foto_url;
      delete transformadoresMap[idTransformador].foto_public_id;
    }

    // Si la fila actual contiene una fotografía válida, la acoplamos al arreglo
    if (row.id_banco_transformadores_foto) {
      transformadoresMap[idTransformador].fotos_transformador.push({
        id_banco_transformadores_foto: row.id_banco_transformadores_foto,
        foto_url: row.foto_url,
        foto_public_id: row.foto_public_id,
      });
    }
  });

  // Retornamos los transformadores como una lista limpia de objetos estructurados
  return Object.values(transformadoresMap);
};

//Servicio para registrar un Banco de Transformadores
export const RegisterBancoTransformadores = async (nuevoTransformador) => {
  const {
    tipo,
    norma,
    potencia_nominal,
    año,
    nivel_aislamiento,
    num_fases,
    frecuencia,
    clase_aislamiento,
    tension_primaria,
    tension_secundaria,
    conexion,
    corriente_primaria,
    refrigeracion,
    tension_c_c,
    peso_act,
    tipo_aceite,
    temp_ambiente,
    peso_total,
    vol_aceite_total,
    impedancia_voltios,
    calentamiento,
    marca,
    lugar_fabricado,
    est_bombeo_id_est,
  } = nuevoTransformador;

  const [rows] = await pool.query(
    `INSERT INTO banco_transformadores (
      tipo, norma, potencia_nominal, año, nivel_aislamiento, 
      num_fases, frecuencia, clase_aislamiento, tension_primaria, tension_secundaria, 
      conexion, corriente_primaria, refrigeracion, tension_c_c, peso_act, 
      tipo_aceite, temp_ambiente, peso_total, vol_aceite_total, impedancia_voltios, 
      calentamiento, marca, lugar_fabricado, est_bombeo_id_est
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      tipo,
      norma,
      potencia_nominal,
      año,
      nivel_aislamiento,
      num_fases,
      frecuencia,
      clase_aislamiento,
      tension_primaria,
      tension_secundaria,
      conexion,
      corriente_primaria,
      refrigeracion,
      tension_c_c,
      peso_act,
      tipo_aceite,
      temp_ambiente,
      peso_total,
      vol_aceite_total,
      impedancia_voltios,
      calentamiento,
      marca,
      lugar_fabricado,
      est_bombeo_id_est,
    ],
  );

  return { id: rows.insertId, ...nuevoTransformador };
};

//Servicio que elimina un Banco de Transformadores por el id
export const deleteOneBancoTransformadoresForId = async (
  id_banco_transformadores,
) => {
  const [rows] = await pool.query(
    "DELETE FROM banco_transformadores WHERE id_banco_transformadores = ?",
    [id_banco_transformadores],
  );
  return rows;
};

//Servicio para modificar un Banco de Transformadores
export const modificarBancoTransformadores = async (transformador) => {
  const id_banco_transformadores = transformador.id_banco_transformadores;
  const {
    tipo,
    norma,
    potencia_nominal,
    año,
    nivel_aislamiento,
    num_fases,
    frecuencia,
    clase_aislamiento,
    tension_primaria,
    tension_secundaria,
    conexion,
    corriente_primaria,
    refrigeracion,
    tension_c_c,
    peso_act,
    tipo_aceite,
    temp_ambiente,
    peso_total,
    vol_aceite_total,
    impedancia_voltios,
    calentamiento,
    marca,
    lugar_fabricado,
    est_bombeo_id_est,
  } = transformador;

  const [rows] = await pool.query(
    `UPDATE banco_transformadores SET 
      tipo = ?, norma = ?, potencia_nominal = ?, año = ?, nivel_aislamiento = ?, 
      num_fases = ?, frecuencia = ?, clase_aislamiento = ?, tension_primaria = ?, tension_secundaria = ?, 
      conexion = ?, corriente_primaria = ?, refrigeracion = ?, tension_c_c = ?, peso_act = ?, 
      tipo_aceite = ?, temp_ambiente = ?, peso_total = ?, vol_aceite_total = ?, impedancia_voltios = ?, 
      calentamiento = ?, marca = ?, lugar_fabricado = ?, est_bombeo_id_est = ? 
    WHERE id_banco_transformadores = ?`,
    [
      tipo,
      norma,
      potencia_nominal,
      año,
      nivel_aislamiento,
      num_fases,
      frecuencia,
      clase_aislamiento,
      tension_primaria,
      tension_secundaria,
      conexion,
      corriente_primaria,
      refrigeracion,
      tension_c_c,
      peso_act,
      tipo_aceite,
      temp_ambiente,
      peso_total,
      vol_aceite_total,
      impedancia_voltios,
      calentamiento,
      marca,
      lugar_fabricado,
      est_bombeo_id_est,
      id_banco_transformadores,
    ],
  );

  return { id: id_banco_transformadores, ...transformador };
};
