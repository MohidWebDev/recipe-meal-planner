import { body, query } from 'express-validator';
import { MEAL_TYPES } from '../models/MealPlan.js';

const dateRule = () => body('date').isISO8601().withMessage('Date must be a valid date (YYYY-MM-DD)');
const mealTypeRule = () =>
  body('mealType').isIn(MEAL_TYPES).withMessage(`Meal type must be one of: ${MEAL_TYPES.join(', ')}`);
const recipeRule = () => body('recipe').isMongoId().withMessage('A valid recipe id is required');
const servingsRule = () =>
  body('servings')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('Servings must be a positive whole number')
    .toInt();

/** POST /meal-plans: date, mealType and recipe are required. */
export const createMealPlanRules = [dateRule(), mealTypeRule(), recipeRule(), servingsRule()];

/** PUT /meal-plans/:id: every field is optional, but must be valid when sent. */
export const updateMealPlanRules = [
  dateRule().optional(),
  mealTypeRule().optional(),
  recipeRule().optional(),
  servingsRule(),
];

/** ?from=&to= used by meal plans, the shopping list and stats. */
export const dateRangeRules = [
  query('from').optional({ values: 'falsy' }).isISO8601().withMessage('from must be a valid date (YYYY-MM-DD)'),
  query('to').optional({ values: 'falsy' }).isISO8601().withMessage('to must be a valid date (YYYY-MM-DD)'),
];
