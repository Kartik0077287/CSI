import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Select from "../components/Select";
import ProgressBar from "../components/ProgressBar";
import SkillBadge from "../components/SkillBadge";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { TableSkeleton } from "../components/Skeleton";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../services/api";
import {
  fetchMySkills, addSkillApi, updateSkillApi, deleteSkillApi, fetchSkillCatalog,
} from "../services/services";
import type { StudentSkill, Skill } from "../types";

const CATEGORIES = [
  "Programming", "Web Development", "Data", "AI/ML", "Cloud",
  "Cybersecurity", "Soft Skills", "Design", "Game Development",
];

const LEVELS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "EXPERT", label: "Expert" },
];

interface FormState {
  skillName: string;
  category: string;
  level: string;
  experience: string;
}

const emptyForm: FormState = { skillName: "", category: "", level: "", experience: "" };

export default function Skills() {
  const { showToast } = useToast();
  const [skills, setSkills] = useState<StudentSkill[]>([]);
  const [catalog, setCatalog] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<StudentSkill | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StudentSkill | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [mySkills, allSkills] = await Promise.all([fetchMySkills(), fetchSkillCatalog()]);
      setSkills(mySkills);
      setCatalog(allSkills);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(skill: StudentSkill) {
    setEditing(skill);
    setForm({
      skillName: skill.skill.name,
      category: skill.skill.category,
      level: skill.level,
      experience: skill.experience.toString(),
    });
    setModalOpen(true);
  }

  function handleSkillNameChange(name: string) {
    setForm((f) => ({ ...f, skillName: name }));
    const existing = catalog.find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (existing) setForm((f) => ({ ...f, category: existing.category }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.skillName || !form.category || !form.level) {
      showToast("Please fill in skill, category, and proficiency.", "error");
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        await updateSkillApi(editing.id, { level: form.level, experience: Number(form.experience) || 0 });
        showToast("Skill updated successfully.");
      } else {
        await addSkillApi({
          skillName: form.skillName, category: form.category,
          level: form.level, experience: Number(form.experience) || 0,
        });
        showToast("Skill added successfully.");
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
      await deleteSkillApi(deleteTarget.id);
      showToast("Skill deleted.");
      setSkills((s) => s.filter((x) => x.id !== deleteTarget.id));
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
          <h1 className="text-2xl font-bold text-ink-950">My Skills</h1>
          <p className="mt-1 text-ink-500">Track and rate the skills you've built so far.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Add Skill
        </Button>
      </div>

      <Card>
        {loading ? (
          <TableSkeleton rows={5} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : skills.length === 0 ? (
          <EmptyState
            title="No skills added yet."
            description="Add your first skill to start building your profile."
            actionLabel="Add Your First Skill"
            onAction={openAdd}
          />
        ) : (
          <div className="space-y-5">
            {skills.map((s) => (
              <div key={s.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 border-b border-ink-100 pb-5 last:border-none last:pb-0">
                <div className="sm:w-48 shrink-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-ink-900">{s.skill.name}</p>
                    {s.verified && <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-label="Verified" />}
                  </div>
                  <p className="text-xs text-ink-400">{s.skill.category}</p>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <ProgressBar value={s.proficiency} className="flex-1" />
                  <span className="text-sm font-semibold text-ink-700 w-10 text-right">{s.proficiency}%</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <SkillBadge level={s.level} />
                  <button onClick={() => openEdit(s)} className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700" aria-label={`Edit ${s.skill.name}`}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(s)} className="rounded-lg p-2 text-ink-400 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${s.skill.name}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Skill" : "Add Skill"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Skill" list="skill-catalog" required disabled={!!editing}
            value={form.skillName} onChange={(e) => handleSkillNameChange(e.target.value)}
            placeholder="e.g. JavaScript"
          />
          <datalist id="skill-catalog">
            {catalog.map((s) => <option key={s.id} value={s.name} />)}
          </datalist>
          <Select
            label="Category" required disabled={!!editing}
            value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            placeholder="Select category"
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <Select
            label="Proficiency" required
            value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
            placeholder="Select level"
            options={LEVELS}
          />
          <Input
            label="Experience (years)" type="number" step="0.5" min="0"
            value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
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
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          Remove <strong>{deleteTarget?.skill.name}</strong> from your skills? This can't be undone.
        </p>
      </Modal>
    </div>
  );
}
