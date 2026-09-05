import { Link } from "react-router-dom";
import {
  ArrowRight, Compass, Sparkles, Target, TrendingUp, BarChart3, Radar,
  UserPlus, ListChecks, LineChart, GraduationCap,
} from "lucide-react";

const problems = [
  "Students don't know which skills their target career requires.",
  "Students cannot accurately evaluate their current skill level.",
  "Learning resources are scattered across dozens of platforms.",
  "Students don't know what to prioritize learning next.",
];

const steps = [
  { icon: UserPlus, title: "Create your profile", text: "Tell us about your education and career interests." },
  { icon: ListChecks, title: "Add your skills", text: "Rate your proficiency across the skills you already have." },
  { icon: Compass, title: "Pick a target career", text: "Choose from real job roles with defined skill requirements." },
  { icon: Target, title: "See your skill gap", text: "Get a precise, calculated readiness score and gap breakdown." },
  { icon: LineChart, title: "Follow your roadmap", text: "Work through personalized recommendations and track progress." },
];

const features = [
  { icon: Radar, title: "Skill Assessment", text: "Rate proficiency across programming, data, design, and soft skills." },
  { icon: Target, title: "Skill Gap Analysis", text: "See exactly where you stand against any career's requirements." },
  { icon: Compass, title: "Career Mapping", text: "Explore ten in-demand roles with transparent skill benchmarks." },
  { icon: Sparkles, title: "Personalized Recommendations", text: "Get a prioritized list of what to learn, practice, or build next." },
  { icon: TrendingUp, title: "Progress Tracking", text: "Watch your proficiency and readiness grow over time." },
  { icon: BarChart3, title: "Analytics", text: "Admins get platform-wide insight into skill gaps and growth." },
];

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Nav */}
      <header className="border-b border-ink-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-sm">SP</div>
            <span className="text-lg font-bold text-ink-900">SkillPath</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost">Log in</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
          <GraduationCap className="h-4 w-4" />
          Built for the Smart India Hackathon
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-ink-950 leading-[1.08]">
          Build the skills.<br />Become career ready.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-600">
          SkillPath helps students understand their current skills, identify exactly
          where they fall short of their dream career, and follow a clear roadmap to close the gap.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/register" className="btn-primary text-base px-6 py-3">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/login" className="btn-secondary text-base px-6 py-3">
            Explore Platform
          </Link>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-ink-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-ink-950">Career prep is guesswork right now</h2>
            <p className="mt-3 text-ink-600">Most students figure out what to learn far too late, or not at all.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {problems.map((p) => (
              <div key={p} className="card p-5">
                <p className="text-ink-700">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-bold text-ink-950">One clear path from where you are to where you want to be</h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
            {["Profile", "Skills", "Skill Gap", "Recommendations", "Progress"].map((s, i, arr) => (
              <div key={s} className="flex items-center gap-3">
                <span className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-brand-700">{s}</span>
                {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-ink-300" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ink-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-ink-950 text-center">How it works</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s) => (
              <div key={s.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-card text-brand-600">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-ink-900">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-ink-950 text-center">Everything you need to get career ready</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-ink-900">{f.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Start building your career roadmap today</h2>
          <p className="mt-3 text-brand-100">It takes two minutes to create a profile and see your first skill gap analysis.</p>
          <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm hover:bg-brand-50">
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-100 py-10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-xs">SP</div>
            <span className="text-sm font-semibold text-ink-900">SkillPath</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-ink-500">
            <span>About</span>
            <span>Features</span>
            <span>Contact</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
          <p className="text-sm text-ink-400">© {new Date().getFullYear()} SkillPath</p>
        </div>
      </footer>
    </div>
  );
}
