import React, { useRef, useState } from 'react'
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
import {
  validatePersonalStep,
  validateEducationStep,
  validateExperienceStep,
  hasErrors,
} from '../utils/resumeValidation'

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
      'w-full bg-background/50 border rounded-xl px-4 py-2 transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-primary/30',
      errors?.[errorKey] ? 'border-red-500 focus:ring-red-400/30' : 'border-border'
    )

  const inputClsArr = (errors) => (errorKey) =>
    cn(
      'w-full bg-background/50 border rounded-lg px-4 py-2 transition-colors',
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

            {/* Summary */}
            <div className="pt-2">
              <label className="block text-sm font-medium mb-1" htmlFor="summary">Professional Summary</label>
              <textarea
                id="summary"
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
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
    className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
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
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                      value={proj.name}
                      onChange={e => { const n = [...projects]; n[index].name = e.target.value; setProjects(n) }}
                      placeholder="E-commerce App"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Technologies Used</label>
                    <input
                      type="text"
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                      value={proj.tech}
                      onChange={e => { const n = [...projects]; n[index].tech = e.target.value; setProjects(n) }}
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Link (Optional)</label>
                    <input
                      type="url"
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                      value={proj.link}
                      onChange={e => { const n = [...projects]; n[index].link = e.target.value; setProjects(n) }}
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description (Bullet points)</label>
                    <textarea
                      className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
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
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-2 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
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
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
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
        <div className="flex-1 bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
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
              className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 font-medium"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
