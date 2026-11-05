import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const LINKS = [
  { to: '/recipes', label: 'Recipes' },
  { to: '/planner', label: 'Meal Planner' },
  { to: '/shopping-list', label: 'Shopping List' },
];

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to={isAuthenticated ? '/recipes' : '/login'} className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-lg text-white">🍲</span>
          <span className="hidden sm:inline">Recipe &amp; Meal Planner</span>
        </Link>

        {isAuthenticated ? (
          <>
            <nav className="hidden items-center gap-1 md:flex">
              {LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} className={linkClass}>
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="hidden items-center gap-3 md:flex">
              <span className="text-sm text-slate-500">
                Hi, <span className="font-medium text-slate-800">{user?.name?.split(' ')[0]}</span>
              </span>
              <button type="button" className="btn-secondary py-1.5" onClick={logout}>
                Log out
              </button>
            </div>
            <button
              type="button"
              className="btn-ghost px-2 md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path strokeLinecap="round" d="M6 6l12 12M6 18 18 6" />
                ) : (
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </>
        ) : (
          <nav className="flex items-center gap-2">
            <NavLink to="/login" className={linkClass}>
              Log in
            </NavLink>
            <Link to="/register" className="btn-primary py-1.5">
              Sign up
            </Link>
          </nav>
        )}
      </div>

      {isAuthenticated && menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <span className="text-sm text-slate-600">{user?.email}</span>
            <button type="button" className="btn-secondary py-1.5" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
