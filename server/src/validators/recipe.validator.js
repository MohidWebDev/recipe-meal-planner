import { body, query } from 'express-validator';

export const SORT_OPTIONS = ['newest', 'oldest', 'title', 'cookTime'];

/** Rules for creating (POST) and replacing (PUT) a recipe. */
export const recipeRules = [
  body('title')
    .isString()
    .withMessage('Title is required')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be longer than 100 characters'),
  body('description')
    .optional({ values: 'null' })
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot be longer than 1000 characters'),
  body('cuisine')
    .optional({ values: 'null' })
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Cuisine cannot be longer than 50 characters'),
  body('cookTime')
    .notEmpty()
    .withMessage('Cook time is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Cook time must be a positive whole number of minutes')
    .toInt(),
  body('servings')
    .notEmpty()
    .withMessage('Servings is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Servings must be a positive whole number')
    .toInt(),
  body('instructions').optional({ values: 'null' }).isString().trim(),
  body('tags').optional({ values: 'null' }).isArray().withMessage('Tags must be an array of strings'),
  body('tags.*').isString().withMessage('Each tag must be text').bail().trim().toLowerCase(),
  body('ingredients').isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  body('ingredients.*.name')
    .isString()
    .withMessage('Ingredient name is required')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Ingredient name is required'),
  body('ingredients.*.quantity')
    .isFloat({ gt: 0 })
    .withMessage('Quantity must be a positive number')
    .toFloat(),
  body('ingredients.*.unit')
    .optional({ values: 'null' })
    .isString()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Unit cannot be longer than 20 characters'),
];

/** Rules for GET /recipes query parameters (all optional). */
export const listRecipesRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('limit must be a positive integer'),
  query('maxTime').optional({ values: 'falsy' }).isInt({ min: 1 }).withMessage('maxTime must be a positive integer'),
  query('sort')
    .optional({ values: 'falsy' })
    .isIn(SORT_OPTIONS)
    .withMessage(`sort must be one of: ${SORT_OPTIONS.join(', ')}`),
];
