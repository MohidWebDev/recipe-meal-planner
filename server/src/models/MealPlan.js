import mongoose from 'mongoose';
import { startOfDayUTC } from '../utils/date.js';

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

const mealPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      // Always store the start of the day (UTC) so range queries are simple.
      set: (value) => (value ? startOfDayUTC(value) : value),
    },
    mealType: {
      type: String,
      required: [true, 'Meal type is required'],
      enum: { values: MEAL_TYPES, message: `Meal type must be one of: ${MEAL_TYPES.join(', ')}` },
    },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: [true, 'Recipe is required'] },
    // Defaults to the recipe's servings (set in the controller / hook below).
    servings: { type: Number, min: [1, 'Servings must be at least 1'] },
  },
  { timestamps: true }
);

mealPlanSchema.index({ user: 1, date: 1 });

// Fallback: if servings were not provided, copy them from the recipe.
mealPlanSchema.pre('save', async function defaultServings() {
  if (this.servings != null) return;
  const recipe = await mongoose.model('Recipe').findById(this.recipe).select('servings').lean();
  this.servings = recipe?.servings || 1;
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

export default MealPlan;
