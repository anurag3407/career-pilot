import { ResumeConsistencyChecker } from '../utils/resumeChecker';
import ConsistencyPanel from '../utils/ConsistencyPanel';
import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle, Plus, Trash2,
  Save, FileText, User, Briefcase, GraduationCap, Code, Star
} from 'lucide-react'
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

const STEPS = [
  { id: 'personal',   title: 'Personal Info', icon: User },
  { id: 'education',  title: 'Education',     icon: GraduationCap },
  { id: 'experience', title: 'Experience',    icon: Briefcase },
  { id: 'projects',   title: 'Projects',      icon: Code },
  { id: 'skills',     title: 'Skills',        icon: Star },
  { id: 'preview',    title: 'Preview',       icon: FileText },
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

  const role = targetRole.toLowerCase()
  const skillText = skills.toLowerCase()

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
}, [targetRole, skills])
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
    md += `${contact.join(' | ')}\n\n`

    if (personal.summary) md += `## SUMMARY\n\n${personal.summary}\n\n`

    if (education.some(e => e.school)) {
      md += `## EDUCATION\n\n`
      education.forEach(e => {
        if (!e.school) return
        md += `**${e.degree}${e.field ? ' in ' + e.field : ''}** | ${e.school} | ${e.startDate} - ${e.endDate}\n`
        if (e.gpa) md += `- GPA: ${e.gpa}\n`
        if (e.description) md += `- ${e.description}\n`
        md += '\n'
      })
    }

    if (experience.some(e => e.title)) {
      md += `## EXPERIENCE\n\n`
      experience.forEach(e => {
        if (!e.title) return
        md += `**${e.title}** | ${e.company} | ${e.location} | ${e.startDate} - ${e.current ? 'Present' : e.endDate}\n`
        const bullets = e.description.split('\n').filter(b => b.trim())
        bullets.forEach(b => { md += `- ${b.replace(/^- /, '').trim()}\n` })
        md += '\n'
      })
    }

    if (projects.some(p => p.name)) {
      md += `## PROJECTS\n\n`
      projects.forEach(p => {
        if (!p.name) return
        md += `**${p.name}** | ${p.tech}\n`
        const bullets = p.description.split('\n').filter(b => b.trim())
        bullets.forEach(b => { md += `- ${b.replace(/^- /, '').trim()}\n` })
        if (p.link) md += `- [Project Link](${p.link})\n`
        md += '\n'
      })
    }

    if (skills) md += `## SKILLS\n\n${skills}\n\n`

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
  }, [experience, education, projects, personal, skills, generateMarkdown]);

  const handleGenerate = async () => {
    try {
      setIsSubmitting(true)
      const markdown = generateMarkdown()

      const response = await resumeApi.create({
        originalText: markdown,
        jobRole: targetRole || 'Software Engineer',
        title:   `${personal.name || 'My'} Resume - ${new Date().toLocaleDateString()}`,
      })
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
            </div>
          </div>
        )

      /* ── Step 1: Education ── */
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Education</h2>
            {education.map((edu, index) => {
              const errs = educationErrors[index] || {}
              const ic = inputClsArr(errs)
              return (
                <div key={index} className="bg-background/30 p-5 rounded-xl border border-border relative">
                  <button
                    onClick={() => removeEducation(index)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors"
                    aria-label="Remove education entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
              )
            })}
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
            {experience.map((exp, index) => {
              const errs = experienceErrors[index] || {}
              const ic = inputClsArr(errs)
              return (
                <div key={index} className="bg-background/30 p-5 rounded-xl border border-border relative">
                  <button
                    onClick={() => removeExperience(index)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors"
                    aria-label="Remove experience entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

                    {/* Date row */}
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

                    {/* Currently working here */}
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

  <AchievementEnhancer
    value={exp.description}
    jobRole={targetRole}
    onApply={(text) =>
      updateExp(index, "description", text)
    }
  />
</div>

                  </div>
                </div>
              )
            })}
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
            {projects.map((proj, index) => (
              <div key={index} className="bg-background/30 p-5 rounded-xl border border-border relative">
                <button
                  onClick={() => removeProject(index)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors"
                  aria-label="Remove project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            ))}
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

      /* ── Step 5: Preview ── */
      case 5:
        return (

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Preview &amp; Generate</h2>
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
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Resume Builder
          </h1>
          <p className="text-muted-foreground mt-2">Build a professional resume from scratch.</p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-8 flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-border -z-10 transform -translate-y-1/2" />
          {STEPS.map((step, index) => {
            const isActive    = index === currentStep
            const isCompleted = index < currentStep
            const StepIcon    = step.icon
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                  isActive    ? 'bg-primary border-primary text-primary-foreground' :
                  isCompleted ? 'bg-primary/20 border-primary text-primary' :
                                'bg-background border-border text-muted-foreground'
                )}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                </div>
                <span className={cn(
                  'text-xs mt-2 hidden sm:block',
                  isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                )}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>

        {/* Content Area */}
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

        {/* Drop this safely within your main workspace grid or right before action buttons */}
<AnimatePresence mode="wait">
  {currentStep !== 5 && ( // Hide panel on the final pure preview screen
    <ConsistencyPanel errors={activeConsistencyWarnings} />
  )}
</AnimatePresence>

        {/* Navigation Actions */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-6 py-2.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {currentStep === STEPS.length - 1 ? (
            <button
              onClick={handleGenerate}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-primary/25 flex items-center gap-2 font-medium"
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
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-full bg-foreground text-background hover:bg-foreground/90 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 font-medium"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
