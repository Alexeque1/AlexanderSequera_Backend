export const errorMiddleware = (error, req, res, next) => {
    console.error(error);
  
    const statusCode = error.code || 500;
    const errorMessage = error.message || 'Error interno del servidor';
    const errorName = error.name || 'ServerError';
  
    res.status(statusCode).json({ message: errorMessage, name: errorName });
  };