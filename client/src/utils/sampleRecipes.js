/** Starter recipes offered on the empty Recipes page. */
export const SAMPLE_RECIPES = [
  {
    title: "Chicken karahi",
    description: "A rich, tomato-forward Pakistani classic cooked in one pan.",
    cuisine: "Pakistani",
    cookTime: 45,
    servings: 4,
    instructions:
      "Heat the oil and fry garlic and ginger. Add chicken and sear. Add tomatoes and green chilies, cover and cook until the oil separates. Finish with fresh ginger.",
    tags: ["dinner", "spicy"],
    ingredients: [
      { name: "Chicken", quantity: 1000, unit: "g" },
      { name: "Tomatoes", quantity: 6, unit: "pc" },
      { name: "Garlic", quantity: 6, unit: "clove" },
      { name: "Ginger paste", quantity: 2, unit: "tbsp" },
      { name: "Green chilies", quantity: 4, unit: "pc" },
      { name: "Oil", quantity: 100, unit: "ml" },
    ],
  },
  {
    title: "Veggie omelette",
    description: "A quick breakfast with tomato and onion.",
    cuisine: "French",
    cookTime: 10,
    servings: 1,
    instructions:
      "Whisk the eggs. Soften onion and tomato in butter, pour in the eggs and fold when set.",
    tags: ["breakfast", "quick"],
    ingredients: [
      { name: "Eggs", quantity: 3, unit: "pc" },
      { name: "Tomatoes", quantity: 1, unit: "pc" },
      { name: "Onion", quantity: 1, unit: "pc" },
      { name: "Butter", quantity: 1, unit: "tbsp" },
    ],
  },
  {
    title: "Spaghetti Bolognese",
    description: "Slow-simmered beef sauce over spaghetti.",
    cuisine: "Italian",
    cookTime: 40,
    servings: 4,
    instructions:
      "Brown the mince with onion and garlic. Add tomatoes and paste, simmer for 25 minutes. Boil spaghetti and toss with the sauce.",
    tags: ["dinner", "pasta"],
    ingredients: [
      { name: "Spaghetti", quantity: 400, unit: "g" },
      { name: "Minced beef", quantity: 500, unit: "g" },
      { name: "Onion", quantity: 1, unit: "pc" },
      { name: "Tomatoes", quantity: 4, unit: "pc" },
      { name: "Tomato paste", quantity: 2, unit: "tbsp" },
      { name: "Garlic", quantity: 3, unit: "clove" },
    ],
  },
  {
    title: "Chana chaat",
    description: "Tangy chickpea snack with onion, tomato and lemon.",
    cuisine: "Pakistani",
    cookTime: 15,
    servings: 2,
    instructions:
      "Toss boiled chickpeas with chopped onion and tomato. Dress with lemon juice and chaat masala.",
    tags: ["snack", "vegetarian"],
    ingredients: [
      { name: "Chickpeas", quantity: 400, unit: "g" },
      { name: "Tomatoes", quantity: 2, unit: "pc" },
      { name: "Onion", quantity: 1, unit: "pc" },
      { name: "Lemon juice", quantity: 2, unit: "tbsp" },
    ],
  },
];
