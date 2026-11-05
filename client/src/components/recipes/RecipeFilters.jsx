import { RotateCcw, X } from 'lucide-react';
import { CUISINES, MAX_TIME_OPTIONS, SORT_OPTIONS } from '../../utils/constants';

export default function RecipeFilters({ filters, onChange, onReset }) {
  const update = (field) => (event) => onChange({ [field]: event.target.value });
  const hasFilters = filters.cuisine || filters.maxTime || filters.tag || filters.ingredient || filters.sort !== 'newest';

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label htmlFor="filter-cuisine" className="label">
          Cuisine
        </label>
        <select id="filter-cuisine" className="input" value={filters.cuisine} onChange={update('cuisine')}>
          <option value="">All cuisines</option>
          {CUISINES.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-time" className="label">
          Max cook time
        </label>
        <select id="filter-time" className="input" value={filters.maxTime} onChange={update('maxTime')}>
          {MAX_TIME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-ingredient" className="label">
          Contains ingredient
        </label>
        <input
          id="filter-ingredient"
          className="input"
          placeholder="e.g. garlic"
          value={filters.ingredient}
          onChange={update('ingredient')}
        />
      </div>

      <div>
        <label htmlFor="filter-sort" className="label">
          Sort by
        </label>
        <select id="filter-sort" className="input" value={filters.sort} onChange={update('sort')}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <div className="flex animate-fade-in flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-4">
          {filters.tag && (
            <span className="badge-accent">
              #{filters.tag}
              <button
                type="button"
                className="-mr-1 rounded-full p-0.5 transition hover:bg-accent/20"
                onClick={() => onChange({ tag: '' })}
                aria-label="Remove tag filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button type="button" className="link inline-flex items-center gap-1.5 text-sm" onClick={onReset}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
