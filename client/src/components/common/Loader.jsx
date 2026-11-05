export default function Loader({ label = 'Loading…', fullScreen = false, size = 'md' }) {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-[3px]', lg: 'h-12 w-12 border-4' };

  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center gap-3 text-slate-500 ${fullScreen ? 'min-h-[60vh]' : 'py-12'}`}
    >
      <span className={`animate-spin rounded-full border-emerald-600 border-t-transparent ${sizes[size]}`} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
