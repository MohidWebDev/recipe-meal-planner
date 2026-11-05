import { Router } from 'express';
import { getTopIngredients, getMealsByCuisine } from '../controllers/stats.controller.js';
import protect from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/top-ingredients', getTopIngredients);
router.get('/meals-by-cuisine', getMealsByCuisine);

export default router;
