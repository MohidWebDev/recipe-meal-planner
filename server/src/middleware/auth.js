import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Requires a valid "Authorization: Bearer <token>" header.
 * On success sets req.user (req.user.id is the user's id as a string).
 */
export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw ApiError.unauthorized('Not authorized, no token provided');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Session expired, please log in again' : 'Not authorized, invalid token';
    throw ApiError.unauthorized(message);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw ApiError.unauthorized('Not authorized, user no longer exists');
  }

  req.user = user; // mongoose document: user.id is a string, user._id an ObjectId
  next();
});

export default protect;
