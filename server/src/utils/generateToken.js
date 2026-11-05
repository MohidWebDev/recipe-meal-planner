import jwt from 'jsonwebtoken';

/** Signs a JWT containing the user's id. */
const generateToken = (userId) =>
  jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export default generateToken;
