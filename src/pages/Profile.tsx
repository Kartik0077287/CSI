import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import { CardSkeleton } from "../components/Skeleton";
import ErrorState from "../components/ErrorState";
import { fetchProfile, updateProfileApi } from "../services/services";
import { getErrorMessage } from "../services/api";
import { useToast } from "../context/ToastContext";
import type { StudentProfile } from "../types";

const emptyForm = {
  name: "", phone: "", location: "",
  college: "", degree: "", branch: "", graduationYear: "", cgpa: "",
  preferredIndustry: "", experienceLevel: "",
  bio: "",
};

type FormState = typeof emptyForm;

export default function Profile() {
  const { showToast } = useToast();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const profile = await fetchProfile();
      setForm({
        name: profile.name ?? "",
        phone: profile.phone ?? "",
        location: profile.location ?? "",
        college: profile.college ?? "",
        degree: profile.degree ?? "",
        branch: profile.branch ?? "",
        graduationYear: profile.graduationYear?.toString() ?? "",
        cgpa: profile.cgpa?.toString() ?? "",
        preferredIndustry: profile.preferredIndustry ?? "",
        experienceLevel: profile.experienceLevel ?? "",
        bio: profile.bio ?? "",
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileApi({
        name: form.name,
        phone: form.phone || null,
        location: form.location || null,
        college: form.college || null,
        degree: form.degree || null,
        branch: form.branch || null,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : null,
        cgpa: form.cgpa ? Number(form.cgpa) : null,
        preferredIndustry: form.preferredIndustry || null,
        experienceLevel: form.experienceLevel || null,
        bio: form.bio || null,
      });
      showToast("Profile updated successfully.");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton /><CardSkeleton /><CardSkeleton />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-950">Profile</h1>
        <p className="mt-1 text-ink-500">Keep your information up to date for better recommendations.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Personal Information">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
              {form.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-sm font-medium text-ink-700">Profile photo</p>
              <p className="text-xs text-ink-400">Photo upload isn't wired up in this demo build.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" value={form.name} onChange={(e) => update("name", e.target.value)} />
            <Input label="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" />
            <Input label="Location" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="City, State" className="sm:col-span-2" />
          </div>
        </Card>

        <Card title="Education">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="College" value={form.college} onChange={(e) => update("college", e.target.value)} className="sm:col-span-2" />
            <Input label="Degree" value={form.degree} onChange={(e) => update("degree", e.target.value)} placeholder="B.Tech" />
            <Input label="Branch" value={form.branch} onChange={(e) => update("branch", e.target.value)} placeholder="Computer Science" />
            <Input label="Graduation year" type="number" value={form.graduationYear} onChange={(e) => update("graduationYear", e.target.value)} />
            <Input label="CGPA" type="number" step="0.01" value={form.cgpa} onChange={(e) => update("cgpa", e.target.value)} />
          </div>
        </Card>

        <Card title="Career">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Preferred industry" value={form.preferredIndustry} onChange={(e) => update("preferredIndustry", e.target.value)} placeholder="Software" />
            <Select
              label="Experience level"
              value={form.experienceLevel}
              onChange={(e) => update("experienceLevel", e.target.value)}
              placeholder="Select level"
              options={[
                { value: "Student / Intern", label: "Student / Intern" },
                { value: "Entry Level", label: "Entry Level" },
                { value: "1-3 years", label: "1-3 years" },
                { value: "3+ years", label: "3+ years" },
              ]}
            />
          </div>
        </Card>

        <Card title="About">
          <label className="label-field" htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            className="input-field min-h-[120px] resize-y"
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            placeholder="Tell us a bit about yourself..."
          />
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" /> Edit Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
