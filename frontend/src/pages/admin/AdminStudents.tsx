import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, Power } from "lucide-react";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import { TableSkeleton } from "../../components/Skeleton";
import { fetchAdminStudents, toggleStudentStatusApi, deleteStudentApi } from "../../services/services";
import { getErrorMessage } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import type { AdminStudentRow } from "../../types";

type SortKey = "name" | "readiness" | "skillCount";

export default function AdminStudents() {
  const { showToast } = useToast();
  const [students, setStudents] = useState<AdminStudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [deleteTarget, setDeleteTarget] = useState<AdminStudentRow | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminStudents();
      setStudents(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let result = students.filter((s) =>
      (s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()))
      && (!statusFilter || s.status === statusFilter)
    );
    result = result.sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      if (sortKey === "readiness") return (b.readiness ?? 0) - (a.readiness ?? 0);
      return b.skillCount - a.skillCount;
    });
    return result;
  }, [students, search, statusFilter, sortKey]);

  async function handleToggleStatus(s: AdminStudentRow) {
    try {
      await toggleStudentStatusApi(s.id);
      setStudents((prev) => prev.map((x) => x.id === s.id ? { ...x, status: x.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : x));
      showToast("Student status updated.");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteStudentApi(deleteTarget.id);
      setStudents((prev) => prev.filter((x) => x.id !== deleteTarget.id));
      showToast("Student deleted.");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-950">Students</h1>
        <p className="mt-1 text-ink-500">View and manage all registered students.</p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <Input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="All statuses"
            options={[{ value: "ACTIVE", label: "Active" }, { value: "INACTIVE", label: "Inactive" }]}
            className="sm:w-40"
          />
          <Select
            value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}
            options={[
              { value: "name", label: "Sort: Name" },
              { value: "readiness", label: "Sort: Readiness" },
              { value: "skillCount", label: "Sort: Skills" },
            ]}
            className="sm:w-44"
          />
        </div>

        {loading ? (
          <TableSkeleton rows={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No students found" description="Try adjusting your search or filters." />
        ) : (
          <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-left text-ink-400 border-b border-ink-100">
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">College</th>
                  <th className="pb-3 font-medium">Career</th>
                  <th className="pb-3 font-medium text-right">Readiness</th>
                  <th className="pb-3 font-medium text-right">Skills</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-ink-50 last:border-none">
                    <td className="py-3">
                      <p className="font-medium text-ink-800">{s.name}</p>
                      <p className="text-xs text-ink-400">{s.email}</p>
                    </td>
                    <td className="py-3 text-ink-600">{s.college || "—"}</td>
                    <td className="py-3 text-ink-600">{s.career}</td>
                    <td className="py-3 text-right text-ink-600">{s.readiness !== null ? `${s.readiness}%` : "—"}</td>
                    <td className="py-3 text-right text-ink-600">{s.skillCount}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${s.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-ink-100 text-ink-500"}`}>
                        {s.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleToggleStatus(s)} className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700" aria-label="Toggle status">
                          <Power className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(s)} className="rounded-lg p-2 text-ink-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete student">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete student"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          Permanently delete <strong>{deleteTarget?.name}</strong>'s account and all associated data? This can't be undone.
        </p>
      </Modal>
    </div>
  );
}
