// 404
export const notFoundRoute = (_req, res) =>{
    res.status(404).json({ error: 'Ruta no encontrada' });
}



// Error Handler
export const errorHandler = (err, _req, res, _next) => {
  console.error(err.stack);

  let message = 'Ocurrió un error inesperado. Por favor, intenta más tarde.';

  // Solo muestra el mensaje real si el error es controlado (400, 404, etc.)
  if (statusCode < 500 && err.message) {
    message = err.message;
  }

  res.status(statusCode).json({
    error: message
  });
}