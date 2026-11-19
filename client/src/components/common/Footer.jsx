import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Logo from "./Logo";
import SectionLink from "./SectionLink";

const SECTION_LINKS = [
  { id: "how-it-works", label: "How it works" },
  { id: "features", label: "Features" },
];

const APP_LINKS = [
  { to: "/recipes", label: "Recipes" },
  { to: "/planner", label: "Meal Planner" },
  { to: "/shopping-list", label: "Shopping List" },
];

const ACCOUNT_LINKS = [
  { to: "/login", label: "Log in" },
  { to: "/register", label: "Sign up" },
];

const linkClass =
  "text-sm text-muted transition hover:text-fg focus:outline-none focus-visible:text-accent";

const headingClass =
  "mb-3 text-xs font-semibold tracking-[0.16em] text-subtle uppercase";

export default function Footer() {
  const { isAuthenticated } = useAuth();

  const second = isAuthenticated
    ? { title: "App", links: APP_LINKS }
    : { title: "Account", links: ACCOUNT_LINKS };

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm text-subtle">
            Save recipes, plan your week, and shop once.
          </p>
        </div>

        <div className="flex gap-14">
          <nav aria-label="Product">
            <p className={headingClass}>Product</p>
            <ul className="space-y-2">
              {SECTION_LINKS.map(({ id, label }) => (
                <li key={id}>
                  <SectionLink id={id} className={linkClass}>
                    {label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={second.title}>
            <p className={headingClass}>{second.title}</p>
            <ul className="space-y-2">
              {second.links.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
