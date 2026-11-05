import { ResumeConsistencyChecker } from '../utils/resumeChecker';
import ConsistencyPanel from '../utils/ConsistencyPanel';
import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle, Plus, Trash2,
  Save, FileText, User, Briefcase, GraduationCap, Code, Star, GripVertical,
  LayoutTemplate, Award, Layers, Eye, Columns, Sparkles, Upload, Clock,
  CheckCircle2, AlertCircle, RefreshCw, X, Loader2
} from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { resumeApi } from '../services/api'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import AchievementEnhancer from "../components/resume/AchievementEnhancer";
import PhoneInput from '../components/PhoneInput'
import { getSectionOrderSuggestions } from "../utils/sectionReorderAnalyzer";
import {
  validatePersonalStep,
  validateEducationStep,
  validateExperienceStep,
  hasErrors,
} from '../utils/resumeValidation'
import { analyzeResumeTone } from "../utils/toneAnalyzer";
import CustomSectionManager from '../components/resume/CustomSectionManager';
import LiveResumePreview from '../components/resume/LiveResumePreview';
import InlineAIEnhancer from '../components/resume/InlineAIEnhancer';
import { calculateRealtimeAtsScore } from '../utils/realtimeAtsScorer';
import { markdownToStructured, jsonResumeToStructured } from '../utils/resumeParser';
import { normalizeResumeData } from '../context/ResumeContext';

const STEPS = [
  { id: 'personal',       title: 'Personal Info',    icon: User },
  { id: 'education',      title: 'Education',        icon: GraduationCap },
  { id: 'experience',     title: 'Experience',       icon: Briefcase },
  { id: 'projects',       title: 'Projects',         icon: Code },
  { id: 'skills',         title: 'Skills',           icon: Star },
  { id: 'certifications', title: 'Certifications',   icon: Award },
  { id: 'custom',         title: 'Custom Sections',  icon: Layers },
  { id: 'preview',        title: 'Preview',          icon: FileText },
]

// ─────────────────── small helpers ───────────────────────────────────────────
/** Red border class when an error exists for a field key. */
function errBorder(errors, key) {
  return errors?.[key] ? 'border-red-500 focus:ring-red-400/30' : 'border-border'
}

/** Inline error message below a field. */
function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="text-red-500 text-sm mt-1" role="alert">{msg}</p>
  )
}

// ─────────────────── component ───────────────────────────────────────────────
export default function ResumeBuilder() {
  const navigate   = useNavigate()
  const firstErrRef = useRef(null)

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [targetRole, setTargetRole]   = useState('')
  const [readabilityScore, setReadabilityScore] = useState(0)
  const [claritySuggestions, setClaritySuggestions] = useState([])
  const [achievementScore, setAchievementScore] = useState(0)
  const [achievementSuggestions, setAchievementSuggestions] = useState([])
  const [toneScore, setToneScore] = useState(100)
  const [toneSuggestions, setToneSuggestions] = useState([])
  const [sectionSuggestions, setSectionSuggestions] = useState([]);
  

  // ── form state ──────────────────────────────────────────────────────────────
  const [personal, setPersonal] = useState({
    name: '', email: '', phone: '', linkedin: '', github: '', portfolio: '', summary: '',
  })
  // phone is stored split: country code + digit string
  const [phoneCode,   setPhoneCode]   = useState('+91')
  const [phoneDigits, setPhoneDigits] = useState('')

  const [education, setEducation] = useState([
    { school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' }
  ])
  const [experience, setExperience] = useState([
    { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }
  ])
  const [projects, setProjects] = useState([
    { name: '', tech: '', link: '', description: '' }
  ])
  const [skills, setSkills] = useState('')
  const [certifications, setCertifications] = useState([
    { name: '', issuer: '', year: '', url: '' }
  ])
  const [customSections, setCustomSections] = useState([])
  const [sectionOrder, setSectionOrder] = useState(['education', 'experience', 'projects', 'skills'])
  const [viewMode, setViewMode] = useState('form')
  const [draftSavedAt, setDraftSavedAt] = useState(null)
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importingFile, setImportingFile] = useState(false)
  const [resumeScore, setResumeScore] = useState(0)
  const [recommendedSections, setRecommendedSections] = useState([])
  const [atsScore, setAtsScore] = useState(0)
  const [missingKeywords, setMissingKeywords] = useState([])
  const [resumeVersions, setResumeVersions] = useState([])
  const [selectedVersion, setSelectedVersion] = useState(null)
  
  const [recommendedSkills, setRecommendedSkills] = useState([])
  const [profileScore, setProfileScore] = useState(0)
  const [recommendedCertifications, setRecommendedCertifications] = useState([])
  const [profileIssues, setProfileIssues] = useState([])
  const [impactScores, setImpactScores] = useState({
  experience: 0,
  projects: 0,
  skills: 0,
  education: 0,
  achievements: 0
})
const [careerGoals, setCareerGoals] = useState([
  {
    title: "Complete Resume",
    completed: false
  },
  {
    title: "Add Projects",
    completed: false
  },
  {
    title: "Improve ATS Score",
    completed: false
  }
])

const [goalProgress, setGoalProgress] = useState(0)

  const DRAFT_KEY = 'careerpilot_resume_builder_draft'

  // Load draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const d = JSON.parse(raw)
        if (d.personal) {
          setPersonal(prev => ({
            name: d.personal.name || '',
            email: d.personal.email || '',
            phone: d.personal.phone || '',
            linkedin: d.personal.linkedin || '',
            github: d.personal.github || '',
            portfolio: d.personal.portfolio || '',
            summary: d.personal.summary || '',
          }))
        }
        if (d.targetRole) setTargetRole(d.targetRole)
        if (d.phoneCode) setPhoneCode(d.phoneCode)
        if (d.phoneDigits) setPhoneDigits(d.phoneDigits)
        if (Array.isArray(d.education) && d.education.length) setEducation(d.education)
        if (Array.isArray(d.experience) && d.experience.length) setExperience(d.experience)
        if (Array.isArray(d.projects) && d.projects.length) setProjects(d.projects)
        if (d.skills) setSkills(d.skills)
        if (Array.isArray(d.certifications) && d.certifications.length) setCertifications(d.certifications)
        if (Array.isArray(d.customSections) && d.customSections.length) setCustomSections(d.customSections)
        if (Array.isArray(d.sectionOrder) && d.sectionOrder.length) setSectionOrder(d.sectionOrder)
        setHasRestoredDraft(true)
        setDraftSavedAt(d.savedAt || 'earlier')
      }
    } catch (_e) {}
  }, [])

  // Debounced autosave
  useEffect(() => {
    const timer = setTimeout(() => {
      if (personal.name || personal.email || education[0]?.school || experience[0]?.title) {
        const payload = {
          personal,
          targetRole,
          phoneCode,
          phoneDigits,
          education,
          experience,
          projects,
          skills,
          certifications,
          customSections,
          sectionOrder,
          savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
          setDraftSavedAt(payload.savedAt)
        } catch (_e) {}
      }
    }, 1200)
    return () => clearTimeout(timer)
  }, [personal, targetRole, phoneCode, phoneDigits, education, experience, projects, skills, certifications, customSections, sectionOrder])

  const canonicalResumeData = React.useMemo(() => {
    const fullPhone = phoneDigits ? `${phoneCode} ${phoneDigits}` : (personal.phone || '')
    const normSkills = typeof skills === 'string'
      ? skills.split(/[\n,]/).map(s => s.replace(/^[-*•]\s*/, '').trim()).filter(Boolean).map(s => ({ name: s }))
      : Array.isArray(skills) ? skills : []

    return normalizeResumeData({
      personal: {
        ...personal,
        phone: fullPhone,
      },
      experience: (experience || []).filter(e => e.title || e.company || e.description).map(e => ({
        role: e.title || 'Role',
        company: e.company || '',
        location: e.location || '',
        startDate: e.startDate || '',
        endDate: e.endDate || '',
        current: Boolean(e.current),
        period: [e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join(' - '),
        bullets: e.description ? e.description.split(/\r?\n/).map(b => b.replace(/^[-*•]\s*/, '').trim()).filter(Boolean) : [],
      })),
      education: (education || []).filter(edu => edu.school || edu.degree).map(edu => ({
        institution: edu.school || '',
        degree: edu.degree || '',
        field: edu.field || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        period: [edu.startDate, edu.endDate].filter(Boolean).join(' - '),
        gpa: edu.gpa || '',
        description: edu.description || '',
      })),
      projects: (projects || []).filter(p => p.name || p.description).map(p => ({
        title: p.name || 'Project',
        link: p.link || '',
        techStack: typeof p.tech === 'string' ? p.tech.split(',').map(s => s.trim()).filter(Boolean) : (p.tech || []),
        description: p.description || '',
        bullets: p.description ? p.description.split(/\r?\n/).map(b => b.replace(/^[-*•]\s*/, '').trim()).filter(Boolean) : [],
      })),
      skills: normSkills,
      certifications: (certifications || []).filter(c => c.name),
      customSections: customSections || [],
      sectionOrder: sectionOrder || ['education', 'experience', 'projects', 'skills'],
    })
  }, [personal, phoneCode, phoneDigits, experience, education, projects, skills, certifications, customSections, sectionOrder])

  const realtimeAts = React.useMemo(() => {
    return calculateRealtimeAtsScore(canonicalResumeData, targetRole)
  }, [canonicalResumeData, targetRole])

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportingFile(true)
    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text()
        const parsed = JSON.parse(text)
        const structured = jsonResumeToStructured(parsed) || parsed
        populateFromStructured(structured)
        toast.success('JSON Resume imported!')
      } else if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        const text = await file.text()
        const structured = markdownToStructured(text, file.name.replace(/\.[^/.]+$/, ''))
        populateFromStructured(structured)
        toast.success('Resume text imported!')
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const formData = new FormData()
        formData.append('resume', file)
        const res = await resumeApi.upload(formData)
        const extracted = res.data?.extractedText || ''
        const structured = markdownToStructured(extracted, file.name.replace(/\.[^/.]+$/, ''))
        populateFromStructured(structured)
        toast.success('PDF Resume parsed & imported!')
      } else {
        toast.error('Please upload a PDF, JSON, Markdown, or TXT file.')
      }
      setShowImportModal(false)
    } catch (err) {
      console.error('Import error:', err)
      toast.error('Failed to import file: ' + (err.message || 'Check format'))
    } finally {
      setImportingFile(false)
    }
  }

  const populateFromStructured = (s) => {
    if (!s) return
    if (s.personal) {
      setPersonal(prev => ({
        ...prev,
        name: s.personal.name || prev.name,
        email: s.personal.email || prev.email,
        phone: s.personal.phone || prev.phone,
        linkedin: s.personal.linkedin || prev.linkedin,
        github: s.personal.github || prev.github,
        portfolio: s.personal.website || prev.portfolio,
        summary: s.personal.summary || prev.summary,
      }))
    }
    if (Array.isArray(s.experience) && s.experience.length) {
      setExperience(s.experience.map(e => ({
        title: e.role || '',
        company: e.company || '',
        location: e.location || '',
        startDate: e.startDate || '',
        endDate: e.endDate || '',
        current: Boolean(e.current),
        description: Array.isArray(e.bullets) ? e.bullets.join('\n') : (e.description || '')
      })))
    }
    if (Array.isArray(s.education) && s.education.length) {
      setEducation(s.education.map(edu => ({
        school: edu.institution || edu.school || '',
        degree: edu.degree || '',
        field: edu.field || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        gpa: edu.gpa || '',
        description: edu.description || (Array.isArray(edu.highlights) ? edu.highlights.join('\n') : '')
      })))
    }
    if (Array.isArray(s.projects) && s.projects.length) {
      setProjects(s.projects.map(p => ({
        name: p.title || '',
        tech: Array.isArray(p.techStack) ? p.techStack.join(', ') : (p.tech || ''),
        link: p.link || '',
        description: Array.isArray(p.bullets) && p.bullets.length ? p.bullets.join('\n') : (p.description || '')
      })))
    }
    if (Array.isArray(s.skills) && s.skills.length) {
      setSkills(s.skills.map(sk => sk.name || sk).join(', '))
    }
    if (Array.isArray(s.certifications) && s.certifications.length) {
      setCertifications(s.certifications)
    }
    if (Array.isArray(s.customSections) && s.customSections.length) {
      setCustomSections(s.customSections)
    }
    if (Array.isArray(s.sectionOrder) && s.sectionOrder.length) {
      setSectionOrder(s.sectionOrder)
    }
  }

  useEffect(() => {
  const suggestions = []
  let score = 100

  const descriptions = experience.map(exp => exp.description).join(" ")

  if (!/\d+%|\d+\+|\$\d+/g.test(descriptions)) {
    score -= 25
    suggestions.push("Add measurable metrics such as percentages, revenue, or growth numbers.")
  }

  if (!/(led|developed|implemented|created|optimized|improved)/i.test(descriptions)) {
    score -= 20
    suggestions.push("Use stronger action verbs to describe achievements.")
  }

  if (descriptions.length < 100) {
    score -= 15
    suggestions.push("Provide more detailed achievement descriptions.")
  }

  if (!/(resulted|increased|reduced|improved|achieved)/i.test(descriptions)) {
    score -= 20
    suggestions.push("Highlight outcomes and business impact.")
  }

  setAchievementScore(Math.max(score, 0))
  setAchievementSuggestions(suggestions)
}, [experience])

  useEffect(() => {
  const content = [
    personal.summary,
    ...experience.map(e => e.description),
    ...projects.map(p => p.description)
  ].join(' ')

  let score = 100
  const suggestions = []

  if (content.length < 100) {
    score -= 20
    suggestions.push("Add more descriptive content.")
  }

  if (content.includes("was") || content.includes("were")) {
    score -= 10
    suggestions.push("Reduce passive voice usage.")
  }

  if (!content.match(/developed|built|created|led|implemented/i)) {
    score -= 15
    suggestions.push("Use stronger action verbs.")
  }

  setReadabilityScore(Math.max(score, 0))
  setClaritySuggestions(suggestions)
}, [personal, experience, projects])

useEffect(() => {
  const content = [
    personal.summary,
    ...experience.map(e => e.description),
    ...projects.map(p => p.description)
  ].join(" ").toLowerCase()

  let score = 100
  const suggestions = []

  const weakPhrases = {
    "helped": "contributed to",
    "worked on": "developed",
    "stuff": "tasks",
    "things": "responsibilities",
    "awesome": "exceptional",
    "cool": "innovative"
  }

  Object.entries(weakPhrases).forEach(([weak, professional]) => {
    if (content.includes(weak)) {
      score -= 10
      suggestions.push(
        `Replace "${weak}" with "${professional}"`
      )
    }
  })

  if (
    !content.match(
      /developed|implemented|created|led|optimized|improved/i
    )
  ) {
    score -= 15
    suggestions.push(
      "Use stronger professional action verbs."
    )
  }

  setToneScore(Math.max(score, 0))
  setToneSuggestions(suggestions)
}, [personal, experience, projects])

useEffect(() => {
  setImpactScores({
    experience:
      experience.some(
        e =>
          e.description &&
          e.description.length > 50
      )
        ? 90
        : 40,

    projects:
      projects.some(
        p =>
          p.description &&
          p.description.length > 50
      )
        ? 80
        : 30,

    skills:
      skills.trim().length > 20
        ? 75
        : 25,

    education:
      education.some(e => e.school)
        ? 70
        : 20,

    achievements:
      achievementScore
  })
}, [
  experience,
  projects,
  skills,
  education,
  achievementScore
])

useEffect(() => {
  const updatedGoals = [
    {
      title: "Complete Resume",
      completed: resumeScore >= 100
    },
    {
      title: "Add Projects",
      completed: projects.some(
        p => p.name.trim()
      )
    },
    {
      title: "Improve ATS Score",
      completed: atsScore >= 80
    }
  ]

  setCareerGoals(updatedGoals)

  const completed =
    updatedGoals.filter(
      g => g.completed
    ).length

  setGoalProgress(
    Math.round(
      (completed / updatedGoals.length) * 100
    )
  )
}, [resumeScore, projects, atsScore])

useEffect(() => {
  let score = 100
  const issues = []

  if (!personal.linkedin) {
    score -= 30
    issues.push("LinkedIn profile missing")
  }

  if (!personal.github) {
    score -= 30
    issues.push("GitHub profile missing")
  }

  if (!personal.portfolio) {
    score -= 20
    issues.push("Portfolio website missing")
  }

  if (
    personal.linkedin &&
    !personal.linkedin.includes("linkedin.com")
  ) {
    score -= 10
    issues.push("Invalid LinkedIn URL")
  }

  if (
    personal.github &&
    !personal.github.includes("github.com")
  ) {
    score -= 10
    issues.push("Invalid GitHub URL")
  }

  setProfileScore(Math.max(score, 0))
  setProfileIssues(issues)
}, [personal])

const normalizedSkills = React.useMemo(() => {
  if (typeof skills === "string") {
    return skills.split(",").map(skill => skill.trim()).filter(Boolean);
  }
  if (Array.isArray(skills)) {
    return skills
      .map(skill => String(skill).trim())
      .filter(Boolean);
  }
  return [];
}, [skills]);

// ─────────────────── CONSOLIDATED ATS ASSESSMENT LOOP ───────────────────
useEffect(() => {
  const certs = []

  const role = (targetRole || '').toLowerCase()
  const skillText = normalizedSkills.join(" ").toLowerCase()

  // Frontend
  if (
    role.includes("frontend") ||
    skillText.includes("react") ||
    skillText.includes("javascript")
  ) {
    certs.push(
      "Meta Front-End Developer Professional Certificate"
    )
  }

  // Backend
  if (
    role.includes("backend") ||
    skillText.includes("node") ||
    skillText.includes("express")
  ) {
    certs.push(
      "IBM Back-End Development Professional Certificate"
    )
  }

  // Full Stack
  if (
    role.includes("full stack")
  ) {
    certs.push(
      "IBM Full Stack Software Developer Professional Certificate"
    )
  }

  // Data Science
  if (
    role.includes("data scientist") ||
    role.includes("data analyst") ||
    skillText.includes("python")
  ) {
    certs.push(
      "Google Data Analytics Professional Certificate"
    )

    certs.push(
      "IBM Data Science Professional Certificate"
    )
  }

  // Cloud
  if (
    role.includes("cloud") ||
    skillText.includes("aws")
  ) {
    certs.push(
      "AWS Certified Cloud Practitioner"
    )
  }

  // DevOps
  if (
    role.includes("devops") ||
    skillText.includes("docker")
  ) {
    certs.push(
      "Docker Certified Associate"
    )

    certs.push(
      "AWS DevOps Engineer"
    )
  }

  // Cyber Security
  if (
    role.includes("security") ||
    role.includes("cyber")
  ) {
    certs.push(
      "CompTIA Security+"
    )
  }

  setRecommendedCertifications([...new Set(certs)])
}, [targetRole, normalizedSkills])
useEffect(() => {
  // 1. Gather all inputs into a clean string representation
  const resumeText = `${personal?.summary || ''} ${normalizedSkills.join(' ')} ${
  projects?.map(p => `${p.name} ${p.description}`).join(' ') || ''
} ${experience?.map(e => `${e.title} ${e.description}`).join(' ') || ''}`.toLowerCase();

  // 2. Define assessment target keywords (moved to component/effect scope correctly)
  const baseKeywords = ["react", "node.js", "javascript", "typescript", "python", "docker", "aws", "git", "ci/cd", "rest api"];
  const prioritySkills = ["docker", "kubernetes", "ci/cd", "aws", "linux"];

  const found = baseKeywords.filter(keyword => resumeText.includes(keyword));
  const missing = baseKeywords.filter(keyword => !resumeText.includes(keyword));

  // 3. State update calculations
  setMissingKeywords(missing);
  
  // Prioritize missing crucial devops/infrastructure skills first in recommendation
  const recommendations = [
    ...prioritySkills.filter(sk => !found.includes(sk)),
    ...missing
  ].slice(0, 4);
  setRecommendedSkills(recommendations);

  const score = baseKeywords.length > 0 ? Math.round((found.length / baseKeywords.length) * 100) : 0;
  setAtsScore(score);

}, [personal, normalizedSkills, projects, experience]);
  // ─────────────────── Live Consistency Memoized Engine ───────────────────
  const activeConsistencyWarnings = React.useMemo(() => {
    const allExperienceDates = (experience || []).flatMap(exp => [exp.startDate, exp.endDate]);
    const allEducationDates = (education || []).flatMap(edu => [edu.startDate, edu.endDate]);
    const aggregatedTimelineDates = [...allExperienceDates, ...allEducationDates];

    // Filter out current roles so ongoing present-tense verbs aren't flagged as bugs
    const pastExperienceBullets = (experience || [])
      .filter(exp => !exp.current)
      .map(exp => exp.description || '');

    const projectDescriptions = (projects || []).map(p => p.description || '');
    const aggregatedTextDescriptions = [...pastExperienceBullets, ...projectDescriptions];

    const dateValidationErrors = ResumeConsistencyChecker.checkDateConsistency(aggregatedTimelineDates);
    const tenseValidationErrors = ResumeConsistencyChecker.checkTenseConsistency(pastExperienceBullets);
    const redundancyValidationErrors = ResumeConsistencyChecker.checkDuplicateContent(aggregatedTextDescriptions);

    return [
      ...dateValidationErrors,
      ...tenseValidationErrors,
      ...redundancyValidationErrors
    ];
  }, [experience, education, projects]);

  const restoreVersion = React.useCallback((version) => {
    setSelectedVersion(version);
    if (typeof toast !== 'undefined') {
      toast.success(`Restored version from ${version.timestamp}`);
    }
  }, []);

  // ─────────────────── Automated Recommendations Engine ───────────────────
  useEffect(() => {
    const recommendations = [];
    
  if (projects.every(p => !p.name.trim())) {
    recommendations.push("Projects")
  }

  if (!skills.trim()) {
    recommendations.push("Skills")
  }

  if (education.every(e => !e.school?.trim())) {
    recommendations.push("Certifications")
  }

  if (experience.every(e => !e.title?.trim())) {
    recommendations.push("Volunteer Experience")
  }

  setRecommendedSections(recommendations)
}, [projects, skills, education, experience])

useEffect(() => {
  let score = 0

  if (personal.name && personal.email) {
    score += 20
  }

  if (education.some(e => e.school.trim())) {
    score += 20
  }

  if (experience.some(e => e.title.trim())) {
    score += 20
  }

  if (projects.some(p => p.name.trim())) {
    score += 20
  }

  if (skills.trim()) {
    score += 20
  }

  setResumeScore(score)
}, [
  personal,
  education,
  experience,
  projects,
  skills
])


  // ── error state ─────────────────────────────────────────────────────────────
  const [personalErrors,   setPersonalErrors]   = useState({})
  const [educationErrors,  setEducationErrors]  = useState([])   // array per entry
  const [experienceErrors, setExperienceErrors] = useState([])   // array per entry

  // ── helpers: update array entries immutably ─────────────────────────────────
  function updateEdu(index, key, value) {
    setEducation(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [key]: value }
      return next
    })
    // Clear the matching error on change
    setEducationErrors(prev => {
      const next = [...prev]
      if (next[index]) { next[index] = { ...next[index], [key]: '' } }
      return next
    })
  }

  function updateExp(index, key, value) {
    setExperience(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [key]: value }
      return next
    })
    setExperienceErrors(prev => {
      const next = [...prev]
      if (next[index]) { next[index] = { ...next[index], [key]: '' } }
      return next
    })
  }

  function updatePersonal(key, value) {
    setPersonal(prev => ({ ...prev, [key]: value }))
    if (personalErrors[key]) {
      setPersonalErrors(prev => ({ ...prev, [key]: '' }))
    }
  }

  // ── list management ──────────────────────────────────────────────────────────
  const addEducation    = () => setEducation(p => [...p, { school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' }])
  const removeEducation = i  => { setEducation(p => p.filter((_, idx) => idx !== i)); setEducationErrors(p => p.filter((_, idx) => idx !== i)) }

  const addExperience    = () => setExperience(p => [...p, { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }])
  const removeExperience = i  => { setExperience(p => p.filter((_, idx) => idx !== i)); setExperienceErrors(p => p.filter((_, idx) => idx !== i)) }

  const addProject    = () => setProjects(p => [...p, { name: '', tech: '', link: '', description: '' }])
  const removeProject = i  => setProjects(p => p.filter((_, idx) => idx !== i))

  // ── step validation ──────────────────────────────────────────────────────────
  function validateCurrentStep() {
    switch (currentStep) {
      case 0: {
        const errs = validatePersonalStep(personal, targetRole, phoneDigits)
        setPersonalErrors(errs)
        return !hasErrors(errs)
      }
      case 1: {
        const errs = validateEducationStep(education)
        setEducationErrors(errs)
        return !hasErrors(errs)
      }
      case 2: {
        const errs = validateExperienceStep(experience)
        setExperienceErrors(errs)
        return !hasErrors(errs)
      }
      default:
        return true
    }
  }

  function handleNext() {
    if (!validateCurrentStep()) {
      // Focus first invalid field
      setTimeout(() => {
        const el = document.querySelector('[aria-invalid="true"], .border-red-500')
        el?.focus()
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }
    setCurrentStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  const handlePrev = () => setCurrentStep(s => Math.max(s - 1, 0))

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, type } = result;

    if (type === 'sections') {
      const newOrder = Array.from(sectionOrder);
      const [removed] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, removed);
      setSectionOrder(newOrder);
      return;
    }

    if (type === 'education') {
      const newEdu = Array.from(education);
      const [removed] = newEdu.splice(source.index, 1);
      newEdu.splice(destination.index, 0, removed);
      setEducation(newEdu);
      const newErrors = Array.from(educationErrors);
      const [removedErr] = newErrors.splice(source.index, 1);
      newErrors.splice(destination.index, 0, removedErr);
      setEducationErrors(newErrors);
      return;
    }

    if (type === 'experience') {
      const newExp = Array.from(experience);
      const [removed] = newExp.splice(source.index, 1);
      newExp.splice(destination.index, 0, removed);
      setExperience(newExp);
      const newErrors = Array.from(experienceErrors);
      const [removedErr] = newErrors.splice(source.index, 1);
      newErrors.splice(destination.index, 0, removedErr);
      setExperienceErrors(newErrors);
      return;
    }

    if (type === 'projects') {
      const newProj = Array.from(projects);
      const [removed] = newProj.splice(source.index, 1);
      newProj.splice(destination.index, 0, removed);
      setProjects(newProj);
      return;
    }
  }

  // ── markdown preview & generate ──────────────────────────────────────────────
  const generateMarkdown = () => {
    // Compose full phone string
    const fullPhone = phoneDigits ? `${phoneCode} ${phoneDigits}` : ''
    let md = `# ${personal.name || 'Your Name'}\n\n`

    const contact = []
    if (personal.email)     contact.push(`[${personal.email}](mailto:${personal.email})`)
    if (fullPhone)          contact.push(fullPhone)
    if (personal.linkedin)  contact.push(`[LinkedIn](${personal.linkedin})`)
    if (personal.github)    contact.push(`[GitHub](${personal.github})`)
    if (personal.portfolio) contact.push(`[Portfolio](${personal.portfolio})`)
    if (contact.length > 0) md += `${contact.join(' | ')}\n\n`

    if (personal.summary) md += `## SUMMARY\n\n${personal.summary}\n\n`

    const renderSection = (section) => {
      let sectionMd = ''
      if (section === 'education' && education.some(e => e.school)) {
        sectionMd += `## EDUCATION\n\n`
        education.forEach(e => {
          if (!e.school) return
          sectionMd += `**${e.degree}${e.field ? ' in ' + e.field : ''}** | ${e.school} | ${e.startDate} - ${e.endDate}\n`
          if (e.gpa) sectionMd += `- GPA: ${e.gpa}\n`
          if (e.description) sectionMd += `- ${e.description}\n`
          sectionMd += '\n'
        })
      } else if (section === 'experience' && experience.some(e => e.title)) {
        sectionMd += `## EXPERIENCE\n\n`
        experience.forEach(e => {
          if (!e.title) return
          sectionMd += `**${e.title}** | ${e.company} | ${e.location} | ${e.startDate} - ${e.current ? 'Present' : e.endDate}\n`
          const bullets = e.description.split('\n').filter(b => b.trim())
          bullets.forEach(b => { sectionMd += `- ${b.replace(/^- /, '').trim()}\n` })
          sectionMd += '\n'
        })
      } else if (section === 'projects' && projects.some(p => p.name)) {
        sectionMd += `## PROJECTS\n\n`
        projects.forEach(p => {
          if (!p.name) return
          sectionMd += `**${p.name}** | ${p.tech}\n`
          const bullets = p.description.split('\n').filter(b => b.trim())
          bullets.forEach(b => { sectionMd += `- ${b.replace(/^- /, '').trim()}\n` })
          if (p.link) sectionMd += `- [Project Link](${p.link})\n`
          sectionMd += '\n'
        })
      } else if (section === 'skills' && skills) {
        sectionMd += `## SKILLS\n\n${skills}\n\n`
      } else if (section === 'certifications' && certifications.some(c => c.name)) {
        sectionMd += `## CERTIFICATIONS\n\n`
        certifications.forEach(c => {
          if (!c.name) return
          const issuer = c.issuer ? ` - ${c.issuer}` : ''
          const year = c.year ? ` (${c.year})` : ''
          sectionMd += `- ${c.name}${issuer}${year}\n`
        })
        sectionMd += '\n'
      } else {
        const cs = customSections.find(s => s.id === section)
        if (cs && cs.title) {
          sectionMd += `## ${cs.title.toUpperCase()}\n\n`
          if (cs.kind === 'paragraph') {
            sectionMd += `${cs.body || ''}\n\n`
          } else {
            (cs.items || []).forEach(item => {
              if (item) sectionMd += `- ${item}\n`
            })
            sectionMd += '\n'
          }
        }
      }
      return sectionMd
    }

    sectionOrder.forEach(section => {
      md += renderSection(section)
    })

    // Append any custom sections not explicitly in sectionOrder
    customSections.forEach(cs => {
      if (!sectionOrder.includes(cs.id)) {
        md += renderSection(cs.id)
      }
    })

    return md
  }

  const saveVersion = React.useCallback(() => {
    const newVersion = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      content: typeof generateMarkdown === 'function' ? generateMarkdown() : "",
    };
    setResumeVersions(prev => [newVersion, ...prev]);
    if (typeof toast !== 'undefined') {
      toast.success("Resume version layout tracked successfully!");
    }
  }, [experience, education, projects, personal, skills, certifications, customSections, sectionOrder, generateMarkdown]);

  const handleGenerate = async () => {
    try {
      setIsSubmitting(true)
      const markdown = generateMarkdown()

      const response = await resumeApi.create({
        originalText: markdown,
        jobRole: targetRole || 'Software Engineer',
        title:   `${personal.name || 'My'} Resume - ${new Date().toLocaleDateString()}`,
        sectionOrder: sectionOrder,
        customSections: customSections,
        structuredData: canonicalResumeData,
      })
      try {
        localStorage.removeItem(DRAFT_KEY)
      } catch (_e) {}
      toast.success('Resume created successfully!')
      navigate(`/enhance/${response.data.id}`)
    } catch (error) {
      toast.error(error.message || 'Failed to create resume')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── shared input class builder ────────────────────────────────────────────────
  const inputCls = (errorKey, errors = personalErrors) =>
    cn(
      'w-full bg-muted border rounded-xl px-4 py-2 transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-primary/30',
      errors?.[errorKey] ? 'border-red-500 focus:ring-red-400/30' : 'border-border'
    )

  const inputClsArr = (errors) => (errorKey) =>
    cn(
      'w-full bg-muted border rounded-lg px-4 py-2 transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-primary/30',
      errors?.[errorKey] ? 'border-red-500 focus:ring-red-400/30' : 'border-border'
    )

  // ── step renderers ────────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (currentStep) {

      /* ── Step 0: Personal Info ── */
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className={inputCls('name')}
                  value={personal.name}
                  onChange={e => updatePersonal('name', e.target.value)}
                  placeholder="John Doe"
                  aria-invalid={!!personalErrors.name}
                  aria-describedby={personalErrors.name ? 'name-error' : undefined}
                />
                <FieldError msg={personalErrors.name} />
              </div>

              {/* Target Job Role */}
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="targetRole">
                  Target Job Role <span className="text-red-500">*</span>
                </label>
                <input
                  id="targetRole"
                  type="text"
                  className={inputCls('targetRole')}
                  value={targetRole}
                  onChange={e => {
                    setTargetRole(e.target.value)
                    if (personalErrors.targetRole) setPersonalErrors(p => ({ ...p, targetRole: '' }))
                  }}
                  placeholder="Software Engineer"
                  aria-invalid={!!personalErrors.targetRole}
                />
                <FieldError msg={personalErrors.targetRole} />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className={inputCls('email')}
                  value={personal.email}
                  onChange={e => updatePersonal('email', e.target.value)}
                  placeholder="john@example.com"
                  aria-invalid={!!personalErrors.email}
                />
                <FieldError msg={personalErrors.email} />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="phone-number">
                  Phone <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  countryCode={phoneCode}
                  onCountryChange={code => {
                    setPhoneCode(code)
                    if (personalErrors.phone) setPersonalErrors(p => ({ ...p, phone: '' }))
                  }}
                  digits={phoneDigits}
                  onDigitsChange={d => {
                    setPhoneDigits(d)
                    if (personalErrors.phone) setPersonalErrors(p => ({ ...p, phone: '' }))
                  }}
                  error={personalErrors.phone}
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="linkedin">LinkedIn URL</label>
                <input
                  id="linkedin"
                  type="url"
                  className={inputCls('linkedin')}
                  value={personal.linkedin}
                  onChange={e => updatePersonal('linkedin', e.target.value)}
                  placeholder="https://www.linkedin.com/in/johndoe"
                  aria-invalid={!!personalErrors.linkedin}
                />
                <FieldError msg={personalErrors.linkedin} />
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="github">GitHub URL</label>
                <input
                  id="github"
                  type="url"
                  className={inputCls('github')}
                  value={personal.github}
                  onChange={e => updatePersonal('github', e.target.value)}
                  placeholder="https://github.com/johndoe"
                  aria-invalid={!!personalErrors.github}
                />
                <FieldError msg={personalErrors.github} />
              </div>
            </div>

            {/* Portfolio */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Portfolio URL
              </label>

              <input
                type="url"
                className={inputCls('portfolio')}
                value={personal.portfolio}
                onChange={e =>
                  updatePersonal('portfolio', e.target.value)
                }
                placeholder="https://yourportfolio.com"
              />
            </div>

            {/* Summary */}
            <div className="pt-2">
              <label className="block text-sm font-medium mb-1" htmlFor="summary">Professional Summary</label>
              <textarea
                id="summary"
                className="w-full bg-muted border border-border rounded-xl px-4 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                value={personal.summary}
                onChange={e => updatePersonal('summary', e.target.value)}
                placeholder="A brief summary of your professional background..."
              />
              <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                <AchievementEnhancer
                  value={personal.summary}
                  jobRole={targetRole}
                  onApply={(text) => updatePersonal('summary', text)}
                />
                <InlineAIEnhancer
                  text={personal.summary}
                  role={targetRole || 'Software Engineer'}
                  sectionType="summary"
                  onApply={(text) => updatePersonal('summary', text)}
                />
              </div>
            </div>
          </div>
        )

      /* ── Step 1: Education ── */
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Education</h2>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="education" type="education">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {education.map((edu, index) => {
                      const errs = educationErrors[index] || {}
                      const ic = inputClsArr(errs)
                      return (
                        <Draggable key={`edu-${index}`} draggableId={`edu-${index}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="bg-background/30 p-5 rounded-xl border border-border relative"
                            >
                              <div {...provided.dragHandleProps} className="absolute top-4 left-4 text-muted-foreground hover:text-foreground cursor-grab">
                                <GripVertical className="w-4 h-4" />
                              </div>
                              <button
                                onClick={() => removeEducation(index)}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors"
                                aria-label="Remove education entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    School <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className={ic('school')}
                                    value={edu.school}
                                    onChange={e => updateEdu(index, 'school', e.target.value)}
                                    placeholder="University Name"
                                    aria-invalid={!!errs.school}
                                  />
                                  <FieldError msg={errs.school} />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Degree <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className={ic('degree')}
                                    value={edu.degree}
                                    onChange={e => updateEdu(index, 'degree', e.target.value)}
                                    placeholder="B.S., M.S., etc."
                                    aria-invalid={!!errs.degree}
                                  />
                                  <FieldError msg={errs.degree} />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">Field of Study</label>
                                  <input
                                    type="text"
                                    className={ic('field')}
                                    value={edu.field}
                                    onChange={e => updateEdu(index, 'field', e.target.value)}
                                    placeholder="Computer Science"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">GPA (Optional)</label>
                                  <input
                                    type="text"
                                    className={ic('gpa')}
                                    value={edu.gpa}
                                    onChange={e => updateEdu(index, 'gpa', e.target.value)}
                                    placeholder="3.8/4.0"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Start Date <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="month"
                                    className={ic('startDate')}
                                    value={edu.startDate}
                                    onChange={e => updateEdu(index, 'startDate', e.target.value)}
                                    aria-invalid={!!errs.startDate}
                                  />
                                  <FieldError msg={errs.startDate} />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    End Date <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="month"
                                    className={ic('endDate')}
                                    value={edu.endDate}
                                    onChange={e => updateEdu(index, 'endDate', e.target.value)}
                                    aria-invalid={!!errs.endDate}
                                  />
                                  <FieldError msg={errs.endDate} />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <button onClick={addEducation} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
        )

      /* ── Step 2: Experience ── */
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Experience</h2>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="experience" type="experience">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {experience.map((exp, index) => {
                      const errs = experienceErrors[index] || {}
                      const ic = inputClsArr(errs)
                      return (
                        <Draggable key={`exp-${index}`} draggableId={`exp-${index}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="bg-background/30 p-5 rounded-xl border border-border relative"
                            >
                              <div {...provided.dragHandleProps} className="absolute top-4 left-4 text-muted-foreground hover:text-foreground cursor-grab">
                                <GripVertical className="w-4 h-4" />
                              </div>
                              <button
                                onClick={() => removeExperience(index)}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors"
                                aria-label="Remove experience entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Job Title <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className={ic('title')}
                                    value={exp.title}
                                    onChange={e => updateExp(index, 'title', e.target.value)}
                                    placeholder="Software Engineer"
                                    aria-invalid={!!errs.title}
                                  />
                                  <FieldError msg={errs.title} />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Company <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className={ic('company')}
                                    value={exp.company}
                                    onChange={e => updateExp(index, 'company', e.target.value)}
                                    placeholder="Tech Corp"
                                    aria-invalid={!!errs.company}
                                  />
                                  <FieldError msg={errs.company} />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">Location</label>
                                  <input
                                    type="text"
                                    className={ic('location')}
                                    value={exp.location}
                                    onChange={e => updateExp(index, 'location', e.target.value)}
                                    placeholder="San Francisco, CA"
                                  />
                                </div>
                                <div className="flex items-start gap-4 md:col-span-2">
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">
                                      Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="month"
                                      className={ic('startDate')}
                                      value={exp.startDate}
                                      onChange={e => updateExp(index, 'startDate', e.target.value)}
                                      aria-invalid={!!errs.startDate}
                                    />
                                    <FieldError msg={errs.startDate} />
                                  </div>
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">End Date</label>
                                    <input
                                      type="month"
                                      disabled={exp.current}
                                      className={cn(ic('endDate'), 'disabled:opacity-50 disabled:cursor-not-allowed')}
                                      value={exp.current ? '' : exp.endDate}
                                      onChange={e => updateExp(index, 'endDate', e.target.value)}
                                      aria-invalid={!!errs.endDate}
                                    />
                                    <FieldError msg={errs.endDate} />
                                  </div>
                                </div>
                                <div className="md:col-span-2 flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id={`current-${index}`}
                                    checked={exp.current}
                                    onChange={e => {
                                      updateExp(index, 'current', e.target.checked)
                                      if (e.target.checked) updateExp(index, 'endDate', '')
                                    }}
                                    className="rounded border-border accent-primary"
                                  />
                                  <label htmlFor={`current-${index}`} className="text-sm">I currently work here</label>
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium mb-1">
                                    Description (Bullet points)
                                  </label>
                                  <textarea
                                    className="w-full bg-muted border border-border rounded-lg px-4 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                                    value={exp.description}
                                    onChange={e => updateExp(index, 'description', e.target.value)}
                                    placeholder={`- Developed feature X resulting in Y% improvement\n- Led a team of...`}
                                  />
                                  <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                                    <AchievementEnhancer
                                      value={exp.description}
                                      jobRole={targetRole}
                                      onApply={(text) =>
                                        updateExp(index, "description", text)
                                      }
                                    />
                                    <InlineAIEnhancer
                                      text={exp.description}
                                      role={targetRole || 'Software Engineer'}
                                      sectionType="experience"
                                      onApply={(text) =>
                                        updateExp(index, "description", text)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <button onClick={addExperience} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
        )

      /* ── Step 3: Projects ── */
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Projects</h2>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="projects" type="projects">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {projects.map((proj, index) => (
                      <Draggable key={`proj-${index}`} draggableId={`proj-${index}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="bg-background/30 p-5 rounded-xl border border-border relative"
                          >
                            <div {...provided.dragHandleProps} className="absolute top-4 left-4 text-muted-foreground hover:text-foreground cursor-grab">
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <button
                              onClick={() => removeProject(index)}
                              className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors"
                              aria-label="Remove project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                              <div>
                                <label className="block text-sm font-medium mb-1">Project Name</label>
                                <input
                                  type="text"
                                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                                  value={proj.name}
                                  onChange={e => { const n = [...projects]; n[index].name = e.target.value; setProjects(n) }}
                                  placeholder="E-commerce App"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Technologies Used</label>
                                <input
                                  type="text"
                                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                                  value={proj.tech}
                                  onChange={e => { const n = [...projects]; n[index].tech = e.target.value; setProjects(n) }}
                                  placeholder="React, Node.js, MongoDB"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Link (Optional)</label>
                                <input
                                  type="url"
                                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                                  value={proj.link}
                                  onChange={e => { const n = [...projects]; n[index].link = e.target.value; setProjects(n) }}
                                  placeholder="https://github.com/..."
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Description (Bullet points)</label>
                                <textarea
                                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                                  value={proj.description}
                                  onChange={e => { const n = [...projects]; n[index].description = e.target.value; setProjects(n) }}
                                  placeholder="- Built a full-stack application..."
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <button onClick={addProject} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
        )

      /* ── Step 4: Skills ── */
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Skills</h2>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="skills">Technical Skills &amp; Competencies</label>
              <textarea
                id="skills"
                className="w-full bg-muted border border-border rounded-xl px-4 py-2 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder={'**Languages:** JavaScript, Python, Java\n**Frameworks:** React, Node.js, Express\n**Tools:** Git, Docker, AWS'}
              />
              <p className="text-xs text-muted-foreground mt-2">Format exactly as you want it to appear (Markdown supported).</p>
            </div>
          </div>
        )

      /* ── Step 5: Certifications ── */
      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <h2 className="text-2xl font-semibold">Certifications & Licenses</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Showcase industry-recognized credentials</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCertifications([...certifications, { name: '', issuer: '', year: '', url: '' }])
                  if (!sectionOrder.includes('certifications')) {
                    setSectionOrder([...sectionOrder, 'certifications'])
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Certification
              </button>
            </div>

            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index} className="bg-background/40 p-4 rounded-xl border border-border relative space-y-3">
                  <button
                    type="button"
                    onClick={() => setCertifications(certifications.filter((_, i) => i !== index))}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors"
                    title="Remove certification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-6">
                    <div>
                      <label className="block text-xs font-medium mb-1">Certification Name</label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => {
                          const n = [...certifications]
                          n[index].name = e.target.value
                          setCertifications(n)
                        }}
                        placeholder="e.g. AWS Certified Solutions Architect"
                        className="w-full bg-muted border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Issuing Organization</label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => {
                          const n = [...certifications]
                          n[index].issuer = e.target.value
                          setCertifications(n)
                        }}
                        placeholder="e.g. Amazon Web Services"
                        className="w-full bg-muted border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Year / Date</label>
                      <input
                        type="text"
                        value={cert.year}
                        onChange={(e) => {
                          const n = [...certifications]
                          n[index].year = e.target.value
                          setCertifications(n)
                        }}
                        placeholder="e.g. 2024"
                        className="w-full bg-muted border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Credential URL (Optional)</label>
                      <input
                        type="url"
                        value={cert.url}
                        onChange={(e) => {
                          const n = [...certifications]
                          n[index].url = e.target.value
                          setCertifications(n)
                        }}
                        placeholder="https://credly.com/..."
                        className="w-full bg-muted border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {certifications.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No certifications added yet. Click &quot;Add Certification&quot; above.</p>
              )}
            </div>
          </div>
        )

      /* ── Step 6: Custom Sections ── */
      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-1">Custom Sections</h2>
              <p className="text-sm text-muted-foreground">Add Languages, Honors &amp; Awards, Volunteering, Publications, or any custom heading.</p>
            </div>
            <CustomSectionManager
              customSections={customSections}
              onChange={setCustomSections}
              sectionOrder={sectionOrder}
              onSectionOrderChange={setSectionOrder}
            />
          </div>
        )

      /* ── Step 7: Preview ── */
      case 7:
        return (

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Preview &amp; Generate</h2>

            <div className="mb-6 p-4 rounded-xl border border-border bg-muted">
              <h3 className="font-semibold mb-3">Reorder Sections (Drag &amp; Drop)</h3>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="sections" type="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {sectionOrder.map((section, index) => {
                        const customSec = customSections.find(c => c.id === section)
                        const label = customSec?.title || section
                        return (
                          <Draggable key={section} draggableId={section} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center justify-between p-3 bg-background border border-border rounded-lg shadow-2xs"
                              >
                                <div className="flex items-center gap-2">
                                  <div {...provided.dragHandleProps} className="cursor-grab text-muted-foreground hover:text-foreground">
                                    <GripVertical className="w-5 h-5" />
                                  </div>
                                  <span className="capitalize font-medium text-sm">{label}</span>
                                </div>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">
                                  #{index + 1}
                                </span>
                              </div>
                            )}
                          </Draggable>
                        )
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            <div className="flex justify-end mb-4">
  <button
    onClick={saveVersion}
    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
  >
    Save Version
  </button>
</div>

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">

  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">
      Skill Gap Analysis
    </h3>

    <div className="mt-2">
  <span
    className={`px-3 py-1 rounded-full text-sm ${
      atsScore >= 80
        ? "bg-green-500/20 text-green-500"
        : atsScore >= 60
        ? "bg-yellow-500/20 text-yellow-500"
        : "bg-red-500/20 text-red-500"
    }`}
  >
    {atsScore >= 80
      ? "Strong Match"
      : atsScore >= 60
      ? "Moderate Gap"
      : "High Skill Gap"}
  </span>
</div>

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">

  <h3 className="font-semibold mb-3">
    Smart Certification Recommendations
  </h3>

  {recommendedCertifications.length > 0 ? (
    <div className="flex flex-wrap gap-2">

      {recommendedCertifications.map(cert => (
        <span
          key={cert}
          className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm"
        >
          {cert}
        </span>
      ))}

    </div>
  ) : (
    <p className="text-sm text-muted-foreground">
      Add skills and target role to receive certification recommendations.
    </p>
  )}

</div>

    <span className="text-primary font-bold">
      {atsScore}% Match
    </span>
  </div>

  <div className="w-full bg-secondary rounded-full h-3">
    <div
      className="bg-primary h-3 rounded-full transition-all duration-500"
      style={{ width: `${atsScore}%` }}
    />
  </div>

  {recommendedSkills.length > 0 && (
  <div className="mt-4">
    <h4 className="font-medium mb-2">
      Recommended Skills to Learn
    </h4>

    <div className="flex flex-wrap gap-2">
      {recommendedSkills.map(skill => (
        <span
          key={skill}
          className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
)}

{sectionSuggestions.length > 0 && (
  <div className="mb-6 p-4 rounded-xl border border-border bg-muted">
    <h3 className="font-semibold mb-3">
      Resume Section Reordering Suggestions
    </h3>

    <ul className="list-disc list-inside text-sm text-muted-foreground">
      {sectionSuggestions.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)}

  <div className="mt-4">
    <h4 className="font-medium mb-2">
      Missing Skills
    </h4>

    <div className="flex flex-wrap gap-2">
      {missingKeywords.map(skill => (
        <span
          key={skill}
          className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>

</div>

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">
      Achievement Impact Score
    </h3>

    <span className="text-primary font-bold">
      {achievementScore}/100
    </span>
  </div>

  <div className="w-full bg-secondary rounded-full h-3">
    <div
      className="bg-primary h-3 rounded-full transition-all"
      style={{ width: `${achievementScore}%` }}
    />
  </div>

  {achievementSuggestions.length > 0 && (
    <div className="mt-4">
      <h4 className="font-medium mb-2">
        Improvement Suggestions
      </h4>

      <ul className="list-disc list-inside text-sm text-muted-foreground">
        {achievementSuggestions.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )}
</div>
<div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <h3 className="font-semibold mb-3">
    Section Completion Status
  </h3>

  <div className="space-y-2">
    <div>{personal.name && personal.email ? "✅" : "❌"} Personal Info</div>
    <div>{education.some(e => e.school) ? "✅" : "❌"} Education</div>
    <div>{experience.some(e => e.title) ? "✅" : "❌"} Experience</div>
    <div>{projects.some(p => p.name) ? "✅" : "❌"} Projects</div>
    <div>{skills.trim() ? "✅" : "❌"} Skills</div>
  </div>
</div>
            <div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">
      Resume Improvement Progress
    </h3>

    <span className="text-primary font-bold">
      {resumeScore}%
    </span>
  </div>

  <div className="w-full bg-secondary rounded-full h-3">
    <div
      className="bg-primary h-3 rounded-full transition-all duration-500"
      style={{ width: `${resumeScore}%` }}
    />
  </div>

  <div className="mt-4 flex flex-wrap gap-2">
  <span
    className={`px-3 py-1 rounded-full text-sm ${
      resumeScore >= 20
        ? "bg-green-500/20 text-green-500"
        : "bg-secondary"
    }`}
  >
    Personal Info
  </span>

  <span
    className={`px-3 py-1 rounded-full text-sm ${
      resumeScore >= 40
        ? "bg-green-500/20 text-green-500"
        : "bg-secondary"
    }`}
  >
    Education
  </span>

  <span
    className={`px-3 py-1 rounded-full text-sm ${
      resumeScore >= 60
        ? "bg-green-500/20 text-green-500"
        : "bg-secondary"
    }`}
  >
    Experience
  </span>

  <span
    className={`px-3 py-1 rounded-full text-sm ${
      resumeScore >= 80
        ? "bg-green-500/20 text-green-500"
        : "bg-secondary"
    }`}
  >
    Projects
  </span>

  <span
    className={`px-3 py-1 rounded-full text-sm ${
      resumeScore >= 100
        ? "bg-green-500/20 text-green-500"
        : "bg-secondary"
    }`}
  >
    Skills
  </span>
</div>

  <p className="mt-2 text-sm text-muted-foreground">
    Complete more sections to improve your resume score.
  </p>
</div>
            {recommendedSections.length > 0 && (
  <div className="mb-6 p-4 rounded-xl border border-border bg-muted">
    <h3 className="font-semibold mb-2">
      Recommended Sections
    </h3>

    <div className="flex flex-wrap gap-2">
      {recommendedSections.map(section => (
        <span
          key={section}
          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
        >
          {section}
        </span>
      ))}
    </div>
  </div>
)}

{resumeVersions.length > 0 && (
  <div className="mb-6 p-4 rounded-xl border border-border bg-muted">
    <h3 className="font-semibold mb-3">
      Resume Version History
    </h3>

    <div className="space-y-2">
      {resumeVersions.map(version => (
        <div
          key={version.id}
          className="flex justify-between items-center p-2 rounded-lg bg-background"
        >
          <span className="text-sm">
            {version.timestamp}
          </span>

          <button
            onClick={() => restoreVersion(version)}
            className="text-primary text-sm font-medium"
          >
            Restore
          </button>
        </div>
      ))}
    </div>
  </div>
)}

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">
      Portfolio Social Profile Score
    </h3>

    <span className="text-primary font-bold">
      {profileScore}/100
    </span>
  </div>

  <div className="w-full bg-secondary rounded-full h-3">
    <div
      className="bg-primary h-3 rounded-full"
      style={{ width: `${profileScore}%` }}
    />
  </div>

  {profileIssues.length > 0 && (
    <div className="mt-4">
      <h4 className="font-medium mb-2">
        Optimization Suggestions
      </h4>

      <ul className="list-disc list-inside text-sm text-muted-foreground">
        {profileIssues.map((issue, index) => (
          <li key={index}>{issue}</li>
        ))}
      </ul>
    </div>
  )}
</div>

<div className="mt-4 flex flex-wrap gap-2">

  {personal.linkedin && (
    <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded">
      LinkedIn Added
    </span>
  )}

  {personal.github && (
    <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded">
      GitHub Added
    </span>
  )}

  {personal.portfolio && (
    <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded">
      Portfolio Added
    </span>
  )}

</div>

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <h3 className="font-semibold mb-4">
    Resume Content Impact Score
  </h3>

  {Object.entries(impactScores).map(
    ([section, score]) => (
      <div key={section} className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="capitalize">
            {section}
          </span>

          <span className="font-medium">
            {score}/100
          </span>
        </div>

        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full"
            style={{
              width: `${score}%`
            }}
          />
        </div>
      </div>
    )
  )}
</div>

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">
      Resume Readability Score
    </h3>

    <span className="text-primary font-bold">
      {readabilityScore}/100
    </span>
  </div>

  <div className="w-full bg-secondary rounded-full h-3">
    <div
      className="bg-primary h-3 rounded-full transition-all"
      style={{ width: `${readabilityScore}%` }}
    />
  </div>

  {claritySuggestions.length > 0 && (
    <div className="mt-4">
      <h4 className="font-medium mb-2">
        Suggestions
      </h4>

      <ul className="list-disc list-inside text-sm text-muted-foreground">
        {claritySuggestions.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  )}
</div>

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">
      Resume Language Tone Analyzer
    </h3>

    <span className="text-primary font-bold">
      {toneScore}/100
    </span>
  </div>

  <div className="w-full bg-secondary rounded-full h-3">
    <div
      className="bg-primary h-3 rounded-full"
      style={{ width: `${toneScore}%` }}
    />
  </div>

  {toneSuggestions.length > 0 && (
    <div className="mt-4">
      <h4 className="font-medium mb-2">
        Professional Tone Suggestions
      </h4>

      <ul className="list-disc list-inside text-sm text-muted-foreground">
        {toneSuggestions.map((tip, index) => (
          <li key={index}>{tip}</li>
        ))}
      </ul>
    </div>
  )}
</div>

{activeConsistencyWarnings.some(
  item => item.type === "duplicate"
) && (
  <div className="mb-6 p-4 rounded-xl border border-yellow-500 bg-yellow-500/10">
    <h3 className="font-semibold mb-3">
      Duplicate Information Detector
    </h3>

    <ul className="space-y-2">
      {activeConsistencyWarnings
        .filter(
          item => item.type === "duplicate"
        )
        .map((item, index) => (
          <li
            key={index}
            className="text-sm text-yellow-400"
          >
            • {item.message}
          </li>
        ))}
    </ul>
  </div>
)}

<div className="mb-6 p-4 rounded-xl border border-border bg-muted">
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold">
      Career Goal Progress Tracker
    </h3>

    <span className="text-primary font-bold">
      {goalProgress}%
    </span>
  </div>

  <div className="w-full bg-secondary rounded-full h-3">
    <div
      className="bg-primary h-3 rounded-full"
      style={{
        width: `${goalProgress}%`
      }}
    />
  </div>

  <div className="mt-4 space-y-2">
    {careerGoals.map((goal, index) => (
      <div key={index}>
        {goal.completed ? "✅" : "⭕"} {goal.title}
      </div>
    ))}
  </div>
</div>

<div className="bg-background border border-border rounded-xl p-6 h-[500px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">
  {generateMarkdown()}
</div>
          </div>
        )

      default:
        return null
    }
  }

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-20 pb-12 bg-background flex flex-col">
      <div className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col transition-all duration-300',
        viewMode === 'split' ? 'max-w-[1600px]' : 'max-w-4xl'
      )}>

        {/* Top Header Bar with Mode Switcher & Live ATS Score */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Resume Studio
            </h1>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span>Build an ATS-optimized, high-conversion resume</span>
              {draftSavedAt && (
                <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                  <CheckCircle className="w-3 h-3" /> Draft saved {draftSavedAt}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Realtime ATS Score Badge */}
            <div
              className="px-3 py-1.5 rounded-xl border border-primary/20 bg-primary/10 flex items-center gap-2 text-xs"
              title={realtimeAts.tips[0]?.text || 'Live ATS analysis'}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold text-foreground">ATS Score: {realtimeAts.overallScore}%</span>
              <span className="text-[10px] uppercase font-bold text-primary">({realtimeAts.grade})</span>
            </div>

            {/* Import Button */}
            <button
              type="button"
              onClick={() => setShowImportModal(true)}
              className="px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-xs font-medium inline-flex items-center gap-1.5 shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border">
              <button
                type="button"
                onClick={() => setViewMode('form')}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                  viewMode === 'form' ? 'bg-background text-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Form
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
                  viewMode === 'split' ? 'bg-background text-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Split View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
                  viewMode === 'preview' ? 'bg-background text-foreground shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* Restored Draft Banner */}
        {hasRestoredDraft && (
          <div className="mb-6 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs text-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary shrink-0" />
              <span>Restored your saved draft from {draftSavedAt}.</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  try { localStorage.removeItem(DRAFT_KEY) } catch (_e) {}
                  window.location.reload()
                }}
                className="text-red-500 hover:underline font-medium"
              >
                Clear &amp; Start Fresh
              </button>
              <button
                type="button"
                onClick={() => setHasRestoredDraft(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Progress Stepper (hidden in pure preview mode) */}
        {viewMode !== 'preview' && (
          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex items-center gap-2 min-w-max">
              {STEPS.map((step, index) => {
                const isActive    = index === currentStep
                const isCompleted = index < currentStep
                const StepIcon    = step.icon
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                      isActive    ? 'bg-primary text-primary-foreground shadow-xs' :
                      isCompleted ? 'bg-primary/10 text-primary hover:bg-primary/20' :
                                    'bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <StepIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{step.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Main Workspace: Form Only, Split View, or Full Preview */}
        {viewMode === 'preview' ? (
          <div className="flex-1 h-[calc(100vh-180px)] min-h-[700px]">
            <LiveResumePreview resumeData={canonicalResumeData} />
          </div>
        ) : viewMode === 'split' ? (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left Column: Form Editor */}
            <div className="flex flex-col bg-card backdrop-blur-xl border border-border rounded-3xl p-6 sm:p-7 shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Actions */}
              <div className="mt-8 pt-4 border-t border-border flex flex-wrap justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="px-5 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-xs font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                {currentStep === STEPS.length - 1 ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => navigate('/resume-templates', {
                        state: {
                          builderData: {
                            ...canonicalResumeData,
                            sectionOrder,
                            customSections,
                          }
                        }
                      })}
                      className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all flex items-center gap-2 text-xs font-medium border border-border"
                    >
                      <LayoutTemplate className="w-3.5 h-3.5" /> All Templates
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all shadow-xs flex items-center gap-2 text-xs font-medium"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" /> Generate &amp; Enhance
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xs flex items-center gap-2 text-xs font-medium"
                  >
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Live Template Preview */}
            <div className="sticky top-20 h-[calc(100vh-140px)] min-h-[650px]">
              <LiveResumePreview resumeData={canonicalResumeData} />
            </div>
          </div>
        ) : (
          /* Form Only View */
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-card backdrop-blur-xl border border-border rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {currentStep !== STEPS.length - 1 && (
                <ConsistencyPanel errors={activeConsistencyWarnings} />
              )}
            </AnimatePresence>

            {/* Navigation Actions */}
            <div className="mt-8 flex flex-wrap justify-between items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-6 py-2.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {currentStep === STEPS.length - 1 ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/resume-templates', {
                      state: {
                        builderData: {
                          ...canonicalResumeData,
                          sectionOrder,
                          customSections,
                        }
                      }
                    })}
                    className="px-6 py-2.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all flex items-center gap-2 font-medium border border-border text-sm"
                  >
                    <LayoutTemplate className="w-4 h-4" /> Choose Resume Template
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-primary/25 flex items-center gap-2 font-medium text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Generate &amp; Enhance
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-full bg-foreground text-background hover:bg-foreground/90 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 font-medium text-sm"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-semibold">Import Resume</h3>
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Upload a PDF, JSON Resume (.json), Markdown (.md), or Plaintext (.txt) file. Our intelligent parser extracts all fields into the builder automatically.
              </p>
              <label className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/20 hover:bg-muted/40">
                <Upload className="w-8 h-8 text-primary mb-2" />
                <span className="text-xs font-medium text-foreground">Click to upload or drag &amp; drop</span>
                <span className="text-[10px] text-muted-foreground mt-1">PDF, JSON, MD, TXT (up to 5MB)</span>
                <input
                  type="file"
                  accept=".pdf,.json,.md,.txt,text/plain,application/json,application/pdf"
                  onChange={handleImportFile}
                  className="hidden"
                  disabled={importingFile}
                />
              </label>
              {importingFile && (
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>Parsing and structuring resume…</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
