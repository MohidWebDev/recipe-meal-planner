import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../api/axios';
import { deleteRecipe, getRecipe } from '../api/recipe.api';
import ConfirmModal from '../components/common/ConfirmModal';
import Loader from '../components/common/Loader';
import useToast from '../hooks/useToast';
import { formatQuantity } from '../utils/constants';
import NotFound from './NotFound';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    getRecipe(id)
      .then((data) => !ignore && setRecipe(data))
      .catch((err) => !ignore && setError(err))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { removedMealPlans } = await deleteRecipe(id);
      toast.success(
        removedMealPlans
          ? `Recipe deleted (and removed from ${removedMealPlans} planned meal${removedMealPlans === 1 ? '' : 's'}).`
          : 'Recipe deleted.'
      );
      navigate('/recipes', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) return <Loader label="Loading recipe…" />;

  if (error) {
    const status = error.response?.status;
    if (status === 404 || status === 400) {
      return <NotFound title="Recipe not found" message="This recipe doesn't exist or belongs to another account." />;
    }
    return (
      <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {getErrorMessage(error)}
      </div>
    );
  }

  const { title, description, cuisine, cookTime, servings, tags = [], ingredients = [], instructions } = recipe;
  const steps = (instructions || '').split('\n').map((line) => line.trim()).filter(Boolean);

  return (
    <article className="space-y-6">
      <Link to="/recipes" className="text-sm font-medium text-emerald-700 hover:underline">
        ← Back to recipes
      </Link>

      <header className="card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {cuisine && <span className="badge mb-2 bg-emerald-50 text-emerald-700">{cuisine}</span>}
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
            {description && <p className="mt-2 max-w-2xl text-slate-600">{description}</p>}
          </div>
          <div className="flex shrink-0 gap-2">
            <Link to={`/recipes/${id}/edit`} className="btn-secondary">
              Edit
            </Link>
            <button type="button" className="btn-danger" onClick={() => setConfirmOpen(true)}>
              Delete
            </button>
          </div>
        </div>

        <dl className="mt-5 flex flex-wrap gap-6 border-t border-slate-100 pt-5 text-sm">
          <div>
            <dt className="text-slate-500">Cook time</dt>
            <dd className="font-semibold text-slate-900">{cookTime} min</dd>
          </div>
          <div>
            <dt className="text-slate-500">Servings</dt>
            <dd className="font-semibold text-slate-900">{servings}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Ingredients</dt>
            <dd className="font-semibold text-slate-900">{ingredients.length}</dd>
          </div>
        </dl>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Link key={tag} to={`/recipes?tag=${encodeURIComponent(tag)}`} className="badge hover:bg-emerald-50 hover:text-emerald-700">
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <section className="card p-6">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Ingredients</h2>
          <ul className="divide-y divide-slate-100">
            {ingredients.map((ingredient, index) => (
              <li key={`${ingredient.name}-${index}`} className="flex justify-between gap-4 py-2 text-sm">
                <span className="text-slate-800">{ingredient.name}</span>
                <span className="shrink-0 font-medium text-slate-600">
                  {formatQuantity(ingredient.quantity)} {ingredient.unit}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Instructions</h2>
          {steps.length ? (
            <ol className="space-y-3 text-sm leading-relaxed text-slate-700">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step.replace(/^\d+[.)]\s*/, '')}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-slate-400 italic">No instructions added yet.</p>
          )}
        </section>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete recipe?"
        message={`"${title}" will be permanently deleted and removed from any meal plans. This cannot be undone.`}
        confirmLabel="Delete recipe"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </article>
  );
}
