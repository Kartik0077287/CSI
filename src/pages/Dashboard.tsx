import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { ListChecks, Target, TrendingUp, ArrowRight } from "lucide-react";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import CircularProgress from "../components/CircularProgress";
import { CardSkeleton } from "../components/Skeleton";
import ErrorState from "../components/ErrorState";
import { useAuth } from "../context/AuthContext";
import { fetchMySkills, fetchProfileCompletion, fetchSkillGap, fetchProgress } from "../services/services";
import { getErrorMessage } from "../services/api";
import type { StudentSkill, SkillGapResult, ProgressEntry } from "../types";

const RADAR_CATEGORIES = ["Programming", "Web Development", "Data", "Soft Skills", "Design", "Cloud"];

export default function Dashboard() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<StudentSkill[] | null>(null);
  const [completion, setCompletion] = useState<number | null>(null);
  const [gap, setGap] = useState<SkillGapResult | null>(null);
  const [history, setHistory] = useState<ProgressEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [skillsData, completionData, progressData] = await Promise.all([
        fetchMySkills(),
        fetchProfileCompletion(),
        fetchProgress(),
      ]);
      setSkills(skillsData);
      setCompletion(completionData);
      setHistory(progressData.history);

      try {
        const gapData = await fetchSkillGap();
        setGap(gapData);
      } catch {
        setGap(null); // No target career selected yet - handled in UI
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

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

  const strongSkills = skills?.filter((s) => s.proficiency >= 70).length ?? 0;
  const skillGapCount = gap?.weakSkills.length ?? 0;
  const readiness = gap?.readiness ?? 0;

  const radarData = RADAR_CATEGORIES.map((cat) => {
    const inCategory = skills?.filter((s) => s.skill.category === cat) ?? [];
    const avg = inCategory.length
      ? Math.round(inCategory.reduce((sum, s) => sum + s.proficiency, 0) / inCategory.length)
      : 0;
    return { category: cat, value: avg };
  });

  const gapChartData = (gap?.entries ?? []).map((e) => ({
    name: e.skillName, current: e.current, required: e.required,
  }));

  const progressChartData = history.map((h, i) => ({
    index: i + 1,
    date: new Date(h.updatedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    proficiency: h.newProficiency,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-950">Good morning, {user?.name?.split(" ")[0]}</h1>
        <p className="mt-1 text-ink-500">Here's your career-readiness overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <p className="text-sm text-ink-500">Profile Completion</p>
          <p className="mt-1 text-2xl font-bold text-ink-900">{completion}%</p>
          <ProgressBar value={completion ?? 0} className="mt-3" />
        </Card>
        <Card>
          <p className="text-sm text-ink-500">Skills</p>
          <p className="mt-1 text-2xl font-bold text-ink-900">{skills?.length ?? 0}</p>
          <p className="mt-3 text-xs text-ink-400 flex items-center gap-1"><ListChecks className="h-3.5 w-3.5" /> tracked skills</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-500">Strong Skills</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{strongSkills}</p>
          <p className="mt-3 text-xs text-ink-400">proficiency ≥ 70%</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-500">Skill Gaps</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{skillGapCount}</p>
          <p className="mt-3 text-xs text-ink-400 flex items-center gap-1"><Target className="h-3.5 w-3.5" /> vs target career</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-500 mb-2">Career Readiness</p>
          <CircularProgress value={readiness} size={64} strokeWidth={7} label={`${readiness}%`} />
        </Card>
      </div>

      {!gap && (
        <Card className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-ink-900">Select a target career to unlock your skill gap</p>
            <p className="text-sm text-ink-500 mt-0.5">Choose a career goal to see a personalized readiness score.</p>
          </div>
          <Link to="/career" className="btn-primary shrink-0">
            Choose career <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      )}

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Skill Proficiency" subtitle="Average proficiency by category">
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData} outerRadius="75%">
              <PolarGrid stroke="#e5e8ee" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "#67708c" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#b1b8c8" }} />
              <Radar dataKey="value" stroke="#3d6bff" fill="#3d6bff" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Career Readiness" subtitle={gap ? `Target: ${gap.careerName}` : "No target career selected"}>
          <div className="flex items-center justify-center h-[280px]">
            <CircularProgress value={readiness} size={180} strokeWidth={14} sublabel="ready" />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Skill Gaps" subtitle="Current vs required proficiency">
          {gapChartData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={gapChartData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eceef2" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#67708c" }} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11, fill: "#67708c" }} />
                <Tooltip />
                <Bar dataKey="current" fill="#3d6bff" radius={[0, 4, 4, 0]} name="Current" />
                <Bar dataKey="required" fill="#d5d9e2" radius={[0, 4, 4, 0]} name="Required" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-ink-400 py-16 text-center">Select a career goal to see skill gaps here.</p>
          )}
        </Card>

        <Card title="Learning Progress" subtitle="Proficiency change over time">
          {progressChartData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={progressChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#67708c" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#67708c" }} />
                <Tooltip />
                <Line type="monotone" dataKey="proficiency" stroke="#3d6bff" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-ink-400 py-16 text-center flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4" /> No progress recorded yet.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
