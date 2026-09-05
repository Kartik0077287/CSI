interface PriorityBadgeProps {
  priority: string;
}

const styles: Record<string, string> = {
  "High Priority": "bg-red-50 text-red-700",
  "Medium Priority": "bg-amber-50 text-amber-700",
  "Low Priority": "bg-ink-100 text-ink-600",
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[priority] ?? styles["Low Priority"]}`}>
      {priority}
    </span>
  );
}
