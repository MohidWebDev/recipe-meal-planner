import { Home, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { scrollToTop } from "../../utils/smoothScroll";
import Logo from "./Logo";
import { APP_LINKS } from "./navLinks";
import UserMenu from "./UserMenu";

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition duration-200 ${
    isActive
      ? "bg-accent/10 text-accent"
      : "text-muted hover:bg-raised hover:text-fg"
  }`;

// Home / About links: icon on top with a small label on phones, icon + label in a row from sm up.
const centerLinkClass = ({ isActive }) =>
  `flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 text-[11px] font-medium transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:flex-row sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm ${
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <Link
          to="/"
          onClick={handleLogoClick}
          className={`${logoLinkClass} md:justify-self-start`}
          aria-label={onLanding ? "Back to top" : "Go to home page"}
        >
          <span className="lg:hidden">
            <Logo showText={false} />
          </span>
          <span className="hidden lg:inline">
            <Logo />
          </span>
        </Link>

        {/* Center: Home, the app links (desktop, logged-in), then About */}
        <nav
          className="flex items-center gap-1 md:justify-self-center"
          aria-label="Primary"
        >
          <NavLink
            to="/"
            end
            onClick={handleLogoClick}
            className={centerLinkClass}
          >
            <Home
              className="h-4.5 w-4.5 sm:h-3.75 sm:w-3.75"
              aria-hidden="true"
            />
            Home
          </NavLink>

          <div className="hidden items-center gap-1 md:flex">
            {APP_LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={linkClass} title={label}>
                <Icon className="h-3.75 w-3.75" aria-hidden="true" />
                {/* Labels show from xl up; smaller screens get icons only to save space */}
                <span className="hidden xl:inline">{label}</span>
                <span className="sr-only xl:hidden">{label}</span>
              </NavLink>
            ))}
          </div>

          <NavLink to="/about" className={centerLinkClass}>
            <Info
              className="h-4.5 w-4.5 sm:h-3.75 sm:w-3.75"
              aria-hidden="true"
            />
            About
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 lg:justify-self-end">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <span className="hidden sm:inline-flex">
                <NavLink to="/login" className={linkClass}>
                  Log in
                </NavLink>
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
