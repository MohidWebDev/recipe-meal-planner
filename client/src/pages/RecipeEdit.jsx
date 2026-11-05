import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../api/axios';
import { getRecipe, updateRecipe } from '../api/recipe.api';
import Loader from '../components/common/Loader';
import RecipeForm from '../components/recipes/RecipeForm';
import useToast from '../hooks/useToast';
import NotFound from './NotFound';

export default function RecipeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getRecipe(id)
      .then((data) => !ignore && setRecipe(data))
      .catch((err) => !ignore && setError(err))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleSubmit = async (payload) => {
    await updateRecipe(id, payload);
    toast.success('Recipe updated!');
    navigate(`/recipes/${id}`);
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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link to={`/recipes/${id}`} className="text-sm font-medium text-emerald-700 hover:underline">
          ← Back to recipe
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Edit recipe</h1>
      </div>
      <RecipeForm
        key={recipe._id}
        initialValues={recipe}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        onCancel={() => navigate(`/recipes/${id}`)}
      />
    </div>
  );
}
