import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle, Plus, Trash2, Save, FileText, User, Briefcase, GraduationCap, Code, Star } from 'lucide-react'
import { resumeApi } from '../services/api'
import { toast } from 'react-hot-toast'

const STEPS = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'projects', title: 'Projects', icon: Code },
  { id: 'skills', title: 'Skills', icon: Star },
  { id: 'preview', title: 'Preview', icon: FileText }
]

export default function ResumeBuilder() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [targetRole, setTargetRole] = useState('')

  // Form State
  const [personal, setPersonal] = useState({
    name: '', email: '', phone: '', linkedin: '', github: '', portfolio: '', summary: ''
  })
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

  const handleNext = () => setCurrentStep(s => Math.min(s + 1, STEPS.length - 1))
  const handlePrev = () => setCurrentStep(s => Math.max(s - 1, 0))

  const addEducation = () => setEducation([...education, { school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' }])
  const removeEducation = (index) => setEducation(education.filter((_, i) => i !== index))

  const addExperience = () => setExperience([...experience, { title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }])
  const removeExperience = (index) => setExperience(experience.filter((_, i) => i !== index))

  const addProject = () => setProjects([...projects, { name: '', tech: '', link: '', description: '' }])
  const removeProject = (index) => setProjects(projects.filter((_, i) => i !== index))

  const generateMarkdown = () => {
    let md = `# ${personal.name || 'Your Name'}\n\n`
    
    const contact = []
    if (personal.email) contact.push(`[${personal.email}](mailto:${personal.email})`)
    if (personal.phone) contact.push(personal.phone)
    if (personal.linkedin) contact.push(`[LinkedIn](${personal.linkedin})`)
    if (personal.github) contact.push(`[GitHub](${personal.github})`)
    if (personal.portfolio) contact.push(`[Portfolio](${personal.portfolio})`)
    
    md += `${contact.join(' | ')}\n\n`

    if (personal.summary) {
      md += `## SUMMARY\n\n${personal.summary}\n\n`
    }

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
        bullets.forEach(b => {
          md += `- ${b.replace(/^- /, '').trim()}\n`
        })
        md += '\n'
      })
    }

    if (projects.some(p => p.name)) {
      md += `## PROJECTS\n\n`
      projects.forEach(p => {
        if (!p.name) return
        md += `**${p.name}** | ${p.tech}\n`
        const bullets = p.description.split('\n').filter(b => b.trim())
        bullets.forEach(b => {
          md += `- ${b.replace(/^- /, '').trim()}\n`
        })
        if (p.link) md += `- [Project Link](${p.link})\n`
        md += '\n'
      })
    }

    if (skills) {
      md += `## SKILLS\n\n${skills}\n\n`
    }

    return md
  }

  const handleGenerate = async () => {
    try {
      setIsSubmitting(true)
      const markdown = generateMarkdown()
      
      const response = await resumeApi.create({
        originalText: markdown,
        jobRole: targetRole || 'Software Engineer',
        title: `${personal.name || 'My'} Resume - ${new Date().toLocaleDateString()}`
      })

      toast.success('Resume created successfully!')
      navigate(`/enhance/${response.data.id}`)
    } catch (error) {
      toast.error(error.message || 'Failed to create resume')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" className="w-full bg-background/50 border border-border rounded-xl px-4 py-2" value={personal.name} onChange={e => setPersonal({...personal, name: e.target.value})} placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Job Role</label>
                <input type="text" className="w-full bg-background/50 border border-border rounded-xl px-4 py-2" value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="Software Engineer" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full bg-background/50 border border-border rounded-xl px-4 py-2" value={personal.email} onChange={e => setPersonal({...personal, email: e.target.value})} placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input type="text" className="w-full bg-background/50 border border-border rounded-xl px-4 py-2" value={personal.phone} onChange={e => setPersonal({...personal, phone: e.target.value})} placeholder="+1 (555) 123-4567" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                <input type="text" className="w-full bg-background/50 border border-border rounded-xl px-4 py-2" value={personal.linkedin} onChange={e => setPersonal({...personal, linkedin: e.target.value})} placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GitHub URL</label>
                <input type="text" className="w-full bg-background/50 border border-border rounded-xl px-4 py-2" value={personal.github} onChange={e => setPersonal({...personal, github: e.target.value})} placeholder="https://github.com/..." />
              </div>
            </div>
            <div className="pt-2">
              <label className="block text-sm font-medium mb-1">Professional Summary</label>
              <textarea className="w-full bg-background/50 border border-border rounded-xl px-4 py-2 min-h-[100px]" value={personal.summary} onChange={e => setPersonal({...personal, summary: e.target.value})} placeholder="A brief summary of your professional background..." />
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="bg-background/30 p-5 rounded-xl border border-border relative">
                <button onClick={() => removeEducation(index)} className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">School</label>
                    <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2" value={edu.school} onChange={e => { const newEdu = [...education]; newEdu[index].school = e.target.value; setEducation(newEdu) }} placeholder="University Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Degree</label>
                    <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2" value={edu.degree} onChange={e => { const newEdu = [...education]; newEdu[index].degree = e.target.value; setEducation(newEdu) }} placeholder="B.S., M.S., etc." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Field of Study</label>
                    <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2" value={edu.field} onChange={e => { const newEdu = [...education]; newEdu[index].field = e.target.value; setEducation(newEdu) }} placeholder="Computer Science" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">GPA (Optional)</label>
                    <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2" value={edu.gpa} onChange={e => { const newEdu = [...education]; newEdu[index].gpa = e.target.value; setEducation(newEdu) }} placeholder="3.8/4.0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2" value={edu.startDate} onChange={e => { const newEdu = [...education]; newEdu[index].startDate = e.target.value; setEducation(newEdu) }} placeholder="Aug 2019" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2" value={edu.endDate} onChange={e => { const newEdu = [...education]; newEdu[index].endDate = e.target.value; setEducation(newEdu) }} placeholder="May 2023" />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addEducation} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} className="bg-background/30 p-5 rounded-xl border border-border relative">
                <button onClick={() => removeExperience(index)} className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Job Title</label>
                    <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2" value={exp.title} onChange={e => { const newExp = [...experience]; newExp[index].title = e.target.value; setExperience(newExp) }} placeholder="Software Engineer" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2" value={exp.company} onChange={e => { const newExp = [...experience]; newExp[index].company = e.target.value; setExperience(newExp) }} placeholder="Tech Corp" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2" value={exp.location} onChange={e => { const newExp = [...experience]; newExp[index].location = e.target.value; setExperience(newExp) }} placeholder="San Francisco, CA" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2" value={exp.startDate} onChange={e => { const newExp = [...experience]; newExp[index].startDate = e.target.value; setExperience(newExp) }} placeholder="Jan 2022" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">End Date</label>
                      <input type="text" disabled={exp.current} className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 disabled:opacity-50" value={exp.current ? 'Present' : exp.endDate} onChange={e => { const newExp = [...experience]; newExp[index].endDate = e.target.value; setExperience(newExp) }} placeholder="Dec 2023" />
                    </div>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2 mt-[-10px]">
                    <input type="checkbox" id={`current-${index}`} checked={exp.current} onChange={e => { const newExp = [...experience]; newExp[index].current = e.target.checked; setExperience(newExp) }} className="rounded border-border" />
                    <label htmlFor={`current-${index}`} className="text-sm">I currently work here</label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description (Bullet points)</label>
                    <textarea className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 min-h-[100px]" value={exp.description} onChange={e => { const newExp = [...experience]; newExp[index].description = e.target.value; setExperience(newExp) }} placeholder="- Developed feature X resulting in Y% improvement&#10;- Led a team of..." />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addExperience} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Projects</h2>
            {projects.map((proj, index) => (
              <div key={index} className="bg-background/30 p-5 rounded-xl border border-border relative">
                <button onClick={() => removeProject(index)} className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Project Name</label>
                    <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2" value={proj.name} onChange={e => { const newP = [...projects]; newP[index].name = e.target.value; setProjects(newP) }} placeholder="E-commerce App" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Technologies Used</label>
                    <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2" value={proj.tech} onChange={e => { const newP = [...projects]; newP[index].tech = e.target.value; setProjects(newP) }} placeholder="React, Node.js, MongoDB" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Link (Optional)</label>
                    <input type="text" className="w-full bg-background/50 border border-border rounded-lg px-4 py-2" value={proj.link} onChange={e => { const newP = [...projects]; newP[index].link = e.target.value; setProjects(newP) }} placeholder="https://github.com/..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description (Bullet points)</label>
                    <textarea className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 min-h-[100px]" value={proj.description} onChange={e => { const newP = [...projects]; newP[index].description = e.target.value; setProjects(newP) }} placeholder="- Built a full-stack application..." />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addProject} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Skills</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Technical Skills & Competencies</label>
              <textarea 
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-2 min-h-[150px]" 
                value={skills} 
                onChange={e => setSkills(e.target.value)} 
                placeholder="**Languages:** JavaScript, Python, Java&#10;**Frameworks:** React, Node.js, Express&#10;**Tools:** Git, Docker, AWS" 
              />
              <p className="text-xs text-muted-foreground mt-2">Format exactly as you want it to appear (Markdown supported).</p>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Preview & Generate</h2>
            <div className="bg-background border border-border rounded-xl p-6 h-[500px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">
              {generateMarkdown()}
            </div>
          </div>
        )
      default:
        return null
    }
  }

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
          <div className="absolute left-0 top-1/2 w-full h-0.5 bg-border -z-10 transform -translate-y-1/2"></div>
          {STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const StepIcon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? 'bg-primary border-primary text-primary-foreground' : isCompleted ? 'bg-primary/20 border-primary text-primary' : 'bg-background border-border text-muted-foreground'}`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                </div>
                <span className={`text-xs mt-2 hidden sm:block ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{step.title}</span>
              </div>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

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
                  <Save className="w-4 h-4" /> Generate & Enhance
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
