import { VerifyToken } from "../helpers/GenerateToken.js"; // Importa tu helper optimizado

//1. GUARDIÁN DE AUTENTICACIÓN (checkAuth)
//Revisa si el usuario tiene un token válido (ya sea en las cookies o en las cabeceras).
export const checkAuth = async (req, res, next) => {
  try {
    let token = null;

    // A. Intentamos buscar el token en las cookies
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    // B. Si no está en las cookies, lo buscamos en el header estándar 'Authorization'
    else if (req.headers["authorization"]) {
      const bearerHeader = req.headers["authorization"];
      if (bearerHeader.startsWith("Bearer ")) {
        token = bearerHeader.split(" ")[1]; // Extrae solo el string del token
      }
    }

    // Si no se encontró el token en ningún lado, bloqueamos el acceso
    if (!token) {
      return res.status(401).send({
        status: "mal",
        description:
          "Acceso denegado. No se proporcionó un token de autenticación válido.",
      });
    }

    // Usamos la función helper 'VerifyToken' pasándole el string puro del token
    const decodificada = await VerifyToken(token);

    // Si el token expiró, fue manipulado o el helper devolvió null
    if (!decodificada) {
      return res.status(403).send({
        status: "mal",
        description:
          "Sesión inválida o expirada. Por favor, inicie sesión nuevamente.",
      });
    }

    // Inyectamos los datos ya descifrados (id_usuario, username, rol) en la petición 'req'
    req.user = decodificada;

    // Todo perfecto, damos luz verde para avanzar al siguiente paso
    return next();
  } catch (error) {
    console.error("Error crítico en el middleware checkAuth:", error.message);
    return res.status(500).send({
      status: "error",
      description: "Error interno del servidor durante la autenticación.",
    });
  }
};

//2. VALIDADOR DINÁMICO DE ROLES (checkRole)
export const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    // Si checkAuth se ejecutó antes correctamente, req.user DEBE existir
    if (!req.user) {
      return res.status(500).send({
        status: "error",
        description:
          "Error de configuración interna: checkAuth debe ejecutarse antes de checkRole.",
      });
    }

    // Verificamos si el rol que viene dentro del token está en la lista de permitidos
    if (!rolesPermitidos.includes(req.user.rol)) {
      // 403 Forbidden es el estado HTTP correcto cuando el usuario está autenticado pero no tiene permisos
      return res.status(403).send({
        status: "mal",
        description:
          "Acceso denegado. Tu rol actual no tiene los privilegios necesarios para esta acción.",
      });
    }

    // El rol es correcto, ¡adelante!
    return next();
  };
};
