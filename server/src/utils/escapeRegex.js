/**
 * Escapes characters that have a special meaning in regular expressions so
 * user input can be safely used inside `new RegExp()` / `$regex`.
 * Also trims the input and caps its length to avoid expensive patterns.
 */
const escapeRegex = (value = '', maxLength = 100) =>
  String(value).trim().slice(0, maxLength).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default escapeRegex;
