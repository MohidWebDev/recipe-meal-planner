import { Router } from 'express';
import {
  getMealPlans,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from '../controllers/mealPlan.controller.js';
import { createMealPlanRules, updateMealPlanRules, dateRangeRules } from '../validators/mealPlan.validator.js';
import { idParamRules } from '../validators/common.validator.js';
import validate from '../middleware/validate.js';
import protect from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.route('/').get(dateRangeRules, validate, getMealPlans).post(createMealPlanRules, validate, createMealPlan);

router
  .route('/:id')
  .put(idParamRules, updateMealPlanRules, validate, updateMealPlan)
  .delete(idParamRules, validate, deleteMealPlan);

export default router;
