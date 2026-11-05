import ApiError from './ApiError.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Returns a new Date set to 00:00:00.000 UTC of the given day. */
export const startOfDayUTC = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return date;
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

export const addDaysUTC = (date, days) => new Date(date.getTime() + days * DAY_MS);

/** Monday 00:00 UTC of the week containing `date`. */
export const startOfWeekUTC = (date = new Date()) => {
  const day = startOfDayUTC(date);
  const weekday = day.getUTCDay(); // 0 = Sunday
  const diff = weekday === 0 ? -6 : 1 - weekday;
  return addDaysUTC(day, diff);
};

/**
 * Turns optional ?from=&to= query strings into a Mongo date filter.
 * Defaults to the current week (Monday to Sunday). Both ends are inclusive.
 */
export const parseDateRange = (from, to) => {
  const start = from ? startOfDayUTC(from) : startOfWeekUTC();
  const end = to ? startOfDayUTC(to) : addDaysUTC(start, 6);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw ApiError.badRequest('from and to must be valid dates (YYYY-MM-DD)');
  }
  if (start > end) {
    throw ApiError.badRequest('"from" date must be before or equal to "to" date');
  }

  return {
    start,
    end,
    // Upper bound is exclusive so that every meal stored on `end` is included.
    filter: { $gte: start, $lt: addDaysUTC(end, 1) },
  };
};
