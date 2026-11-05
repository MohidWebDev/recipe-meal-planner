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

  const baseBtn = 'min-w-9 rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1" aria-label="Pagination">
      <button
        type="button"
        className={`${baseBtn} text-slate-600 hover:bg-slate-100`}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        ‹ Prev
      </button>
      {getPageItems(page, pages).map((item, index) =>
        item === '…' ? (
          <span key={`gap-${index}`} className="px-2 text-slate-400">
            …
          </span>
        ) : (
          <button
            type="button"
            key={item}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={`${baseBtn} ${item === page ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            {item}
          </button>
        )
      )}
      <button
        type="button"
        className={`${baseBtn} text-slate-600 hover:bg-slate-100`}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
      >
        Next ›
      </button>
    </nav>
  );
}
