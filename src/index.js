import express from "express";
import morgan from "morgan";

//importamos las variables de entorno
import { PORT } from "./config.js";

/*const EventEmitter = require("events");
const emitter = new EventEmitter();

// Increase the limit to 20 listeners
emitter.setMaxListeners(20);*/

//importamos las rutas
import principal from "../src/routes/principal.routes.js";
import est_bombeoRoutes from "./routes/EstacionBombeo/est_bombeo.routes.js";
import detalle_est_bombeoRoutes from "./routes/EstacionBombeo/detalle_est_bombeo.routes.js";
import motorRoutes from "./routes/motor/motor.routes.js";
import detalle_motorRoutes from "./routes/motor/detalle_motor.routes.js";
import bombaRoutes from "./routes/bomba/bomba.routes.js";
import detalle_bombaRoutes from "./routes/bomba/detalle_bomba.routes.js";
import valvulaRoutes from "./routes/valvula/valvula.routes.js";
import banco_transformadoresRoutes from "./routes/bancoTransformadores/banco_transformadores.routes.js";
import ccmRoutes from "./routes/ccm/ccm.routes.js";
import tipo_circuito_ccmRoutes from "./routes/ccm/tipo_circuito_ccm.routes.js";
import tipo_arrancadores_ccmRoutes from "./routes/ccm/tipo_arrancadores_ccm.routes.js";
import juegos_contactos_ccmRoutes from "./routes/ccm/juegos_contactos_ccm.routes.js";
import generadorRoutes from "./routes/generador/generador.routes.js";
import combustible_lubricante_generadorRoutes from "./routes/generador/combustible_lubricante_generador.routes.js";
import dimension_peso_generadorRoutes from "./routes/generador/dimension_peso_generador.routes.js";
import motor_generadorRoutes from "./routes/generador/motor_generador.routes.js";
import tanqueRoutes from "./routes/tanque/tanque.routes.js";
import tanque_has_generadorRoutes from "./routes/tanque/tanque_has_generador.routes.js";

const app = express();

//para procesar datos enviados desde el form
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//inicializar morgan
app.use(morgan("dev"));

//llamar al Router de login
app.use(principal);
app.use(est_bombeoRoutes);
app.use(detalle_est_bombeoRoutes);
app.use(motorRoutes);
app.use(detalle_motorRoutes);
app.use(bombaRoutes);
app.use(detalle_bombaRoutes);
app.use(valvulaRoutes);
app.use(banco_transformadoresRoutes);
app.use(ccmRoutes);
app.use(tipo_circuito_ccmRoutes);
app.use(tipo_arrancadores_ccmRoutes);
app.use(juegos_contactos_ccmRoutes);
app.use(generadorRoutes);
app.use(combustible_lubricante_generadorRoutes);
app.use(dimension_peso_generadorRoutes);
app.use(motor_generadorRoutes);
app.use(tanqueRoutes);
app.use(tanque_has_generadorRoutes);

app.listen(PORT);
console.log("server running in the port", PORT);
