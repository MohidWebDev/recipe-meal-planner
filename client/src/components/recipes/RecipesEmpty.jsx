import { BookOpen, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getErrorMessage } from "../../api/axios";
import { createRecipe } from "../../api/recipe.api";
import { getCuisineEmoji } from "../../utils/constants";
import { SAMPLE_RECIPES } from "../../utils/sampleRecipes";

const PREVIEW = SAMPLE_RECIPES.slice(0, 3);

/** First-run state for an empty cookbook: a preview of what's coming plus two ways to start. */
export default function RecipesEmpty({ onLoaded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSamples = async () => {
    setLoading(true);
    setError("");
    try {
      // Created oldest-first so the samples appear in the listed order (newest first view).
      for (const recipe of [...SAMPLE_RECIPES].reverse()) {
        // eslint-disable-next-line no-await-in-loop
        await createRecipe(recipe);
      }
      onLoaded();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card relative flex animate-fade-up flex-col items-center overflow-hidden px-6 py-14 text-center">
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-56 w-96 -translate-x-1/2 rounded-full bg-brand/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-10 -bottom-24 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full">
        {/* Ghost preview of what the cookbook will look like */}
        <div
          className="mx-auto mb-10 hidden max-w-2xl grid-cols-3 gap-3 [mask-image:linear-gradient(to_bottom,black_30%,transparent)] sm:grid"
          aria-hidden="true"
        >
          {PREVIEW.map((recipe, i) => (
            <div
              key={recipe.title}
              style={{ opacity: 1 - i * 0.2 }}
              className="overflow-hidden rounded-xl border border-line bg-surface/70 text-left"
            >
              <div className="relative h-14 border-b border-line bg-[radial-gradient(120%_120%_at_0%_0%,rgba(21,88,201,0.4),transparent_60%)]">
                <span className="absolute -bottom-1 right-3 text-3xl">
                  {getCuisineEmoji(recipe.cuisine)}
                </span>
              </div>
              <div className="space-y-1 p-3">
                <p className="truncate text-xs font-semibold text-fg">
                  {recipe.title}
                </p>
                <p className="text-[11px] text-subtle">
                  {recipe.cookTime} min · Serves {recipe.servings}
                </p>
              </div>
            </div>
          ))}
        </div>

        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
          <BookOpen className="h-6 w-6" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-semibold text-fg">
          Your cookbook is empty
        </h2>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
          Add your own recipe, or start with a few samples and see how planning
          works.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/recipes/new" className="btn-accent">
            <Plus className="h-4 w-4" aria-hidden="true" /> Add a recipe
          </Link>
          <button
            type="button"
            className="btn-secondary"
            onClick={loadSamples}
            disabled={loading}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {loading ? "Adding samples…" : "Load sample recipes"}
          </button>
        </div>

        {error && (
          <p role="alert" className="field-error mt-4">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
