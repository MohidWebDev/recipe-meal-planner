import ApiError from '../utils/ApiError.js';

/** Catches requests that did not match any route. */
export const notFound = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Central error handler. Every error ends up here and is converted to
 * a consistent JSON shape: { message, errors? }.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = Array.isArray(err.errors) ? err.errors : undefined;

  // Malformed ObjectId, e.g. /api/recipes/not-an-id
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
    errors = [{ field: err.path, message }];
  }

  // Mongoose schema validation errors
  if (err.name === 'ValidationError' && err.errors && !Array.isArray(err.errors)) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  }

  // Duplicate key (unique index), e.g. an email that is already registered
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    statusCode = 409;
    message = `An account with that ${field} already exists`;
    errors = [{ field, message }];
  }

  // Invalid JSON body
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Request body contains invalid JSON';
  }

  if (statusCode >= 500) {
    console.error(err);
    if (process.env.NODE_ENV === 'production') message = 'Internal server error';
  }

  const body = { message };
  if (errors) body.errors = errors;
  if (process.env.NODE_ENV === 'development' && statusCode >= 500) body.stack = err.stack;

  res.status(statusCode).json(body);
};

