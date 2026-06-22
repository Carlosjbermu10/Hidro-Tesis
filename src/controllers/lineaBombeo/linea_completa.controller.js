// lineasBombeoController.js
import {
  SearchEstacionId, // Servicio que busca si ya existe una Estación de bombeo por su id
  obtenerArbolOperativoPorEstacion, // Servicio del super select
} from "../../services/lineaBombeo/linea_completa.service.js";

export const getArbolOperativo = async (req, res) => {
  try {
    const { id_est } = req.params; // Extraemos el ID de la ruta

    // Validamos que el ID venga en la petición
    if (!id_est) {
      return res.status(400).json({
        status: "error",
        message: "El ID de la estación es requerido.",
      });
    }

    // 🔴 CORRECCIÓN: Se usa id_est (el parámetro que llegó en la ruta)
    // en lugar de la variable indefinida id_bombeo
    const search_es = await SearchEstacionId(id_est);

    if (search_es === 0) {
      return res.status(404).json({
        // Cambiado a .json por uniformidad
        status: "mal",
        description: "Estación de bombeo no registrada",
      });
    }

    // 🔴 CORRECCIÓN: Como se importó la función directamente,
    // se llama directo 'obtenerArbolOperativoPorEstacion(id_est)'
    // y no como un objeto .obtenerArbolOperativoPorEstacion
    const resultado = await obtenerArbolOperativoPorEstacion(id_est);

    // ⚠️ BLINDAJE DE PARSEO (Solo si tu driver de BD devuelve los JSON como texto)
    const datosParseados = resultado.map((linea) => {
      return {
        ...linea,
        fotos_linea:
          typeof linea.fotos_linea === "string"
            ? JSON.parse(linea.fotos_linea)
            : linea.fotos_linea,
        valvulas:
          typeof linea.valvulas === "string"
            ? JSON.parse(linea.valvulas)
            : linea.valvulas,
        bombas:
          typeof linea.bombas === "string"
            ? JSON.parse(linea.bombas)
            : linea.bombas,
      };
    });

    // Respondemos con el formato estándar exitoso de tu app
    return res.status(200).json({
      status: "ok",
      data: datosParseados,
    });
  } catch (error) {
    console.error("Error en getArbolOperativo:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al procesar el árbol operativo.",
    });
  }
};
