interface ProgressBarProps {
  value: number;
  max?: number;
  colorClass?: string;
  trackClass?: string;
  height?: string;
  className?: string;
}

export default function ProgressBar({
  value, max = 100, colorClass = "bg-brand-500", trackClass = "bg-ink-100", height = "h-2", className = "",
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`w-full ${height} ${trackClass} rounded-full overflow-hidden ${className}`}>
      <div
        className={`${height} ${colorClass} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
