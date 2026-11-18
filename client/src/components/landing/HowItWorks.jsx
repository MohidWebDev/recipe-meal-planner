import { BookOpen, CalendarDays, ShoppingCart } from "lucide-react";

const STEPS = [
  {
    icon: BookOpen,
    title: "Save your recipes",
    text: "Add the dishes you love with ingredients, quantities and cooking time. Search and filter them whenever you need.",
    points: ["Ingredients and quantities", "Search and pagination"],
  },
  {
    icon: CalendarDays,
    title: "Plan the week",
    text: "Drop recipes into a 7-day grid with breakfast, lunch, dinner and snack slots. Move things around until it feels right.",
    points: ["7-day meal grid", "Four meal slots per day"],
  },
  {
    icon: ShoppingCart,
    title: "Get one shopping list",
    text: "Your planned meals are combined into a single list. Same ingredients are merged, so you only buy what you need.",
    points: ["Ingredients merged automatically", "Tick items off as you shop"],
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-line/60 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            From recipe to shopping list in three steps
          </h2>
          <p className="mt-4 text-muted">
            No spreadsheets, no scribbled notes. Everything stays in one place.
          </p>
        </div>

        <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
          {/* Connector line: runs behind the cards, so it only shows in the gaps between them */}
          <div
            className="absolute top-11.5 right-0 left-0 hidden h-px bg-linear-to-r from-line-strong via-brand/60 to-line-strong md:block"
            aria-hidden="true"
          />

          {STEPS.map(({ icon: Icon, title, text, points }, i) => (
            <li
              key={title}
              className="card relative z-10 bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-line-strong"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-display text-lg font-bold text-accent">
                  {i + 1}
                </span>
                <Icon className="h-6 w-6 text-brand-light" aria-hidden="true" />
              </div>

              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>

              <ul className="mt-5 space-y-2 border-t border-line pt-4">
                {points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2 text-xs text-subtle"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
