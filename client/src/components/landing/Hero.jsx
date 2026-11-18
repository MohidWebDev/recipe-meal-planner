import { ArrowRight, Check, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import DemoButton from "./DemoButton";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY = 2; // Wed, highlighted in the mock

// true = a recipe is planned in that slot
const PLAN = [
  { meal: "Breakfast", slots: [true, true, true, false, true, true, false] },
  { meal: "Lunch", slots: [true, false, true, true, false, true, true] },
  { meal: "Dinner", slots: [true, true, true, true, true, false, true] },
];

const SHOPPING_PREVIEW = [
  { name: "Chicken breast", qty: "600 g", done: true },
  { name: "Basmati rice", qty: "2 cups", done: true },
  { name: "Tomatoes", qty: "6", done: false },
];

function PlannerMock() {
  return (
    <div className="relative">
      {/* Soft glow behind the card */}
      <div
        className="absolute -inset-6 -z-10 rounded-4xl bg-brand/25 blur-3xl"
        aria-hidden="true"
      />

      <div className="card p-4 shadow-2xl shadow-black/40 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="font-display text-sm font-semibold text-fg">
            This week
          </p>
          <span className="badge-accent">17 meals planned</span>
        </div>

        <div className="grid grid-cols-[auto_repeat(7,minmax(0,1fr))] items-center gap-1.5 sm:gap-2">
          {/* Day headers */}
          <span aria-hidden="true" />
          {DAYS.map((day, i) => (
            <span
              key={day}
              className={`text-center text-[10px] font-semibold sm:text-xs ${
                i === TODAY ? "text-accent" : "text-subtle"
              }`}
            >
              {day}
            </span>
          ))}

          {/* Meal rows */}
          {PLAN.map(({ meal, slots }) => (
            <MealRow key={meal} meal={meal} slots={slots} />
          ))}
        </div>
      </div>

      {/* Floating shopping list preview */}
      <div className="card absolute -bottom-8 -left-2 hidden w-56 p-4 shadow-xl shadow-black/40 sm:block lg:-left-8">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-fg">
          <ShoppingCart
            className="h-3.5 w-3.5 text-accent"
            aria-hidden="true"
          />
          Shopping list
        </p>
        <ul className="space-y-2">
          {SHOPPING_PREVIEW.map(({ name, qty, done }) => (
            <li key={name} className="flex items-center gap-2 text-xs">
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  done
                    ? "border-accent bg-accent text-ink"
                    : "border-line-strong"
                }`}
                aria-hidden="true"
              >
                {done && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span
                className={`flex-1 truncate ${done ? "text-subtle line-through" : "text-muted"}`}
              >
                {name}
              </span>
              <span className="text-subtle">{qty}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MealRow({ meal, slots }) {
  return (
    <>
      <span className="pr-1 text-[10px] font-medium text-subtle sm:pr-2 sm:text-xs">
        <span className="sm:hidden">{meal[0]}</span>
        <span className="hidden sm:inline">{meal}</span>
      </span>
      {slots.map((filled, i) => (
        <span
          key={i}
          className={`h-7 rounded-md border sm:h-9 sm:rounded-lg ${
            filled
              ? i === TODAY
                ? "border-accent/50 bg-accent/20"
                : "border-brand/40 bg-brand/25"
              : "border-line bg-raised"
          }`}
        />
      ))}
    </>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pt-16 pb-24 sm:px-6 sm:pt-20 lg:grid-cols-2 lg:gap-12 lg:pt-28 lg:pb-32">
        {/* Copy */}
        <div className="animate-fade-up">
          <span className="badge-accent">
            Recipes · Planner · Shopping list
          </span>

          <h1 className="mt-5 text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
            Plan the week.
            <br />
            <span className="text-accent">Shop once.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-muted sm:text-lg">
            Save your favourite recipes, drop them into a 7-day meal grid, and
            get one combined shopping list. No more guessing what is for dinner
            or what to buy.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="btn-accent px-6 py-3 text-base">
              Get started free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/register" className="btn-accent px-6 py-3 text-base">
              Get started free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <DemoButton />
          </div>

          <p className="mt-4 text-xs text-subtle">
            Free to use · No credit card required
          </p>
        </div>

        {/* Visual */}
        <div className="animate-fade-up pb-8 [animation-delay:120ms] lg:pb-0">
          <PlannerMock />
        </div>
      </div>
    </section>
  );
}
