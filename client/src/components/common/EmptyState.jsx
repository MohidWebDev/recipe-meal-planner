/** Friendly placeholder for lists with nothing to show. */
export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="card flex animate-fade-up flex-col items-center px-6 py-16 text-center">
      {Icon && (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      )}
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      {message && <p className="mt-1.5 max-w-sm text-sm text-muted">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
