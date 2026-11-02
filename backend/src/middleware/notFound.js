/**
 * 404 Not Found Middleware
 * Catches any requests made to undefined routes and passes a structured error to the error handler.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found - [${req.method}] ${req.originalUrl}`);
  res.status(404);
  next(error);
};
