import { useEffect, useState } from "react";
import { CheckCircle2, Briefcase } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import ErrorState from "../components/ErrorState";
import { CardSkeleton } from "../components/Skeleton";
import { fetchCareers, selectCareerApi, fetchProfile } from "../services/services";
import { getErrorMessage } from "../services/api";
import { useToast } from "../context/ToastContext";
import type { Career } from "../types";

const difficultyColor: Record<string, string> = {
  Easy: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-red-50 text-red-700",
};

export default function CareerGoals() {
  const { showToast } = useToast();
  const [careers, setCareers] = useState<Career[]>([]);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selecting, setSelecting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [careerList, profile] = await Promise.all([fetchCareers(), fetchProfile()]);
      setCareers(careerList);
      setTargetId(profile.targetCareerId ?? null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSelect(careerId: string) {
    setSelecting(careerId);
    try {
      await selectCareerApi(careerId);
      setTargetId(careerId);
      showToast("Career goal updated.");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setSelecting(null);
    }
  }

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-950">Career Goals</h1>
        <p className="mt-1 text-ink-500">Explore roles and choose the one you're working toward.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {careers.map((career) => {
          const isTarget = career.id === targetId;
          const avgRequired = career.requiredSkills.length
            ? Math.round(career.requiredSkills.reduce((s, cs) => s + cs.requiredProficiency, 0) / career.requiredSkills.length)
            : 0;

          return (
            <Card key={career.id} className={isTarget ? "ring-2 ring-brand-400" : ""}>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Briefcase className="h-5 w-5" />
                </div>
                {isTarget && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Target
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-semibold text-ink-900">{career.name}</h3>
              <p className="mt-1 text-sm text-ink-500 line-clamp-2">{career.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-ink-100 px-2.5 py-1 text-ink-600">{career.industry}</span>
                <span className={`rounded-full px-2.5 py-1 font-medium ${difficultyColor[career.difficulty] ?? difficultyColor.Medium}`}>
                  {career.difficulty}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-ink-500">
                <span>{career.requiredSkills.length} skills required</span>
                <span>Avg readiness {avgRequired}%</span>
              </div>

              <Button
                onClick={() => handleSelect(career.id)}
                variant={isTarget ? "secondary" : "primary"}
                loading={selecting === career.id}
                disabled={isTarget}
                className="mt-5 w-full"
              >
                {isTarget ? "Selected" : "Select as target"}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
