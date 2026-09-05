import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ListChecks, GraduationCap, Rocket, Clock, Flame } from "lucide-react";
import Card from "../components/Card";
import Select from "../components/Select";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { CardSkeleton } from "../components/Skeleton";
import { fetchProgress, fetchRecommendations, updateRecommendationApi } from "../services/services";
import { getErrorMessage } from "../services/api";
import { useToast } from "../context/ToastContext";
import type { ProgressStats, ProgressEntry, Recommendation, RecStatus } from "../types";

const statusOptions: Array<{ value: RecStatus; label: string }> = [
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

export default function Progress() {
  const { showToast } = useToast();
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [history, setHistory] = useState<ProgressEntry[]>([]);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [progressData, recsData] = await Promise.all([fetchProgress(), fetchRecommendations()]);
      setStats(progressData.stats);
      setHistory(progressData.history);
      setRecs(recsData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleStatusChange(rec: Recommendation, status: RecStatus) {
    try {
      await updateRecommendationApi(rec.id, status);
      setRecs((prev) => prev.map((r) => (r.id === rec.id ? { ...r, status } : r)));
      showToast(
        status === "COMPLETED"
          ? "Recommendation marked as completed."
          : `${rec.skill.name} marked as ${status.toLowerCase().replace("_", " ")}.`
      );
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={load} />;

  const chartData = history.map((h, i) => ({
    index: i + 1,
    date: new Date(h.updatedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    skill: h.skill.name,
    proficiency: h.newProficiency,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-950">Progress</h1>
        <p className="mt-1 text-ink-500">See how far you've come and update what you're working on.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <ListChecks className="h-5 w-5 text-brand-500" />
          <p className="mt-2 text-2xl font-bold text-ink-900">{stats?.skillsImproved ?? 0}</p>
          <p className="text-sm text-ink-500">Skills improved</p>
        </Card>
        <Card>
          <GraduationCap className="h-5 w-5 text-emerald-500" />
          <p className="mt-2 text-2xl font-bold text-ink-900">{stats?.coursesCompleted ?? 0}</p>
          <p className="text-sm text-ink-500">Courses completed</p>
        </Card>
        <Card>
          <Rocket className="h-5 w-5 text-purple-500" />
          <p className="mt-2 text-2xl font-bold text-ink-900">{stats?.projectsCompleted ?? 0}</p>
          <p className="text-sm text-ink-500">Projects completed</p>
        </Card>
        <Card>
          <Clock className="h-5 w-5 text-amber-500" />
          <p className="mt-2 text-2xl font-bold text-ink-900">{stats?.learningHours ?? 0}</p>
          <p className="text-sm text-ink-500">Learning hours</p>
        </Card>
        <Card>
          <Flame className="h-5 w-5 text-red-500" />
          <p className="mt-2 text-2xl font-bold text-ink-900">{stats?.currentStreak ?? 0}</p>
          <p className="text-sm text-ink-500">Active days</p>
        </Card>
      </div>

      <Card title="Proficiency Over Time">
        {chartData.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#67708c" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#67708c" }} />
              <Tooltip />
              <Line type="monotone" dataKey="proficiency" stroke="#3d6bff" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-ink-400 py-16 text-center">No progress history yet. Update a skill's proficiency to start tracking.</p>
        )}
      </Card>

      <Card title="Recommendation Status" subtitle="Update as you work through your learning plan">
        {recs.length === 0 ? (
          <EmptyState title="No recommendations to track yet." description="Select a career goal to generate a learning plan." />
        ) : (
          <div className="space-y-3">
            {recs.map((rec) => (
              <div key={rec.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-ink-100 px-4 py-3">
                <div>
                  <p className="font-medium text-ink-800">{rec.skill.name}</p>
                  <p className="text-xs text-ink-400">{rec.type.charAt(0) + rec.type.slice(1).toLowerCase()}</p>
                </div>
                <Select
                  value={rec.status}
                  onChange={(e) => handleStatusChange(rec, e.target.value as RecStatus)}
                  options={statusOptions}
                  className="sm:w-44"
                />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
