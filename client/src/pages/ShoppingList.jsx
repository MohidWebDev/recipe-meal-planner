import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getErrorMessage } from '../api/axios';
import { getShoppingList } from '../api/shoppingList.api';
import Loader from '../components/common/Loader';
import useToast from '../hooks/useToast';
import { formatQuantity } from '../utils/constants';
import { addDays, endOfWeek, formatRange, fromDateKey, isValidDateKey, startOfWeek, toDateKey } from '../utils/dateHelpers';

const itemKey = (item) => `${item.name}|${item.unit}`;
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const formatAmount = (item) => [formatQuantity(item.totalQuantity), item.unit].filter(Boolean).join(' ');

/** Copies text, falling back to a hidden textarea for older browsers / http. */
const copyText = async (text) => {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(textarea);
  if (!ok) throw new Error('Copy failed');
};

export default function ShoppingList() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Defaults to the current week; the planner links here with ?from=&to=.
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');
  const from = isValidDateKey(fromParam) ? fromParam : toDateKey(startOfWeek());
  const to = isValidDateKey(toParam) ? toParam : toDateKey(endOfWeek());
  const rangeError = from > to ? '"From" must be on or before "To".' : '';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState(() => new Set()); // client-side only

  useEffect(() => {
    if (rangeError) {
      setLoading(false);
      setItems([]);
      return undefined;
    }
    let ignore = false;
    setLoading(true);
    setError('');
    getShoppingList({ from, to })
      .then((data) => {
        if (ignore) return;
        setItems(data);
        // Keep ticks only for items that are still on the list.
        setChecked((current) => new Set(data.map(itemKey).filter((key) => current.has(key))));
      })
      .catch((err) => !ignore && setError(getErrorMessage(err)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [from, to, rangeError]);

  const setRange = (next) => setSearchParams({ from, to, ...next }, { replace: true });

  const setWeekRange = (offsetWeeks) => {
    const start = addDays(startOfWeek(), offsetWeeks * 7);
    setSearchParams({ from: toDateKey(start), to: toDateKey(addDays(start, 6)) }, { replace: true });
  };

  const toggle = (key) =>
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const remaining = useMemo(() => items.filter((item) => !checked.has(itemKey(item))), [items, checked]);

  const handleCopy = async () => {
    const list = remaining.length ? remaining : items;
    const heading = `Shopping list (${formatRange(fromDateKey(from), fromDateKey(to))})`;
    const lines = list.map((item) => `- ${capitalize(item.name)}: ${formatAmount(item)}`);
    try {
      await copyText([heading, '', ...lines].join('\n'));
      toast.success(`Copied ${list.length} item${list.length === 1 ? '' : 's'} to the clipboard.`);
    } catch {
      toast.error('Could not copy to the clipboard.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shopping list</h1>
          <p className="text-sm text-slate-500">
            Ingredients for every meal planned between {formatRange(fromDateKey(from), fromDateKey(to))}, scaled to your servings.
          </p>
        </div>
        <button type="button" className="btn-primary shrink-0" onClick={handleCopy} disabled={!items.length}>
          📋 Copy {remaining.length && remaining.length !== items.length ? 'remaining' : 'list'}
        </button>
      </div>

      <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-end">
        <div className="grid flex-1 grid-cols-2 gap-3">
          <div>
            <label htmlFor="from" className="label">
              From
            </label>
            <input
              id="from"
              type="date"
              className={`input ${rangeError ? 'input-error' : ''}`}
              value={from}
              onChange={(event) => event.target.value && setRange({ from: event.target.value })}
            />
          </div>
          <div>
            <label htmlFor="to" className="label">
              To
            </label>
            <input
              id="to"
              type="date"
              className={`input ${rangeError ? 'input-error' : ''}`}
              value={to}
              onChange={(event) => event.target.value && setRange({ to: event.target.value })}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={() => setWeekRange(0)}>
            This week
          </button>
          <button type="button" className="btn-secondary" onClick={() => setWeekRange(1)}>
            Next week
          </button>
        </div>
      </div>
      {rangeError && <p className="field-error -mt-4">{rangeError}</p>}

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <Loader label="Building your shopping list…" />
      ) : items.length === 0 ? (
        !error &&
        !rangeError && (
          <div className="card flex flex-col items-center px-6 py-14 text-center">
            <span className="text-4xl" aria-hidden="true">
              🛒
            </span>
            <h2 className="mt-3 font-semibold text-slate-900">Nothing to buy</h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500">No meals are planned for these dates yet.</p>
            <Link to="/planner" className="btn-primary mt-5">
              Plan some meals
            </Link>
          </div>
        )
      ) : (
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 text-sm">
            <span className="text-slate-600">
              <strong className="text-slate-900">{items.length - remaining.length}</strong> of {items.length} items ticked off
            </span>
            {checked.size > 0 && (
              <button type="button" className="font-medium text-emerald-700 hover:underline" onClick={() => setChecked(new Set())}>
                Untick all
              </button>
            )}
          </div>
          <ul className="divide-y divide-slate-100">
            {items.map((item) => {
              const key = itemKey(item);
              const isChecked = checked.has(key);
              return (
                <li key={key}>
                  <label className="flex cursor-pointer items-start gap-3 px-5 py-3 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-600"
                      checked={isChecked}
                      onChange={() => toggle(key)}
                    />
                    <span className="min-w-0 flex-1">
                      <span className={`block font-medium ${isChecked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {capitalize(item.name)}
                      </span>
                      {item.recipes?.length > 0 && (
                        <span className="block truncate text-xs text-slate-500">For: {item.recipes.join(', ')}</span>
                      )}
                    </span>
                    <span className={`shrink-0 text-sm font-semibold ${isChecked ? 'text-slate-400' : 'text-slate-700'}`}>
                      {formatAmount(item)}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
