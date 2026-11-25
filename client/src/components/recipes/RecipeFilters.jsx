import { RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import {
  CUISINES,
  MAX_TIME_OPTIONS,
  SORT_OPTIONS,
} from "../../utils/constants";
import SearchBar from "../common/SearchBar";

export default function RecipeFilters({
  search,
  onSearchChange,
  filters,
  onChange,
  onReset,
}) {
  const [open, setOpen] = useState(false);
  const update = (field) => (event) =>
    onChange({ [field]: event.target.value });

  const timeLabel = MAX_TIME_OPTIONS.find(
    (option) => option.value === filters.maxTime,
  )?.label;
  const chips = [
    filters.cuisine && { key: "cuisine", label: filters.cuisine },
    filters.maxTime && { key: "maxTime", label: timeLabel },
    filters.ingredient && {
      key: "ingredient",
      label: `Has ${filters.ingredient}`,
    },
    filters.tag && { key: "tag", label: `#${filters.tag}` },
  ].filter(Boolean);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Search recipes by title…"
          />
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="recipe-filter-panel"
          className={`btn-secondary ${open || chips.length > 0 ? "border-accent/40 text-accent" : ""}`}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {chips.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-ink">
              {chips.length}
            </span>
          )}
        </button>

        <div>
          <label htmlFor="filter-sort" className="sr-only">
            Sort by
          </label>
          <select
            id="filter-sort"
            className="input sm:w-48"
            value={filters.sort}
            onChange={update("sort")}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {open && (
        <div
          id="recipe-filter-panel"
          className="card grid animate-fade-up grid-cols-1 gap-3 p-4 sm:grid-cols-3"
        >
          <div>
            <label htmlFor="filter-cuisine" className="label">
              Cuisine
            </label>
            <select
              id="filter-cuisine"
              className="input"
              value={filters.cuisine}
              onChange={update("cuisine")}
            >
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
            <select
              id="filter-time"
              className="input"
              value={filters.maxTime}
              onChange={update("maxTime")}
            >
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
              onChange={update("ingredient")}
            />
          </div>
        </div>
      )}

      {chips.length > 0 && (
        <div className="flex animate-fade-in flex-wrap items-center gap-2">
          {chips.map(({ key, label }) => (
            <span key={key} className="badge-accent">
              {label}
              <button
                type="button"
                className="-mr-1 rounded-full p-0.5 transition hover:bg-accent/20"
                onClick={() => onChange({ [key]: "" })}
                aria-label={`Remove ${label} filter`}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </span>
          ))}
          <button
            type="button"
            className="link ml-1 inline-flex items-center gap-1.5 text-sm"
            onClick={onReset}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
