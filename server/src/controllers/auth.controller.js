import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

const sendAuthResponse = (res, statusCode, user) => {
  res.status(statusCode).json({ token: generateToken(user._id), user });
};

// @route  POST /api/auth/register
// @access Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.exists({ email });
  if (exists) {
    throw ApiError.conflict('An account with that email already exists', [
      { field: 'email', message: 'An account with that email already exists' },
    ]);
  }

  const user = await User.create({ name, email, password });
  sendAuthResponse(res, 201, user);
});

// @route  POST /api/auth/login
// @access Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // password has select:false, so ask for it explicitly
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  sendAuthResponse(res, 200, user);
});

// @route  GET /api/auth/me
// @access Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
