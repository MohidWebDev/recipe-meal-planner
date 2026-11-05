import { ArrowLeft } from 'lucide-react';
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
    <div className="mx-auto max-w-3xl animate-fade-up space-y-6">
      <div>
        <Link to="/recipes" className="link inline-flex items-center gap-1.5 text-sm">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to recipes
        </Link>
        <p className="eyebrow mt-5">Cookbook</p>
        <h1 className="mt-1 text-3xl font-bold text-fg sm:text-4xl">New recipe</h1>
      </div>
      <RecipeForm onSubmit={handleSubmit} submitLabel="Create recipe" onCancel={() => navigate('/recipes')} />
    </div>
  );
}
