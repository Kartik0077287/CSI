import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  college: string;
  course: string;
  graduationYear: string;
}

const initialState: FormState = {
  name: "", email: "", password: "", confirmPassword: "", college: "", course: "", graduationYear: "",
};

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: typeof errors = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        college: form.college || undefined,
        course: form.course || undefined,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
      });
      showToast("Account created. Welcome to SkillPath!");
      navigate(user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-sm">SP</div>
            <span className="text-lg font-bold text-ink-900">SkillPath</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-ink-950">Create your account</h1>
          <p className="mt-1 text-sm text-ink-500">Start mapping your path to career readiness.</p>
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {apiError && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{apiError}</div>
            )}
            <Input label="Full name" name="name" required value={form.name} onChange={(e) => update("name", e.target.value)} error={errors.name} placeholder="Aarav Sharma" />
            <Input label="Email" type="email" name="email" required value={form.email} onChange={(e) => update("email", e.target.value)} error={errors.email} placeholder="you@example.com" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Password" type="password" name="password" required value={form.password} onChange={(e) => update("password", e.target.value)} error={errors.password} placeholder="••••••••" />
              <Input label="Confirm password" type="password" name="confirmPassword" required value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} error={errors.confirmPassword} placeholder="••••••••" />
            </div>
            <Input label="College" name="college" value={form.college} onChange={(e) => update("college", e.target.value)} placeholder="Your college or university" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Course / Branch" name="course" value={form.course} onChange={(e) => update("course", e.target.value)} placeholder="Computer Science" />
              <Input label="Graduation year" name="graduationYear" type="number" value={form.graduationYear} onChange={(e) => update("graduationYear", e.target.value)} placeholder="2027" />
            </div>
            <Button type="submit" loading={loading} className="w-full">
              <UserPlus className="h-4 w-4" /> Create account
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-ink-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
