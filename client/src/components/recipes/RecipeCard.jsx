import { Clock, ShoppingBasket, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCuisineEmoji } from '../../utils/constants';

export default function RecipeCard({ recipe, index = 0 }) {
  const { _id, title, description, cuisine, cookTime, servings, tags = [], ingredients = [] } = recipe;

  return (
    <Link
      to={`/recipes/${_id}`}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className="group card flex animate-fade-up flex-col overflow-hidden transition duration-300 ease-out hover:-translate-y-1 hover:border-brand/60 hover:shadow-[0_18px_40px_-20px_rgba(21,88,201,0.7)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* Cover: recipes have no photos yet, so show a gradient with the cuisine's emoji */}
      <div className="relative h-28 overflow-hidden border-b border-line bg-[radial-gradient(120%_120%_at_0%_0%,rgba(21,88,201,0.45),transparent_60%),radial-gradient(80%_80%_at_100%_100%,rgba(212,255,36,0.12),transparent_60%)]">
        {cuisine && <span className="badge absolute top-3 left-4 border-white/10 bg-ink/60 text-fg backdrop-blur">{cuisine}</span>}
        <span
          className="absolute right-4 -bottom-2 text-6xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transition duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-[-6deg]"
          aria-hidden="true"
        >
          {getCuisineEmoji(cuisine)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg leading-snug font-semibold text-fg transition-colors group-hover:text-accent">{title}</h3>
        <p className={`mt-1.5 mb-4 line-clamp-2 text-sm ${description ? 'text-muted' : 'text-subtle italic'}`}>
          {description || 'No description'}
        </p>

        <div className="mt-auto space-y-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted">
            <span className="flex items-center gap-1.5" title="Cook time">
              <Clock className="h-4 w-4 text-brand-light" aria-hidden="true" /> {cookTime} min
            </span>
            <span className="flex items-center gap-1.5" title="Servings">
              <Users className="h-4 w-4 text-brand-light" aria-hidden="true" /> {servings}
            </span>
            <span className="flex items-center gap-1.5" title="Ingredients">
              <ShoppingBasket className="h-4 w-4 text-brand-light" aria-hidden="true" /> {ingredients.length} ingredient
              {ingredients.length === 1 ? '' : 's'}
            </span>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="badge">
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && <span className="badge">+{tags.length - 3}</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
