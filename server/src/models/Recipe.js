import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true,
      maxlength: [80, 'Ingredient name cannot be longer than 80 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Ingredient quantity is required'],
      validate: {
        validator: (value) => value > 0,
        message: 'Quantity must be a positive number',
      },
    },
    // Stored lowercase so "Cup" and "cup" are grouped together in the shopping list.
    unit: { type: String, trim: true, lowercase: true, default: '', maxlength: 20 },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be longer than 100 characters'],
    },
    description: { type: String, trim: true, default: '', maxlength: 1000 },
    cuisine: { type: String, trim: true, default: 'Other', maxlength: 50 },
    cookTime: {
      type: Number,
      required: [true, 'Cook time is required'],
      min: [1, 'Cook time must be at least 1 minute'],
    },
    servings: {
      type: Number,
      required: [true, 'Servings is required'],
      min: [1, 'Servings must be at least 1'],
    },
    instructions: { type: String, trim: true, default: '' },
    tags: [{ type: String, trim: true, lowercase: true }],
    ingredients: {
      type: [ingredientSchema],
      validate: {
        validator: (list) => Array.isArray(list) && list.length > 0,
        message: 'At least one ingredient is required',
      },
    },
  },
  { timestamps: true }
);

// Text index on title (required by the spec; usable for $text search).
recipeSchema.index({ title: 'text' });
// Speeds up the most common query: "my recipes, newest first".
recipeSchema.index({ user: 1, createdAt: -1 });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
