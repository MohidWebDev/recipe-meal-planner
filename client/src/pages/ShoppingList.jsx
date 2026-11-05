import { Check, Copy, RotateCcw, ShoppingCart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getErrorMessage } from '../api/axios';
import { getShoppingList } from '../api/shoppingList.api';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
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

  const tickedCount = items.length - remaining.length;
  const progress = items.length ? Math.round((tickedCount / items.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        eyebrow="Groceries"
        title="Shopping list"
        subtitle={`Everything for ${formatRange(fromDateKey(from), fromDateKey(to))}, scaled to your servings.`}
        actions={
          <button type="button" className="btn-accent" onClick={handleCopy} disabled={!items.length}>
            <Copy className="h-4 w-4" aria-hidden="true" />
            Copy {remaining.length && remaining.length !== items.length ? 'remaining' : 'list'}
          </button>
        }
      />

      <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:p-5">
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
          <button type="button" className="btn-secondary flex-1 sm:flex-none" onClick={() => setWeekRange(0)}>
            This week
          </button>
          <button type="button" className="btn-secondary flex-1 sm:flex-none" onClick={() => setWeekRange(1)}>
            Next week
          </button>
        </div>
      </div>
      {rangeError && <p className="field-error -mt-4">{rangeError}</p>}

      {error && (
        <div role="alert" className="alert-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card space-y-3 p-5" role="status" aria-label="Building your shopping list">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton h-10" />
          ))}
        </div>
      ) : items.length === 0 ? (
        !error &&
        !rangeError && (
          <EmptyState
            icon={ShoppingCart}
            title="Nothing to buy"
            message="No meals are planned for these dates yet."
            action={
              <Link to="/planner" className="btn-primary">
                Plan some meals
              </Link>
            }
          />
        )
      ) : (
        <section className="card animate-fade-up overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">
                <strong className="font-display text-base text-fg">{tickedCount}</strong> of {items.length} items ticked off
              </span>
              {checked.size > 0 && (
                <button type="button" className="link inline-flex items-center gap-1.5 text-sm" onClick={() => setChecked(new Set())}>
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Untick all
                </button>
              )}
            </div>
            <div
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-raised"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Shopping progress"
            >
              <div className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <ul className="divide-y divide-line">
            {items.map((item) => {
              const key = itemKey(item);
              const isChecked = checked.has(key);
              return (
                <li key={key}>
                  <label className="group flex cursor-pointer items-center gap-4 px-5 py-3.5 transition-colors duration-200 hover:bg-raised/60">
                    <span className="relative flex h-5 w-5 shrink-0">
                      <input
                        type="checkbox"
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-line-strong bg-raised transition duration-200 checked:border-accent checked:bg-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none group-hover:border-subtle"
                        checked={isChecked}
                        onChange={() => toggle(key)}
                      />
                      <Check
                        className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 scale-50 text-ink opacity-0 transition duration-200 peer-checked:scale-100 peer-checked:opacity-100"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block font-medium transition-colors duration-200 ${isChecked ? 'text-subtle line-through' : 'text-fg'}`}>
                        {capitalize(item.name)}
                      </span>
                      {item.recipes?.length > 0 && (
                        <span className="block truncate text-xs text-subtle">For: {item.recipes.join(', ')}</span>
                      )}
                    </span>
                    <span
                      className={`shrink-0 rounded-lg px-2.5 py-1 text-sm font-semibold transition-colors duration-200 ${
                        isChecked ? 'text-subtle' : 'bg-brand/15 text-brand-light'
                      }`}
                    >
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
