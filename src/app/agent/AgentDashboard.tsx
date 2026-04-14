"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Loader2, CheckCircle2, XCircle, Mail, Briefcase, User, Bot } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface JobResult {
  title: string;
  company: string;
  location: string;
  url: string;
  recruiterEmail?: string;
  status: "found" | "applied" | "emailed" | "error";
}

interface RunResult {
  jobsFound: number;
  emailsSent: number;
  applicationsSubmitted: number;
  jobs: JobResult[];
  logs: string[];
}

// ─── Pipeline Stage Definition ────────────────────────────────────────────────

const PIPELINE_STAGES = [
  {
    id: "cv",
    label: "CV Parser",
    description: "Extracts skills & experience from your CV",
    icon: User,
    color: "border-[#5483B3]",
    bg: "bg-[#5483B3]/10",
    iconColor: "text-[#5483B3]",
  },
  {
    id: "jobs",
    label: "Job Discovery",
    description: "Searches Adzuna for matching roles",
    icon: Briefcase,
    color: "border-[#C1E8FF]",
    bg: "bg-[#C1E8FF]/10",
    iconColor: "text-[#C1E8FF]",
  },
  {
    id: "recruiter",
    label: "Recruiter Finder",
    description: "Locates recruiter emails via Hunter.io",
    icon: Mail,
    color: "border-[#7DA0CA]",
    bg: "bg-[#7DA0CA]/10",
    iconColor: "text-[#7DA0CA]",
  },
  {
    id: "email",
    label: "Email Generator",
    description: "Writes personalised outreach with GPT-4o",
    icon: Bot,
    color: "border-white/50",
    bg: "bg-white/5",
    iconColor: "text-white",
  },
];

const STATUS_COLORS: Record<JobResult["status"], string> = {
  found: "text-[#C1E8FF]",
  applied: "text-[#00ff9d]",
  emailed: "text-[#7DA0CA]",
  error: "text-red-400",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function AgentDashboard() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [cvText, setCvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(-1);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    if (!jobTitle.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setActiveStage(0);

    try {
      // Animate through stages while the request is in flight
      const stageInterval = setInterval(() => {
        setActiveStage((prev) => {
          if (prev < PIPELINE_STAGES.length - 1) return prev + 1;
          clearInterval(stageInterval);
          return prev;
        });
      }, 2500);

      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, location, cvText }),
      });

      clearInterval(stageInterval);
      setActiveStage(PIPELINE_STAGES.length - 1);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server error ${res.status}`);
      }

      const data: RunResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
      setActiveStage(-1);
    }
  }

  return (
    <main className="bg-[#021024] min-h-screen text-white">
      {/* Back */}
      <Link
        href="/"
        className="fixed top-8 left-8 z-[100] flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20 transition-all font-bold text-sm tracking-widest uppercase"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {/* Hero */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.06)_0%,transparent_70%)] pointer-events-none" />
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-primary/70 text-sm font-bold tracking-[0.3em] uppercase mb-4 block"
        >
          AI / Automation · 2025
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-6"
        >
          AI Job Application&nbsp;Agent
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Autonomous pipeline that discovers jobs, finds recruiter emails, writes
          personalised cold outreach, and auto-applies — all while you sleep.
        </motion.p>
      </section>

      {/* Pipeline Visualiser */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-primary/60 mb-8 text-center">
          Pipeline Stages
        </h2>

        <div className="relative glass rounded-[2rem] p-8 md:p-14 overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-2xl">
          {/* Animated connector line (desktop) */}
          <svg
            className="absolute top-1/2 left-[8%] w-[84%] h-16 -translate-y-1/2 z-0 hidden md:block overflow-visible"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 32 L 1000 32"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {[0, 1, 2].map((i) => (
              <circle key={i} r="4" fill="#C1E8FF" filter="drop-shadow(0 0 6px #C1E8FF)">
                <animateMotion
                  dur={loading ? "2s" : "4s"}
                  begin={`${i * 0.8}s`}
                  repeatCount="indefinite"
                  path="M 0 32 L 1000 32"
                />
              </circle>
            ))}
          </svg>

          <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-4 relative z-10">
            {PIPELINE_STAGES.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = loading && activeStage === index;
              const isDone = !loading && result !== null;

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="flex flex-col items-center group w-full md:w-1/4"
                >
                  <div
                    className={`w-52 md:w-44 relative rounded-xl border-l-4 ${stage.color} bg-[#0d1b2e] p-4 shadow-xl flex items-center gap-3 transition-all duration-300 ${
                      isActive ? "scale-105 shadow-[0_0_30px_rgba(193,232,255,0.15)]" : ""
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg ${stage.bg} flex items-center justify-center shrink-0`}>
                      {isActive ? (
                        <Loader2 className={`w-5 h-5 ${stage.iconColor} animate-spin`} />
                      ) : isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-[#00ff9d]" />
                      ) : (
                        <Icon className={`w-5 h-5 ${stage.iconColor}`} />
                      )}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] uppercase text-foreground/50 font-bold tracking-wider truncate">
                        Stage {index + 1}
                      </span>
                      <span className="text-sm font-bold text-white truncate">{stage.label}</span>
                    </div>

                    {/* Connection dots */}
                    {index > 0 && (
                      <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/30 hidden md:block" />
                    )}
                    {index < PIPELINE_STAGES.length - 1 && (
                      <div className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/30 hidden md:block" />
                    )}
                  </div>

                  <p className="mt-4 text-[11px] text-white/40 text-center max-w-[160px] leading-relaxed">
                    {stage.description}
                  </p>

                  {isActive && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#00ff9d] shadow-[0_0_8px_#00ff9d] animate-pulse" />
                      <span className="text-[10px] font-bold text-[#00ff9d] tracking-widest uppercase">Running</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Control Panel */}
      <section className="max-w-3xl mx-auto px-6 mb-20">
        <div className="glass rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl p-8 md:p-10 space-y-6">
          <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-primary/60">
            Run the Agent
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white/70 mb-2">
                Target Job Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white/70 mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. London or Remote"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white/70 mb-2">
                CV / Resume Text{" "}
                <span className="text-white/30 font-normal">(paste plain text or leave blank to use stored profile)</span>
              </label>
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                rows={6}
                placeholder="Paste your CV text here…"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleRun}
            disabled={loading || !jobTitle.trim()}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-black font-black text-sm tracking-widest uppercase transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(193,232,255,0.2)] hover:shadow-[0_0_40px_rgba(193,232,255,0.35)]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-black" />
            )}
            {loading ? "Agent Running…" : "Run Agent"}
          </button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </motion.div>
          )}
        </div>
      </section>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="max-w-6xl mx-auto px-6 pb-32"
          >
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { label: "Jobs Found", value: result.jobsFound },
                { label: "Emails Sent", value: result.emailsSent },
                { label: "Applications", value: result.applicationsSubmitted },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/4 p-6 text-center backdrop-blur-md"
                >
                  <p className="text-4xl font-black text-primary mb-1">{stat.value}</p>
                  <p className="text-xs font-bold tracking-widest uppercase text-white/40">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Job Cards */}
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-primary/60 mb-6">
              Job Results
            </h2>
            <div className="space-y-3 mb-10">
              {result.jobs.map((job, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/4 backdrop-blur-md p-5"
                >
                  <div>
                    <p className="font-bold text-white">{job.title}</p>
                    <p className="text-sm text-white/50">
                      {job.company} · {job.location}
                    </p>
                    {job.recruiterEmail && (
                      <p className="text-xs text-[#7DA0CA] mt-1">📧 {job.recruiterEmail}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs font-bold uppercase tracking-widest ${STATUS_COLORS[job.status]}`}
                    >
                      {job.status}
                    </span>
                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all"
                      >
                        View
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Logs */}
            {result.logs.length > 0 && (
              <>
                <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-primary/60 mb-4">
                  Agent Logs
                </h2>
                <div className="rounded-2xl border border-white/10 bg-black/60 p-6 font-mono text-xs text-white/60 space-y-1.5 max-h-64 overflow-y-auto">
                  {result.logs.map((log, i) => (
                    <p key={i}>{log}</p>
                  ))}
                </div>
              </>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
