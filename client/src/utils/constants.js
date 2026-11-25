export const CUISINES = [
  "American",
  "Chinese",
  "French",
  "Greek",
  "Indian",
  "Italian",
  "Japanese",
  "Mediterranean",
  "Mexican",
  "Middle Eastern",
  "Pakistani",
  "Thai",
  "Other",
];

export const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

/** Emoji used on the recipe "cover" since recipes have no photos yet. */
const CUISINE_EMOJI = {
  american: "🍔",
  chinese: "🥡",
  french: "🥐",
  greek: "🫒",
  indian: "🍛",
  italian: "🍝",
  japanese: "🍣",
  mediterranean: "🥙",
  mexican: "🌮",
  "middle eastern": "🧆",
  pakistani: "🍢",
  thai: "🍜",
};

export const getCuisineEmoji = (cuisine = "") =>
  CUISINE_EMOJI[cuisine.trim().toLowerCase()] ?? "🍽️";

/** RGB triplets used to tint each cuisine's cover gradient. */
const CUISINE_TINT = {
  american: "234,88,12",
  chinese: "190,30,45",
  french: "124,58,237",
  greek: "14,165,233",
  indian: "234,179,8",
  italian: "220,60,60",
  japanese: "225,29,100",
  mediterranean: "13,148,136",
  mexican: "249,115,22",
  "middle eastern": "180,110,20",
  pakistani: "16,150,100",
  thai: "168,85,247",
};

export const getCuisineTint = (cuisine = "") =>
  CUISINE_TINT[cuisine.trim().toLowerCase()] ?? "21,88,201";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title (A–Z)" },
  { value: "cookTime", label: "Cook time (shortest)" },
];

export const MAX_TIME_OPTIONS = [
  { value: "", label: "Any time" },
  { value: "15", label: "≤ 15 min" },
  { value: "30", label: "≤ 30 min" },
  { value: "45", label: "≤ 45 min" },
  { value: "60", label: "≤ 1 hour" },
  { value: "90", label: "≤ 1.5 hours" },
];

export const COMMON_UNITS = [
  "g",
  "kg",
  "ml",
  "l",
  "tsp",
  "tbsp",
  "cup",
  "pc",
  "clove",
  "pinch",
  "can",
  "slice",
];

/** 1.5 -> "1.5", 2 -> "2", 0.3333 -> "0.33" */
export const formatQuantity = (value) => {
  const rounded = Math.round(Number(value) * 100) / 100;
  return Number.isFinite(rounded) ? String(rounded) : "";
};
