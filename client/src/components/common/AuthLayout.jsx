import { CalendarDays, ShoppingCart, Sparkles } from 'lucide-react';

const FEATURES = [
  { icon: Sparkles, title: 'Your recipe box', text: 'Save recipes with ingredients, tags and steps.' },
  { icon: CalendarDays, title: 'Plan the week', text: 'Drop meals into a 7-day planner in seconds.' },
  { icon: ShoppingCart, title: 'Smart shopping list', text: 'Ingredients totalled and scaled to your servings.' },
];

/** Split layout for the login/register pages: brand panel on the left, form on the right. */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid items-center gap-10 py-4 lg:min-h-[calc(100vh-12rem)] lg:grid-cols-2 lg:gap-16">
      <section className="hidden animate-fade-up lg:block">
        <p className="eyebrow">Recipe &amp; Meal Planner</p>
        <h2 className="mt-4 text-5xl leading-[1.05] font-bold text-fg">
          Cook more.
          <br />
          Plan <span className="text-accent">smarter.</span>
          <br />
          Shop <span className="text-brand-light">less.</span>
        </h2>
        <ul className="mt-10 space-y-5">
          {FEATURES.map(({ icon: Icon, title: featureTitle, text }) => (
            <li key={featureTitle} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-raised text-accent">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold text-fg">{featureTitle}</span>
                <span className="text-sm text-muted">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-md animate-fade-up [animation-delay:80ms]">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-fg">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
        </div>
        {children}
      </section>
    </div>
  );
}
