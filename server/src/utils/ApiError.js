/**
 * An Error with an HTTP status code (and optional field errors) that the
 * central error middleware knows how to turn into a JSON response.
 */
class ApiError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    if (errors) this.errors = errors;
  }

  static badRequest(message = 'Bad request', errors) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Not authorized') {
    return new ApiError(401, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Conflict', errors) {
    return new ApiError(409, message, errors);
  }
}

export default ApiError;
