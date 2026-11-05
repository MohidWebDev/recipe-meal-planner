import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Runs after a list of express-validator rules. If any rule failed it
 * responds with 400 and an `errors` array of { field, message } objects
 * (only the first error per field is reported).
 */
const validate = (req, _res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result
    .array({ onlyFirstError: true })
    .map((err) => ({ field: err.path ?? err.param ?? 'unknown', message: err.msg }));

  return next(ApiError.badRequest('Validation failed', errors));
};

export default validate;
