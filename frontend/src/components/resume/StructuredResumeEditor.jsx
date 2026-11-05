import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Briefcase, GraduationCap, Code, Star, Award, Layers,
  Plus, Trash2, Save, Sparkles, Check, ChevronDown, ChevronUp,
  LayoutTemplate, ExternalLink, Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { resumeApi } from '../../services/api'
import { markdownToStructured, structuredToMarkdown } from '../../utils/resumeParser'
import CustomSectionManager from './CustomSectionManager'
import InlineAIEnhancer from './InlineAIEnhancer'
import { calculateRealtimeAtsScore } from '../../utils/realtimeAtsScorer'

export default function StructuredResumeEditor({ resume, onSaveSuccess }) {
  const navigate = useNavigate()
  const resumeId = resume?.id || resume?._id

  // Initial parsed structure
  const [data, setData] = useState(() => {
    if (resume?.structuredData) return resume.structuredData
    const text = resume?.enhancedText || resume?.originalText || ''
    return markdownToStructured(text, resume?.title)
  })

  const [saving, setSaving] = useState(false)
  const [openSections, setOpenSections] = useState({
    personal: true,
    experience: true,
    education: false,
    projects: false,
    skills: false,
    certifications: false,
    custom: false,
  })

  // Synchronize when incoming resume changes
  useEffect(() => {
    if (resume?.structuredData) {
      setData(resume.structuredData)
    } else {
      const text = resume?.enhancedText || resume?.originalText || ''
      if (text) {
        setData(markdownToStructured(text, resume?.title))
      }
    }
  }, [resume?.id, resume?.structuredData])

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Real-time ATS Score
  const atsReport = useMemo(() => {
    return calculateRealtimeAtsScore(data, resume?.jobRole || 'Software Engineer')
  }, [data, resume?.jobRole])

  // Field change helpers
  const updatePersonal = (field, val) => {
    setData((prev) => ({
      ...prev,
      personal: { ...(prev.personal || {}), [field]: val },
    }))
  }

  // Experience helpers
  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        { role: '', company: '', location: '', startDate: '', endDate: '', current: false, bullets: [''] },
      ],
    }))
    setOpenSections((p) => ({ ...p, experience: true }))
  }

  const updateExperience = (index, field, val) => {
    setData((prev) => {
      const exp = [...(prev.experience || [])]
      exp[index] = { ...exp[index], [field]: val }
      return { ...prev, experience: exp }
    })
  }

  const updateBullet = (expIndex, bulletIndex, val) => {
    setData((prev) => {
      const exp = [...(prev.experience || [])]
      const bullets = [...(exp[expIndex]?.bullets || [])]
      bullets[bulletIndex] = val
      exp[expIndex] = { ...exp[expIndex], bullets }
      return { ...prev, experience: exp }
    })
  }

  const addBullet = (expIndex) => {
    setData((prev) => {
      const exp = [...(prev.experience || [])]
      const bullets = [...(exp[expIndex]?.bullets || []), '']
      exp[expIndex] = { ...exp[expIndex], bullets }
      return { ...prev, experience: exp }
    })
  }

  const removeBullet = (expIndex, bulletIndex) => {
    setData((prev) => {
      const exp = [...(prev.experience || [])]
      const bullets = (exp[expIndex]?.bullets || []).filter((_, i) => i !== bulletIndex)
      exp[expIndex] = { ...exp[expIndex], bullets }
      return { ...prev, experience: exp }
    })
  }

  const removeExperience = (index) => {
    setData((prev) => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== index),
    }))
  }

  // Education helpers
  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
      ],
    }))
    setOpenSections((p) => ({ ...p, education: true }))
  }

  const updateEducation = (index, field, val) => {
    setData((prev) => {
      const edu = [...(prev.education || [])]
      edu[index] = { ...edu[index], [field]: val }
      return { ...prev, education: edu }
    })
  }

  const removeEducation = (index) => {
    setData((prev) => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index),
    }))
  }

  // Project helpers
  const addProject = () => {
    setData((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        { title: '', link: '', techStack: [], description: '', bullets: [''] },
      ],
    }))
    setOpenSections((p) => ({ ...p, projects: true }))
  }

  const updateProject = (index, field, val) => {
    setData((prev) => {
      const proj = [...(prev.projects || [])]
      proj[index] = { ...proj[index], [field]: val }
      return { ...prev, projects: proj }
    })
  }

  const removeProject = (index) => {
    setData((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index),
    }))
  }

  // Skills helpers
  const handleSkillsChange = (val) => {
    const items = val.split(/[,|•/]/).map((s) => s.trim()).filter(Boolean)
    setData((prev) => ({
      ...prev,
      skills: items.map((name) => ({ name, category: 'Technical' })),
    }))
  }

  // Save handler
  const handleSave = async () => {
    if (!resumeId) return
    setSaving(true)
    try {
      const generatedMarkdown = structuredToMarkdown(data)
      await resumeApi.update(resumeId, {
        structuredData: data,
        enhancedText: generatedMarkdown,
        sectionOrder: data.sectionOrder || ['education', 'experience', 'projects', 'skills'],
        customSections: data.customSections || [],
      })
      toast.success('Resume content saved & synchronized!')
      if (onSaveSuccess) onSaveSuccess(data, generatedMarkdown)
    } catch (err) {
      console.error('Failed to save resume:', err)
      toast.error('Failed to save changes: ' + (err.message || 'Error'))
    } finally {
      setSaving(false)
    }
  }

  const skillsString = (data.skills || []).map((s) => s.name || s).join(', ')

  return (
    <div className="space-y-6">
      {/* Top Action & ATS Header */}
      <div className="p-4 rounded-2xl bg-card border border-border flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/10 flex items-center gap-2 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-foreground">Live ATS: {atsReport.overallScore}%</span>
            <span className="text-[10px] uppercase font-bold text-primary">({atsReport.grade})</span>
          </div>
          {atsReport.tips[0] && (
            <span className="text-xs text-muted-foreground hidden md:inline-block max-w-md truncate">
              Tip: {atsReport.tips[0].text}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/resume-templates?resumeId=${resumeId}`)}
            className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-medium inline-flex items-center gap-1.5"
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Preview in Template</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* ── 1. Personal & Summary ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection('personal')}
          className="w-full p-4 flex items-center justify-between text-left font-semibold text-foreground hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-primary" />
            <span>Personal Info & Summary</span>
          </div>
          {openSections.personal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections.personal && (
          <div className="p-5 pt-0 space-y-4 border-t border-border/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  value={data.personal?.name || ''}
                  onChange={(e) => updatePersonal('name', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Professional Title</label>
                <input
                  type="text"
                  value={data.personal?.title || ''}
                  onChange={(e) => updatePersonal('title', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-3 py-1.5 text-sm bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={data.personal?.email || ''}
                  onChange={(e) => updatePersonal('email', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Phone</label>
                <input
                  type="text"
                  value={data.personal?.phone || ''}
                  onChange={(e) => updatePersonal('phone', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Location</label>
                <input
                  type="text"
                  value={data.personal?.location || ''}
                  onChange={(e) => updatePersonal('location', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={data.personal?.linkedin || ''}
                  onChange={(e) => updatePersonal('linkedin', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-muted-foreground">Professional Summary</label>
                <InlineAIEnhancer
                  text={data.personal?.summary || ''}
                  role={resume?.jobRole || 'Software Engineer'}
                  sectionType="summary"
                  onApply={(text) => updatePersonal('summary', text)}
                />
              </div>
              <textarea
                rows={3}
                value={data.personal?.summary || ''}
                onChange={(e) => updatePersonal('summary', e.target.value)}
                placeholder="2-3 impact-driven sentences summarizing your track record..."
                className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── 2. Work Experience ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection('experience')}
          className="w-full p-4 flex items-center justify-between text-left font-semibold text-foreground hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-4 h-4 text-primary" />
            <span>Work Experience ({data.experience?.length || 0})</span>
          </div>
          {openSections.experience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections.experience && (
          <div className="p-5 pt-0 space-y-5 border-t border-border/60">
            {(data.experience || []).map((exp, eIdx) => (
              <div key={eIdx} className="p-4 rounded-xl bg-muted/20 border border-border space-y-3 relative mt-4">
                <button
                  type="button"
                  onClick={() => removeExperience(eIdx)}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 p-1"
                  title="Remove Job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Job Title</label>
                    <input
                      type="text"
                      value={exp.role || exp.title || ''}
                      onChange={(e) => updateExperience(eIdx, 'role', e.target.value)}
                      placeholder="e.g. Lead Software Engineer"
                      className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company || ''}
                      onChange={(e) => updateExperience(eIdx, 'company', e.target.value)}
                      placeholder="e.g. Stripe"
                      className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate || ''}
                      onChange={(e) => updateExperience(eIdx, 'startDate', e.target.value)}
                      placeholder="e.g. Jan 2022"
                      className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">End Date</label>
                    <input
                      type="text"
                      value={exp.current ? 'Present' : exp.endDate || ''}
                      onChange={(e) => updateExperience(eIdx, 'endDate', e.target.value)}
                      placeholder="e.g. Present"
                      className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg"
                    />
                  </div>
                </div>

                {/* Bullets */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-medium text-muted-foreground">Achievement Bullet Points</span>
                  {(exp.bullets || []).map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2">
                      <span className="text-muted-foreground mt-2">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => updateBullet(eIdx, bIdx, e.target.value)}
                        placeholder="Action verb + Context + Quantified business impact..."
                        className="flex-1 px-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/40 resize-y"
                      />
                      <InlineAIEnhancer
                        text={bullet}
                        role={resume?.jobRole || 'Software Engineer'}
                        sectionType="experience"
                        compact
                        onApply={(improved) => updateBullet(eIdx, bIdx, improved)}
                      />
                      <button
                        type="button"
                        onClick={() => removeBullet(eIdx, bIdx)}
                        className="p-1.5 text-muted-foreground hover:text-red-500 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addBullet(eIdx)}
                    className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:text-primary/80 pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add bullet point
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addExperience}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 mt-2"
            >
              <Plus className="w-4 h-4" /> Add Experience Entry
            </button>
          </div>
        )}
      </div>

      {/* ── 3. Education ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection('education')}
          className="w-full p-4 flex items-center justify-between text-left font-semibold text-foreground hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span>Education ({data.education?.length || 0})</span>
          </div>
          {openSections.education ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections.education && (
          <div className="p-5 pt-0 space-y-4 border-t border-border/60">
            {(data.education || []).map((edu, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-muted/20 border border-border space-y-3 relative mt-4">
                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-6">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Institution</label>
                    <input
                      type="text"
                      value={edu.institution || edu.school || ''}
                      onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                      placeholder="e.g. Stanford University"
                      className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Degree & Major</label>
                    <input
                      type="text"
                      value={edu.degree || ''}
                      onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                      placeholder="e.g. B.S. in Computer Science"
                      className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Period / Grad Date</label>
                    <input
                      type="text"
                      value={edu.period || [edu.startDate, edu.endDate].filter(Boolean).join(' - ')}
                      onChange={(e) => updateEducation(idx, 'period', e.target.value)}
                      placeholder="e.g. 2018 - 2022"
                      className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">GPA (Optional)</label>
                    <input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(idx, 'gpa', e.target.value)}
                      placeholder="e.g. 3.9/4.0"
                      className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 mt-2"
            >
              <Plus className="w-4 h-4" /> Add Education Entry
            </button>
          </div>
        )}
      </div>

      {/* ── 4. Skills ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection('skills')}
          className="w-full p-4 flex items-center justify-between text-left font-semibold text-foreground hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Star className="w-4 h-4 text-primary" />
            <span>Skills ({data.skills?.length || 0})</span>
          </div>
          {openSections.skills ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections.skills && (
          <div className="p-5 pt-0 space-y-3 border-t border-border/60">
            <label className="block text-xs font-medium text-muted-foreground mt-4">
              Comma-separated Skills & Competencies
            </label>
            <textarea
              rows={3}
              value={skillsString}
              onChange={(e) => handleSkillsChange(e.target.value)}
              placeholder="React, TypeScript, Python, Node.js, GraphQL, Docker, Kubernetes, AWS"
              className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Aim for 10–20 high-value keywords relevant to your target role ({resume?.jobRole || 'role'}).
            </p>
          </div>
        )}
      </div>

      {/* ── 5. Custom Sections & Certifications ── */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
        <button
          type="button"
          onClick={() => toggleSection('custom')}
          className="w-full p-4 flex items-center justify-between text-left font-semibold text-foreground hover:bg-muted/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-primary" />
            <span>Custom Sections (Languages, Awards, Volunteering…)</span>
          </div>
          {openSections.custom ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSections.custom && (
          <div className="p-5 pt-0 space-y-4 border-t border-border/60 mt-4">
            <CustomSectionManager
              customSections={data.customSections || []}
              onChange={(updated) => setData((prev) => ({ ...prev, customSections: updated }))}
              sectionOrder={data.sectionOrder || []}
              onSectionOrderChange={(order) => setData((prev) => ({ ...prev, sectionOrder: order }))}
            />
          </div>
        )}
      </div>
    </div>
  )
}
