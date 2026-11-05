import { MEAL_TYPES } from '../../utils/constants';
import { formatShortDate, formatWeekday, isToday, toDateKey } from '../../utils/dateHelpers';
import MealSlot from './MealSlot';

/**
 * 7-day planner grid. `mealsByDay` looks like:
 * { '2026-11-02': { breakfast: [meal, ...], dinner: [...] }, ... }
 */
export default function WeekGrid({ days, mealsByDay, onAdd, onEdit, onRemove, removingId }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {days.map((day) => {
        const key = toDateKey(day);
        const today = isToday(day);
        const dayMeals = mealsByDay[key] || {};

        return (
          <section
            key={key}
            className={`card flex flex-col gap-2 p-3 ${today ? 'border-emerald-400 ring-1 ring-emerald-400' : ''}`}
            aria-label={day.toDateString()}
          >
            <header className="flex items-baseline justify-between px-1">
              <h3 className={`font-semibold ${today ? 'text-emerald-700' : 'text-slate-900'}`}>{formatWeekday(day)}</h3>
              <span className="text-xs text-slate-500">
                {formatShortDate(day)}
                {today && <span className="ml-1 font-medium text-emerald-700">· Today</span>}
              </span>
            </header>

            {MEAL_TYPES.map((mealType) => (
              <MealSlot
                key={mealType.value}
                mealType={mealType}
                meals={dayMeals[mealType.value]}
                onAdd={() => onAdd(key, mealType.value)}
                onEdit={onEdit}
                onRemove={onRemove}
                removingId={removingId}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}
