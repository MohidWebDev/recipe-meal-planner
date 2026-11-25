import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Check,
  Search,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import Reveal from "./Reveal";

/* ---------- Small hooks ---------- */

/** Returns [ref, inView]. inView turns true once the element scrolls into view. */
function useInView(threshold = 0.4) {
  const ref = useRef(null);
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return [ref, inView];
}

/** Counts from 0 up to `target` once `active` becomes true. */
function useCountUp(target, active, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return undefined;
    }

    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3)))); // ease-out
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
}

/* ---------- Live mini-demos ---------- */

const RECIPES = [
  { name: "Chicken karahi", meta: "45 min", tag: "Dinner" },
  { name: "Veggie omelette", meta: "10 min", tag: "Breakfast" },
  { name: "Chana chaat", meta: "15 min", tag: "Snack" },
  { name: "Daal chawal", meta: "30 min", tag: "Lunch" },
  { name: "Beef biryani", meta: "60 min", tag: "Dinner" },
  { name: "Aloo paratha", meta: "20 min", tag: "Breakfast" },
];

function RecipesArt() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const matches = RECIPES.filter(
    ({ name, tag }) =>
      name.toLowerCase().includes(q) || tag.toLowerCase().includes(q),
  );
  const visible = matches.slice(0, 3);

  return (
    <div className="mt-6">
      <label className="flex items-center gap-2 rounded-xl border border-line bg-raised px-3 py-2 text-xs text-subtle transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/25">
        <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes…"
          aria-label="Search the sample recipes"
          className="w-full bg-transparent text-fg outline-none placeholder:text-subtle"
        />
      </label>

      <ul className="mt-2 min-h-[10.75rem] space-y-2" aria-live="polite">
        {visible.map(({ name, meta, tag }) => (
          <li
            key={name}
            className="flex animate-fade-in items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-2.5"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-brand-light">
                <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="truncate text-sm font-medium text-fg">
                {name}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="hidden text-xs text-subtle sm:inline">
                {meta}
              </span>
              <span className="badge">{tag}</span>
            </span>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="rounded-xl border border-dashed border-line px-3 py-6 text-center text-sm text-subtle">
            No recipes match "{query}"
          </li>
        )}
      </ul>

      <p className="mt-2 text-right text-xs text-subtle">
        Showing {visible.length} of {matches.length}
      </p>
    </div>
  );
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY = 9; // index of the highlighted "today" slot
// 7 days x 4 meal slots
const INITIAL_PLAN = [
  1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1,
  0, 0,
].map(Boolean);

function PlannerArt() {
  const [plan, setPlan] = useState(INITIAL_PLAN);
  const planned = plan.filter(Boolean).length;

  const toggle = (index) =>
    setPlan((prev) => prev.map((on, i) => (i === index ? !on : on)));

  return (
    <div className="mt-6">
      <div className="grid grid-cols-7 gap-1.5">
        {plan.map((on, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            aria-pressed={on}
            aria-label={`${DAYS[i % 7]}, meal slot ${Math.floor(i / 7) + 1}`}
            className={`h-6 rounded-md border transition duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
              on
                ? i === TODAY
                  ? "border-accent/50 bg-accent/20"
                  : "border-brand/40 bg-brand/25"
                : "border-line bg-raised hover:border-line-strong"
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-subtle">
        <span className="font-semibold text-fg tabular-nums">{planned}</span> of{" "}
        {plan.length} meals planned · tap a slot to try it
      </p>
    </div>
  );
}

const INITIAL_ITEMS = [
  { name: "Tomatoes", qty: "6", note: "from 3 recipes", done: false },
  { name: "Onions", qty: "4", note: "from 2 recipes", done: false },
  { name: "Basmati rice", qty: "2 cups", note: "", done: true },
  { name: "Yogurt", qty: "500 g", note: "", done: true },
];

function ShoppingArt() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const left = items.filter((item) => !item.done).length;

  const toggle = (name) =>
    setItems((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, done: !item.done } : item,
      ),
    );

  return (
    <div className="mt-6">
      <ul className="space-y-2">
        {items.map(({ name, qty, note, done }) => (
          <li key={name}>
            <button
              type="button"
              onClick={() => toggle(name)}
              aria-pressed={done}
              className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5 text-left text-sm transition duration-200 hover:border-line-strong hover:bg-raised focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition duration-200 ${
                  done
                    ? "border-accent bg-accent text-ink"
                    : "border-line-strong"
                }`}
              >
                {done && (
                  <Check
                    className="h-3.5 w-3.5 animate-fade-in"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                )}
              </span>
              <span
                className={`flex-1 truncate transition-colors ${
                  done ? "text-subtle line-through" : "text-fg"
                }`}
              >
                {name}
              </span>
              {note && (
                <span className="badge-accent hidden sm:inline-flex">
                  {note}
                </span>
              )}
              <span className="text-xs text-subtle">{qty}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-subtle" aria-live="polite">
        {left === 0
          ? "All done, happy cooking!"
          : `${left} ${left === 1 ? "item" : "items"} left to buy · tap to tick off`}
      </p>
    </div>
  );
}

const BARS = [40, 65, 50, 85, 60, 95, 55];

function StatsArt() {
  const [ref, inView] = useInView();
  const meals = useCountUp(24, inView);
  const recipes = useCountUp(8, inView, 900);

  return (
    <div ref={ref} className="mt-6">
      <div className="flex gap-8">
        <div>
          <p className="font-display text-3xl font-bold text-fg tabular-nums">
            {meals}
          </p>
          <p className="text-xs text-subtle">meals planned</p>
        </div>
        <div>
          <p className="font-display text-3xl font-bold text-accent tabular-nums">
            {recipes}
          </p>
          <p className="text-xs text-subtle">recipes saved</p>
        </div>
      </div>

      <div className="mt-5 flex h-24 items-end gap-2" aria-hidden="true">
        {BARS.map((h, i) => (
          <span
            key={i}
            style={{
              height: `${h}%`,
              transitionDelay: inView ? `${i * 70}ms` : "0ms",
            }}
            className={`flex-1 origin-bottom rounded-t-md transition-transform duration-700 ease-out-soft ${
              inView ? "scale-y-100" : "scale-y-0"
            } ${i === 5 ? "bg-accent" : "bg-brand/50"}`}
          />
        ))}
      </div>
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

/** Tracks the cursor inside a card so the spotlight can follow it. */
function handleSpotlight(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

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
              delay={i * 100}
              onMouseMove={handleSpotlight}
              className={`card group relative overflow-hidden p-6 hover:border-line-strong ${span}`}
            >
              {/* Corner glow that brightens on hover */}
              <div
                className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand/20 blur-3xl transition duration-500 group-hover:bg-brand/35"
                aria-hidden="true"
              />

              {/* Spotlight that follows the cursor */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--color-accent) 9%, transparent), transparent 70%)",
                }}
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
