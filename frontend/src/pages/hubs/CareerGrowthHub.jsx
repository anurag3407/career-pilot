import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  Mic,
  Video,
  TrendingUp,
  UserRound,
  DollarSign,
  BookOpen,
  ArrowRight,
} from 'lucide-react'
import HubLayout from '../../components/HubLayout'
import ToolCard from '../../components/ToolCard'
import { careerProfileApi, interviewApi, starStoriesApi } from '../../services/api'

export default function CareerGrowthHub() {
  const [loading, setLoading] = useState(true)
  const [interviewCount, setInterviewCount] = useState(0)
  const [avgScore, setAvgScore] = useState(null)
  const [storyCount, setStoryCount] = useState(0)
  const [targetRoles, setTargetRoles] = useState([])

  useEffect(() => {
    Promise.all([
      interviewApi.getHistory().catch(() => null),
      starStoriesApi.getAll().catch(() => null),
      careerProfileApi.get().catch(() => null),
    ])
      .then(([intRes, storiesRes, profRes]) => {
        const list = intRes?.data || intRes?.history || []
        const sessions = Array.isArray(list) ? list : []
        setInterviewCount(sessions.length)
        if (sessions.length > 0) {
          const avg = Math.round(
            sessions.reduce((acc, s) => acc + Number(s.overallScore || 0), 0) / sessions.length,
          )
          setAvgScore(`${avg}%`)
        }
        const stories = storiesRes?.stories || storiesRes?.data || []
        setStoryCount(Array.isArray(stories) ? stories.length : 0)
        setTargetRoles(profRes?.profile?.targetRoles || [])
      })
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { icon: Mic, value: interviewCount, label: 'Mock interviews', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: TrendingUp, value: avgScore ?? 'No data', label: 'Avg score', color: 'text-accent-foreground', bg: 'bg-accent' },
    { icon: BookOpen, value: storyCount, label: 'STAR stories', color: 'text-foreground', bg: 'bg-muted' },
  ]

  return (
    <HubLayout
      icon={GraduationCap}
      title="Interview & Career Growth"
      description="Practice mock interviews out loud, review session replays, analyze JD skill gaps, and map your next career move."
      color="primary"
      suite="03 Interview & Growth"
      breadcrumb="Interview & Growth"
      stats={loading ? [] : stats}
      actions={
        <Link
          to="/mock-interview/practice"
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
        >
          Start mock interview <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      }
    >
      <ToolCard
        to="/mock-interview/practice"
        icon={Mic}
        title="Mock Interview Lab"
        description="Practice behavioral, technical, and coding rounds with role-aware AI scoring."
        badge="Voice + Code"
        color="primary"
      />
      <ToolCard
        to="/interview-history"
        icon={Video}
        title="Interview Replay & History"
        description="Review past transcripts, score progression, and debrief notes."
        color="secondary"
      />
      <ToolCard
        to="/skill-gap"
        icon={TrendingUp}
        title="Skill Gap Analyzer"
        description="Compare your resume against any job description and review rejection learnings."
        color="emerald"
      />
      <ToolCard
        to="/career-path"
        icon={GraduationCap}
        title="Career Path Planner"
        description="Explore realistic next roles, skill requirements, and step-by-step roadmaps."
        color="primary"
      />
      <ToolCard
        to="/career-profile"
        icon={UserRound}
        title="Career Profile & STAR Bank"
        description="Manage your master resume, target roles, and reusable STAR interview stories."
        color="foreground"
      />
      <ToolCard
        to="/salary-estimate"
        icon={DollarSign}
        title="Offer Desk & Salary Bands"
        description="Benchmark role compensation by market tier and generate counter-offer drafts."
        color="amber"
      />

      {/* Contextual guidance based on real user state */}
      <div className="col-span-full mt-4 flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
            Personalization context
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground">
            {targetRoles.length > 0
              ? `Targeting: ${targetRoles.join(', ')}`
              : 'Set your target roles in Career Profile'}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {targetRoles.length > 0
              ? 'Mock interviews, LinkedIn optimization, and skill gap checks automatically calibrate to these roles.'
              : 'Add 2 to 3 target roles and STAR stories so every interview and outreach tool is preloaded.'}
          </p>
        </div>
        <Link
          to="/career-profile"
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-4 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
        >
          Manage Career Profile <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </HubLayout>
  )
}
