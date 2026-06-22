// lineasBombeoService.js
import { pool } from "../../database/db.js";

// Servicio que busca si ya existe una Estación de bombeo por su id
export const SearchEstacionId = async (id_bombeo) => {
  const [rows] = await pool.query("SELECT * FROM est_bombeo WHERE id_est = ?", [
    id_bombeo,
  ]);
  return rows.length;
};

// Servicio del super select
export const obtenerArbolOperativoPorEstacion = async (idEstacion) => {
  const query = `
    SELECT 
  l.id_linea_bombeo,
  l.numero_linea,
  l.nombre_linea_bombeo,
  l.estado_linea_bombeo,
  l.observaciones_linea_bombeo,
  l.created_at,
  
  -- 1. FOTOS DE LA LÍNEA DE BOMBEO
  IFNULL((
    SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'id_linea_bombeo_foto', lf.id_linea_bombeo_foto,
        'foto_url', lf.foto_url,
        'foto_public_id', lf.foto_public_id
      )
    )
    FROM linea_bombeo_fotos lf
    WHERE lf.linea_bombeo_id = l.id_linea_bombeo
  ), JSON_ARRAY()) AS fotos_linea,

  -- 2. VÁLVULAS Y SUS FOTOS
  IFNULL((
    SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'id_valvula', v.id_valvula,
        'modelo_valvula', v.modelo_valvula,
        'marca_valvula', v.marca_valvula,
        'tipo_valvula', v.tipo_valvula,
        'pn', v.pn,
        'norma_brida', v.norma_brida,
        'clase_valvula', v.clase_valvula,
        'diametro_tornillo', v.diametro_tornillo,
        'longitud_tornillo', v.longitud_tornillo,
        'grado_tornillo', v.grado_tornillo,
        'tipo_asiento', v.tipo_asiento,
        'tipo_compuerta', v.tipo_compuerta,
        'forma_operacion', v.forma_operacion,
        
        -- Sub-array: Fotos de la válvula
        'fotos_valvula', IFNULL((
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id_valvula_foto', vf.id_valvula_foto,
              'foto_url', vf.foto_url,
              'foto_public_id', vf.foto_public_id
            )
          )
          FROM valvula_fotos vf
          WHERE vf.valvula_id = v.id_valvula
        ), JSON_ARRAY())
      )
    )
    FROM valvula v
    WHERE v.linea_bombeo_id_linea_bombeo = l.id_linea_bombeo
  ), JSON_ARRAY()) AS valvulas,

  -- 3. BOMBAS, SUS DETALLES, SUS FOTOS Y SUS MOTORES
  IFNULL((
    SELECT JSON_ARRAYAGG(
      JSON_OBJECT(
        'id_bomba', b.id_bomba,
        'modelo_bomba', b.modelo_bomba,
        'marca_bomba', b.marca_bomba,
        'tipo_bomba', b.tipo_bomba,
        'q', b.q,
        'num_etapa', b.num_etapa,

        -- Sub-objeto: Detalles de la Bomba (1:1)
        'detalles_bomba', (
          SELECT JSON_OBJECT(
            'id_detalle_bomba', db.id_detalle_bomba,
            'pot_nom_bomba_hp', db.pot_nom_bomba_hp,
            'presion_descarga', db.presion_descarga,
            'alt_elevacion_bomba', db.alt_elevacion_bomba,
            'vel_nom_bomba_rpm', db.vel_nom_bomba_rpm,
            'dimensiones_impulsor', db.dimensiones_impulsor,
            'diametro_succion', db.diametro_succion,
            'diametro_carga', db.diametro_carga,
            'peso_bomba', db.peso_bomba,
            'acomplamiento', db.acomplamiento,
            'tipo_acople', db.tipo_acople,
            'tipo_cabezal', db.tipo_cabezal,
            'diametro_succion_cabezal', db.diametro_succion_cabezal,
            'diametro_descarga_cabezal', db.diametro_descarga_cabezal,
            'lubricacion', db.lubricacion,
            'rodamiento', db.rodamiento
          )
          FROM detalle_bomba db
          WHERE db.bomba_id_bomba = b.id_bomba
          LIMIT 1
        ),

        -- Sub-array: Fotos de la bomba
        'fotos_bomba', IFNULL((
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id_bomba_foto', bf.id_bomba_foto,
              'foto_url', bf.foto_url,
              'foto_public_id', bf.foto_public_id
            )
          )
          FROM bomba_fotos bf
          WHERE bf.bomba_id = b.id_bomba
        ), JSON_ARRAY()),

        -- Sub-array: Motores asociados a la bomba
        'motores', IFNULL((
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id_motor', m.id_motor,
              'codigo_motor', m.codigo_motor,
              'marca_motor', m.marca_motor,
              'tipo_motor', m.tipo_motor,
              'tipo_corriente', m.tipo_corriente,
              'mono_tri', m.mono_tri,
              'asin_sin', m.asin_sin,
              'universal', m.universal,
              'soporte_tec', m.soporte_tec,
              'num_fases', m.num_fases,

              -- Sub-objeto: Detalles del Motor (1:1)
              'detalles_motor', (
                SELECT JSON_OBJECT(
                  'id_detalle_motor', dm.id_detalle_motor,
                  'pot_nom_motor_hp', dm.pot_nom_motor_hp,
                  'pot_nom_motor_kw', dm.pot_nom_motor_kw,
                  'tens_nom_operacion_v', dm.tens_nom_operacion_v,
                  'tens_nom_operacion_amp', dm.tens_nom_operacion_amp,
                  'eficencia', dm.eficencia,
                  'vel_nom_motor_rpm', dm.vel_nom_motor_rpm,
                  'tam_carcaza', dm.tam_carcaza,
                  'frecuencia', dm.frecuencia,
                  'factor_potencia', dm.factor_potencia,
                  'factor_servicio', dm.factor_servicio,
                  'tipo_aislamiento', dm.tipo_aislamiento,
                  'grado_proteccion', dm.grado_proteccion,
                  'temp_ambiente_max', dm.temp_ambiente_max,
                  'peso_motor', dm.peso_motor,
                  'altitud_ambiente_max', dm.altitud_ambiente_max,
                  'rodamiento', dm.rodamiento
                )
                FROM detalle_motor dm
                WHERE dm.motor_id_motor = m.id_motor
                LIMIT 1
              ),

              -- Sub-array: Fotos del motor
              'fotos_motor', IFNULL((
                SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'id_motor_foto', mf.id_motor_foto,
                    'foto_url', mf.foto_url,
                    'foto_public_id', mf.foto_public_id
                  )
                )
                FROM motor_fotos mf
                WHERE mf.motor_id = m.id_motor
              ), JSON_ARRAY())
            )
          )
          FROM motor m
          WHERE m.bomba_id_bomba = b.id_bomba
        ), JSON_ARRAY())
      )
    )
    FROM bomba b
    WHERE b.linea_bombeo_id_linea_bombeo = l.id_linea_bombeo
  ), JSON_ARRAY()) AS bombas

FROM linea_bombeo l
WHERE l.est_bombeo_id_est = ?;
  `;

  const [rows] = await pool.query(query, [idEstacion]);
  return rows;
};
