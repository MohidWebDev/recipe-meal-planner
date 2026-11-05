import { ArrowLeft, Clock, Pencil, ShoppingBasket, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../api/axios';
import { deleteRecipe, getRecipe } from '../api/recipe.api';
import ConfirmModal from '../components/common/ConfirmModal';
import Loader from '../components/common/Loader';
import useToast from '../hooks/useToast';
import { formatQuantity, getCuisineEmoji } from '../utils/constants';
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
      <div role="alert" className="alert-error">
        {getErrorMessage(error)}
      </div>
    );
  }

  const { title, description, cuisine, cookTime, servings, tags = [], ingredients = [], instructions } = recipe;
  const steps = (instructions || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const stats = [
    { icon: Clock, label: 'Cook time', value: `${cookTime} min` },
    { icon: Users, label: 'Servings', value: servings },
    { icon: ShoppingBasket, label: 'Ingredients', value: ingredients.length },
  ];

  return (
    <article className="space-y-6">
      <Link to="/recipes" className="link inline-flex items-center gap-1.5 text-sm">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to recipes
      </Link>

      <header className="card relative animate-fade-up overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_120%_at_0%_0%,rgba(21,88,201,0.35),transparent_60%),radial-gradient(50%_90%_at_100%_100%,rgba(212,255,36,0.1),transparent_60%)]"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute -top-4 right-6 hidden text-[9rem] opacity-90 drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] sm:block"
          aria-hidden="true"
        >
          {getCuisineEmoji(cuisine)}
        </span>

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:pr-40">
            <div>
              {cuisine && <span className="badge-accent mb-3">{cuisine}</span>}
              <h1 className="text-3xl font-bold text-fg sm:text-4xl">{title}</h1>
              {description && <p className="mt-3 max-w-2xl leading-relaxed text-muted">{description}</p>}
            </div>

            <dl className="flex flex-wrap gap-3">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-line bg-ink/50 px-4 py-2.5">
                  <Icon className="h-5 w-5 text-brand-light" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-subtle">{label}</dt>
                    <dd className="font-display font-semibold text-fg">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/recipes?tag=${encodeURIComponent(tag)}`}
                    className="badge transition hover:border-accent/40 hover:text-accent"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Link to={`/recipes/${id}/edit`} className="btn-primary">
                <Pencil className="h-4 w-4" aria-hidden="true" /> Edit
              </Link>
              <button type="button" className="btn-secondary hover:border-danger/50 hover:text-danger" onClick={() => setConfirmOpen(true)}>
                <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
        <section className="card animate-fade-up p-6 [animation-delay:60ms]">
          <h2 className="mb-4 text-xl font-semibold text-fg">Ingredients</h2>
          <ul className="divide-y divide-line">
            {ingredients.map((ingredient, index) => (
              <li key={`${ingredient.name}-${index}`} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                <span className="flex items-center gap-3 text-fg">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  {ingredient.name}
                </span>
                <span className="shrink-0 font-semibold text-brand-light">
                  {formatQuantity(ingredient.quantity)} {ingredient.unit}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card animate-fade-up p-6 [animation-delay:120ms]">
          <h2 className="mb-4 text-xl font-semibold text-fg">Instructions</h2>
          {steps.length ? (
            <ol className="space-y-4 text-sm leading-relaxed text-muted">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand font-display text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-1 text-fg/90">{step.replace(/^\d+[.)]\s*/, '')}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-subtle italic">No instructions added yet.</p>
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
