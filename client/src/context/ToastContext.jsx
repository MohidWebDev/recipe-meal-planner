import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { createContext, useCallback, useMemo, useRef, useState } from 'react';

export const ToastContext = createContext(null);

const VARIANTS = {
  success: { icon: CircleCheck, className: 'text-accent' },
  error: { icon: CircleAlert, className: 'text-danger' },
  info: { icon: Info, className: 'text-brand-light' },
};

const EXIT_MS = 200;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  // Fade the toast out first, then remove it.
  const dismiss = useCallback(
    (id) => {
      setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      setTimeout(() => remove(id), EXIT_MS);
    },
    [remove]
  );

  const show = useCallback(
    (message, type = 'info', duration = 3500) => {
      const id = ++idRef.current;
      setToasts((list) => [...list.slice(-3), { id, message, type, leaving: false }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      show,
      success: (message) => show(message, 'success'),
      error: (message) => show(message, 'error', 5000),
      info: (message) => show(message, 'info'),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6"
      >
        {toasts.map((toast) => {
          const { icon: Icon, className } = VARIANTS[toast.type] ?? VARIANTS.info;
          return (
            <div
              key={toast.id}
              role={toast.type === 'error' ? 'alert' : 'status'}
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line-strong bg-raised/95 px-4 py-3 text-sm text-fg shadow-xl shadow-black/50 backdrop-blur transition duration-200 ${
                toast.leaving ? 'translate-x-4 opacity-0' : 'animate-slide-in'
              }`}
            >
              <Icon className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${className}`} aria-hidden="true" />
              <p className="flex-1 leading-snug">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="-mr-1 rounded-md p-0.5 text-subtle transition hover:text-fg"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
