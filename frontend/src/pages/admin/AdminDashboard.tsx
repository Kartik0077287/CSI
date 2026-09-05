import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Users, Database, Briefcase, Target, AlertTriangle } from "lucide-react";
import Card from "../../components/Card";
import ErrorState from "../../components/ErrorState";
import { CardSkeleton } from "../../components/Skeleton";
import { fetchAdminAnalytics } from "../../services/services";
import { getErrorMessage } from "../../services/api";
import type { AdminAnalytics } from "../../types";

const PIE_COLORS = ["#3d6bff", "#6191ff", "#95b9ff", "#c1d6ff", "#1d36e0", "#161a56", "#2547f5", "#dde8ff"];

export default function AdminDashboard() {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAdminAnalytics();
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return null;

  const { stats, charts } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-950">Admin Dashboard</h1>
        <p className="mt-1 text-ink-500">Platform-wide overview of students and skill readiness.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <Users className="h-5 w-5 text-brand-500" />
          <p className="mt-2 text-2xl font-bold text-ink-900">{stats.totalStudents}</p>
          <p className="text-sm text-ink-500">Total Students</p>
        </Card>
        <Card>
          <Database className="h-5 w-5 text-emerald-500" />
          <p className="mt-2 text-2xl font-bold text-ink-900">{stats.totalSkills}</p>
          <p className="text-sm text-ink-500">Total Skills</p>
        </Card>
        <Card>
          <Briefcase className="h-5 w-5 text-purple-500" />
          <p className="mt-2 text-2xl font-bold text-ink-900">{stats.totalCareers}</p>
          <p className="text-sm text-ink-500">Career Roles</p>
        </Card>
        <Card>
          <Target className="h-5 w-5 text-amber-500" />
          <p className="mt-2 text-2xl font-bold text-ink-900">{stats.avgReadiness}%</p>
          <p className="text-sm text-ink-500">Avg. Readiness</p>
        </Card>
        <Card>
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <p className="mt-2 text-lg font-bold text-ink-900 truncate">{stats.mostCommonGap}</p>
          <p className="text-sm text-ink-500">Most Common Gap</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Student Growth" subtitle="Cumulative registrations over time">
          {charts.studentGrowth.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={charts.studentGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#67708c" }} />
                <YAxis tick={{ fontSize: 11, fill: "#67708c" }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3d6bff" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-ink-400 py-16 text-center">No student data yet.</p>
          )}
        </Card>

        <Card title="Most Common Skill Gaps" subtitle="Across all students with a target career">
          {charts.skillGaps.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={charts.skillGaps}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" />
                <XAxis dataKey="skill" tick={{ fontSize: 10, fill: "#67708c" }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: "#67708c" }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3d6bff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-ink-400 py-16 text-center">No skill gap data yet.</p>
          )}
        </Card>
      </div>

      <Card title="Career Distribution" subtitle="Target careers selected by students">
        {charts.careerDistribution.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={charts.careerDistribution}
                dataKey="count"
                nameKey="career"
                cx="50%" cy="50%"
                outerRadius={100}
                label={(entry) => entry.career}
              >
                {charts.careerDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-ink-400 py-16 text-center">No career selections yet.</p>
        )}
      </Card>
    </div>
  );
}
