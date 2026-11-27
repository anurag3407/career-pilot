import { analyzePerformance } from "../utils/interviewAnalyzer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Clock,
  TrendingUp,
  BarChart3,
  Sparkles,
  Target,
  AlarmClock,
  FileText,
  Mic,
} from "lucide-react";
import logger from "../utils/logger";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { interviewApi, jobTrackerApi, careerProfileApi } from "../services/api";
import {
  funnelByResumeVersion,
  quietCompanies,
  weeklyAppliedCount,
} from "../utils/applicationFlow";

const DEFAULT_SUMMARY = {
  count: 0,
  averageOverallScore: 0,
  averageCommunication: 0,
  averageTechnicalAccuracy: 0,
  averageConfidence: 0,
  latestSession: null,
};

export default function Analytics() {
  const [analytics, setAnalytics] = useState({ sessions: [], summary: DEFAULT_SUMMARY });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [funnel, setFunnel] = useState([]);
  const [quiet, setQuiet] = useState([]);
  const [weeklyApplied, setWeeklyApplied] = useState(0);
  const [weeklyTarget, setWeeklyTarget] = useState(5);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await interviewApi.getAnalytics();
        logger.log("Analytics Response loaded", { status: response.status });
        const payload = response.data || { sessions: [], summary: DEFAULT_SUMMARY };
        setAnalytics({
          sessions: Array.isArray(payload.sessions) ? payload.sessions : [],
          summary: payload.summary || DEFAULT_SUMMARY,
        });
      } catch (fetchError) {
        const message = fetchError?.message || "Failed to load analytics data.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  useEffect(() => {
    Promise.all([
      jobTrackerApi.getAll().catch(() => null),
      careerProfileApi.get().catch(() => null),
    ]).then(([jobsRes, profileRes]) => {
      const jobs = jobsRes?.trackedJobs || [];
      setFunnel(funnelByResumeVersion(jobs));
      setQuiet(quietCompanies(jobs));
      setWeeklyApplied(weeklyAppliedCount(jobs));
      const target = profileRes?.profile?.weeklyApplyTarget;
      if (Number.isFinite(target) && target > 0) setWeeklyTarget(target);
    });
  }, []);

  const sessions = analytics.sessions;
  const summary = analytics.summary;
  const latestSession = summary.latestSession || sessions[sessions.length - 1] || {
    date: "--",
    overallScore: 0,
    communication: 0,
    technicalAccuracy: 0,
    confidence: 0,
  };

  const radarData = [
    { subject: "Communication", A: latestSession.communication, fullMark: 100 },
    { subject: "Technical", A: latestSession.technicalAccuracy, fullMark: 100 },
    { subject: "Confidence", A: latestSession.confidence, fullMark: 100 },
    { subject: "Overall", A: latestSession.overallScore, fullMark: 100 },
  ];

  const summaryStats = [
    { label: "Sessions", value: summary.count, icon: Clock, accent: "text-primary" },
    { label: "Avg Score", value: `${summary.averageOverallScore}%`, icon: TrendingUp, accent: "text-accent-foreground" },
    { label: "Communication", value: `${summary.averageCommunication}%`, icon: BarChart3, accent: "text-secondary" },
    { label: "Confidence", value: `${summary.averageConfidence}%`, icon: Sparkles, accent: "text-amber-500" },
  ];

  const hasSessions = sessions.length > 0;
  const insights = analyzePerformance(sessions);
  const improvement = insights.improvement || 0;

  return (
    <div className="cp-flight min-h-full bg-background text-foreground antialiased">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/85">
              Command Center
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-foreground">
              Pipeline &amp; Interview Analytics
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              Track which resume versions earn interviews, monitor stalled applications, and measure mock interview progression.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex h-9 items-center gap-2 self-start rounded-md border border-border bg-card px-3.5 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:text-primary lg:self-auto"
          >
            Back to Command Center <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </header>

        {/* Application Outcomes */}
        <section className="mb-8 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Application outcomes
              </p>
              <h2 className="mt-1 text-xl font-semibold text-foreground">
                Conversion by resume version
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground tabular-nums">
              <Target className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              This week: {weeklyApplied}/{weeklyTarget} applied
            </div>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="px-4 py-3">Resume version</th>
                    <th className="px-4 py-3 text-center">Applied</th>
                    <th className="px-4 py-3 text-center">Interviews</th>
                    <th className="px-4 py-3 text-center">Offers</th>
                    <th className="px-4 py-3 text-center">Closed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {funnel.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-xs text-muted-foreground">
                        No tailored packets attached to tracked jobs yet. Build a packet in Job Tracker to see conversion rates here.
                      </td>
                    </tr>
                  ) : (
                    funnel.map((row) => (
                      <tr key={row.key} className="text-foreground">
                        <td className="px-4 py-3 font-medium">
                          <span className="inline-flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                            {row.label || (row.resumeVersionId ? "Tailored version" : "Linked resume")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center tabular-nums">{row.applied}</td>
                        <td className="px-4 py-3 text-center font-semibold text-primary tabular-nums">{row.interviews}</td>
                        <td className="px-4 py-3 text-center font-semibold text-accent-foreground tabular-nums">{row.offered}</td>
                        <td className="px-4 py-3 text-center text-destructive tabular-nums">{row.rejected}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-4">
              <h3 className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
                <AlarmClock className="h-3.5 w-3.5" aria-hidden="true" /> Gone quiet
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Applied 14+ days ago with no follow-up scheduled.
              </p>
              <ul className="mt-3 space-y-2">
                {quiet.length === 0 ? (
                  <li className="text-xs text-muted-foreground">No stalled applications detected.</li>
                ) : (
                  quiet.slice(0, 5).map((c) => (
                    <li key={`${c.company}-${c.title}`} className="flex items-center justify-between gap-2 text-xs">
                      <span className="min-w-0 truncate text-foreground">
                        {c.company} · {c.title}
                      </span>
                      <span className="shrink-0 font-mono font-semibold text-amber-600 dark:text-amber-400">
                        {c.days}d
                      </span>
                    </li>
                  ))
                )}
              </ul>
              <Link
                to="/job-tracker"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Open tracker <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* Interview Metrics & Charts */}
        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Interview trend
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">
                    Score progression over time
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Overall, communication, technical accuracy, and confidence across mock sessions
                </p>
              </div>

              {loading ? (
                <div className="mt-6 h-[320px] animate-pulse rounded-xl bg-muted" />
              ) : !hasSessions ? (
                <div className="mt-6 flex h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/50 p-6 text-center">
                  <Mic className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium text-foreground">No mock interview sessions recorded yet</p>
                  <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                    Complete a practice session to populate trend charts and communication diagnostics.
                  </p>
                  <Link
                    to="/mock-interview/practice"
                    className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3.5 text-xs font-semibold text-primary-foreground"
                  >
                    Start mock interview <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <div className="mt-6 h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sessions} margin={{ top: 16, right: 16, bottom: 16, left: 0 }}>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "8px",
                          color: "var(--foreground)",
                        }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Line type="monotone" dataKey="overallScore" name="Overall" stroke="#1d6b3c" strokeWidth={2.5} dot={{ r: 3.5 }} />
                      <Line type="monotone" dataKey="communication" name="Communication" stroke="#a94a6c" strokeWidth={2.5} dot={{ r: 3.5 }} />
                      <Line type="monotone" dataKey="technicalAccuracy" name="Technical" stroke="#cc420c" strokeWidth={2.5} dot={{ r: 3.5 }} />
                      <Line type="monotone" dataKey="confidence" name="Confidence" stroke="#d97706" strokeWidth={2.5} dot={{ r: 3.5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            {hasSessions && (
              <section className="rounded-xl border border-border bg-card p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Skill breakdown
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-foreground">
                      Latest session radar
                    </h2>
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {latestSession.date} · Overall {latestSession.overallScore}%
                  </div>
                </div>

                <div className="mt-6 h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="80%">
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="subject" stroke="var(--muted-foreground)" fontSize={12} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={10} />
                      <Radar name="Latest Session" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Interview snapshot
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {summaryStats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border bg-background p-4">
                    <div className="flex items-center gap-2">
                      <stat.icon className={`h-4 w-4 ${stat.accent}`} aria-hidden="true" />
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                    <p className="mt-3 text-2xl font-semibold tabular-nums text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-base font-semibold text-foreground mb-4">
                Performance diagnostics
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-destructive mb-1.5">Weak areas</h4>
                  {insights.weaknesses.length > 0 ? (
                    <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
                      {insights.weaknesses.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No major weaknesses flagged yet.</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-1.5">Recurring patterns</h4>
                  {insights.recurringWeaknesses?.length > 0 ? (
                    <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
                      {insights.recurringWeaknesses.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No recurring gaps detected.</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-accent-foreground mb-1.5">Strengths</h4>
                  {insights.strengths.length > 0 ? (
                    <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
                      {insights.strengths.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">Complete sessions to surface consistent strengths.</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-1.5">Recommendations</h4>
                  {insights.recommendations.length > 0 ? (
                    <ul className="list-disc ml-4 space-y-1 text-muted-foreground">
                      {insights.recommendations.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">Keep practicing across varied role types.</p>
                  )}
                </div>

                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="text-muted-foreground">Net improvement</span>
                  <span className="font-mono font-semibold text-foreground tabular-nums">
                    {Number(improvement) > 0 ? `+${improvement}%` : `${improvement}%`}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">Latest sessions</h3>
                <Link to="/interview-history" className="text-xs font-semibold text-primary hover:underline">
                  All history
                </Link>
              </div>

              <div className="space-y-3">
                {hasSessions ? (
                  sessions.slice(0, 4).map((session, i) => (
                    <div key={`${session.date}-${i}`} className="rounded-lg border border-border bg-background p-3.5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-foreground">{session.date}</p>
                          <p className="text-[11px] text-muted-foreground">Overall: {session.overallScore}%</p>
                        </div>
                        <div className="text-right font-mono text-xs font-semibold text-primary tabular-nums">
                          {session.confidence}% conf
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {loading ? "Loading interview sessions..." : error || "No interview sessions available yet."}
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
