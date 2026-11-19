import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { scrollToTop } from "../../utils/smoothScroll";
import DemoButton from "./DemoButton";
import Logo from "./Logo";
import { APP_LINKS } from "./navLinks";
import UserMenu from "./UserMenu";

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition duration-200 ${
    isActive
      ? "bg-accent/10 text-accent"
      : "text-muted hover:bg-raised hover:text-fg"
  }`;

const logoLinkClass =
  "group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const onLanding = pathname === "/";
  const onRecipeForm =
    pathname === "/recipes/new" || pathname.endsWith("/edit");

  // On the landing page the logo scrolls to the top instead of navigating.
  const handleLogoClick = (event) => {
    if (!onLanding) return;
    event.preventDefault();
    scrollToTop();
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  };

  // Slightly stronger background once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300 ${
        scrolled ? "border-line bg-ink/85" : "border-transparent bg-ink/40"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          onClick={handleLogoClick}
          className={logoLinkClass}
          aria-label={onLanding ? "Back to top" : "Go to home page"}
        >
          <span className="sm:hidden">
            <Logo showText={false} />
          </span>
          <span className="hidden sm:inline">
            <Logo />
          </span>
        </Link>

        {isAuthenticated && !onLanding && (
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {APP_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={linkClass}>
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              {onLanding ? (
                <Link to="/recipes" className="btn-accent py-2">
                  Open app
                </Link>
              ) : (
                !onRecipeForm && (
                  <Link
                    to="/recipes/new"
                    className="btn-accent py-2"
                    aria-label="New recipe"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">New recipe</span>
                  </Link>
                )
              )}
              <UserMenu />
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Log in
              </NavLink>
              <span className="hidden sm:inline-flex">
                <DemoButton className="btn-secondary py-2" />
              </span>
              <Link to="/register" className="btn-accent py-2">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
