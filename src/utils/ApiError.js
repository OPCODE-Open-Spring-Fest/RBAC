export default class ApiError extends Error {
  constructor(statusCode = 500, message = 'Internal Server Error') {
    super(message);
    this.statusCode = statusCode;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}