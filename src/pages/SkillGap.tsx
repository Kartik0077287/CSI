import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle } from "lucide-react";
import Card from "../components/Card";
import CircularProgress from "../components/CircularProgress";
import GapStatusBadge from "../components/GapStatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { CardSkeleton } from "../components/Skeleton";
import { fetchSkillGap } from "../services/services";
import { getErrorMessage } from "../services/api";
import type { SkillGapResult } from "../types";

export default function SkillGap() {
  const [gap, setGap] = useState<SkillGapResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noCareer, setNoCareer] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    setNoCareer(false);
    try {
      const data = await fetchSkillGap();
      setGap(data);
    } catch (err) {
      const message = getErrorMessage(err);
      if (message.toLowerCase().includes("select a target career")) {
        setNoCareer(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton /><CardSkeleton />
      </div>
    );
  }

  if (noCareer) {
    return (
      <Card>
        <EmptyState
          icon={<AlertCircle className="h-7 w-7" />}
          title="Select a target career first"
          description="Your skill gap is calculated against a specific career's requirements. Choose one to get started."
          actionLabel="Choose a career"
          onAction={() => (window.location.href = "/career")}
        />
      </Card>
    );
  }

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!gap) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-950">Skill Gap</h1>
          <p className="mt-1 text-ink-500">Target Role: <span className="font-semibold text-ink-800">{gap.careerName}</span></p>
        </div>
        <Link to="/career" className="btn-secondary">Change career</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 flex flex-col items-center justify-center text-center">
          <CircularProgress value={gap.readiness} size={160} strokeWidth={12} />
          <p className="mt-4 font-semibold text-ink-900">Career Readiness: {gap.readiness}%</p>
          <p className="text-sm text-ink-500">Skill Gap: {gap.overallGap}%</p>
        </Card>

        <Card className="lg:col-span-2" title="Priority Skills" subtitle="Biggest gaps to close first">
          {gap.priority.length === 0 ? (
            <p className="text-sm text-ink-500 py-6">You meet or exceed every required skill for this role. Great work.</p>
          ) : (
            <ol className="space-y-3">
              {gap.priority.map((p, i) => (
                <li key={p.skillName} className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-100 text-xs font-bold text-ink-600">{i + 1}</span>
                    <span className="font-medium text-ink-800">{p.skillName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-ink-500">Gap: {p.gap}%</span>
                    <PriorityBadge priority={p.priority} />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <Card title="Current Skills vs Required Skills">
        <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-ink-400 border-b border-ink-100">
                <th className="pb-3 font-medium">Skill</th>
                <th className="pb-3 font-medium text-right">Current</th>
                <th className="pb-3 font-medium text-right">Required</th>
                <th className="pb-3 font-medium text-right">Gap</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {gap.entries.map((e) => (
                <tr key={e.skillId} className="border-b border-ink-50 last:border-none">
                  <td className="py-3 font-medium text-ink-800">{e.skillName}</td>
                  <td className="py-3 text-right text-ink-600">{e.current}</td>
                  <td className="py-3 text-right text-ink-600">{e.required}</td>
                  <td className="py-3 text-right text-ink-600">{e.gap}</td>
                  <td className="py-3 text-right"><GapStatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-ink-900">Ready to close the gap?</p>
          <p className="text-sm text-ink-500 mt-0.5">See personalized recommendations based on this analysis.</p>
        </div>
        <Link to="/recommendations" className="btn-primary shrink-0">
          View recommendations <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>
    </div>
  );
}
