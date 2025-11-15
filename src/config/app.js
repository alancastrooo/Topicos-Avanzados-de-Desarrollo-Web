import express from "express";
import { ServerLog } from "../middlewares/log.js";
import apiRouter from "../routers/api.js";
import { errorHandler, notFoundRoute } from "../middlewares/error.js";

const app = express();

app.use(express.json());
app.use(ServerLog);

// Rutas
app.use("/api", apiRouter);

// Manejo de rutas no definidas (404)
app.use(notFoundRoute);

// Manejo de errores generales
app.use(errorHandler);

export default app;
