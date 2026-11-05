/** One meal type (e.g. "Lunch") for one day, listing the planned recipes. */
export default function MealSlot({ mealType, meals = [], onAdd, onEdit, onRemove, removingId }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 p-2">
      <div className="mb-1 flex items-center justify-between">
        <span className="flex items-center gap-1 text-[11px] font-semibold tracking-wide whitespace-nowrap text-slate-500 uppercase">
          <span aria-hidden="true">{mealType.icon}</span>
          {mealType.label}
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-md px-1.5 text-lg leading-none text-emerald-600 hover:bg-emerald-50"
          aria-label={`Add ${mealType.label.toLowerCase()}`}
          title={`Add ${mealType.label.toLowerCase()}`}
        >
          +
        </button>
      </div>

      {meals.length === 0 ? (
        <button
          type="button"
          onClick={onAdd}
          className="w-full rounded-md py-1.5 text-left text-xs text-slate-400 hover:text-emerald-700"
        >
          Nothing planned
        </button>
      ) : (
        <ul className="space-y-1.5">
          {meals.map((meal) => (
            <li
              key={meal._id}
              className={`group flex items-start gap-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 shadow-xs ${
                removingId === meal._id ? 'opacity-50' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => onEdit(meal)}
                className="min-w-0 flex-1 text-left"
                title={`Edit meal: ${meal.recipe?.title ?? 'Deleted recipe'}`}
              >
                <span className="line-clamp-2 text-sm leading-snug font-medium text-slate-800">
                  {meal.recipe?.title ?? 'Deleted recipe'}
                </span>
                <span className="mt-0.5 block text-xs whitespace-nowrap text-slate-500">
                  🍽 {meal.servings}
                  {meal.recipe?.cookTime ? ` · ⏱ ${meal.recipe.cookTime}m` : ''}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onRemove(meal)}
                disabled={removingId === meal._id}
                className="rounded px-1 text-base leading-none text-slate-300 hover:text-red-600"
                aria-label={`Remove ${meal.recipe?.title ?? 'meal'}`}
                title="Remove from plan"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
