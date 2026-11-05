import { BookOpen, CalendarDays, LogOut, Menu, ShoppingCart, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Logo from './Logo';

const LINKS = [
  { to: '/recipes', label: 'Recipes', icon: BookOpen },
  { to: '/planner', label: 'Meal Planner', icon: CalendarDays },
  { to: '/shopping-list', label: 'Shopping List', icon: ShoppingCart },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition duration-200 ${
    isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-raised hover:text-fg'
  }`;

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // Slightly stronger background once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300 ${
        scrolled ? 'border-line bg-ink/85' : 'border-transparent bg-ink/40'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to={isAuthenticated ? '/recipes' : '/login'} className="group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <span className="sm:hidden">
            <Logo showText={false} />
          </span>
          <span className="hidden sm:inline">
            <Logo />
          </span>
        </Link>

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
                <span className="hidden text-sm font-medium text-fg lg:inline">{user?.name?.split(' ')[0]}</span>
              </span>
              <button type="button" className="icon-btn" onClick={logout} title="Log out" aria-label="Log out">
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            </div>

            <button
              type="button"
              className="icon-btn md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        ) : (
          <nav className="flex items-center gap-2">
            <NavLink to="/login" className={linkClass}>
              Log in
            </NavLink>
            <Link to="/register" className="btn-accent py-2">
              Sign up
            </Link>
          </nav>
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
            <button type="button" className="btn-secondary py-2" onClick={logout}>
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
