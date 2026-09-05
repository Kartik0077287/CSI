import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Dumbbell, Rocket, Award, AlertCircle } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import PriorityBadge from "../components/PriorityBadge";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { CardSkeleton } from "../components/Skeleton";
import { fetchRecommendations, updateRecommendationApi } from "../services/services";
import { getErrorMessage } from "../services/api";
import { useToast } from "../context/ToastContext";
import type { Recommendation, RecType } from "../types";

const typeConfig: Record<RecType, { label: string; icon: any; color: string }> = {
  LEARN: { label: "Learn", icon: BookOpen, color: "bg-brand-50 text-brand-600" },
  PRACTICE: { label: "Practice", icon: Dumbbell, color: "bg-amber-50 text-amber-600" },
  PROJECT: { label: "Project", icon: Rocket, color: "bg-purple-50 text-purple-600" },
  CERTIFICATION: { label: "Certification", icon: Award, color: "bg-emerald-50 text-emerald-600" },
};

export default function Recommendations() {
  const { showToast } = useToast();
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecommendations();
      setRecs(data.sort((a, b) => (a.priority === "High Priority" ? -1 : 1)));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleStart(rec: Recommendation) {
    setUpdating(rec.id);
    try {
      await updateRecommendationApi(rec.id, "IN_PROGRESS");
      setRecs((prev) => prev.map((r) => (r.id === rec.id ? { ...r, status: "IN_PROGRESS" } : r)));
      showToast(`Started learning ${rec.skill.name}.`);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setUpdating(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <CardSkeleton /><CardSkeleton /><CardSkeleton />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-950">Recommendations</h1>
        <p className="mt-1 text-ink-500">Generated from your live skill-gap analysis, highest priority first.</p>
      </div>

      {recs.length === 0 ? (
        <Card>
          <EmptyState
            icon={<AlertCircle className="h-7 w-7" />}
            title="No recommendations yet"
            description="Select a target career and add some skills so we can generate a personalized plan."
            actionLabel="Choose a career"
            onAction={() => (window.location.href = "/career")}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {recs.map((rec) => {
            const cfg = typeConfig[rec.type];
            return (
              <Card key={rec.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cfg.color}`}>
                  <cfg.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink-900">Learn {rec.skill.name}</p>
                    <PriorityBadge priority={rec.priority} />
                    <span className="text-xs font-medium text-ink-400">{cfg.label}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-500">{rec.reason}</p>
                </div>
                <div className="shrink-0">
                  {rec.status === "NOT_STARTED" && (
                    <Button loading={updating === rec.id} onClick={() => handleStart(rec)}>Start Learning</Button>
                  )}
                  {rec.status === "IN_PROGRESS" && (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">In Progress</span>
                  )}
                  {rec.status === "COMPLETED" && (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">Completed</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-ink-900">Track what you've started</p>
          <p className="text-sm text-ink-500 mt-0.5">Mark recommendations as in progress or completed on the Progress page.</p>
        </div>
        <Link to="/progress" className="btn-secondary shrink-0">Go to Progress</Link>
      </Card>
    </div>
  );
}
