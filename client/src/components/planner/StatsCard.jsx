import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../api/axios';
import { getMealsByCuisine, getTopIngredients } from '../../api/stats.api';

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
    <aside className="card p-5">
      <h2 className="font-semibold text-slate-900">Your planning stats</h2>
      <p className="mb-4 text-sm text-slate-500">Across all of your planned meals.</p>

      {loading ? (
        <p className="text-sm text-slate-500">Loading stats…</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : topIngredients.length === 0 ? (
        <p className="text-sm text-slate-500">Plan a few meals to see your most-used ingredients.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">Top 5 ingredients</h3>
            <ol className="space-y-1.5">
              {topIngredients.map((item, index) => (
                <li key={item.name} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 capitalize">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                      {index + 1}
                    </span>
                    {item.name}
                  </span>
                  <span className="text-slate-500">
                    {item.count} meal{item.count === 1 ? '' : 's'}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">Meals by cuisine</h3>
            <ul className="flex flex-wrap gap-2">
              {cuisines.map((item) => (
                <li key={item.cuisine} className="badge gap-1.5 bg-slate-100 py-1 text-slate-700">
                  {item.cuisine}
                  <span className="rounded-full bg-white px-1.5 text-xs font-semibold text-slate-600">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </aside>
  );
}
