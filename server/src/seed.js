/**
 * Seeds a demo account with recipes and a week of meal plans.
 *
 *   npm run seed
 *
 * Only the demo user's data is replaced; other accounts are left untouched.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Recipe from './models/Recipe.js';
import MealPlan from './models/MealPlan.js';

const DEMO_USER = { name: 'Demo User', email: 'demo@example.com', password: 'demo1234' };

const recipes = [
  {
    title: 'Classic Spaghetti Bolognese',
    description: 'A rich, slow-simmered meat sauce tossed with spaghetti.',
    cuisine: 'Italian',
    cookTime: 45,
    servings: 4,
    tags: ['pasta', 'comfort-food', 'family'],
    instructions:
      '1. Heat olive oil and soften the diced onion and garlic.\n2. Add the beef and brown well.\n3. Stir in the tomatoes, season and simmer for 30 minutes.\n4. Cook the spaghetti, toss with the sauce and top with parmesan.',
    ingredients: [
      { name: 'Spaghetti', quantity: 400, unit: 'g' },
      { name: 'Ground beef', quantity: 500, unit: 'g' },
      { name: 'Onion', quantity: 1, unit: 'pc' },
      { name: 'Garlic', quantity: 3, unit: 'clove' },
      { name: 'Canned tomatoes', quantity: 800, unit: 'g' },
      { name: 'Olive oil', quantity: 2, unit: 'tbsp' },
      { name: 'Parmesan', quantity: 50, unit: 'g' },
    ],
  },
  {
    title: 'Chicken Tikka Masala',
    description: 'Charred, spiced chicken in a creamy tomato sauce. Serve with rice or naan.',
    cuisine: 'Indian',
    cookTime: 50,
    servings: 4,
    tags: ['curry', 'spicy', 'high-protein'],
    instructions:
      '1. Marinate the chicken in yogurt and half the spices for 20 minutes.\n2. Sear the chicken until charred.\n3. Cook onion, garlic and ginger, add tomatoes and remaining spices.\n4. Stir in the cream and chicken, simmer 10 minutes. Serve with rice.',
    ingredients: [
      { name: 'Chicken breast', quantity: 600, unit: 'g' },
      { name: 'Yogurt', quantity: 200, unit: 'g' },
      { name: 'Onion', quantity: 1, unit: 'pc' },
      { name: 'Garlic', quantity: 4, unit: 'clove' },
      { name: 'Ginger', quantity: 1, unit: 'tbsp' },
      { name: 'Garam masala', quantity: 2, unit: 'tsp' },
      { name: 'Canned tomatoes', quantity: 400, unit: 'g' },
      { name: 'Heavy cream', quantity: 150, unit: 'ml' },
      { name: 'Rice', quantity: 300, unit: 'g' },
    ],
  },
  {
    title: 'Veggie Breakfast Omelette',
    description: 'A quick, fluffy omelette packed with vegetables and cheese.',
    cuisine: 'French',
    cookTime: 15,
    servings: 1,
    tags: ['breakfast', 'vegetarian', 'quick'],
    instructions:
      '1. Whisk the eggs with a pinch of salt.\n2. Sauté the pepper and spinach in butter.\n3. Pour in the eggs, cook gently, add cheese and fold.',
    ingredients: [
      { name: 'Eggs', quantity: 3, unit: 'pc' },
      { name: 'Bell pepper', quantity: 0.5, unit: 'pc' },
      { name: 'Spinach', quantity: 30, unit: 'g' },
      { name: 'Cheddar', quantity: 30, unit: 'g' },
      { name: 'Butter', quantity: 1, unit: 'tbsp' },
    ],
  },
  {
    title: 'Overnight Oats with Berries',
    description: 'Make-ahead creamy oats, ready to grab in the morning.',
    cuisine: 'American',
    cookTime: 10,
    servings: 2,
    tags: ['breakfast', 'vegetarian', 'make-ahead'],
    instructions:
      '1. Mix oats, milk, yogurt, chia seeds and honey in a jar.\n2. Refrigerate overnight.\n3. Top with berries before serving.',
    ingredients: [
      { name: 'Rolled oats', quantity: 100, unit: 'g' },
      { name: 'Milk', quantity: 250, unit: 'ml' },
      { name: 'Yogurt', quantity: 100, unit: 'g' },
      { name: 'Honey', quantity: 2, unit: 'tbsp' },
      { name: 'Mixed berries', quantity: 150, unit: 'g' },
      { name: 'Chia seeds', quantity: 1, unit: 'tbsp' },
    ],
  },
  {
    title: 'Chicken Caesar Salad',
    description: 'Crisp romaine, grilled chicken, crunchy croutons and a creamy dressing.',
    cuisine: 'American',
    cookTime: 25,
    servings: 2,
    tags: ['salad', 'high-protein', 'lunch'],
    instructions:
      '1. Season and grill the chicken, then slice.\n2. Chop the lettuce and toss with dressing and lemon juice.\n3. Top with chicken, croutons and parmesan.',
    ingredients: [
      { name: 'Chicken breast', quantity: 300, unit: 'g' },
      { name: 'Romaine lettuce', quantity: 1, unit: 'pc' },
      { name: 'Parmesan', quantity: 30, unit: 'g' },
      { name: 'Croutons', quantity: 60, unit: 'g' },
      { name: 'Caesar dressing', quantity: 4, unit: 'tbsp' },
      { name: 'Lemon', quantity: 0.5, unit: 'pc' },
    ],
  },
  {
    title: 'Beef Tacos',
    description: 'Seasoned beef in crunchy shells with all the toppings.',
    cuisine: 'Mexican',
    cookTime: 30,
    servings: 4,
    tags: ['family', 'quick', 'dinner'],
    instructions:
      '1. Brown the beef with onion and garlic.\n2. Add taco seasoning and a splash of water, simmer 5 minutes.\n3. Warm the shells and fill with beef, tomato, lettuce, cheese and sour cream.',
    ingredients: [
      { name: 'Ground beef', quantity: 500, unit: 'g' },
      { name: 'Taco shells', quantity: 8, unit: 'pc' },
      { name: 'Onion', quantity: 1, unit: 'pc' },
      { name: 'Garlic', quantity: 2, unit: 'clove' },
      { name: 'Taco seasoning', quantity: 2, unit: 'tbsp' },
      { name: 'Tomato', quantity: 2, unit: 'pc' },
      { name: 'Shredded lettuce', quantity: 100, unit: 'g' },
      { name: 'Cheddar', quantity: 100, unit: 'g' },
      { name: 'Sour cream', quantity: 100, unit: 'g' },
    ],
  },
  {
    title: 'Tofu Vegetable Stir-Fry',
    description: 'Crispy tofu and crunchy vegetables in a savoury garlic-ginger sauce.',
    cuisine: 'Chinese',
    cookTime: 20,
    servings: 3,
    tags: ['vegan', 'quick', 'dinner'],
    instructions:
      '1. Cook the rice.\n2. Press and cube the tofu, then fry until golden.\n3. Stir-fry the vegetables with garlic and ginger.\n4. Add tofu, soy sauce and sesame oil, toss and serve over rice.',
    ingredients: [
      { name: 'Firm tofu', quantity: 400, unit: 'g' },
      { name: 'Broccoli', quantity: 250, unit: 'g' },
      { name: 'Bell pepper', quantity: 1, unit: 'pc' },
      { name: 'Carrot', quantity: 2, unit: 'pc' },
      { name: 'Garlic', quantity: 2, unit: 'clove' },
      { name: 'Ginger', quantity: 1, unit: 'tbsp' },
      { name: 'Soy sauce', quantity: 3, unit: 'tbsp' },
      { name: 'Sesame oil', quantity: 1, unit: 'tbsp' },
      { name: 'Rice', quantity: 250, unit: 'g' },
    ],
  },
  {
    title: 'Mediterranean Lentil Soup',
    description: 'A hearty, warming red lentil soup with cumin and lemon.',
    cuisine: 'Mediterranean',
    cookTime: 40,
    servings: 6,
    tags: ['soup', 'vegan', 'make-ahead'],
    instructions:
      '1. Sauté onion, carrot and garlic in olive oil.\n2. Add cumin, lentils and stock.\n3. Simmer for 25 minutes, blend partially and finish with lemon juice.',
    ingredients: [
      { name: 'Red lentils', quantity: 300, unit: 'g' },
      { name: 'Onion', quantity: 1, unit: 'pc' },
      { name: 'Carrot', quantity: 2, unit: 'pc' },
      { name: 'Garlic', quantity: 3, unit: 'clove' },
      { name: 'Cumin', quantity: 2, unit: 'tsp' },
      { name: 'Vegetable stock', quantity: 1.5, unit: 'l' },
      { name: 'Lemon', quantity: 1, unit: 'pc' },
      { name: 'Olive oil', quantity: 2, unit: 'tbsp' },
    ],
  },
];

/** Monday of the current week as a UTC-midnight Date (matches how meal plans are stored). */
const startOfCurrentWeek = () => {
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekday = monday.getDay(); // 0 = Sunday
  monday.setDate(monday.getDate() + (weekday === 0 ? -6 : 1 - weekday));
  return new Date(Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate()));
};

const addDays = (date, days) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

// [dayOffset, mealType, recipe title, servings]
const weekPlan = [
  [0, 'breakfast', 'Overnight Oats with Berries', 2],
  [0, 'lunch', 'Chicken Caesar Salad', 2],
  [0, 'dinner', 'Classic Spaghetti Bolognese', 4],
  [1, 'breakfast', 'Veggie Breakfast Omelette', 2],
  [1, 'lunch', 'Mediterranean Lentil Soup', 3],
  [1, 'dinner', 'Tofu Vegetable Stir-Fry', 3],
  [2, 'breakfast', 'Overnight Oats with Berries', 2],
  [2, 'lunch', 'Classic Spaghetti Bolognese', 2],
  [2, 'dinner', 'Chicken Tikka Masala', 4],
  [3, 'breakfast', 'Veggie Breakfast Omelette', 1],
  [3, 'lunch', 'Mediterranean Lentil Soup', 3],
  [3, 'dinner', 'Beef Tacos', 4],
  [3, 'snack', 'Overnight Oats with Berries', 1],
  [4, 'breakfast', 'Overnight Oats with Berries', 2],
  [4, 'lunch', 'Chicken Caesar Salad', 2],
  [4, 'dinner', 'Tofu Vegetable Stir-Fry', 3],
  [5, 'breakfast', 'Veggie Breakfast Omelette', 2],
  [5, 'dinner', 'Chicken Tikka Masala', 6],
  [6, 'lunch', 'Beef Tacos', 4],
  [6, 'dinner', 'Mediterranean Lentil Soup', 4],
];

const seed = async () => {
  await connectDB();

  // Remove any previous demo data so the script can be re-run safely.
  const existing = await User.findOne({ email: DEMO_USER.email });
  if (existing) {
    await Promise.all([MealPlan.deleteMany({ user: existing._id }), Recipe.deleteMany({ user: existing._id })]);
    await existing.deleteOne();
  }

  const user = await User.create(DEMO_USER); // password hashed by the pre-save hook
  const createdRecipes = await Recipe.insertMany(recipes.map((recipe) => ({ ...recipe, user: user._id })));
  const byTitle = new Map(createdRecipes.map((recipe) => [recipe.title, recipe]));

  const monday = startOfCurrentWeek();
  const mealPlans = weekPlan.map(([offset, mealType, title, servings]) => ({
    user: user._id,
    date: addDays(monday, offset),
    mealType,
    recipe: byTitle.get(title)._id,
    servings,
  }));
  await MealPlan.insertMany(mealPlans);

  console.log('\nSeed complete:');
  console.log(`  user:       ${DEMO_USER.email} / ${DEMO_USER.password}`);
  console.log(`  recipes:    ${createdRecipes.length}`);
  console.log(`  meal plans: ${mealPlans.length} (week of ${monday.toISOString().slice(0, 10)})\n`);
};

seed()
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
