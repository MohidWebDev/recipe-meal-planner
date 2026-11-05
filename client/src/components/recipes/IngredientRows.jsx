import { Plus, X } from 'lucide-react';
import { COMMON_UNITS } from '../../utils/constants';

/** Dynamic list of { name, quantity, unit } rows used inside RecipeForm. */
export default function IngredientRows({ ingredients, errors = {}, onChange, onAdd, onRemove }) {
  return (
    <div className="space-y-3">
      <datalist id="unit-options">
        {COMMON_UNITS.map((unit) => (
          <option key={unit} value={unit} />
        ))}
      </datalist>

      <div className="hidden grid-cols-[1fr_7rem_7rem_2.5rem] gap-2 px-1 text-xs font-semibold tracking-wider text-subtle uppercase sm:grid">
        <span>Ingredient</span>
        <span>Quantity</span>
        <span>Unit</span>
        <span />
      </div>

      {ingredients.map((ingredient, index) => {
        const nameError = errors[`ingredients[${index}].name`];
        const quantityError = errors[`ingredients[${index}].quantity`];
        const unitError = errors[`ingredients[${index}].unit`];

        return (
          <div key={ingredient.key} className="animate-fade-up rounded-xl border border-line p-3 sm:border-0 sm:p-0">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_7rem_7rem_2.5rem]">
              <div className="col-span-2 sm:col-span-1">
                <label className="sr-only" htmlFor={`ing-name-${index}`}>
                  Ingredient {index + 1} name
                </label>
                <input
                  id={`ing-name-${index}`}
                  className={`input ${nameError ? 'input-error' : ''}`}
                  placeholder="e.g. Chicken breast"
                  value={ingredient.name}
                  onChange={(event) => onChange(index, 'name', event.target.value)}
                />
              </div>
              <div>
                <label className="sr-only" htmlFor={`ing-qty-${index}`}>
                  Ingredient {index + 1} quantity
                </label>
                <input
                  id={`ing-qty-${index}`}
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  className={`input ${quantityError ? 'input-error' : ''}`}
                  placeholder="Qty"
                  value={ingredient.quantity}
                  onChange={(event) => onChange(index, 'quantity', event.target.value)}
                />
              </div>
              <div className="flex gap-2 sm:contents">
                <div className="flex-1">
                  <label className="sr-only" htmlFor={`ing-unit-${index}`}>
                    Ingredient {index + 1} unit
                  </label>
                  <input
                    id={`ing-unit-${index}`}
                    list="unit-options"
                    className={`input ${unitError ? 'input-error' : ''}`}
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(event) => onChange(index, 'unit', event.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="icon-btn h-[42px] w-10 shrink-0 hover:bg-danger/10 hover:text-danger"
                  onClick={() => onRemove(index)}
                  disabled={ingredients.length === 1}
                  aria-label={`Remove ingredient ${index + 1}`}
                  title="Remove ingredient"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {(nameError || quantityError || unitError) && (
              <p className="field-error">{[nameError, quantityError, unitError].filter(Boolean).join(' · ')}</p>
            )}
          </div>
        );
      })}

      <button type="button" className="btn-secondary" onClick={onAdd}>
        <Plus className="h-4 w-4" aria-hidden="true" /> Add ingredient
      </button>
    </div>
  );
}
