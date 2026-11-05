import { ChartNoAxesColumn, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../api/axios';
import { getMealsByCuisine, getTopIngredients } from '../../api/stats.api';
import { getCuisineEmoji } from '../../utils/constants';

/** Small summary card powered by the two /stats aggregation endpoints. */
export default function StatsCard({ refreshKey = 0 }) {
  const [topIngredients, setTopIngredients] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    setError('');
    Promise.all([getTopIngredients(), getMealsByCuisine()])
      .then(([ingredients, byCuisine]) => {
        if (ignore) return;
        setTopIngredients(ingredients);
        setCuisines(byCuisine);
      })
      .catch((err) => !ignore && setError(getErrorMessage(err)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  return (
    <aside className="card animate-fade-up p-5 sm:p-6">
      <p className="eyebrow">Insights</p>
      <h2 className="mt-1 text-xl font-semibold text-fg">Your planning stats</h2>
      <p className="mb-5 text-sm text-muted">Across all of your planned meals.</p>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2" aria-hidden="true">
          <div className="space-y-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skeleton h-6" />
            ))}
          </div>
          <div className="skeleton h-8 w-2/3" />
        </div>
      ) : error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : topIngredients.length === 0 ? (
        <p className="text-sm text-muted">Plan a few meals to see your most-used ingredients.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-sans text-xs font-semibold tracking-wider text-subtle uppercase">
              <ChartNoAxesColumn className="h-3.5 w-3.5" aria-hidden="true" /> Top 5 ingredients
            </h3>
            <ol className="space-y-1">
              {topIngredients.map((item, index) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-raised"
                >
                  <span className="flex items-center gap-3 capitalize">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-md font-display text-xs font-bold ${
                        index === 0 ? 'bg-accent text-ink' : 'bg-raised text-muted ring-1 ring-line'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-fg">{item.name}</span>
                  </span>
                  <span className="text-muted">
                    {item.count} meal{item.count === 1 ? '' : 's'}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-sans text-xs font-semibold tracking-wider text-subtle uppercase">
              <Globe className="h-3.5 w-3.5" aria-hidden="true" /> Meals by cuisine
            </h3>
            <ul className="flex flex-wrap gap-2">
              {cuisines.map((item) => (
                <li
                  key={item.cuisine}
                  className="flex items-center gap-2 rounded-xl border border-line bg-raised py-1.5 pr-1.5 pl-2.5 text-sm text-fg transition-colors hover:border-line-strong"
                >
                  <span aria-hidden="true">{getCuisineEmoji(item.cuisine)}</span>
                  {item.cuisine}
                  <span className="rounded-lg bg-brand/20 px-2 py-0.5 text-xs font-bold text-brand-light">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </aside>
  );
}
