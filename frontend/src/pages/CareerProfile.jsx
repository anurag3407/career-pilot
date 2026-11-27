import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  UserRound, FileText, Target, Plus, Trash2, Loader2, BookOpen, Check, Save, StickyNote, X,
} from 'lucide-react'
import Layout from '../components/Layout'
import { careerProfileApi, resumeApi, starStoriesApi } from '../services/api'
import { resumeDocToText } from '../utils/resumeText'

const STORY_FIELDS = [
  { key: 'situation', label: 'Situation', placeholder: 'Where were you? What was at stake?' },
  { key: 'task', label: 'Task', placeholder: 'What were you responsible for?' },
  { key: 'action', label: 'Action', placeholder: 'What did YOU do — decisions, tradeoffs, moves?' },
  { key: 'result', label: 'Result', placeholder: 'Numbers, outcomes, what changed.' },
]

const SOURCE_BADGES = {
  manual: { label: 'Manual', cls: 'bg-primary/10 border-primary/25 text-primary' },
  rejection_debrief: { label: 'From a rejection', cls: 'bg-red-500/10 border-red-500/25 text-red-400' },
  interview_debrief: { label: 'From an interview', cls: 'bg-violet-500/10 border-violet-500/25 text-violet-400' },
}

const emptyStory = () => ({
  id: null,
  title: '',
  situation: '',
  task: '',
  action: '',
  result: '',
  skills: '',
  roleTags: '',
  source: 'manual',
})

export default function CareerProfile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(null)
  const [resumes, setResumes] = useState([])
  const [masterResumeId, setMasterResumeId] = useState('')
  const [targetRoles, setTargetRoles] = useState([])
  const [newRole, setNewRole] = useState('')
  const [weeklyApplyTarget, setWeeklyApplyTarget] = useState(5)
  const [stories, setStories] = useState([])
  const [storyDraft, setStoryDraft] = useState(emptyStory())
  const [storySaving, setStorySaving] = useState(false)
  const [storyOpen, setStoryOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [profileRes, resumesRes, storiesRes] = await Promise.all([
        careerProfileApi.get().catch(() => null),
        resumeApi.getAll().catch(() => null),
        starStoriesApi.getAll().catch(() => null),
      ])
      const prof = profileRes?.profile || null
      const list = resumesRes?.resumes || resumesRes?.data || []
      setProfile(prof)
      setResumes(list)
      setMasterResumeId(prof?.masterResumeId || list[0]?.id || '')
      setTargetRoles(prof?.targetRoles || [])
      setWeeklyApplyTarget(prof?.weeklyApplyTarget ?? 5)
      setStories(storiesRes?.stories || storiesRes?.data || [])
      setLoading(false)
    }
    load()
  }, [])

  const masterText = useMemo(
    () => resumeDocToText(resumes.find((r) => r.id === masterResumeId)),
    [resumes, masterResumeId],
  )

  const saveProfile = async () => {
    if (!masterResumeId) {
      toast.error('Pick a master resume first')
      return
    }
    setSaving(true)
    try {
      await careerProfileApi.update({
        masterResumeId,
        masterResumeText: masterText,
        targetRoles,
        weeklyApplyTarget: Number(weeklyApplyTarget) || 0,
      })
      toast.success('Career profile saved — tailoring, interviews, and outreach now use it')
    } catch (err) {
      toast.error(err.message || 'Could not save the profile')
    } finally {
      setSaving(false)
    }
  }

  const addRole = () => {
    const role = newRole.trim()
    if (!role) return
    if (targetRoles.includes(role)) return
    if (targetRoles.length >= 3) {
      toast.error('Keep it to two or three target roles')
      return
    }
    setTargetRoles([...targetRoles, role])
    setNewRole('')
  }

  const saveStory = async () => {
    if (!storyDraft.title.trim()) {
      toast.error('Give the story a title')
      return
    }
    setStorySaving(true)
    try {
      const payload = {
        title: storyDraft.title.trim(),
        situation: storyDraft.situation,
        task: storyDraft.task,
        action: storyDraft.action,
        result: storyDraft.result,
        skills: storyDraft.skills,
        roleTags: storyDraft.roleTags,
        source: storyDraft.source || 'manual',
      }
      if (storyDraft.id) {
        const res = await starStoriesApi.update(storyDraft.id, payload)
        setStories((prev) => prev.map((s) => (s.id === storyDraft.id ? (res.story || s) : s)))
      } else {
        const res = await starStoriesApi.create(payload)
        setStories((prev) => [res.story || res.data, ...prev])
      }
      toast.success(storyDraft.id ? 'Story updated' : 'Story added to the bank')
      setStoryDraft(emptyStory())
      setStoryOpen(false)
    } catch (err) {
      toast.error(err.message || 'Could not save the story')
    } finally {
      setStorySaving(false)
    }
  }

  const deleteStory = async (storyId) => {
    if (!window.confirm('Remove this story from the bank?')) return
    try {
      await starStoriesApi.delete(storyId)
      setStories((prev) => prev.filter((s) => s.id !== storyId))
      toast.success('Story removed')
    } catch (err) {
      toast.error(err.message || 'Could not remove the story')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background px-4 py-10">
          <div className="mx-auto max-w-4xl animate-pulse space-y-4">
            <div className="h-9 w-64 rounded bg-foreground/10" />
            <div className="h-40 rounded-xl bg-foreground/[0.06]" />
            <div className="h-64 rounded-xl bg-foreground/[0.06]" />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <UserRound className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Career profile</h1>
              <p className="text-sm text-muted-foreground">
                One master resume, target roles, and STAR stories shared across every tool.
              </p>
            </div>
          </div>

          {/* Master resume + target roles */}
          <div className="rounded-2xl border border-border bg-card/40 p-5 space-y-5">
            <div>
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                <FileText className="w-3.5 h-3.5" /> Master resume
              </label>
              <select
                value={masterResumeId}
                onChange={(e) => setMasterResumeId(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
              >
                <option value="">Select a resume...</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>{r.title || 'Untitled resume'}</option>
                ))}
              </select>
              {masterText && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-[11.5px] font-semibold text-primary">Preview master resume text</summary>
                  <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-lg bg-muted/30 border border-border p-3 text-[11.5px] leading-relaxed text-foreground/80 scrollbar-thin">
                    {masterText}
                  </pre>
                </details>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                <Target className="w-3.5 h-3.5" /> Target roles (2–3)
              </label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {targetRoles.map((role) => (
                  <span key={role} className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[12px] font-semibold text-primary">
                    {role}
                    <button onClick={() => setTargetRoles(targetRoles.filter((r) => r !== role))} className="text-primary/60 hover:text-primary">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {targetRoles.length === 0 && (
                  <span className="text-[12px] text-muted-foreground">No target roles yet. Tailoring and interview prep use these.</span>
                )}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
                <button onClick={addRole} className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-[13px] font-bold text-primary hover:bg-primary/20">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Weekly apply target</label>
                <input
                  type="number" min={0} max={100}
                  value={weeklyApplyTarget}
                  onChange={(e) => setWeeklyApplyTarget(e.target.value)}
                  className="mt-1.5 w-28 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>
              <button
                onClick={saveProfile}
                disabled={saving || !masterResumeId}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save profile
              </button>
            </div>
          </div>

          {/* STAR story bank */}
          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">STAR story bank</h2>
                <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-bold text-muted-foreground">{stories.length}</span>
              </div>
              <button
                onClick={() => { setStoryDraft(emptyStory()); setStoryOpen(true) }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[12.5px] font-bold text-primary-foreground transition hover:brightness-110"
              >
                <Plus className="w-3.5 h-3.5" /> Add story
              </button>
            </div>
            <p className="mb-4 text-[12.5px] text-muted-foreground">
              Situation · Task · Action · Result. Mock interviews, outreach, and the skill-gap view pull from this bank — write once, reuse everywhere.
            </p>

            {stories.length === 0 && !storyOpen && (
              <div className="rounded-xl border border-dashed border-border p-6 text-center">
                <StickyNote className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No stories yet. Add one from a win — or mark a card rejected and the debrief will draft one for you.
                </p>
              </div>
            )}

            {storyOpen && (
              <div className="mb-5 rounded-xl border border-primary/30 bg-primary/[0.04] p-4 space-y-3">
                <input
                  value={storyDraft.title}
                  onChange={(e) => setStoryDraft({ ...storyDraft, title: e.target.value })}
                  placeholder="Story title — e.g. 'Led the payments migration'"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground outline-none focus:border-primary/50"
                />
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {STORY_FIELDS.map((f) => (
                    <label key={f.key} className="block sm:col-span-2">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{f.label}</span>
                      <textarea
                        value={storyDraft[f.key]}
                        onChange={(e) => setStoryDraft({ ...storyDraft, [f.key]: e.target.value })}
                        rows={2}
                        placeholder={f.placeholder}
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary/50 resize-y"
                      />
                    </label>
                  ))}
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <input
                    value={storyDraft.skills}
                    onChange={(e) => setStoryDraft({ ...storyDraft, skills: e.target.value })}
                    placeholder="Skills (comma-separated) — React, SQL"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary/50"
                  />
                  <input
                    value={storyDraft.roleTags}
                    onChange={(e) => setStoryDraft({ ...storyDraft, roleTags: e.target.value })}
                    placeholder="Best for roles (comma-separated)"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary/50"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setStoryOpen(false)} className="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground">Cancel</button>
                  <button
                    onClick={saveStory} disabled={storySaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
                  >
                    {storySaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {storyDraft.id ? 'Save changes' : 'Add to bank'}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              {stories.map((s) => {
                const badge = SOURCE_BADGES[s.source] || SOURCE_BADGES.manual
                return (
                  <div key={s.id} className="group rounded-xl border border-border bg-card/45 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-foreground">{s.title || 'Untitled story'}</p>
                        <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.cls}`}>{badge.label}</span>
                        {s.skills?.length > 0 && (
                          <p className="mt-1.5 text-[11px] text-muted-foreground">{(Array.isArray(s.skills) ? s.skills : []).join(' · ')}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          onClick={() => {
                            setStoryDraft({
                              id: s.id,
                              title: s.title || '',
                              situation: s.situation || '',
                              task: s.task || '',
                              action: s.action || '',
                              result: s.result || '',
                              skills: Array.isArray(s.skills) ? s.skills.join(', ') : s.skills || '',
                              roleTags: Array.isArray(s.roleTags || s.role_tags) ? (s.roleTags || s.role_tags || []).join(', ') : '',
                              source: s.source || 'manual',
                            })
                            setStoryOpen(true)
                          }}
                          className="rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteStory(s.id)}
                          className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-red-400"
                          title="Delete story"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2.5 grid gap-1.5 text-[12px] text-foreground/75 sm:grid-cols-2">
                      {(['S', 'T', 'A', 'R']).map((k, i) => {
                        const val = [s.situation, s.task, s.action, s.result][i]
                        return val ? (
                          <p key={k} className="leading-relaxed">
                            <span className="mr-1 font-mono text-[10px] font-bold text-primary">{k}</span>{val}
                          </p>
                        ) : null
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
