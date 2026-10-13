import { analyzePerformance } from "../utils/interviewAnalyzer";
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowRight,
  Clock,
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Sparkles
} from 'lucide-react'
import logger from '../utils/logger'
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
  Radar
} from 'recharts'
import { interviewApi } from '../services/api'

const DEFAULT_SUMMARY = {
  count: 0,
  averageOverallScore: 0,
  averageCommunication: 0,
  averageTechnicalAccuracy: 0,
  averageConfidence: 0,
  latestSession: null
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState({ sessions: [], summary: DEFAULT_SUMMARY })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await interviewApi.getAnalytics()
        logger.log("Analytics Response loaded", { status: response.status })
        logger.log("Analytics Data loaded", { sessionCount: response.data?.sessions?.length })
        const payload = response.data || { sessions: [], summary: DEFAULT_SUMMARY }
        setAnalytics({
          sessions: Array.isArray(payload.sessions) ? payload.sessions : [],
          summary: payload.summary || DEFAULT_SUMMARY
        })
      } catch (fetchError) {
        const message = fetchError?.message || 'Failed to load analytics data.'
        setError(message)
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  const sessions = analytics.sessions
  const summary = analytics.summary
  const latestSession = summary.latestSession || sessions[sessions.length - 1] || {
    date: '--',
    overallScore: 0,
    communication: 0,
    technicalAccuracy: 0,
    confidence: 0
  }

  const radarData = [
    { subject: 'Communication', A: latestSession.communication, fullMark: 100 },
    { subject: 'Technical Accuracy', A: latestSession.technicalAccuracy, fullMark: 100 },
    { subject: 'Confidence', A: latestSession.confidence, fullMark: 100 },
    { subject: 'Overall Score', A: latestSession.overallScore, fullMark: 100 }
  ]

  const summaryStats = [
    { label: 'Sessions', value: summary.count, icon: Clock, accent: 'text-primary' },
    { label: 'Avg. Score', value: `${summary.averageOverallScore}%`, icon: TrendingUp, accent: 'text-emerald-500' },
    { label: 'Avg. Communication', value: `${summary.averageCommunication}%`, icon: BarChart3, accent: 'text-violet-500' },
    { label: 'Avg. Confidence', value: `${summary.averageConfidence}%`, icon: Sparkles, accent: 'text-amber-500' }
  ]

  const chartData = sessions || []
const hasSessions = sessions.length > 0

const insights = analyzePerformance(sessions)
const improvement = insights.improvement || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                <LayoutDashboard className="w-4 h-4" />
                Interview Analytics
              </div>
              <h1 className="mt-4 text-4xl font-black text-foreground tracking-tight">Mock interview visual analytics</h1>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground leading-7">
                Explore your mock interview history with trend lines, skill breakdowns, and session summaries powered by realtime analytics.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-5 py-3 text-sm font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
            >
              Back to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.7fr_1fr]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Trend analysis</p>
                  <h2 className="mt-2 text-2xl font-black text-foreground">Performance over time</h2>
                </div>
                <p className="text-sm font-medium text-muted-foreground max-w-xl">
                  Track overall score, communication, technical accuracy, and confidence across your most recent mock interviews.
                </p>
              </div>

              <div className="mt-8 h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" dataKey="overallScore" name="Overall" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="communication" name="Communication" stroke="#60a5fa" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="technicalAccuracy" name="Technical" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="confidence" name="Confidence" stroke="#facc15" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Skill breakdown</p>
                  <h2 className="mt-2 text-2xl font-black text-foreground">Latest session radar</h2>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {latestSession.date} • Overall {latestSession.overallScore}%
                </div>
              </div>

              <div className="mt-8 h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="80%">
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" stroke="#64748b" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Latest Session" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-black text-foreground mb-6">Snapshot insights</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {summaryStats.map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-border/70 bg-background/80 p-5">
                    <div className="flex items-center gap-3">
                      <stat.icon className={`w-5 h-5 ${stat.accent}`} />
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.3em]">{stat.label}</p>
                    </div>
                    <p className="mt-5 text-3xl font-black text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
  <h3 className="text-lg font-black text-foreground mb-6">
    Personalized Improvement Insights
  </h3>

  <div className="space-y-5">

    <div>
      <h4 className="font-bold text-red-500 mb-2">
        Weak Areas
      </h4>

      {insights.weaknesses.length > 0 ? (
        <ul className="list-disc ml-5 text-sm">
          {insights.weaknesses.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          No major weaknesses detected.
        </p>
      )}
    </div>
    <div>
  <h4 className="font-bold text-orange-500 mb-2">
    Recurring Weaknesses
  </h4>

  {insights.recurringWeaknesses?.length > 0 ? (
    <ul className="list-disc ml-5 text-sm">
      {insights.recurringWeaknesses.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-muted-foreground">
      No recurring weaknesses detected.
    </p>
  )}
</div>

    <div>
      <h4 className="font-bold text-green-500 mb-2">
        Strengths
      </h4>

      {insights.strengths.length > 0 ? (
        <ul className="list-disc ml-5 text-sm">
          {insights.strengths.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          No strengths identified yet.
        </p>
      )}
    </div>

    <div>
      <h4 className="font-bold text-blue-500 mb-2">
        Recommendations
      </h4>

      {insights.recommendations.length > 0 ? (
        <ul className="list-disc ml-5 text-sm">
          {insights.recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          Keep maintaining your current performance.
        </p>
      )}
    </div>

    <div>
      <h4 className="font-bold text-purple-500 mb-2">
        Progress Tracking
      </h4>

      <p className="text-sm">
        Overall Improvement:
        <span className="font-bold ml-2">
  {Number(improvement) > 0
    ? `+${improvement}%`
    : `${improvement}%`}
</span>
      </p>
    </div>

  </div>
</section>

            <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Recent sessions</p>
                  <h3 className="mt-2 text-2xl font-black text-foreground">Latest interviews</h3>
                </div>
                <Link to="/interview-prep" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                  Review all <ArrowRight className="w-4 h-4 inline-block" />
                </Link>
              </div>

              <div className="space-y-4">
                {hasSessions ? (
                  sessions.map((session) => (
                    <div key={session.date} className="rounded-3xl border border-border/70 bg-background/80 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-foreground">{session.date}</p>
                          <p className="text-xs text-muted-foreground">Overall score: {session.overallScore}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-foreground">{session.confidence}%</p>
                          <p className="text-xs text-muted-foreground">Confidence</p>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-card border border-border p-3 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Communication</p>
                          <p className="mt-2 text-xl font-black text-foreground">{session.communication}%</p>
                        </div>
                        <div className="rounded-2xl bg-card border border-border p-3 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Technical</p>
                          <p className="mt-2 text-xl font-black text-foreground">{session.technicalAccuracy}%</p>
                        </div>
                        <div className="rounded-2xl bg-card border border-border p-3 text-center">
                          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Confidence</p>
                          <p className="mt-2 text-xl font-black text-foreground">{session.confidence}%</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-border/70 bg-background/80 p-8 text-center text-sm text-muted-foreground">
                    {loading ? 'Loading interview sessions...' : error ? error : 'No interview history available yet.'}
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
