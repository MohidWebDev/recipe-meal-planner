import {
  BarChart3,
  CalendarDays,
  Check,
  Search,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import Reveal from "./Reveal";

/* ---------- Mini illustrations (plain divs, no images) ---------- */

function RecipesArt() {
  const rows = [
    { name: "Chicken karahi", meta: "45 min", tag: "Dinner" },
    { name: "Veggie omelette", meta: "10 min", tag: "Breakfast" },
    { name: "Chana chaat", meta: "15 min", tag: "Snack" },
  ];
  return (
    <div className="mt-6 space-y-2" aria-hidden="true">
      <div className="flex items-center gap-2 rounded-xl border border-line bg-raised px-3 py-2 text-xs text-subtle">
        <Search className="h-3.5 w-3.5" />
        Search recipes…
      </div>
      {rows.map(({ name, meta, tag }) => (
        <div
          key={name}
          className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-2.5"
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-brand-light">
              <UtensilsCrossed className="h-4 w-4" />
            </span>
            <span className="truncate text-sm font-medium text-fg">{name}</span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="hidden text-xs text-subtle sm:inline">{meta}</span>
            <span className="badge">{tag}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function PlannerArt() {
  const filled = [
    1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1,
  ];
  return (
    <div className="mt-6 grid grid-cols-7 gap-1.5" aria-hidden="true">
      {filled.map((on, i) => (
        <span
          key={i}
          className={`h-6 rounded-md border ${
            on
              ? i === 9
                ? "border-accent/50 bg-accent/20"
                : "border-brand/40 bg-brand/25"
              : "border-line bg-raised"
          }`}
        />
      ))}
    </div>
  );
}

function ShoppingArt() {
  const items = [
    { name: "Tomatoes", qty: "6", note: "from 3 recipes", done: false },
    { name: "Onions", qty: "4", note: "from 2 recipes", done: false },
    { name: "Basmati rice", qty: "2 cups", note: "", done: true },
    { name: "Yogurt", qty: "500 g", note: "", done: true },
  ];
  return (
    <ul className="mt-6 space-y-2" aria-hidden="true">
      {items.map(({ name, qty, note, done }) => (
        <li
          key={name}
          className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5 text-sm"
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
              done ? "border-accent bg-accent text-ink" : "border-line-strong"
            }`}
          >
            {done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
          </span>
          <span
            className={`flex-1 truncate ${done ? "text-subtle line-through" : "text-fg"}`}
          >
            {name}
          </span>
          {note && (
            <span className="badge-accent hidden sm:inline-flex">{note}</span>
          )}
          <span className="text-xs text-subtle">{qty}</span>
        </li>
      ))}
    </ul>
  );
}

function StatsArt() {
  const bars = [40, 65, 50, 85, 60, 95, 55];
  return (
    <div className="mt-6 flex h-24 items-end gap-2" aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          style={{ height: `${h}%` }}
          className={`flex-1 rounded-t-md ${i === 5 ? "bg-accent" : "bg-brand/50"}`}
        />
      ))}
    </div>
  );
}

/* ---------- Tiles ---------- */

const TILES = [
  {
    icon: UtensilsCrossed,
    title: "Your recipe collection",
    text: "Create, edit and organise recipes with ingredients and cooking time. Search and page through them quickly.",
    art: RecipesArt,
    span: "md:col-span-4",
  },
  {
    icon: CalendarDays,
    title: "Weekly planner",
    text: "A 7-day grid with four meal slots per day.",
    art: PlannerArt,
    span: "md:col-span-2",
  },
  {
    icon: BarChart3,
    title: "Stats at a glance",
    text: "Quick numbers about your recipes and meal plans.",
    art: StatsArt,
    span: "md:col-span-2",
  },
  {
    icon: ShoppingCart,
    title: "Smart shopping list",
    text: "Planned meals are combined into one list. Repeated ingredients are merged, so you buy each thing once.",
    art: ShoppingArt,
    span: "md:col-span-4",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Features</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Everything you need to eat well, nothing you don't
          </h2>
          <p className="mt-4 text-muted">
            Four focused tools that work together.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          {TILES.map(({ icon: Icon, title, text, art: Art, span }, i) => (
            <Reveal
              as="article"
              key={title}
              delay={(i % 2) * 120}
              className={`card group relative overflow-hidden p-6 hover:border-line-strong ${span}`}
            >
              {/* Corner glow that brightens on hover */}
              <div
                className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand/20 blur-3xl transition duration-500 group-hover:bg-brand/35"
                aria-hidden="true"
              />

              <div className="relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line-strong bg-raised text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">
                  {text}
                </p>
                <Art />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
