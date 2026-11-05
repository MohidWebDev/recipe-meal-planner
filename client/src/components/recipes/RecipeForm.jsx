import { useRef, useState } from 'react';
import { getErrorMessage, getFieldErrors } from '../../api/axios';
import { CUISINES } from '../../utils/constants';
import IngredientRows from './IngredientRows';

let rowKey = 0;
const newIngredient = (ingredient = {}) => ({
  key: `ing-${(rowKey += 1)}`, // stable React key for dynamic rows
  name: ingredient.name ?? '',
  quantity: ingredient.quantity ?? '',
  unit: ingredient.unit ?? '',
});

const toFormState = (recipe = {}) => ({
  title: recipe.title ?? '',
  description: recipe.description ?? '',
  cuisine: recipe.cuisine ?? '',
  cookTime: recipe.cookTime ?? '',
  servings: recipe.servings ?? '',
  instructions: recipe.instructions ?? '',
  tags: (recipe.tags ?? []).join(', '),
  ingredients: recipe.ingredients?.length ? recipe.ingredients.map(newIngredient) : [newIngredient()],
});

const isPositiveInt = (value) => /^\d+$/.test(String(value).trim()) && Number(value) >= 1;
const isPositiveNumber = (value) => String(value).trim() !== '' && Number(value) > 0;

/** Client-side mirror of the server's validation rules. */
const validateForm = (values) => {
  const errors = {};
  if (!values.title.trim()) errors.title = 'Title is required';
  else if (values.title.trim().length > 100) errors.title = 'Title cannot be longer than 100 characters';
  if (!isPositiveInt(values.cookTime)) errors.cookTime = 'Cook time must be a positive whole number of minutes';
  if (!isPositiveInt(values.servings)) errors.servings = 'Servings must be a positive whole number';
  if (values.description.length > 1000) errors.description = 'Description cannot be longer than 1000 characters';

  const filled = values.ingredients.filter((row) => row.name.trim() || String(row.quantity).trim() || row.unit.trim());
  if (filled.length === 0) errors.ingredients = 'At least one ingredient is required';

  values.ingredients.forEach((row, index) => {
    const isEmptyRow = !row.name.trim() && !String(row.quantity).trim() && !row.unit.trim();
    if (isEmptyRow && filled.length > 0) return; // blank extra rows are simply ignored
    if (!row.name.trim()) errors[`ingredients[${index}].name`] = 'Ingredient name is required';
    if (!isPositiveNumber(row.quantity)) errors[`ingredients[${index}].quantity`] = 'Quantity must be a positive number';
  });

  return errors;
};

/** Builds the JSON body the API expects. */
const toPayload = (values) => ({
  title: values.title.trim(),
  description: values.description.trim(),
  cuisine: values.cuisine.trim() || 'Other',
  cookTime: Number(values.cookTime),
  servings: Number(values.servings),
  instructions: values.instructions.trim(),
  tags: [...new Set(values.tags.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean))],
  ingredients: values.ingredients
    .filter((row) => row.name.trim() || String(row.quantity).trim() || row.unit.trim())
    .map((row) => ({ name: row.name.trim(), quantity: Number(row.quantity), unit: row.unit.trim() })),
});

/**
 * Remaps server error keys (which index the *filtered* ingredient list) back
 * onto the rows shown in the form.
 */
const remapIngredientErrors = (serverErrors, rows) => {
  const visibleIndexes = rows
    .map((row, index) => (row.name.trim() || String(row.quantity).trim() || row.unit.trim() ? index : null))
    .filter((index) => index !== null);

  return Object.fromEntries(
    Object.entries(serverErrors).map(([key, message]) => {
      const match = key.match(/^ingredients\[(\d+)\](.*)$/);
      if (!match) return [key, message];
      const formIndex = visibleIndexes[Number(match[1])] ?? Number(match[1]);
      return [`ingredients[${formIndex}]${match[2]}`, message];
    })
  );
};

export default function RecipeForm({ initialValues, onSubmit, submitLabel = 'Save recipe', onCancel }) {
  const [values, setValues] = useState(() => toFormState(initialValues));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);

  const clearError = (key) =>
    setErrors((current) => {
      if (!current[key] && !current.ingredients) return current;
      const next = { ...current };
      delete next[key];
      if (key.startsWith('ingredients')) delete next.ingredients;
      return next;
    });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    clearError(name);
  };

  const handleIngredientChange = (index, field, value) => {
    setValues((current) => ({
      ...current,
      ingredients: current.ingredients.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    }));
    clearError(`ingredients[${index}].${field}`);
  };

  const addIngredient = () =>
    setValues((current) => ({ ...current, ingredients: [...current.ingredients, newIngredient()] }));

  const removeIngredient = (index) => {
    setValues((current) => ({
      ...current,
      ingredients: current.ingredients.filter((_, i) => i !== index),
    }));
    // Row indexes shift after a removal, so drop stale ingredient errors.
    setErrors((current) =>
      Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith('ingredients[')))
    );
  };

  const focusFirstError = () => {
    requestAnimationFrame(() => formRef.current?.querySelector('.input-error')?.focus());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    const clientErrors = validateForm(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      focusFirstError();
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(toPayload(values));
    } catch (error) {
      const serverErrors = remapIngredientErrors(getFieldErrors(error), values.ingredients);
      setErrors(serverErrors);
      setFormError(getErrorMessage(error));
      focusFirstError();
      setSubmitting(false);
    }
  };

  const fieldClass = (name) => `input ${errors[name] ? 'input-error' : ''}`;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
      {formError && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      <section className="card space-y-4 p-5">
        <h2 className="font-semibold text-slate-900">Basics</h2>

        <div>
          <label htmlFor="title" className="label">
            Title <span className="text-red-500">*</span>
          </label>
          <input id="title" name="title" className={fieldClass('title')} value={values.title} onChange={handleChange} />
          {errors.title && <p className="field-error">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            className={fieldClass('description')}
            value={values.description}
            onChange={handleChange}
            placeholder="A short summary of the dish"
          />
          {errors.description && <p className="field-error">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="cuisine" className="label">
              Cuisine
            </label>
            <select id="cuisine" name="cuisine" className={fieldClass('cuisine')} value={values.cuisine} onChange={handleChange}>
              <option value="">Select…</option>
              {CUISINES.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
              {values.cuisine && !CUISINES.includes(values.cuisine) && (
                <option value={values.cuisine}>{values.cuisine}</option>
              )}
            </select>
            {errors.cuisine && <p className="field-error">{errors.cuisine}</p>}
          </div>
          <div>
            <label htmlFor="cookTime" className="label">
              Cook time (min) <span className="text-red-500">*</span>
            </label>
            <input
              id="cookTime"
              name="cookTime"
              type="number"
              min="1"
              inputMode="numeric"
              className={fieldClass('cookTime')}
              value={values.cookTime}
              onChange={handleChange}
            />
            {errors.cookTime && <p className="field-error">{errors.cookTime}</p>}
          </div>
          <div>
            <label htmlFor="servings" className="label">
              Servings <span className="text-red-500">*</span>
            </label>
            <input
              id="servings"
              name="servings"
              type="number"
              min="1"
              inputMode="numeric"
              className={fieldClass('servings')}
              value={values.servings}
              onChange={handleChange}
            />
            {errors.servings && <p className="field-error">{errors.servings}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="label">
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            className={fieldClass('tags')}
            value={values.tags}
            onChange={handleChange}
            placeholder="vegetarian, quick, dinner"
          />
          <p className="mt-1 text-xs text-slate-500">Separate tags with commas.</p>
          {errors.tags && <p className="field-error">{errors.tags}</p>}
        </div>
      </section>

      <section className="card space-y-4 p-5">
        <div>
          <h2 className="font-semibold text-slate-900">
            Ingredients <span className="text-red-500">*</span>
          </h2>
          <p className="text-sm text-slate-500">Quantities are for the number of servings above.</p>
        </div>
        {errors.ingredients && <p className="field-error">{errors.ingredients}</p>}
        <IngredientRows
          ingredients={values.ingredients}
          errors={errors}
          onChange={handleIngredientChange}
          onAdd={addIngredient}
          onRemove={removeIngredient}
        />
      </section>

      <section className="card space-y-2 p-5">
        <label htmlFor="instructions" className="font-semibold text-slate-900">
          Instructions
        </label>
        <textarea
          id="instructions"
          name="instructions"
          rows={7}
          className={fieldClass('instructions')}
          value={values.instructions}
          onChange={handleChange}
          placeholder={'1. Prep the ingredients\n2. ...'}
        />
        {errors.instructions && <p className="field-error">{errors.instructions}</p>}
      </section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
