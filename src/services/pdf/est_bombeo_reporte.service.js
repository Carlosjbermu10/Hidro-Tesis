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
