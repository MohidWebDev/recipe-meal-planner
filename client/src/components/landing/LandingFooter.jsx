import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Logo from "../common/Logo";

const PRODUCT_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
];

const linkClass =
  "text-sm text-muted transition hover:text-fg focus:outline-none focus-visible:text-accent";

export default function LandingFooter() {
  const { isAuthenticated } = useAuth();
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
            <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-subtle uppercase">
              Product
            </p>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {!isAuthenticated && (
            <nav aria-label="Account">
              <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-subtle uppercase">
                Account
              </p>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className={linkClass}>
                    Log in
                  </Link>
                </li>
                <li>
                  <Link to="/register" className={linkClass}>
                    Sign up
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      <div className="border-t border-line py-5 text-center text-xs text-subtle">
        Recipe <span className="text-accent">&amp;</span> Meal Planner · MERN
        capstone
      </div>
    </footer>
  );
}
