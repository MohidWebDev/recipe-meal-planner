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
      {days.map((day, index) => {
        const key = toDateKey(day);
        const today = isToday(day);
        const dayMeals = mealsByDay[key] || {};

        return (
          <section
            key={key}
            style={{ animationDelay: `${index * 40}ms` }}
            className={`card flex animate-fade-up flex-col gap-2 p-3 ${
              today ? 'border-accent/50 shadow-[0_0_0_1px_rgba(212,255,36,0.25),0_18px_40px_-24px_rgba(212,255,36,0.45)]' : ''
            }`}
            aria-label={day.toDateString()}
          >
            <header className="flex items-center justify-between px-1 pb-1">
              <div>
                <h3 className={`text-lg leading-none font-bold ${today ? 'text-accent' : 'text-fg'}`}>{formatWeekday(day)}</h3>
                <span className="text-xs text-subtle">{formatShortDate(day)}</span>
              </div>
              {today && <span className="badge-accent">Today</span>}
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

/** Placeholder grid shown while the week loads. */
export function WeekGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7" aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="card space-y-2 p-3">
          <div className="skeleton mb-3 h-8 w-16" />
          {Array.from({ length: 4 }, (__, j) => (
            <div key={j} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ))}
    </div>
  );
}
