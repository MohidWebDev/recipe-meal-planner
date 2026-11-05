import { Router } from 'express';
import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipe.controller.js';
import { recipeRules, listRecipesRules } from '../validators/recipe.validator.js';
import { idParamRules } from '../validators/common.validator.js';
import validate from '../middleware/validate.js';
import protect from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.route('/').get(listRecipesRules, validate, getRecipes).post(recipeRules, validate, createRecipe);

router
  .route('/:id')
  .get(idParamRules, validate, getRecipe)
  .put(idParamRules, recipeRules, validate, updateRecipe)
  .delete(idParamRules, validate, deleteRecipe);

export default router;
