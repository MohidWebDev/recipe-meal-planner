import { ArrowRight, BookOpen, CalendarDays, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import DemoButton from "../common/DemoButton";

const HIGHLIGHTS = [
  { icon: BookOpen, label: "Save your recipes" },
  { icon: CalendarDays, label: "Plan 7 days" },
  { icon: ShoppingCart, label: "One shopping list" },
];

export default function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative isolate -mt-17 flex min-h-[min(100svh,58rem)] flex-col justify-end overflow-hidden">
      {/* Background photo */}
      <img
        src="/hero-bg.jpg"
        alt=""
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      {/* Overlays: darken the left for the text, fade into the page at the bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-ink/80 via-ink/30 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/40 to-ink/30"
      />

      {/* Copy */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-32 pb-12 sm:px-6 sm:pb-16">
        <div className="animate-fade-up">
          <h1 className="max-w-3xl text-5xl leading-[1.02] font-normal tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            Plan the week.
            <br />
            <span className="text-accent">Shop once.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-white/75 sm:text-lg">
            Save your favourite recipes, drop them into a 7-day meal grid, and
            get one combined shopping list. No more guessing what is for dinner
            or what to buy.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isAuthenticated ? (
              <Link to="/recipes" className="btn-accent px-6 py-3 text-base">
                Open your recipes
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-accent px-6 py-3 text-base">
                  Get started free
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <DemoButton />
              </>
            )}
          </div>

          {!isAuthenticated && (
            <p className="mt-4 text-xs text-white/55">
              Free to use · No credit card required
            </p>
          )}
        </div>
      </div>

      {/* Bottom strip: divider + highlights */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 border-t border-white/15 py-6 md:flex-row md:items-center md:justify-between">
          <p className="font-nav text-[11px] font-medium tracking-[0.16em] text-white/55 uppercase">
            Everything in one place
          </p>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 font-nav text-sm font-medium text-white/85"
              >
                <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
