import {
  BookOpen,
  CalendarDays,
  LogOut,
  Menu,
  ShoppingCart,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { scrollToTop } from "../../utils/smoothScroll";
import Logo from "./Logo";
import SectionLink from "./SectionLink";

const LINKS = [
  { to: "/recipes", label: "Recipes", icon: BookOpen },
  { to: "/planner", label: "Meal Planner", icon: CalendarDays },
  { to: "/shopping-list", label: "Shopping List", icon: ShoppingCart },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition duration-200 ${
    isActive
      ? "bg-accent/10 text-accent"
      : "text-muted hover:bg-raised hover:text-fg"
  }`;

const sectionLinkClass =
  "rounded-xl px-3.5 py-2 text-sm font-medium text-muted transition duration-200 hover:bg-raised hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const logoLinkClass =
  "group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

/**
 * Optional props (used by the landing page):
 *  - sectionLinks: [{ href: '#features', label: 'Features' }] shown to logged-out visitors
 *  - logoHref: makes the logo a plain anchor (e.g. '#top') instead of a route link
 */
export default function Navbar({ sectionLinks = [], logoHref }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const hasSections = !isAuthenticated && sectionLinks.length > 0;
  const closeMenu = () => setMenuOpen(false);

  const handleLogoClick = (event) => {
    event.preventDefault();
    scrollToTop();
    // Remove a leftover hash (e.g. #features) without adding a history entry
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  };

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Slightly stronger background once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logo = (
    <>
      <span className="sm:hidden">
        <Logo showText={false} />
      </span>
      <span className="hidden sm:inline">
        <Logo />
      </span>
    </>
  );

  const menuButton = (
    <button
      type="button"
      className="icon-btn md:hidden"
      onClick={() => setMenuOpen((open) => !open)}
      aria-expanded={menuOpen}
      aria-label="Toggle menu"
    >
      {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-line bg-ink/85"
          : "border-transparent bg-ink/40"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {logoHref ? (
          <a
            href={logoHref}
            onClick={handleLogoClick}
            className={logoLinkClass}
            aria-label="Back to top"
          >
            {logo}
          </a>
        ) : (
          <Link to="/" className={logoLinkClass} aria-label="Go to home page">
            {logo}
          </Link>
        )}

        {isAuthenticated ? (
          <>
            <nav className="hidden items-center gap-1 md:flex">
              {LINKS.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={linkClass}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <span className="flex items-center gap-2.5">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-bold text-white ring-2 ring-brand/30"
                  aria-hidden="true"
                >
                  {initials(user?.name)}
                </span>
                <span className="hidden text-sm font-medium text-fg lg:inline">
                  {user?.name?.split(" ")[0]}
                </span>
              </span>
              <button
                type="button"
                className="icon-btn"
                onClick={logout}
                title="Log out"
                aria-label="Log out"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>

            {menuButton}
          </>
        ) : (
          <>
            {hasSections && (
              <nav
                className="hidden items-center gap-1 md:flex"
                aria-label="Page sections"
              >
                {sectionLinks.map(({ href, label }) => (
                  <SectionLink
                    key={href}
                    id={href.slice(1)}
                    className={sectionLinkClass}
                  >
                    {label}
                  </SectionLink>
                ))}
              </nav>
            )}

            {/* With section links the buttons move into the mobile menu on small screens */}
            <nav
              className={`items-center gap-2 ${hasSections ? "hidden md:flex" : "flex"}`}
            >
              <NavLink to="/login" className={linkClass}>
                Log in
              </NavLink>
              <Link to="/register" className="btn-accent py-2">
                {hasSections ? "Get started" : "Sign up"}
              </Link>
            </nav>

            {hasSections && menuButton}
          </>
        )}
      </div>

      {isAuthenticated && menuOpen && (
        <div className="animate-fade-in border-t border-line bg-ink/95 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={linkClass}>
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {initials(user?.name)}
              </span>
              <span className="truncate text-sm text-muted">{user?.email}</span>
            </span>
            <button
              type="button"
              className="btn-secondary py-2"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </div>
      )}

      {hasSections && menuOpen && (
        <div className="animate-fade-in border-t border-line bg-ink/95 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Page sections">
            {sectionLinks.map(({ href, label }) => (
              <SectionLink
                key={href}
                id={href.slice(1)}
                onClick={closeMenu}
                className={sectionLinkClass}
              >
                {label}
              </SectionLink>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
            <Link to="/login" onClick={closeMenu} className="btn-secondary">
              Log in
            </Link>
            <Link to="/register" onClick={closeMenu} className="btn-accent">
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
