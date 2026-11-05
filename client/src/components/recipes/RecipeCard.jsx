import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
  const { _id, title, description, cuisine, cookTime, servings, tags = [], ingredients = [] } = recipe;

  return (
    <Link
      to={`/recipes/${_id}`}
      className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900 group-hover:text-emerald-700">{title}</h3>
        {cuisine && <span className="badge shrink-0 bg-emerald-50 text-emerald-700">{cuisine}</span>}
      </div>

      {description ? (
        <p className="mb-4 line-clamp-2 text-sm text-slate-500">{description}</p>
      ) : (
        <p className="mb-4 text-sm text-slate-400 italic">No description</p>
      )}

      <div className="mt-auto space-y-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          <span title="Cook time">⏱ {cookTime} min</span>
          <span title="Servings">
            🍽 {servings} serving{servings === 1 ? '' : 's'}
          </span>
          <span title="Ingredients">
            🧺 {ingredients.length} ingredient{ingredients.length === 1 ? '' : 's'}
          </span>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className="badge">
                #{tag}
              </span>
            ))}
            {tags.length > 4 && <span className="badge">+{tags.length - 4}</span>}
          </div>
        )}
      </div>
    </Link>
  );
}
