import {
  RegisterOrdenMantenimiento,
  GetOrdenesByEquipo,
  UpdateEstadoOrden,
  GetOneOrdenById,
  RegisterHorometro,
  GetHorometrosByEquipo,
} from "../../services/mantenimiento/mantenimiento.service.js";

// 🔗 Importamos el servicio de la bitácora
import { InsertarBitacora } from "../../services/bitacora/bitacora.service.js";

export const getHistorialMantenimiento = async (req, res) => {
  try {
    // Recibimos los parámetros dinámicos de la ruta
    const { tipo_equipo, equipo_id } = req.params;

    const historial = await GetOrdenesByEquipo(tipo_equipo, equipo_id);

    if (!historial || historial.length === 0) {
      return res.status(404).send({
        status: "mal",
        description:
          "Este equipo no posee historial de mantenimiento registrado",
      });
    }

    res.send({ status: "ok", data: historial });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error al obtener el historial" });
  }
};

export const postOrdenMantenimiento = async (req, res) => {
  try {
    const { body } = req;

    // Validaciones básicas
    if (
      !body.tipo_equipo ||
      !body.equipo_id ||
      !body.tipo_mantenimiento ||
      !body.fecha_programada
    ) {
      return res.status(400).send({
        status: "mal",
        description:
          "Faltan datos obligatorios para crear la orden de mantenimiento",
      });
    }

    const nuevaOrden = {
      tipo_equipo: body.tipo_equipo, // Ej: 'MOTOR'
      equipo_id: body.equipo_id, // Ej: 15
      tipo_mantenimiento: body.tipo_mantenimiento, // 'PREVENTIVO' o 'CORRECTIVO'
      estado: body.estado || "PROGRAMADO",
      criticidad: body.criticidad || "MEDIA",
      fecha_programada: body.fecha_programada,
      descripcion_falla: body.descripcion_falla || null,
    };

    const orden = await RegisterOrdenMantenimiento(nuevaOrden);

    // 🌟 REGISTRO EN BITÁCORA
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "REGISTRAR",
      "ordenes_mantenimiento",
      orden.insertId,
      `Creó una Orden de Trabajo ${body.tipo_mantenimiento} de criticidad ${nuevaOrden.criticidad} para el Equipo (${body.tipo_equipo} ID: ${body.equipo_id})`,
    );

    res.status(201).send({
      status: "ok",
      description: "Orden de mantenimiento creada correctamente",
      data: orden,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error al registrar la orden" });
  }
};

export const updateEstadoOrden = async (req, res) => {
  try {
    const id_orden = req.params.id;
    const { body } = req;

    if (!body.estado) {
      return res.status(400).send({
        status: "mal",
        description:
          "Debe especificar el nuevo estado de la orden (ej. 'COMPLETADO')",
      });
    }

    const ordenExistente = await GetOneOrdenById(id_orden);
    if (!ordenExistente || ordenExistente.length === 0) {
      return res
        .status(404)
        .send({ status: "mal", description: "La orden no existe" });
    }

    const fecha_ejecucion = body.estado === "COMPLETADO" ? new Date() : null;

    // Actualizamos la orden en BD
    await UpdateEstadoOrden(
      id_orden,
      body.estado,
      fecha_ejecucion,
      body.trabajo_realizado,
    );

    // 🌟 REGISTRO EN BITÁCORA
    const idUsuario = req.user ? req.user.id_usuario : 1;
    await InsertarBitacora(
      idUsuario,
      "MODIFICAR",
      "ordenes_mantenimiento",
      id_orden,
      `Actualizó el estado de la Orden de Trabajo a '${body.estado}'. Tareas realizadas: ${body.trabajo_realizado || "N/A"}`,
    );

    res.send({
      status: "ok",
      description: "Estado de la orden actualizado correctamente",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error al actualizar la orden" });
  }
};

// ==========================================
// CONTROLADORES DE HORÓMETROS
// ==========================================

export const getHistorialHorometro = async (req, res) => {
  try {
    // Recibimos los parámetros dinámicos de la ruta (Ej: MOTOR y el ID)
    const { tipo_equipo, equipo_id } = req.params;

    // Invocamos el servicio que ya teníamos creado en la capa de datos
    const historial = await GetHorometrosByEquipo(tipo_equipo, equipo_id);

    if (!historial || historial.length === 0) {
      return res.status(404).send({
        status: "mal",
        description: "Este equipo no posee lecturas de horómetro registradas",
      });
    }

    res.send({ status: "ok", data: historial });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "error",
      description: "Error al obtener el historial del horómetro",
    });
  }
};

export const postLecturaHorometro = async (req, res) => {
  try {
    const { body } = req;

    if (
      !body.tipo_equipo ||
      !body.equipo_id ||
      body.horas_acumuladas === undefined
    ) {
      return res.status(400).send({
        status: "mal",
        description: "Faltan datos para registrar la lectura del horómetro",
      });
    }

    const nuevaLectura = {
      tipo_equipo: body.tipo_equipo,
      equipo_id: body.equipo_id,
      horas_acumuladas: body.horas_acumuladas,
    };

    const lectura = await RegisterHorometro(nuevaLectura);

    // 🌟 LÓGICA INDUSTRIAL AVANZADA: Generación automática de mantenimiento
    // Si las horas acumuladas superan un múltiplo de 250 (ej. 250, 500, 750)
    if (body.horas_acumuladas % 250 === 0 || body.horas_acumuladas % 250 < 10) {
      const ordenAutomatica = {
        tipo_equipo: body.tipo_equipo,
        equipo_id: body.equipo_id,
        tipo_mantenimiento: "PREVENTIVO",
        estado: "PROGRAMADO",
        criticidad: "MEDIA",
        fecha_programada: new Date(), // Para ejecutar inmediatamente o pronto
        descripcion_falla: `Mantenimiento automático generado por alcanzar ${body.horas_acumuladas} horas de operación.`,
      };
      // Creamos la orden de forma transparente en el fondo
      await RegisterOrdenMantenimiento(ordenAutomatica);
    }

    res.status(201).send({
      status: "ok",
      description: "Lectura del horómetro registrada. Sistema actualizado.",
      data: lectura,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "error", description: "Error al registrar horómetro" });
  }
};
