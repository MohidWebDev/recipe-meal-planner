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
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add to plan'}
          </button>
        </>
      }
    >
      <form id="meal-form" onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
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

          <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-slate-200">
            {loadingRecipes && recipeOptions.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">Loading recipes…</p>
            ) : recipeOptions.length === 0 ? (
              <div className="p-4 text-sm text-slate-500">
                {debouncedSearch ? (
                  'No recipes match your search.'
                ) : (
                  <>
                    You have no recipes yet.{' '}
                    <Link to="/recipes/new" className="font-medium text-emerald-700 hover:underline">
                      Create one first
                    </Link>
                    .
                  </>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-slate-100" role="radiogroup" aria-label="Recipes">
                {recipeOptions.map((recipe) => {
                  const selected = recipe._id === recipeId;
                  return (
                    <li key={recipe._id}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => selectRecipe(recipe)}
                        className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition ${
                          selected ? 'bg-emerald-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <span className="min-w-0">
                          <span className={`block truncate font-medium ${selected ? 'text-emerald-800' : 'text-slate-800'}`}>
                            {recipe.title}
                          </span>
                          <span className="block text-xs text-slate-500">
                            {[recipe.cuisine, recipe.cookTime && `${recipe.cookTime} min`, recipe.servings && `serves ${recipe.servings}`]
                              .filter(Boolean)
                              .join(' · ')}
                          </span>
                        </span>
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                            selected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {selected && '✓'}
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
