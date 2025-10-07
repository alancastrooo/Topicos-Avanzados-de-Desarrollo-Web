import express from "express"
import ServerLog from "../middlewares/log.js";
import apiRouter from "../routers/api.js";

const app = express();

app.use(express.json());
app.use(ServerLog)

// Rutas
app.use(apiRouter)

// Manejo de rutas no definidas (404)
app.use((req, res) => {

  res.status(404).json({ error: 'Ruta no encontrada' });

});

// Manejo de errores generales
app.use((err, req, res, next) => {

  console.error(err.stack);

  res.status(500).json({ error: 'Error interno del servidor' });

});

export default app;