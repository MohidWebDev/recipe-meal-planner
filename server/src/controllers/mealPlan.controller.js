import MealPlan from '../models/MealPlan.js';
import Recipe from '../models/Recipe.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { parseDateRange } from '../utils/date.js';

const RECIPE_FIELDS = 'title cookTime servings cuisine';

/** Loads a recipe only if it belongs to the current user. */
const findOwnRecipe = async (recipeId, userId) => {
  const recipe = await Recipe.findOne({ _id: recipeId, user: userId }).select('servings');
  if (!recipe) throw ApiError.notFound('Recipe not found');
  return recipe;
};

// @route  GET /api/meal-plans?from=YYYY-MM-DD&to=YYYY-MM-DD
// @access Private
export const getMealPlans = asyncHandler(async (req, res) => {
  const { filter } = parseDateRange(req.query.from, req.query.to);

  const mealPlans = await MealPlan.find({ user: req.user.id, date: filter })
    .sort({ date: 1, createdAt: 1 })
    .populate('recipe', RECIPE_FIELDS);

  res.json(mealPlans);
});

// @route  POST /api/meal-plans
// @access Private
export const createMealPlan = asyncHandler(async (req, res) => {
  const { date, mealType, recipe: recipeId, servings } = req.body;

  // Make sure the recipe exists and belongs to this user.
  const recipe = await findOwnRecipe(recipeId, req.user.id);

  const mealPlan = await MealPlan.create({
    user: req.user.id,
    date,
    mealType,
    recipe: recipe._id,
    servings: servings ?? recipe.servings, // default to the recipe's servings
  });

  await mealPlan.populate('recipe', RECIPE_FIELDS);
  res.status(201).json(mealPlan);
});

// @route  PUT /api/meal-plans/:id
// @access Private
export const updateMealPlan = asyncHandler(async (req, res) => {
  const mealPlan = await MealPlan.findOne({ _id: req.params.id, user: req.user.id });
  if (!mealPlan) throw ApiError.notFound('Meal plan not found');

  const { date, mealType, recipe: recipeId, servings } = req.body;

  if (recipeId !== undefined) {
    const recipe = await findOwnRecipe(recipeId, req.user.id);
    mealPlan.recipe = recipe._id;
  }
  if (date !== undefined) mealPlan.date = date;
  if (mealType !== undefined) mealPlan.mealType = mealType;
  if (servings !== undefined) mealPlan.servings = servings;

  await mealPlan.save();
  await mealPlan.populate('recipe', RECIPE_FIELDS);
  res.json(mealPlan);
});

// @route  DELETE /api/meal-plans/:id
// @access Private
export const deleteMealPlan = asyncHandler(async (req, res) => {
  const mealPlan = await MealPlan.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!mealPlan) throw ApiError.notFound('Meal plan not found');
  res.json({ message: 'Meal removed from plan', id: mealPlan._id });
});
