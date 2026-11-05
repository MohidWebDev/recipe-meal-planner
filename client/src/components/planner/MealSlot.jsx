import { Clock, Plus, Users, X } from 'lucide-react';
import { MEAL_TYPE_ICONS } from './mealTypeIcons';

/** One meal type (e.g. "Lunch") for one day, listing the planned recipes. */
export default function MealSlot({ mealType, meals = [], onAdd, onEdit, onRemove, removingId }) {
  const Icon = MEAL_TYPE_ICONS[mealType.value];

  return (
    <div className="rounded-xl border border-line/80 bg-raised/40 p-2 transition-colors duration-200 hover:border-line-strong">
      <div className="mb-1 flex items-center justify-between gap-1 pl-1">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider whitespace-nowrap text-subtle uppercase">
          {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
          {mealType.label}
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="flex h-6 w-6 items-center justify-center rounded-md text-subtle transition duration-200 hover:bg-accent hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={`Add ${mealType.label.toLowerCase()}`}
          title={`Add ${mealType.label.toLowerCase()}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {meals.length === 0 ? (
        <button
          type="button"
          onClick={onAdd}
          className="w-full rounded-lg px-1 py-1.5 text-left text-xs text-subtle/80 transition-colors hover:text-accent"
        >
          Nothing planned
        </button>
      ) : (
        <ul className="space-y-1.5">
          {meals.map((meal) => (
            <li
              key={meal._id}
              className={`group flex animate-fade-up items-start gap-1 rounded-lg border border-line border-l-2 border-l-brand bg-surface px-2 py-1.5 transition duration-200 hover:border-line-strong hover:border-l-accent ${
                removingId === meal._id ? 'opacity-40' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => onEdit(meal)}
                className="min-w-0 flex-1 rounded text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                title={`Edit meal: ${meal.recipe?.title ?? 'Deleted recipe'}`}
              >
                <span className="line-clamp-2 text-sm leading-snug font-medium text-fg">
                  {meal.recipe?.title ?? 'Deleted recipe'}
                </span>
                <span className="mt-1 flex items-center gap-2 text-xs whitespace-nowrap text-muted">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" aria-hidden="true" />
                    {meal.servings}
                  </span>
                  {meal.recipe?.cookTime ? (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {meal.recipe.cookTime}m
                    </span>
                  ) : null}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onRemove(meal)}
                disabled={removingId === meal._id}
                className="rounded p-0.5 text-subtle opacity-70 transition duration-200 group-hover:opacity-100 hover:bg-danger/10 hover:text-danger"
                aria-label={`Remove ${meal.recipe?.title ?? 'meal'}`}
                title="Remove from plan"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
