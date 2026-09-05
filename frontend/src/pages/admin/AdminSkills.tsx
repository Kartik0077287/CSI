import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Select from "../../components/Select";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import { TableSkeleton } from "../../components/Skeleton";
import { fetchSkillCatalog, createSkillAdminApi, updateSkillAdminApi, deleteSkillAdminApi } from "../../services/services";
import { getErrorMessage } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import type { Skill } from "../../types";

const CATEGORIES = [
  "Programming", "Web Development", "Data", "AI/ML", "Cloud",
  "Cybersecurity", "Soft Skills", "Design", "Game Development",
];

export default function AdminSkills() {
  const { showToast } = useToast();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setSkills(await fetchSkillCatalog());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditing(null);
    setName("");
    setCategory("");
    setModalOpen(true);
  }

  function openEdit(skill: Skill) {
    setEditing(skill);
    setName(skill.name);
    setCategory(skill.category);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !category) {
      showToast("Name and category are required.", "error");
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        await updateSkillAdminApi(editing.id, { name, category });
        showToast("Skill updated.");
      } else {
        await createSkillAdminApi({ name, category });
        showToast("Skill created.");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteSkillAdminApi(deleteTarget.id);
      setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      showToast("Skill deleted.");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-950">Skill Management</h1>
          <p className="mt-1 text-ink-500">Add, edit, or remove skills available on the platform.</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Skill</Button>
      </div>

      <Card>
        {loading ? (
          <TableSkeleton rows={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : skills.length === 0 ? (
          <EmptyState title="No skills yet" actionLabel="Add Skill" onAction={openAdd} />
        ) : (
          <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="text-left text-ink-400 border-b border-ink-100">
                  <th className="pb-3 font-medium">Skill</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((s) => (
                  <tr key={s.id} className="border-b border-ink-50 last:border-none">
                    <td className="py-3 font-medium text-ink-800">{s.name}</td>
                    <td className="py-3 text-ink-600">{s.category}</td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(s)} className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => setDeleteTarget(s)} className="rounded-lg p-2 text-ink-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Skill" : "Add Skill"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Skill name" required value={name} onChange={(e) => setName(e.target.value)} />
          <Select
            label="Category" required value={category} onChange={(e) => setCategory(e.target.value)}
            placeholder="Select category" options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editing ? "Save changes" : "Add skill"}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete skill"
        footer={<>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </>}
      >
        <p className="text-sm text-ink-600">
          Delete <strong>{deleteTarget?.name}</strong>? This removes it from every student and career that references it.
        </p>
      </Modal>
    </div>
  );
}
