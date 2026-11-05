import { ArrowLeft } from 'lucide-react';
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
      <div role="alert" className="alert-error">
        {getErrorMessage(error)}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-up space-y-6">
      <div>
        <Link to={`/recipes/${id}`} className="link inline-flex items-center gap-1.5 text-sm">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to recipe
        </Link>
        <p className="eyebrow mt-5">Cookbook</p>
        <h1 className="mt-1 text-3xl font-bold text-fg sm:text-4xl">Edit recipe</h1>
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
