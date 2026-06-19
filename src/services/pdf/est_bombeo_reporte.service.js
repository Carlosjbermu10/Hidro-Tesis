import { pool } from "../../database/db.js";

//Servicio que extrae todas las Estaciones de Bombeo y sus Detalles en orden Ascendente
export const GetAllEstacionesWithDetailsForReport = async () => {
  const query = `
    SELECT 
      e.id_est,
      e.codigo,
      e.nombre_sistema,
      e.nombre_est,
      e.tipo_est,
      e.tipo_succion,
      d.ubicacion,
      d.municipio,
      d.coordenada_norte,
      d.coordenada_este,
      d.coordenada_gps,
      d.cota,
      d.caudal_diseño,
      d.poblacion_bene,
      d.caudal_diseño_entrada,
      d.caudal_diseño_salida,
      d.caudal_operacion,
      d.consumo,
      d.aduccion,
      d.sistema_bombeo,
      d.linea_bombeo,
      d.grupo_bombeo
    FROM est_bombeo e
    LEFT JOIN detalle_est_bombeo d ON e.id_est = d.est_bombeo_id_est
    ORDER BY e.id_est ASC 
  `;

  const [rows] = await pool.query(query);
  return rows;
};

/**
 * Obtiene todos los datos técnicos estructurados de una estación de bombeo específica
 * @param {number} idEstacion - ID de la estación de bombeo (id_est)
 * @returns {Promise<Object|null>} Dossier técnico consolidado o null si no existe
 */
export const obtenerDossierPorId = async (idEstacion) => {
  try {
    // 1. Verificar existencia de la estación base y obtener su detalle directo
    const sqlEstacion = `
            SELECT eb.*, deb.* FROM est_bombeo eb
            LEFT JOIN detalle_est_bombeo deb ON eb.id_est = deb.est_bombeo_id_est
            WHERE eb.id_est = ?
        `;

    const [estacionRows] = await pool.execute(sqlEstacion, [idEstacion]);

    // Si la estación no existe en la BD, retornamos null de inmediato
    if (estacionRows.length === 0) {
      return null;
    }

    const infoEstacion = estacionRows[0];

    // 2. Ejecutar todas las consultas de las entidades satélites en paralelo
    const [
      [lineasBombeo],
      [motores],
      [bombas],
      [valvulas],
      [transformadores],
      [ccmData],
      [generadores],
      [interconexiones],
    ] = await Promise.all([
      //Líneas de Bombeo asociadas a la estación
      pool.execute(
        `
                SELECT * FROM linea_bombeo 
                WHERE est_bombeo_id_est = ?
            `,
        [idEstacion],
      ),

      // Consulta A: Motores -> enlazados a Bomba -> enlazada a Línea -> filtrados por Estación
      pool.execute(
        `
                SELECT lb.numero_linea, m.*, dm.* FROM motor m 
                LEFT JOIN detalle_motor dm ON m.id_motor = dm.motor_id_motor 
                INNER JOIN bomba b ON m.bomba_id_bomba = b.id_bomba
                INNER JOIN linea_bombeo lb ON b.linea_bombeo_id_linea_bombeo = lb.id_linea_bombeo
                WHERE lb.est_bombeo_id_est = ?
                ORDER BY lb.numero_linea ASC
            `,
        [idEstacion],
      ),

      // Consulta B: Bombas -> enlazadas a Línea -> filtradas por Estación
      pool.execute(
        `
                SELECT lb.numero_linea, b.*, pool_det.* FROM bomba b 
                LEFT JOIN detalle_bomba pool_det ON b.id_bomba = pool_det.bomba_id_bomba 
                INNER JOIN linea_bombeo lb ON b.linea_bombeo_id_linea_bombeo = lb.id_linea_bombeo
                WHERE lb.est_bombeo_id_est = ?
                ORDER BY lb.numero_linea ASC
            `,
        [idEstacion],
      ),

      // Consulta C: Válvulas -> enlazadas a Línea -> filtradas por Estación
      pool.execute(
        `
                SELECT lb.numero_linea, v.* FROM valvula v 
                INNER JOIN linea_bombeo lb ON v.linea_bombeo_id_linea_bombeo = lb.id_linea_bombeo
                WHERE lb.est_bombeo_id_est = ?
                ORDER BY lb.numero_linea ASC
            `,
        [idEstacion],
      ),

      // Consulta D: Banco de Transformadores eléctricos
      pool.execute(
        `
                SELECT * FROM banco_transformadores 
                WHERE est_bombeo_id_est = ?
            `,
        [idEstacion],
      ),

      // Consulta E: Centro de Control de Motores (CCM)
      pool.execute(
        `
                SELECT c.*, jc.*, ta.*, tc.*
                FROM ccm c
                LEFT JOIN juegos_contactos_ccm jc ON c.id_ccm = jc.ccm_id_ccm
                LEFT JOIN tipo_arrancadores_ccm ta ON c.id_ccm = ta.ccm_id_ccm
                LEFT JOIN tipo_circuito_ccm tc ON c.id_ccm = tc.ccm_id_ccm
                WHERE c.est_bombeo_id_est = ?
            `,
        [idEstacion],
      ),

      // Consulta F: Generadores eléctricos
      pool.execute(
        `
                SELECT g.*, gcl.*, gdp.*, gm.*
                FROM generador g
                LEFT JOIN generador_combustible_lubricante gcl ON g.id_generador = gcl.generador_id_generador
                LEFT JOIN generador_dimension_peso gdp ON g.id_generador = gdp.generador_id_generador
                LEFT JOIN generador_motor gm ON g.id_generador = gm.generador_id_generador
                WHERE g.est_bombeo_id_est = ?
            `,
        [idEstacion],
      ),

      // Consulta G: Interconexión muchos a muchos entre Tanques y Generadores
      pool.execute(
        `
                SELECT t.*, thg.generador_id_generador, thg.tipo_suministro, thg.diametro_tuberia, thg.longitud_linea 
                FROM tanque t
                LEFT JOIN tanque_has_generador thg ON t.id_tanque = thg.tanque_id_tanque
                WHERE t.est_bombeo_id_est = ?
            `,
        [idEstacion],
      ),
    ]);

    // 3. Consolidar el Dossier Técnico Estructurado
    return {
      estacion: infoEstacion,
      lineas_bombeo: lineasBombeo,
      motores: motores,
      bombas: bombas,
      valvulas: valvulas,
      transformadores: transformadores,
      ccm: ccmData,
      generadores: generadores,
      interconexiones: interconexiones,
    };
  } catch (error) {
    console.error(
      `Error crítico en estacionesReporteService [ID: ${idEstacion}]:`,
      error,
    );
    throw error; // Delegamos el manejo del error al controlador
  }
};
