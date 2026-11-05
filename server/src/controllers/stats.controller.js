import mongoose from 'mongoose';
import MealPlan from '../models/MealPlan.js';
import Recipe from '../models/Recipe.js';
import asyncHandler from '../utils/asyncHandler.js';

/** Shared first stages: this user's meal plans joined with their recipe. */
const mealPlansWithRecipe = (userId) => [
  { $match: { user: new mongoose.Types.ObjectId(userId) } },
  { $lookup: { from: Recipe.collection.name, localField: 'recipe', foreignField: '_id', as: 'recipe' } },
  { $unwind: '$recipe' },
];

// @route  GET /api/stats/top-ingredients
// @desc   The user's 5 most-used ingredients across all planned meals
// @access Private
export const getTopIngredients = asyncHandler(async (req, res) => {
  const stats = await MealPlan.aggregate([
    ...mealPlansWithRecipe(req.user.id),
    // One document per ingredient of every planned meal
    { $unwind: '$recipe.ingredients' },
    // Count how many planned meals use each ingredient
    {
      $group: {
        _id: { $toLower: { $trim: { input: '$recipe.ingredients.name' } } },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1, _id: 1 } },
    { $limit: 5 },
    { $project: { _id: 0, name: '$_id', count: 1 } },
  ]);

  res.json(stats);
});

// @route  GET /api/stats/meals-by-cuisine
// @desc   Number of planned meals per cuisine
// @access Private
export const getMealsByCuisine = asyncHandler(async (req, res) => {
  const stats = await MealPlan.aggregate([
    ...mealPlansWithRecipe(req.user.id),
    {
      $group: {
        // Recipes without a cuisine are grouped under "Other"
        _id: {
          $cond: [{ $gt: [{ $strLenCP: { $ifNull: ['$recipe.cuisine', ''] } }, 0] }, '$recipe.cuisine', 'Other'],
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1, _id: 1 } },
    { $project: { _id: 0, cuisine: '$_id', count: 1 } },
  ]);

  res.json(stats);
});
