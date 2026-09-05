import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Skills from "./pages/Skills";
import SkillGap from "./pages/SkillGap";
import CareerGoals from "./pages/CareerGoals";
import Recommendations from "./pages/Recommendations";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminSkills from "./pages/admin/AdminSkills";
import AdminCareers from "./pages/admin/AdminCareers";
import AdminAnalyticsPage from "./pages/admin/AdminAnalytics";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student */}
            <Route element={<ProtectedRoute allow={["STUDENT"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/skill-gap" element={<SkillGap />} />
                <Route path="/career" element={<CareerGoals />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Admin */}
            <Route element={<ProtectedRoute allow={["ADMIN"]} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<AdminStudents />} />
                <Route path="/admin/skills" element={<AdminSkills />} />
                <Route path="/admin/careers" element={<AdminCareers />} />
                <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Landing />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
