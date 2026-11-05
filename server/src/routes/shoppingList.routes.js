import { Router } from 'express';
import { getShoppingList } from '../controllers/shoppingList.controller.js';
import { dateRangeRules } from '../validators/mealPlan.validator.js';
import validate from '../middleware/validate.js';
import protect from '../middleware/auth.js';

const router = Router();

router.get('/', protect, dateRangeRules, validate, getShoppingList);

export default router;
