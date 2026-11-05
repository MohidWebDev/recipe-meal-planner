/** Placeholder card shown while recipes load. */
export default function RecipeCardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="skeleton h-28 rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="flex gap-3 pt-2">
          <div className="skeleton h-4 w-16" />
          <div className="skeleton h-4 w-12" />
          <div className="skeleton h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
