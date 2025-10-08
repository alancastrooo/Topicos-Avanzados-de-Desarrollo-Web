// 404
export const notFoundRoute = (req, res) =>{
    res.status(404).json({ error: 'Ruta no encontrada' });
}



// Error Handler
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    error: message
  });
}