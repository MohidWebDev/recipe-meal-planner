import { BookOpen, Plus, SearchX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getErrorMessage } from '../api/axios';
import { getRecipes } from '../api/recipe.api';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import RecipeCard from '../components/recipes/RecipeCard';
import RecipeCardSkeleton from '../components/recipes/RecipeCardSkeleton';
import RecipeFilters from '../components/recipes/RecipeFilters';
import useDebounce from '../hooks/useDebounce';
import { scrollToTop } from '../utils/smoothScroll';

const PAGE_SIZE = 9;
const FILTER_KEYS = ['search', 'cuisine', 'maxTime', 'ingredient', 'tag', 'sort', 'page'];

export default function Recipes() {
  // Search, filters and page live in the URL so they survive navigation and refreshes.
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(Number.parseInt(searchParams.get('page'), 10) || 1, 1);
  const filters = {
    search: searchParams.get('search') || '',
    cuisine: searchParams.get('cuisine') || '',
    maxTime: searchParams.get('maxTime') || '',
    ingredient: searchParams.get('ingredient') || '',
    tag: searchParams.get('tag') || '',
    sort: searchParams.get('sort') || 'newest',
  };

  // Text inputs update instantly; the URL (and the request) only after typing stops.
  const [searchInput, setSearchInput] = useState(filters.search);
  const [ingredientInput, setIngredientInput] = useState(filters.ingredient);
  const debouncedSearch = useDebounce(searchInput, 400);
  const debouncedIngredient = useDebounce(ingredientInput, 400);

  const [result, setResult] = useState({ data: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const updateParams = (updates, { resetPage = true } = {}) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === '' || value == null || (key === 'sort' && value === 'newest')) next.delete(key);
          else next.set(key, String(value));
        });
        if (resetPage) next.delete('page');
        return next;
      },
      { replace: true }
    );
  };

  // Push debounced text inputs into the URL.
  useEffect(() => {
    if (debouncedSearch.trim() !== filters.search) updateParams({ search: debouncedSearch.trim() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedIngredient.trim() !== filters.ingredient) updateParams({ ingredient: debouncedIngredient.trim() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedIngredient]);

  // If the URL changes from outside (e.g. the "Recipes" nav link), update the inputs to match.
  useEffect(() => {
    if (filters.search !== debouncedSearch.trim()) setSearchInput(filters.search);
    if (filters.ingredient !== debouncedIngredient.trim()) setIngredientInput(filters.ingredient);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.ingredient]);

  // Fetch whenever the URL query changes.
  const queryKey = FILTER_KEYS.map((key) => searchParams.get(key) || '').join('|');
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');

    getRecipes({ ...filters, page, limit: PAGE_SIZE })
      .then((data) => !ignore && setResult(data))
      .catch((err) => !ignore && setError(getErrorMessage(err)))
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  const handleFilterChange = (changes) => {
    if ('ingredient' in changes) {
      setIngredientInput(changes.ingredient);
      return;
    }
    updateParams(changes);
  };

  const resetFilters = () => {
    setSearchInput('');
    setIngredientInput('');
    setSearchParams({}, { replace: true });
  };

  const goToPage = (nextPage) => {
    updateParams({ page: nextPage > 1 ? nextPage : '' }, { resetPage: false });
    scrollToTop();
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => key !== 'sort' && value);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Your cookbook"
        title="My recipes"
        subtitle={
          loading
            ? 'Loading…'
            : `${result.total} recipe${result.total === 1 ? '' : 's'}${hasActiveFilters ? ' found' : ' saved'}`
        }
        actions={
          <Link to="/recipes/new" className="btn-accent">
            <Plus className="h-4 w-4" aria-hidden="true" /> New recipe
          </Link>
        }
      />

      <div className="card space-y-4 p-4 sm:p-5">
        <SearchBar value={searchInput} onChange={setSearchInput} placeholder="Search recipes by title…" />
        <RecipeFilters filters={{ ...filters, ingredient: ingredientInput }} onChange={handleFilterChange} onReset={resetFilters} />
      </div>

      {error && (
        <div role="alert" className="alert-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading recipes">
          {Array.from({ length: 6 }, (_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : result.data.length === 0 ? (
        !error &&
        (hasActiveFilters ? (
          <EmptyState
            icon={SearchX}
            title="No recipes match your filters"
            message="Try a different search term or clear the filters."
            action={
              <button type="button" className="btn-secondary" onClick={resetFilters}>
                Clear filters
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No recipes yet"
            message="Add your first recipe and start planning your week."
            action={
              <Link to="/recipes/new" className="btn-accent">
                <Plus className="h-4 w-4" aria-hidden="true" /> Add a recipe
              </Link>
            }
          />
        ))
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.map((recipe, index) => (
              <RecipeCard key={recipe._id} recipe={recipe} index={index} />
            ))}
          </div>
          <Pagination page={result.page} pages={result.pages} onPageChange={goToPage} />
        </>
      )}
    </div>
  );
}
