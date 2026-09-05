import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Select from "../../components/Select";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import { CardSkeleton } from "../../components/Skeleton";
import {
  fetchCareers, fetchSkillCatalog, createCareerAdminApi, updateCareerAdminApi,
  deleteCareerAdminApi, upsertCareerSkillApi, removeCareerSkillApi,
} from "../../services/services";
import { getErrorMessage } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import type { Career, Skill } from "../../types";

const IMPORTANCE_OPTIONS = [
  { value: "LOW", label: "Low" }, { value: "MEDIUM", label: "Medium" }, { value: "HIGH", label: "High" },
];

export default function AdminCareers() {
  const { showToast } = useToast();
  const [careers, setCareers] = useState<Career[]>([]);
  const [catalog, setCatalog] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Career | null>(null);
  const [form, setForm] = useState({ name: "", description: "", industry: "", difficulty: "Medium" });
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Career | null>(null);

  // Requirement editor state
  const [reqSkillId, setReqSkillId] = useState("");
  const [reqProficiency, setReqProficiency] = useState("70");
  const [reqImportance, setReqImportance] = useState("MEDIUM");
  const [savingReq, setSavingReq] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [careerList, skillList] = await Promise.all([fetchCareers(), fetchSkillCatalog()]);
      setCareers(careerList);
      setCatalog(skillList);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditing(null);
    setForm({ name: "", description: "", industry: "", difficulty: "Medium" });
    setModalOpen(true);
  }

  function openEdit(career: Career) {
    setEditing(career);
    setForm({ name: career.name, description: career.description, industry: career.industry, difficulty: career.difficulty });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await updateCareerAdminApi(editing.id, form);
        showToast("Career updated.");
      } else {
        await createCareerAdminApi(form);
        showToast("Career created.");
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
      await deleteCareerAdminApi(deleteTarget.id);
      setCareers((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast("Career deleted.");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setDeleteTarget(null);
    }
  }

  async function handleAddRequirement(careerId: string) {
    if (!reqSkillId || !reqProficiency) {
      showToast("Select a skill and required proficiency.", "error");
      return;
    }
    setSavingReq(true);
    try {
      await upsertCareerSkillApi(careerId, {
        skillId: reqSkillId, requiredProficiency: Number(reqProficiency), importance: reqImportance,
      });
      showToast("Career skill requirement updated.");
      setReqSkillId(""); setReqProficiency("70"); setReqImportance("MEDIUM");
      load();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setSavingReq(false);
    }
  }

  async function handleRemoveRequirement(careerId: string, skillId: string) {
    try {
      await removeCareerSkillApi(careerId, skillId);
      showToast("Requirement removed.");
      load();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  }

  if (loading) {
    return <div className="space-y-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>;
  }

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-950">Career Management</h1>
          <p className="mt-1 text-ink-500">Define roles and their required skill benchmarks. Changes apply live to every student.</p>
        </div>
        <Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Career</Button>
      </div>

      {careers.length === 0 ? (
        <Card><EmptyState title="No careers yet" actionLabel="Add Career" onAction={openAdd} /></Card>
      ) : (
        <div className="space-y-4">
          {careers.map((career) => {
            const isOpen = expanded === career.id;
            return (
              <Card key={career.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-ink-900">{career.name}</h3>
                    <p className="text-sm text-ink-500 mt-0.5">{career.description}</p>
                    <div className="mt-2 flex gap-2 text-xs">
                      <span className="rounded-full bg-ink-100 px-2.5 py-1 text-ink-600">{career.industry}</span>
                      <span className="rounded-full bg-ink-100 px-2.5 py-1 text-ink-600">{career.difficulty}</span>
                      <span className="rounded-full bg-ink-100 px-2.5 py-1 text-ink-600">{career.requiredSkills.length} skills</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openEdit(career)} className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700" aria-label="Edit career"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteTarget(career)} className="rounded-lg p-2 text-ink-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete career"><Trash2 className="h-4 w-4" /></button>
                    <button
                      onClick={() => setExpanded(isOpen ? null : career.id)}
                      className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                      aria-label={isOpen ? "Collapse requirements" : "Expand requirements"}
                      aria-expanded={isOpen}
                    >
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-5 border-t border-ink-100 pt-5">
                    <p className="text-sm font-medium text-ink-700 mb-3">Required skills</p>
                    <div className="space-y-2 mb-4">
                      {career.requiredSkills.map((rs) => (
                        <div key={rs.id} className="flex items-center justify-between rounded-xl border border-ink-100 px-3 py-2 text-sm">
                          <span className="font-medium text-ink-800">{rs.skill.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-ink-500">Required: {rs.requiredProficiency}%</span>
                            <span className="text-ink-500">{rs.importance}</span>
                            <button onClick={() => handleRemoveRequirement(career.id, rs.skillId)} className="text-ink-400 hover:text-red-600" aria-label="Remove requirement">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {career.requiredSkills.length === 0 && <p className="text-sm text-ink-400">No requirements set yet.</p>}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-4">
                      <Select
                        value={reqSkillId} onChange={(e) => setReqSkillId(e.target.value)}
                        placeholder="Select skill"
                        options={catalog.map((s) => ({ value: s.id, label: s.name }))}
                        className="sm:col-span-2"
                      />
                      <Input type="number" min="0" max="100" placeholder="Required %" value={reqProficiency} onChange={(e) => setReqProficiency(e.target.value)} />
                      <Select value={reqImportance} onChange={(e) => setReqImportance(e.target.value)} options={IMPORTANCE_OPTIONS} />
                    </div>
                    <Button onClick={() => handleAddRequirement(career.id)} loading={savingReq} className="mt-3">
                      Save requirement
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Career" : "Add Career"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <div>
            <label className="label-field">Description</label>
            <textarea
              className="input-field min-h-[90px]" required
              value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <Input label="Industry" required value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} />
          <Select
            label="Difficulty" value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
            options={[{ value: "Easy", label: "Easy" }, { value: "Medium", label: "Medium" }, { value: "Hard", label: "Hard" }]}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editing ? "Save changes" : "Create career"}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete career"
        footer={<>
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </>}
      >
        <p className="text-sm text-ink-600">
          Delete <strong>{deleteTarget?.name}</strong>? Students targeting this career will need to select a new one.
        </p>
      </Modal>
    </div>
  );
}
