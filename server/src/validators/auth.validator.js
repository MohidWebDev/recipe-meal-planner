import { body } from 'express-validator';

const emailRule = () =>
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Please provide a valid email')
    .toLowerCase();

export const registerRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot be longer than 50 characters'),
  emailRule(),
  body('password')
    .isString()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const loginRules = [
  emailRule(),
  body('password').isString().withMessage('Password is required').bail().notEmpty().withMessage('Password is required'),
];
