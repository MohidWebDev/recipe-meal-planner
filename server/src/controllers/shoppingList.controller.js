import mongoose from 'mongoose';
import MealPlan from '../models/MealPlan.js';
import Recipe from '../models/Recipe.js';
import asyncHandler from '../utils/asyncHandler.js';
import { parseDateRange } from '../utils/date.js';

/**
 * Builds the aggregation pipeline that turns meal plans into a shopping list.
 * Exported so it can be reused / inspected (e.g. in tests or the README).
 */
export const buildShoppingListPipeline = (userId, dateFilter) => [
  // 1. $match: only this user's meal plans inside the date range.
  //    req.user.id is a string, but aggregation does NOT cast types like
  //    find() does, so it must be converted to an ObjectId here.
  { $match: { user: new mongoose.Types.ObjectId(userId), date: dateFilter } },

  // 2. $lookup: join each meal plan with its recipe document.
  {
    $lookup: {
      from: Recipe.collection.name, // "recipes"
      localField: 'recipe',
      foreignField: '_id',
      as: 'recipe',
    },
  },

  // 3. $unwind recipe: $lookup returns an array; turn it into a single object.
  //    Meal plans whose recipe no longer exists are dropped here.
  { $unwind: '$recipe' },

  // 4. $unwind ingredients: one document per (meal plan, ingredient) pair.
  { $unwind: '$recipe.ingredients' },

  // 5. $project: normalise the name and scale the quantity to the planned servings,
  //    e.g. a 4-serving recipe planned for 2 people needs half of each ingredient.
  {
    $project: {
      name: { $toLower: { $trim: { input: '$recipe.ingredients.name' } } },
      unit: { $toLower: { $trim: { input: { $ifNull: ['$recipe.ingredients.unit', ''] } } } },
      recipeTitle: '$recipe.title',
      scaledQuantity: {
        $multiply: [
          '$recipe.ingredients.quantity',
          { $divide: [{ $ifNull: ['$servings', '$recipe.servings'] }, '$recipe.servings'] },
        ],
      },
    },
  },

  // 6. $group: add up quantities of the same ingredient in the same unit.
  {
    $group: {
      _id: { name: '$name', unit: '$unit' },
      totalQuantity: { $sum: '$scaledQuantity' },
      recipes: { $addToSet: '$recipeTitle' },
    },
  },

  // 7. $sort: alphabetical by ingredient name (then unit).
  { $sort: { '_id.name': 1, '_id.unit': 1 } },

  // 8. $project: final, flat shape → { name, unit, totalQuantity, recipes }.
  {
    $project: {
      _id: 0,
      name: '$_id.name',
      unit: '$_id.unit',
      totalQuantity: { $round: ['$totalQuantity', 2] },
      recipes: 1,
    },
  },
];

// @route  GET /api/shopping-list?from=YYYY-MM-DD&to=YYYY-MM-DD
// @access Private
export const getShoppingList = asyncHandler(async (req, res) => {
  const { filter } = parseDateRange(req.query.from, req.query.to);
  const items = await MealPlan.aggregate(buildShoppingListPipeline(req.user.id, filter));
  res.json(items);
});
