import { CircleHelp, LogOut, Settings, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

const itemClass =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-fg transition hover:bg-raised focus:outline-none focus-visible:bg-raised focus-visible:ring-2 focus-visible:ring-accent";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const ref = useRef(null);

  // Close when the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const showImage = user?.avatar && !imgFailed;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-brand text-xs font-bold text-white ring-2 ring-brand/30 transition hover:ring-brand/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {showImage ? (
          <img
            src={user.avatar}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          initials(user?.name)
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="animate-fade-in absolute top-full right-0 z-50 mt-2 w-56 rounded-xl border border-line bg-surface p-1.5 shadow-xl shadow-black/40"
        >
          <div className="flex flex-col gap-1 px-3 py-2">
            <p className="truncate text-sm leading-none font-semibold text-fg">
              {user?.name}
            </p>
            <p className="truncate text-xs leading-none text-subtle">
              {user?.email}
            </p>
          </div>

          <div className="my-1 border-t border-line" />

          <Link to="/profile" role="menuitem" className={itemClass}>
            <User className="h-4 w-4" aria-hidden="true" />
            Profile
          </Link>
          <Link to="/settings" role="menuitem" className={itemClass}>
            <Settings className="h-4 w-4" aria-hidden="true" />
            Settings
          </Link>
          <Link to="/help" role="menuitem" className={itemClass}>
            <CircleHelp className="h-4 w-4" aria-hidden="true" />
            Help
          </Link>

          <div className="my-1 border-t border-line" />

          <button
            type="button"
            role="menuitem"
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
