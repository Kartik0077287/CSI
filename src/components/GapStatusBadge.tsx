interface GapStatusBadgeProps {
  status: "sufficient" | "moderate" | "major";
}

const config = {
  sufficient: { label: "On track", dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  moderate: { label: "Moderate gap", dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  major: { label: "Major gap", dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
};

export default function GapStatusBadge({ status }: GapStatusBadgeProps) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
