import { ObtenerBitacora } from "../../services/bitacora/bitacora.service.js";

export const getBitacora = async (req, res) => {
  try {
    const registros = await ObtenerBitacora();

    return res.status(200).send({
      status: "ok",
      description: "Bitácora obtenida exitosamente",
      data: registros,
    });
  } catch (error) {
    console.error("Error al obtener la bitácora:", error);
    return res.status(500).send({
      status: "error",
      description: "Error interno del servidor al consultar la bitácora.",
    });
  }
};
