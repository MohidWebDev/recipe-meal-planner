import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getErrorMessage } from '../api/axios';
import { deleteMealPlan, getMealPlans } from '../api/mealPlan.api';
import Loader from '../components/common/Loader';
import AddMealModal from '../components/planner/AddMealModal';
import StatsCard from '../components/planner/StatsCard';
import WeekGrid from '../components/planner/WeekGrid';
import useToast from '../hooks/useToast';
import {
  addDays,
  apiDateToKey,
  formatRange,
  fromDateKey,
  getWeekDays,
  isValidDateKey,
  startOfWeek,
  toDateKey,
} from '../utils/dateHelpers';

/** { 'YYYY-MM-DD': { breakfast: [...], lunch: [...] } } */
const groupMeals = (meals) =>
  meals.reduce((acc, meal) => {
    const day = apiDateToKey(meal.date);
    acc[day] ??= {};
    (acc[day][meal.mealType] ??= []).push(meal);
    return acc;
  }, {});

export default function Planner() {
  const toast = useToast();
  // The visible week is stored in the URL (?week=YYYY-MM-DD) so refreshes keep it.
  const [searchParams, setSearchParams] = useSearchParams();
  const weekParam = searchParams.get('week');
  const weekStart = useMemo(
    () => startOfWeek(isValidDateKey(weekParam) ? fromDateKey(weekParam) : new Date()),
    [weekParam]
  );
  const days = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const from = toDateKey(days[0]);
  const to = toDateKey(days[6]);
  const isCurrentWeek = from === toDateKey(startOfWeek());

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalTarget, setModalTarget] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [statsKey, setStatsKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');
    getMealPlans({ from, to })
      .then((data) => !ignore && setMeals(data))
      .catch((err) => !ignore && setError(getErrorMessage(err)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [from, to]);

  const mealsByDay = useMemo(() => groupMeals(meals), [meals]);

  const changeWeek = (offsetWeeks) => {
    const next = offsetWeeks === 0 ? startOfWeek() : addDays(weekStart, offsetWeeks * 7);
    const key = toDateKey(next);
    setSearchParams(key === toDateKey(startOfWeek()) ? {} : { week: key });
  };

  const handleSaved = (saved, isEdit) => {
    const dayKey = apiDateToKey(saved.date);
    const inThisWeek = dayKey >= from && dayKey <= to;
    setMeals((current) => {
      const others = current.filter((meal) => meal._id !== saved._id);
      return inThisWeek ? [...others, saved] : others;
    });
    setModalTarget(null);
    setStatsKey((key) => key + 1);
    toast.success(
      isEdit
        ? inThisWeek
          ? 'Meal updated.'
          : 'Meal moved to another week.'
        : `${saved.recipe?.title ?? 'Meal'} added to ${saved.mealType}.`
    );
  };

  const handleRemove = async (meal) => {
    setRemovingId(meal._id);
    try {
      await deleteMealPlan(meal._id);
      setMeals((current) => current.filter((item) => item._id !== meal._id));
      setStatsKey((key) => key + 1);
      toast.success('Meal removed from your plan.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meal planner</h1>
          <p className="text-sm text-slate-500">
            {formatRange(days[0], days[6])} · {meals.length} meal{meals.length === 1 ? '' : 's'} planned
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-lg border border-slate-300 bg-white">
            <button type="button" className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" onClick={() => changeWeek(-1)}>
              ‹ Previous
            </button>
            <button
              type="button"
              className="border-x border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:text-slate-400"
              onClick={() => changeWeek(0)}
              disabled={isCurrentWeek}
            >
              This week
            </button>
            <button type="button" className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100" onClick={() => changeWeek(1)}>
              Next ›
            </button>
          </div>
          <Link to={`/shopping-list?from=${from}&to=${to}`} className="btn-primary">
            🛒 Shopping list
          </Link>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <Loader label="Loading your week…" />
      ) : (
        <WeekGrid
          days={days}
          mealsByDay={mealsByDay}
          onAdd={(date, mealType) => setModalTarget({ mode: 'add', date, mealType })}
          onEdit={(meal) => setModalTarget({ mode: 'edit', meal })}
          onRemove={handleRemove}
          removingId={removingId}
        />
      )}

      <StatsCard refreshKey={statsKey} />

      <AddMealModal target={modalTarget} onClose={() => setModalTarget(null)} onSaved={handleSaved} />
    </div>
  );
}
