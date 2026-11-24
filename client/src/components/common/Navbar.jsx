import { Home, Info } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { scrollToTop } from "../../utils/smoothScroll";
import Logo from "./Logo";
import { APP_LINKS } from "./navLinks";
import UserMenu from "./UserMenu";

const inactiveLink =
  "text-white/80 hover:text-white hover:[filter:drop-shadow(0_0_2px_rgba(255,255,255,0.5))]";
const activeLink =
  "text-accent [filter:drop-shadow(0_0_2px_rgba(212,255,36,0.5))]";

const linkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-xl px-3.5 py-2 font-nav text-[15px] font-medium tracking-[-0.01em] transition duration-200 ${
    isActive ? activeLink : inactiveLink
  }`;

// Home / About links: icon on top with a small label on phones, icon + label in a row from sm up.
const centerLinkClass = ({ isActive }) =>
  `flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 font-nav text-[11px] font-medium tracking-[-0.01em] transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:flex-row sm:gap-2 sm:px-3.5 sm:py-2 sm:text-[15px] ${
    isActive ? activeLink : inactiveLink
  }`;

const loginClass =
  "rounded-full border border-white/20 bg-white/10 px-4 py-2 font-nav text-[15px] font-medium text-white transition duration-200 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";

const logoLinkClass =
  "group rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";

// Survives Navbar remounts (Landing and Layout each render their own Navbar),
// so the underline can slide in from where it was on the previous page.
let lastIndicator = null;

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const [indicator, setIndicator] = useState(
    lastIndicator ?? { left: 0, width: 0, visible: false },
  );
  const [animate, setAnimate] = useState(lastIndicator !== null);

  // Move the underline under whichever link is active.
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const update = () => {
      const active = nav.querySelector('a[aria-current="page"]');
      // No active link, or it is hidden at this screen size: hide the line.
      if (!active || active.offsetWidth === 0) {
        setIndicator((prev) =>
          prev.visible ? { ...prev, visible: false } : prev,
        );
        return;
      }
      const navRect = nav.getBoundingClientRect();
      const linkRect = active.getBoundingClientRect();
      const next = {
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        visible: true,
      };
      lastIndicator = next;
      setIndicator((prev) =>
        prev.left === next.left && prev.width === next.width && prev.visible
          ? prev
          : next,
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(nav);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [pathname, isAuthenticated]);

  // Turn the slide animation on only after the first paint, so the line doesn't fly in on load.
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

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
    <header className="sticky top-0 z-40">
      <div
        className={`rounded-lg border backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled
            ? "border-white/15 bg-ink/85 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.9)]"
            : "border-white/10 bg-ink/60"
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

          {/* Center: Home, the app links (desktop), then About */}
          <nav
            ref={navRef}
            className="relative flex items-center gap-1 md:justify-self-center"
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

            <span
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-accent shadow-[0_0_5px_var(--color-accent)] ${
                animate
                  ? "transition-[transform,width,opacity] duration-300 ease-out"
                  : ""
              }`}
              style={{
                width: indicator.width,
                transform: `translateX(${indicator.left}px)`,
                opacity: indicator.visible ? 1 : 0,
              }}
            />
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 lg:justify-self-end">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <span className="hidden sm:inline-flex">
                  <NavLink to="/login" className={loginClass}>
                    Log in
                  </NavLink>
                </span>
                <Link
                  to="/register"
                  className="btn-accent rounded-full py-2 font-nav text-[15px]"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
