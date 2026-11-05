import Recipe from '../models/Recipe.js';
import MealPlan from '../models/MealPlan.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import escapeRegex from '../utils/escapeRegex.js';

const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 50;

const SORTS = {
  newest: { createdAt: -1, _id: -1 },
  oldest: { createdAt: 1, _id: 1 },
  title: { title: 1, _id: 1 },
  cookTime: { cookTime: 1, title: 1, _id: 1 },
};

// Only these fields can be set from the request body (never `user`).
const EDITABLE_FIELDS = ['title', 'description', 'cuisine', 'cookTime', 'servings', 'instructions', 'tags', 'ingredients'];

const pickRecipeFields = (body) =>
  EDITABLE_FIELDS.reduce((acc, field) => {
    if (body[field] !== undefined) acc[field] = body[field];
    return acc;
  }, {});

// ?search=a&search=b arrives as an array; only use the first value.
const asString = (value) => (Array.isArray(value) ? String(value[0] ?? '') : typeof value === 'string' ? value : '');

const toPositiveInt = (value, fallback) => {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

// @route  GET /api/recipes
// @query  page, limit, search, cuisine, maxTime, ingredient, tag, sort
// @access Private
export const getRecipes = asyncHandler(async (req, res) => {
  const [search, cuisine, maxTime, ingredient, tag, sort] = ['search', 'cuisine', 'maxTime', 'ingredient', 'tag', 'sort'].map(
    (key) => asString(req.query[key])
  );

  const page = toPositiveInt(asString(req.query.page), 1);
  const limit = Math.min(toPositiveInt(asString(req.query.limit), DEFAULT_LIMIT), MAX_LIMIT);

  // Every query is scoped to the logged-in user.
  const filter = { user: req.user.id };

  if (search.trim()) {
    // Escape the input so characters like ".*(" are matched literally.
    filter.title = { $regex: escapeRegex(search), $options: 'i' };
  }
  if (cuisine.trim()) {
    filter.cuisine = { $regex: `^${escapeRegex(cuisine)}$`, $options: 'i' };
  }
  if (maxTime) {
    filter.cookTime = { $lte: toPositiveInt(maxTime, Number.MAX_SAFE_INTEGER) };
  }
  if (ingredient.trim()) {
    filter['ingredients.name'] = { $regex: escapeRegex(ingredient), $options: 'i' };
  }
  if (tag.trim()) {
    filter.tags = tag.trim().toLowerCase();
  }

  const [data, total] = await Promise.all([
    Recipe.find(filter)
      .sort(SORTS[sort] || SORTS.newest)
      .collation({ locale: 'en', strength: 2 }) // case-insensitive title sort
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-instructions')
      .lean(),
    Recipe.countDocuments(filter),
  ]);

  res.json({
    data,
    total,
    page,
    pages: Math.max(Math.ceil(total / limit), 1),
    limit,
  });
});

// @route  GET /api/recipes/:id
// @access Private
export const getRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user.id });
  if (!recipe) throw ApiError.notFound('Recipe not found');
  res.json(recipe);
});

// @route  POST /api/recipes
// @access Private
export const createRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.create({ ...pickRecipeFields(req.body), user: req.user.id });
  res.status(201).json(recipe);
});

// @route  PUT /api/recipes/:id
// @access Private
export const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user.id });
  if (!recipe) throw ApiError.notFound('Recipe not found');

  recipe.set(pickRecipeFields(req.body));
  await recipe.save(); // runs schema validators

  res.json(recipe);
});

// @route  DELETE /api/recipes/:id
// @access Private
export const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!recipe) throw ApiError.notFound('Recipe not found');

  // Remove meal plans that pointed at this recipe so the planner stays consistent.
  const { deletedCount } = await MealPlan.deleteMany({ user: req.user.id, recipe: recipe._id });

  res.json({ message: 'Recipe deleted', id: recipe._id, removedMealPlans: deletedCount });
});
