export const CUISINES = [
  'American',
  'Chinese',
  'French',
  'Greek',
  'Indian',
  'Italian',
  'Japanese',
  'Mediterranean',
  'Mexican',
  'Middle Eastern',
  'Pakistani',
  'Thai',
  'Other',
];

export const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

/** Emoji used on the recipe "cover" since recipes have no photos yet. */
const CUISINE_EMOJI = {
  american: '🍔',
  chinese: '🥡',
  french: '🥐',
  greek: '🫒',
  indian: '🍛',
  italian: '🍝',
  japanese: '🍣',
  mediterranean: '🥙',
  mexican: '🌮',
  'middle eastern': '🧆',
  pakistani: '🍢',
  thai: '🍜',
};

export const getCuisineEmoji = (cuisine = '') => CUISINE_EMOJI[cuisine.trim().toLowerCase()] ?? '🍽️';

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title', label: 'Title (A–Z)' },
  { value: 'cookTime', label: 'Cook time (shortest)' },
];

export const MAX_TIME_OPTIONS = [
  { value: '', label: 'Any time' },
  { value: '15', label: '≤ 15 min' },
  { value: '30', label: '≤ 30 min' },
  { value: '45', label: '≤ 45 min' },
  { value: '60', label: '≤ 1 hour' },
  { value: '90', label: '≤ 1.5 hours' },
];

export const COMMON_UNITS = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'pc', 'clove', 'pinch', 'can', 'slice'];

/** 1.5 -> "1.5", 2 -> "2", 0.3333 -> "0.33" */
export const formatQuantity = (value) => {
  const rounded = Math.round(Number(value) * 100) / 100;
  return Number.isFinite(rounded) ? String(rounded) : '';
};
