import ApiError from '../utils/ApiError.js';

export default function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(err);

  const response = {
    success: false,
    message,
  };
  if (err.details) {
    response.details = err.details;
  }
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }
  res.status(statusCode).json(response);
}