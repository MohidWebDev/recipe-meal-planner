import { Link, useNavigate } from 'react-router-dom';
import { createRecipe } from '../api/recipe.api';
import RecipeForm from '../components/recipes/RecipeForm';
import useToast from '../hooks/useToast';

export default function RecipeCreate() {
  const navigate = useNavigate();
  const toast = useToast();

  // Errors are thrown back to RecipeForm, which maps them onto fields.
  const handleSubmit = async (payload) => {
    const recipe = await createRecipe(payload);
    toast.success('Recipe created!');
    navigate(`/recipes/${recipe._id}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link to="/recipes" className="text-sm font-medium text-emerald-700 hover:underline">
          ← Back to recipes
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">New recipe</h1>
      </div>
      <RecipeForm onSubmit={handleSubmit} submitLabel="Create recipe" onCancel={() => navigate('/recipes')} />
    </div>
  );
}
