import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name.split(" ")[0]}.`);
      navigate(user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
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
          <h1 className="mt-6 text-2xl font-bold text-ink-950">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-500">Log in to continue your career roadmap.</p>
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}
            <Input
              label="Email" type="email" name="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
            />
            <Input
              label="Password" type="password" name="password" autoComplete="current-password" required
              value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
            />
            <Button type="submit" loading={loading} className="w-full">
              <LogIn className="h-4 w-4" /> Log in
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-ink-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">Register</Link>
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-ink-200 bg-white p-4 text-xs text-ink-500">
          <p className="font-semibold text-ink-700 mb-1">Demo accounts</p>
          <p>Student: student@example.com / Student@123</p>
          <p>Admin: admin@example.com / Admin@123</p>
        </div>
      </div>
    </div>
  );
}
