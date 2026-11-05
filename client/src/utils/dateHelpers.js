/**
 * Date helpers for the planner and shopping list.
 *
 * The API stores meal dates as midnight UTC and accepts plain "YYYY-MM-DD"
 * strings. On the client we work with *local* calendar days and convert
 * them to/from those "YYYY-MM-DD" keys, so a meal never jumps to the
 * previous/next day because of the user's time zone.
 */

const pad = (n) => String(n).padStart(2, '0');

/** Local Date -> "YYYY-MM-DD" */
export const toDateKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** "YYYY-MM-DD" -> local Date at midnight */
export const fromDateKey = (key) => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/** ISO date from the API ("2026-11-05T00:00:00.000Z") -> "2026-11-05" */
export const apiDateToKey = (isoString) => String(isoString).slice(0, 10);

export const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

/** Monday of the week that contains `date` (local time, midnight). */
export const startOfWeek = (date = new Date()) => {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const weekday = monday.getDay(); // 0 = Sunday
  monday.setDate(monday.getDate() + (weekday === 0 ? -6 : 1 - weekday));
  return monday;
};

export const endOfWeek = (date = new Date()) => addDays(startOfWeek(date), 6);

/** The 7 days (Mon..Sun) starting at `weekStart`. */
export const getWeekDays = (weekStart) => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

export const isToday = (date) => toDateKey(date) === toDateKey(new Date());

export const isValidDateKey = (key) => /^\d{4}-\d{2}-\d{2}$/.test(key || '') && !Number.isNaN(fromDateKey(key).getTime());

export const formatWeekday = (date) => date.toLocaleDateString(undefined, { weekday: 'short' });

export const formatShortDate = (date) => date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

export const formatLongDate = (date) =>
  date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

/** "Nov 2 – Nov 8, 2026" */
export const formatRange = (start, end) => {
  const sameYear = start.getFullYear() === end.getFullYear();
  const startText = start.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  const endText = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  return `${startText} – ${endText}`;
};
