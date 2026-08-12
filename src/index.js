import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

//importamos las variables de entorno
import { PORT } from "./config.js";

const allowedOrigins = [
  "http://localhost:5173",
  "https://front-tesis-hidro.vercel.app",
];

//importamos las rutas
import principal from "../src/routes/principal.routes.js";
import est_bombeoRoutes from "./routes/EstacionBombeo/est_bombeo.routes.js";
import detalle_est_bombeoRoutes from "./routes/EstacionBombeo/detalle_est_bombeo.routes.js";
import est_bombeo_fotosRoutes from "./routes/EstacionBombeo/est_bombeo_fotos.routes.js";
import linea_bombeoRoutes from "./routes/lineaBombeo/linea_bombeo.routes.js";
import linea_bombeo_fotosRoutes from "./routes/lineaBombeo/linea_bombeo_fotos.routes.js";
import linea_bombeo_superRoutes from "./routes/lineaBombeo/linea_completa.routes.js";
import motorRoutes from "./routes/motor/motor.routes.js";
import detalle_motorRoutes from "./routes/motor/detalle_motor.routes.js";
import motor_fotosRoutes from "./routes/motor/motor_fotos.routes.js";
import bombaRoutes from "./routes/bomba/bomba.routes.js";
import detalle_bombaRoutes from "./routes/bomba/detalle_bomba.routes.js";
import bomba_fotosRoutes from "./routes/bomba/bomba_fotos.routes.js";
import valvulaRoutes from "./routes/valvula/valvula.routes.js";
import valvula_fotosRoutes from "./routes/valvula/valvula_fotos.routes.js";
import banco_transformadoresRoutes from "./routes/bancoTransformadores/banco_transformadores.routes.js";
import banco_transformadores_fotosRoutes from "./routes/bancoTransformadores/banco_transformadores_fotos.routes.js";
import ccmRoutes from "./routes/ccm/ccm.routes.js";
import tipo_circuito_ccmRoutes from "./routes/ccm/tipo_circuito_ccm.routes.js";
import tipo_arrancadores_ccmRoutes from "./routes/ccm/tipo_arrancadores_ccm.routes.js";
import juegos_contactos_ccmRoutes from "./routes/ccm/juegos_contactos_ccm.routes.js";
import ccm_fotosRoutes from "./routes/ccm/ccm_fotos.routes.js";
import generadorRoutes from "./routes/generador/generador.routes.js";
import combustible_lubricante_generadorRoutes from "./routes/generador/combustible_lubricante_generador.routes.js";
import dimension_peso_generadorRoutes from "./routes/generador/dimension_peso_generador.routes.js";
import motor_generadorRoutes from "./routes/generador/motor_generador.routes.js";
import generador_fotosRoutes from "./routes/generador/generador_fotos.routes.js";
import tanqueRoutes from "./routes/tanque/tanque.routes.js";
import tanque_has_generadorRoutes from "./routes/tanque/tanque_has_generador.routes.js";
import tanque_fotosRoutes from "./routes/tanque/tanque_fotos.routes.js";
import registerRoutes from "./routes/usuario/register.routes.js";
import loginRoutes from "./routes/usuario/login.routes.js";
import est_bombeo_reporteRoutes from "./routes/pdf/est_bombeo_reporte.routes.js";
import bitacoraRoutes from "./routes/bitacora/bitacora.routes.js";
import mantenimientoRoutes from "./routes/mantenimiento/mantenimiento.routes.js";

const app = express();

//CONFIGURACIÓN DEL MOTOR DE PLANTILLAS
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "views"));
// Nota: Si tu carpeta "views" está en la raíz y NO dentro de src, usa:

//MIDDLEWARES EN ORDEN DE EJECUCIÓN

//CORS: Permite que tu Frontend en React (puerto 5173) haga peticiones a este Backend sin ser bloqueado por el navegador.
//credentials: true es vital para que React pueda enviar y recibir las cookies de autenticación (JWT).
app.use(
  cors({
    origin: function (origin, callback) {
      // Permite peticiones locales, desde Vercel o desde cualquier URL de localtunnel
      if (
        !origin ||
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith(".loca.lt")
      ) {
        callback(null, true);
      } else {
        callback(null, true); // En desarrollo aceptamos todas para evitar bloqueos
      }
    },
    credentials: true, // PERMITE EL ENVÍO DE COOKIES (ya que usas cookie-parser)
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

//JSON: Reconoce el objeto de petición entrante como un objeto JSON. Permite que leas los req.body que envíe React.
app.use(express.json());

//URLENCODED: Procesa y entiende los datos que se envían a través de formularios HTML tradicionales (en caso de usarlos).
app.use(express.urlencoded({ extended: false }));

//COOKIE-PARSER: Analiza las cookies adjuntas a las peticiones. Permite al Backend leer el token JWT guardado en el navegador de React.
app.use(cookieParser());

//MORGAN: Registra en la consola del servidor todas las peticiones HTTP que entran (Método, ruta, estado, tiempo de respuesta). Ideal para desarrollo.
app.use(morgan("dev"));

//LLAMAR A LOS ROUTERS
app.use(principal);
app.use(est_bombeoRoutes);
app.use(detalle_est_bombeoRoutes);
app.use(est_bombeo_fotosRoutes);
app.use(linea_bombeoRoutes);
app.use(est_bombeo_reporteRoutes);
app.use(linea_bombeo_fotosRoutes);
app.use(linea_bombeo_superRoutes);
app.use(motorRoutes);
app.use(detalle_motorRoutes);
app.use(motor_fotosRoutes);
app.use(bombaRoutes);
app.use(detalle_bombaRoutes);
app.use(bomba_fotosRoutes);
app.use(valvulaRoutes);
app.use(valvula_fotosRoutes);
app.use(banco_transformadoresRoutes);
app.use(banco_transformadores_fotosRoutes);
app.use(ccmRoutes);
app.use(tipo_circuito_ccmRoutes);
app.use(tipo_arrancadores_ccmRoutes);
app.use(juegos_contactos_ccmRoutes);
app.use(ccm_fotosRoutes);
app.use(generadorRoutes);
app.use(combustible_lubricante_generadorRoutes);
app.use(dimension_peso_generadorRoutes);
app.use(motor_generadorRoutes);
app.use(generador_fotosRoutes);
app.use(tanqueRoutes);
app.use(tanque_has_generadorRoutes);
app.use(tanque_fotosRoutes);
app.use(registerRoutes);
app.use(loginRoutes);
app.use(bitacoraRoutes);
app.use(mantenimientoRoutes);

//ARRANQUE DEL SERVIDOR
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
