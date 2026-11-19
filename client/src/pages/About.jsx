import { BookOpen, CalendarDays, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import useAuth from "../hooks/useAuth";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Recipes",
    text: "Save your favourites with ingredients, servings and cooking time, then search and filter them in seconds.",
  },
  {
    icon: CalendarDays,
    title: "Meal planner",
    text: "Drop recipes into a 7-day grid with four meal slots a day, so the week is sorted before it starts.",
  },
  {
    icon: ShoppingCart,
    title: "Shopping list",
    text: "Planned meals are combined into one list. Repeated ingredients are merged and scaled to your servings.",
  },
];

const PRINCIPLES = [
  {
    title: "Simple by design",
    text: "No clutter and no learning curve. Add a recipe, plan a meal, and you're done.",
  },
  {
    title: "Saves you time",
    text: "One combined shopping list means no more rebuilding it from scratch every week.",
  },
  {
    title: "Built around you",
    text: "Your recipes, your servings, your week, all organised in one account.",
  },
];

export default function About() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const previous = document.title;
    document.title = "About · Recipe & Meal Planner";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <PageHeader
        eyebrow="About"
        title="Plan the week. Shop once."
        subtitle="A simple way to keep your recipes, your weekly meals and your groceries in one place."
      />

      <section className="card space-y-3 p-6">
        <h2 className="font-display text-xl font-semibold text-fg">
          Why it exists
        </h2>
        <p className="text-muted">
          Deciding what to cook and what to buy shouldn&apos;t take longer than
          the cooking itself. Recipes end up scattered across notes, tabs and
          screenshots, and the shopping list gets rebuilt from scratch every
          week.
        </p>
        <p className="text-muted">
          Recipe &amp; Meal Planner brings it together: save a recipe once, plan
          it into your week, and get a single shopping list with every
          ingredient merged, so you buy each thing once.
        </p>
      </section>

      <section aria-labelledby="about-features">
        <h2
          id="about-features"
          className="mb-4 font-display text-xl font-semibold text-fg"
        >
          What you can do
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-raised text-accent">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-fg">
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="about-principles">
        <h2
          id="about-principles"
          className="mb-4 font-display text-xl font-semibold text-fg"
        >
          What we care about
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {PRINCIPLES.map(({ title, text }) => (
            <div key={title} className="card p-5">
              <h3 className="font-display text-base font-semibold text-fg">
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link
          to={isAuthenticated ? "/recipes" : "/register"}
          className="btn-accent px-6 py-3 text-base"
        >
          {isAuthenticated ? "Back to your recipes" : "Get started free"}
        </Link>
      </div>
    </div>
  );
}
