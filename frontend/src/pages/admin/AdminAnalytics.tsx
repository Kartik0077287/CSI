import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "../../components/Card";
import ErrorState from "../../components/ErrorState";
import { CardSkeleton } from "../../components/Skeleton";
import { fetchAdminAnalytics, fetchAdminStudents } from "../../services/services";
import { getErrorMessage } from "../../services/api";
import type { AdminAnalytics, AdminStudentRow } from "../../types";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [students, setStudents] = useState<AdminStudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [analytics, studentList] = await Promise.all([fetchAdminAnalytics(), fetchAdminStudents()]);
      setData(analytics);
      setStudents(studentList);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return null;

  const readinessBuckets = [
    { label: "0-25%", count: 0 }, { label: "26-50%", count: 0 },
    { label: "51-75%", count: 0 }, { label: "76-100%", count: 0 },
  ];
  for (const s of students) {
    if (s.readiness === null) continue;
    if (s.readiness <= 25) readinessBuckets[0].count++;
    else if (s.readiness <= 50) readinessBuckets[1].count++;
    else if (s.readiness <= 75) readinessBuckets[2].count++;
    else readinessBuckets[3].count++;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-950">Platform Analytics</h1>
        <p className="mt-1 text-ink-500">Deeper insight into student readiness across the platform.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Readiness Distribution" subtitle="How students cluster by career readiness">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={readinessBuckets}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#67708c" }} />
              <YAxis tick={{ fontSize: 11, fill: "#67708c" }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3d6bff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Most Common Skill Gaps" subtitle="Skills students most often fall short on">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.charts.skillGaps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" />
              <XAxis dataKey="skill" tick={{ fontSize: 10, fill: "#67708c" }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: "#67708c" }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Summary">
        <div className="grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-ink-500">Average readiness</p>
            <p className="text-xl font-bold text-ink-900">{data.stats.avgReadiness}%</p>
          </div>
          <div>
            <p className="text-ink-500">Students with a target career</p>
            <p className="text-xl font-bold text-ink-900">{students.filter((s) => s.readiness !== null).length}</p>
          </div>
          <div>
            <p className="text-ink-500">Most common gap</p>
            <p className="text-xl font-bold text-ink-900">{data.stats.mostCommonGap}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
