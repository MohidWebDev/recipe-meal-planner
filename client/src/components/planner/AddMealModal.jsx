import { Check, Clock, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage, getFieldErrors } from '../../api/axios';
import { createMealPlan, updateMealPlan } from '../../api/mealPlan.api';
import { getRecipes } from '../../api/recipe.api';
import useDebounce from '../../hooks/useDebounce';
import { MEAL_TYPES } from '../../utils/constants';
import { apiDateToKey } from '../../utils/dateHelpers';
import Modal from '../common/Modal';
import SearchBar from '../common/SearchBar';

/**
 * Add a meal to the plan (mode "add") or change an existing one (mode "edit").
 * `target` is { mode: 'add', date, mealType } or { mode: 'edit', meal }.
 */
export default function AddMealModal({ target, onClose, onSaved }) {
  const isEdit = target?.mode === 'edit';
  const editingMeal = isEdit ? target.meal : null;

  const [date, setDate] = useState('');
  const [mealType, setMealType] = useState('dinner');
  const [recipeId, setRecipeId] = useState('');
  const [servings, setServings] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Reset the form whenever the modal opens for a new target.
  useEffect(() => {
    if (!target) return;
    setSearch('');
    setErrors({});
    setFormError('');
    if (isEdit) {
      setDate(apiDateToKey(editingMeal.date));
      setMealType(editingMeal.mealType);
      setRecipeId(editingMeal.recipe?._id ?? '');
      setServings(String(editingMeal.servings ?? ''));
    } else {
      setDate(target.date);
      setMealType(target.mealType);
      setRecipeId('');
      setServings('');
    }
  }, [target, isEdit, editingMeal]);

  // Load the user's recipes (searchable) while the modal is open.
  useEffect(() => {
    if (!target) return undefined;
    let ignore = false;
    setLoadingRecipes(true);
    getRecipes({ search: debouncedSearch, sort: 'title', limit: 50 })
      .then((result) => !ignore && setRecipes(result.data))
      .catch((error) => !ignore && setFormError(getErrorMessage(error)))
      .finally(() => !ignore && setLoadingRecipes(false));
    return () => {
      ignore = true;
    };
  }, [target, debouncedSearch]);

  // Make sure the currently selected recipe is always visible in the list.
  const recipeOptions = useMemo(() => {
    const current = editingMeal?.recipe;
    if (current && current._id === recipeId && !recipes.some((r) => r._id === current._id)) {
      return [current, ...recipes];
    }
    return recipes;
  }, [recipes, editingMeal, recipeId]);

  const clearError = (field) => setErrors((current) => ({ ...current, [field]: undefined }));

  const selectRecipe = (recipe) => {
    setRecipeId(recipe._id);
    setServings(String(recipe.servings ?? 1)); // default to the recipe's servings
    setErrors((current) => ({ ...current, recipe: undefined, servings: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    const nextErrors = {};
    if (!date) nextErrors.date = 'Pick a date';
    if (!recipeId) nextErrors.recipe = 'Choose a recipe';
    if (!/^\d+$/.test(servings) || Number(servings) < 1) nextErrors.servings = 'Servings must be at least 1';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = { date, mealType, recipe: recipeId, servings: Number(servings) };
    setSaving(true);
    try {
      const saved = isEdit ? await updateMealPlan(editingMeal._id, payload) : await createMealPlan(payload);
      onSaved(saved, isEdit);
    } catch (error) {
      setErrors(getFieldErrors(error));
      setFormError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={Boolean(target)}
      title={isEdit ? 'Edit meal' : 'Add a meal'}
      onClose={saving ? undefined : onClose}
      size="lg"
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" form="meal-form" className="btn-primary" disabled={saving}>
            {!saving && <Check className="h-4 w-4" aria-hidden="true" />}
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add to plan'}
          </button>
        </>
      }
    >
      <form id="meal-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <div role="alert" className="alert-error animate-fade-in">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="meal-date" className="label">
              Date
            </label>
            <input
              id="meal-date"
              type="date"
              className={`input ${errors.date ? 'input-error' : ''}`}
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                clearError('date');
              }}
            />
            {errors.date && <p className="field-error">{errors.date}</p>}
          </div>
          <div>
            <label htmlFor="meal-type" className="label">
              Meal
            </label>
            <select
              id="meal-type"
              className={`input ${errors.mealType ? 'input-error' : ''}`}
              value={mealType}
              onChange={(event) => {
                setMealType(event.target.value);
                clearError('mealType');
              }}
            >
              {MEAL_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.mealType && <p className="field-error">{errors.mealType}</p>}
          </div>
          <div>
            <label htmlFor="meal-servings" className="label">
              Servings
            </label>
            <input
              id="meal-servings"
              type="number"
              min="1"
              inputMode="numeric"
              className={`input ${errors.servings ? 'input-error' : ''}`}
              value={servings}
              onChange={(event) => {
                setServings(event.target.value);
                clearError('servings');
              }}
              placeholder="Recipe default"
            />
            {errors.servings && <p className="field-error">{errors.servings}</p>}
          </div>
        </div>

        <div>
          <span className="label">Recipe</span>
          <SearchBar value={search} onChange={setSearch} placeholder="Search your recipes…" label="Search recipes" />
          {errors.recipe && <p className="field-error">{errors.recipe}</p>}

          <div className="mt-2 max-h-64 overflow-y-auto overscroll-contain rounded-xl border border-line bg-ink/40" data-lenis-prevent>
            {loadingRecipes && recipeOptions.length === 0 ? (
              <div className="space-y-2 p-3" aria-hidden="true">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="skeleton h-11" />
                ))}
              </div>
            ) : recipeOptions.length === 0 ? (
              <div className="p-4 text-sm text-muted">
                {debouncedSearch ? (
                  'No recipes match your search.'
                ) : (
                  <>
                    You have no recipes yet.{' '}
                    <Link to="/recipes/new" className="link">
                      Create one first
                    </Link>
                    .
                  </>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-line" role="radiogroup" aria-label="Recipes">
                {recipeOptions.map((recipe) => {
                  const selected = recipe._id === recipeId;
                  return (
                    <li key={recipe._id}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => selectRecipe(recipe)}
                        className={`flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left text-sm transition duration-200 focus:outline-none focus-visible:bg-raised ${
                          selected ? 'bg-brand/15' : 'hover:bg-raised'
                        }`}
                      >
                        <span className="min-w-0">
                          <span className={`block truncate font-medium ${selected ? 'text-accent' : 'text-fg'}`}>{recipe.title}</span>
                          <span className="mt-0.5 flex items-center gap-3 text-xs text-muted">
                            {recipe.cuisine && <span>{recipe.cuisine}</span>}
                            {recipe.cookTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" aria-hidden="true" /> {recipe.cookTime} min
                              </span>
                            )}
                            {recipe.servings && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" aria-hidden="true" /> serves {recipe.servings}
                              </span>
                            )}
                          </span>
                        </span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition duration-200 ${
                            selected ? 'scale-110 border-accent bg-accent text-ink' : 'border-line-strong'
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
