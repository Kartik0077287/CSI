import { useState } from "react";
import { LogOut, Shield, Bell } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Settings() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [emailNotifs, setEmailNotifs] = useState(true);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-950">Settings</h1>
        <p className="mt-1 text-ink-500">Manage your account preferences.</p>
      </div>

      <Card title="Account">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-ink-100 pb-3">
            <span className="text-ink-500">Name</span>
            <span className="font-medium text-ink-800">{user?.name}</span>
          </div>
          <div className="flex justify-between border-b border-ink-100 pb-3">
            <span className="text-ink-500">Email</span>
            <span className="font-medium text-ink-800">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-500">Role</span>
            <span className="font-medium text-ink-800 capitalize">{user?.role.toLowerCase()}</span>
          </div>
        </div>
      </Card>

      <Card title="Notifications">
        <label className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-ink-700">
            <Bell className="h-4 w-4 text-ink-400" /> Email me about recommendations
          </span>
          <input
            type="checkbox"
            checked={emailNotifs}
            onChange={(e) => {
              setEmailNotifs(e.target.checked);
              showToast("Preference saved.");
            }}
            className="h-5 w-5 rounded border-ink-300 text-brand-600 focus:ring-brand-300"
          />
        </label>
      </Card>

      <Card title="Security">
        <p className="flex items-center gap-2 text-sm text-ink-600">
          <Shield className="h-4 w-4 text-ink-400" />
          Password changes aren't available in this demo build.
        </p>
      </Card>

      <Button variant="danger" onClick={logout}>
        <LogOut className="h-4 w-4" /> Log out
      </Button>
    </div>
  );
}
