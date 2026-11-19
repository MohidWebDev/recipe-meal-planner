import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
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

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-bold text-white ring-2 ring-brand/30"
          aria-hidden="true"
        >
          {initials(user?.name)}
        </span>
        <span className="hidden text-sm font-medium text-fg lg:inline">
          {user?.name?.split(" ")[0]}
        </span>
        <ChevronDown
          className={`hidden h-4 w-4 text-subtle transition-transform duration-200 sm:block ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="animate-fade-in absolute top-full right-0 z-50 mt-2 w-64 rounded-2xl border border-line bg-surface p-2 shadow-xl shadow-black/40"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-fg">
              {user?.name}
            </p>
            <p className="truncate text-xs text-subtle">{user?.email}</p>
          </div>
          <div className="my-1 border-t border-line" />
          <button
            type="button"
            role="menuitem"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-raised hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
