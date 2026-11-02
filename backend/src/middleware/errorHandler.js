/**
 * Centralized Error Handler Middleware
 * Normalizes error responses across all controllers, hiding stack traces in production.
 */
export const errorHandler = (err, req, res, next) => {
  // If status is still 200 OK, default to 500 Internal Server Error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
