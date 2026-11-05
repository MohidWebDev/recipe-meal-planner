export default function Loader({ label = 'Loading…', fullScreen = false, size = 'md' }) {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-9 w-9 border-[3px]', lg: 'h-12 w-12 border-4' };

  return (
    <div
      role="status"
      className={`flex animate-fade-in flex-col items-center justify-center gap-3 text-muted ${fullScreen ? 'min-h-[60vh]' : 'py-14'}`}
    >
      <span className={`animate-spin rounded-full border-line-strong border-t-accent ${sizes[size]}`} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
