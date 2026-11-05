import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Builds [1, '…', 4, 5, 6, '…', 10] style page lists. */
const getPageItems = (page, pages) => {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const items = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pages - 1, page + 1);
  if (start > 2) items.push('…');
  for (let p = start; p <= end; p += 1) items.push(p);
  if (end < pages - 1) items.push('…');
  items.push(pages);
  return items;
};

export default function Pagination({ page, pages, onPageChange }) {
  if (!pages || pages <= 1) return null;

  const base =
    'inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-xl px-3 text-sm font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-40';

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
      <button type="button" className={`${base} text-muted hover:bg-raised hover:text-fg`} onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Prev
      </button>
      {getPageItems(page, pages).map((item, index) =>
        item === '…' ? (
          <span key={`gap-${index}`} className="px-1 text-subtle">
            …
          </span>
        ) : (
          <button
            type="button"
            key={item}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={`${base} ${
              item === page ? 'bg-accent text-ink shadow-[0_6px_20px_-8px_rgba(212,255,36,0.6)]' : 'border border-line text-muted hover:border-line-strong hover:text-fg'
            }`}
          >
            {item}
          </button>
        )
      )}
      <button type="button" className={`${base} text-muted hover:bg-raised hover:text-fg`} onClick={() => onPageChange(page + 1)} disabled={page >= pages}>
        Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
