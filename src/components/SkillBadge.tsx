interface SkillBadgeProps {
  level: string;
}

const styles: Record<string, string> = {
  BEGINNER: "bg-ink-100 text-ink-600",
  INTERMEDIATE: "bg-amber-50 text-amber-700",
  ADVANCED: "bg-brand-50 text-brand-700",
  EXPERT: "bg-emerald-50 text-emerald-700",
};

const labels: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
};

export default function SkillBadge({ level }: SkillBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[level] ?? styles.BEGINNER}`}>
      {labels[level] ?? level}
    </span>
  );
}
