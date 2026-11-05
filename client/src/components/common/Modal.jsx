import { X } from 'lucide-react';
import { useEffect } from 'react';
import { lockScroll, unlockScroll } from '../../utils/smoothScroll';

/** Accessible overlay dialog used by ConfirmModal and AddMealModal. */
export default function Modal({ open, title, onClose, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lockScroll();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      unlockScroll();
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 animate-fade-in bg-ink/75 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative flex max-h-[90vh] w-full animate-scale-in flex-col rounded-t-3xl border border-line bg-surface shadow-2xl shadow-black/60 sm:rounded-3xl ${widths[size]}`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-fg">
            {title}
          </h2>
          <button type="button" onClick={onClose} className="icon-btn -mr-2" aria-label="Close" disabled={!onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* data-lenis-prevent lets this area scroll natively while page scrolling is paused */}
        <div className="overflow-y-auto overscroll-contain px-6 py-5" data-lenis-prevent>
          {children}
        </div>
        {footer && <div className="flex justify-end gap-2 border-t border-line px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
