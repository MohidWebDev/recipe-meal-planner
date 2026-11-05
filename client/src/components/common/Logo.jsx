import { CookingPot } from 'lucide-react';

export default function Logo({ showText = true }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-ink shadow-[0_6px_20px_-8px_rgba(212,255,36,0.7)] transition duration-300 group-hover:rotate-[-8deg]">
        <CookingPot className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
      </span>
      {showText && (
        <span className="font-display text-base leading-tight font-bold text-fg">
          Recipe <span className="text-accent">&amp;</span> Meal Planner
        </span>
      )}
    </span>
  );
}
