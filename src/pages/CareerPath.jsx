import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Target, Copy, Check, ChevronDown, ChevronUp,
  TrendingUp, Zap, AlertCircle, CheckCircle2, Star, Briefcase,
  Plus, X, BarChart3, ClipboardList, BookOpen, ExternalLink,
  RefreshCw, Calendar, DollarSign, Award, ChevronRight, Play
} from 'lucide-react'
import { enhanceApi, resumeApi } from '../services/api'
import { toast } from 'react-hot-toast'
import { triggerConfetti } from '../utils/confetti'

// Score Ring Component
function ScoreRing({ score, label, size = 'md' }) {
  const safeScore = isNaN(Number(score)) ? 0 : Math.max(0, Math.min(100, Math.round(Number(score))))
  const r = size === 'lg' ? 40 : 26
  const stroke = size === 'lg' ? 6 : 4
  const dim = (r + stroke) * 2
  const circ = 2 * Math.PI * r
  const color =
    safeScore >= 80 ? 'stroke-emerald-400' :
    safeScore >= 50 ? 'stroke-indigo-400' : 'stroke-rose-400'
  const textColor =
    safeScore >= 80 ? 'text-emerald-400' :
    safeScore >= 50 ? 'text-indigo-400' : 'text-rose-400'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center">
        <svg width={dim} height={dim} className="-rotate-90" viewBox={`0 0 ${dim} ${dim}`}>
          <circle
            cx={r + stroke} cy={r + stroke} r={r}
            fill="none" strokeWidth={stroke}
            stroke="currentColor" className="text-muted-foreground/15"
          />
          <motion.circle
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - safeScore / 100) }}
            transition={{ duration: 1, ease: 'easeOut' }}
            cx={r + stroke} cy={r + stroke} r={r}
            fill="none" strokeWidth={stroke}
            strokeDasharray={circ}
            strokeLinecap="round"
            className={`transition-all duration-700 ${color}`}
          />
        </svg>
        <span className={`absolute text-sm font-bold ${textColor}`}>{safeScore}%</span>
      </div>
      <p className="text-xs text-muted-foreground text-center font-medium mt-1">{label}</p>
    </div>
  )
}

// Robust Salary String Parser
const parseSalary = (salaryStr) => {
  if (!salaryStr || typeof salaryStr !== 'string') return 60000
  
  // Clean string: remove $, commas, and whitespace
  const clean = salaryStr.toLowerCase().replace(/[\$,\s]/g, '')
  
  // Helper to parse single value like "120k" or "120000"
  const parseSingle = (s) => {
    let multiplier = 1
    if (s.includes('k')) {
      multiplier = 1000
      s = s.replace('k', '')
    } else if (s.includes('m')) {
      multiplier = 1000000
      s = s.replace('m', '')
    }
    const parsed = parseFloat(s)
    return isNaN(parsed) ? 60000 : parsed * multiplier
  }

  // Handle range e.g. "120k-150k"
  if (clean.includes('-')) {
    const parts = clean.split('-')
    const low = parseSingle(parts[0])
    const high = parseSingle(parts[1])
    return (low + high) / 2
  }

  return parseSingle(clean)
}

export default function CareerPath() {
  const location = useLocation()
  const navigate = useNavigate()

  // Tab mapping based on URL path
  const getTabFromPath = (path) => {
    if (path.includes('skill-gap')) return 'skills'
    if (path.includes('salary-estimate')) return 'salary'
    return 'trajectory'
  }

  const [activeSection, setActiveSection] = useState(getTabFromPath(location.pathname))
  const [resumes, setResumes] = useState([])
  const [selectedResumeId, setSelectedResumeId] = useState('')
  
  // Input states
  const [currentRole, setCurrentRole] = useState('')
  const [industry, setIndustry] = useState('Technology')
  const [yearsOfExperience, setYearsOfExperience] = useState(2)
  const [skillsList, setSkillsList] = useState([])
  const [skillInput, setSkillInput] = useState('')

  // UI/Flow states
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  
  // Interactive Timeline Tracking
  const [activePathIndex, setActivePathIndex] = useState(0)
  const [userCheckedSkills, setUserCheckedSkills] = useState({}) // { roleTitle: { skillName: boolean } }

  // Study Guide Modal states
  const [guideModalOpen, setGuideModalOpen] = useState(false)
  const [guideLoading, setGuideLoading] = useState(false)
  const [activeGuideRole, setActiveGuideRole] = useState('')
  const [guideData, setGuideData] = useState(null)
  
  // Utility states
  const [copiedTextKey, setCopiedTextKey] = useState('')

  // Sync tab active state with path changes
  useEffect(() => {
    setActiveSection(getTabFromPath(location.pathname))
  }, [location.pathname])

  // Load user resumes for auto-fill dropdown
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await resumeApi.getAll()
        if (response.success && Array.isArray(response.data)) {
          setResumes(response.data)
        }
      } catch (err) {
        console.warn('Failed to fetch resumes for auto-fill selection:', err)
      }
    }
    fetchResumes()
  }, [])

  // Auto-fill inputs when a resume is selected
  const handleResumeSelect = (resumeId) => {
    setSelectedResumeId(resumeId)
    if (!resumeId) return

    const selectedResume = resumes.find(r => r._id === resumeId)
    if (!selectedResume) return

    // Extract basic fields
    if (selectedResume.jobRole) {
      setCurrentRole(selectedResume.jobRole)
    } else if (selectedResume.preferences?.jobRole) {
      setCurrentRole(selectedResume.preferences.jobRole)
    }

    if (selectedResume.preferences?.industry) {
      setIndustry(selectedResume.preferences.industry)
    }

    if (typeof selectedResume.preferences?.yearsOfExperience === 'number') {
      setYearsOfExperience(selectedResume.preferences.yearsOfExperience)
    }

    // Extract skills from string or structured list
    let extractedSkills = []
    if (Array.isArray(selectedResume.preferences?.skills)) {
      extractedSkills = selectedResume.preferences.skills
    } else if (selectedResume.originalText) {
      // Basic heuristics to pull out skills if structured array is missing
      const text = selectedResume.originalText.toLowerCase()
      const popularTechs = ['react', 'node', 'express', 'python', 'javascript', 'typescript', 'mongodb', 'sql', 'docker', 'aws', 'css', 'html', 'git', 'java', 'c++', 'c#', 'rust', 'go', 'figma', 'product management', 'kubernetes']
      popularTechs.forEach(tech => {
        const escapedTech = tech.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
        const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+])${escapedTech}(?:$|[^a-zA-Z0-9#+])`, 'i')
        if (regex.test(text)) {
          extractedSkills.push(tech.charAt(0).toUpperCase() + tech.slice(1))
        }
      })
    }

    // De-duplicate and clamp to 10
    const finalSkills = [...new Set(extractedSkills)].slice(0, 10)
    setSkillsList(finalSkills)
    toast.success('Fields populated from resume successfully!')
  }

  // Handle skills array input
  const handleAddSkill = (e) => {
    e.preventDefault()
    const clean = skillInput.trim()
    if (!clean) return
    if (skillsList.includes(clean)) {
      toast.error('Skill already added')
      return
    }
    if (skillsList.length >= 10) {
      toast.error('Maximum 10 starting skills allowed')
      return
    }
    setSkillsList([...skillsList, clean])
    setSkillInput('')
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove))
  }

  // Scanning status transition
  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < 3 ? prev + 1 : prev))
    }, 1800)
    return () => clearInterval(interval)
  }, [loading])

  // Trigger main career pathway prediction API
  const handleGenerate = async (e) => {
    e.preventDefault()
    const cleanRole = currentRole.trim()
    if (!cleanRole) {
      toast.error('Please enter your current or starting job role')
      return
    }

    setLoading(true)
    setLoadingStep(0)
    setError(null)
    setResults(null)
    setActivePathIndex(0)
    setUserCheckedSkills({})

    const resumeData = {
      currentRole: cleanRole,
      skills: skillsList,
      yearsOfExperience: Number(yearsOfExperience),
      industry: industry
    }

    try {
      const response = await enhanceApi.predictTrajectory(resumeData)
      if (response.success && response.data) {
        setResults(response.data)
        triggerConfetti({ duration: 3000, particleCount: 150, spread: 100 })
        toast.success('Your Career Tracks have been generated successfully!')
      } else {
        throw new Error('Invalid response structure received from API')
      }
    } catch (err) {
      console.error('Trajectory prediction failure:', err)
      setError(err.message || 'Failed to analyze trajectory parameters. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle timeline checkboxes
  const handleToggleSkillCheck = (roleTitle, skill) => {
    setUserCheckedSkills(prev => {
      const roleChecks = prev[roleTitle] || {}
      return {
        ...prev,
        [roleTitle]: {
          ...roleChecks,
          [skill]: !roleChecks[skill]
        }
      }
    })
  }

  // Compute stats for current roadmap milestone
  const getRoleReadiness = (role) => {
    const targetSkills = role.skills || []
    if (targetSkills.length === 0) return 100

    const initialAcquiredCount = targetSkills.filter(skill =>
      skillsList.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
    ).length

    const manuallyCheckedCount = targetSkills.filter(skill => {
      const isInitial = skillsList.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
      if (isInitial) return false
      return userCheckedSkills[role.title]?.[skill] === true
    }).length

    const totalAcquired = initialAcquiredCount + manuallyCheckedCount
    return Math.round((totalAcquired / targetSkills.length) * 100)
  }

  // Trigger Dynamic Study Guide & Project Generation for any Milestone Node
  const handleFetchMilestoneGuide = async (role) => {
    setActiveGuideRole(role.title)
    setGuideModalOpen(true)
    setGuideLoading(true)
    setGuideData(null)

    try {
      const response = await enhanceApi.getMilestoneGuide(role.title, role.skills || [])
      if (response.success && response.data) {
        setGuideData(response.data)
      } else {
        throw new Error('API returned invalid guide structure')
      }
    } catch (err) {
      console.error('Study guide retrieval error:', err)
      toast.error('Failed to generate learning plan. Please try again.')
      setGuideModalOpen(false)
    } finally {
      setGuideLoading(false)
    }
  }

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedTextKey(key)
      setTimeout(() => setCopiedTextKey(''), 2000)
      toast.success('Copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy. Please copy manually.')
    }
  }

  const handleTabRedirect = (section) => {
    setActiveSection(section)
    if (section === 'skills') {
      navigate('/skill-gap')
    } else if (section === 'salary') {
      navigate('/salary-estimate')
    } else {
      navigate('/career-path')
    }
  }

  const activePath = results?.trajectories?.[activePathIndex]

  // Render Loader screen
  const loadingSteps = [
    'Parsing your current professional profile...',
    'Analyzing typical industry paths and requirements...',
    'Quantifying skill gaps against top candidate benchmarks...',
    'Synthesizing personalized pathways and compensations...'
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background blur blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <GraduationCap className="w-4 h-4" />
            AI Career Growth Center
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
            Design Your Career Trajectory
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Leverage advanced AI to forecast your career timeline, uncover skill gaps, and explore custom compensation pathways tailored to your industry goals.
          </p>
        </motion.div>

        {/* Global Tabs Navigation */}
        <div className="flex items-center justify-center gap-2 bg-card/40 backdrop-blur-md border border-border rounded-2xl p-2 mb-8 max-w-lg mx-auto">
          {[
            { id: 'trajectory', label: 'AI Trajectory', icon: TrendingUp },
            { id: 'skills', label: 'Skill Gap Analyzer', icon: Target },
            { id: 'salary', label: 'Salary Pathways', icon: DollarSign }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabRedirect(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer font-semibold text-sm ${
                activeSection === tab.id
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Setup Parameters Panel */}
        {!results && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/45 backdrop-blur-md border border-border rounded-3xl shadow-xl overflow-hidden mb-10"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center gap-2 text-white font-semibold">
              <Star className="w-5 h-5" />
              Configure Your Roadmap Parameters
            </div>
            
            <form onSubmit={handleGenerate} className="p-6 md:p-8 space-y-6">
              
              {/* Optional Auto-Fill from Resume Selection */}
              {resumes.length > 0 && (
                <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Auto-fill using My Resume</h4>
                      <p className="text-xs text-muted-foreground">Automatically pull current role, skills, and industry</p>
                    </div>
                  </div>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => handleResumeSelect(e.target.value)}
                    className="w-full md:w-64 px-3 py-2 bg-background border border-border rounded-xl text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="">Select a saved resume...</option>
                    {resumes.map(r => (
                      <option key={r._id} value={r._id}>{r.title || 'Untitled Resume'}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Current Role */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    Current or Starting Job Title
                  </label>
                  <input
                    type="text"
                    required
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    placeholder="e.g. Junior Web Developer, Product Analyst"
                    className="w-full px-4 py-3 bg-muted/40 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
                  />
                </div>

                {/* Industry Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Award className="w-4 h-4 text-indigo-400" />
                    Industry Sector
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-3 bg-muted/40 border border-border rounded-2xl text-foreground outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
                  >
                    {['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Sales', 'Design', 'Engineering'].map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                {/* Years of Experience */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      Years of Professional Experience
                    </label>
                    <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                      {yearsOfExperience} {yearsOfExperience === 1 ? 'Year' : 'Years'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                    className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>Entry Level (0)</span>
                    <span>Mid Level (5)</span>
                    <span>Senior (10)</span>
                    <span>Expert (15+)</span>
                  </div>
                </div>

                {/* Skills tagging input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Target className="w-4 h-4 text-indigo-400" />
                    Current Skills / Technologies <span className="text-xs text-muted-foreground font-normal">(max 10)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="e.g. JavaScript, Excel, Photoshop"
                      className="flex-1 px-4 py-2 bg-muted/40 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-primary/10 border border-primary/25 hover:bg-primary/20 text-primary font-bold text-sm rounded-2xl transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Skill tags container */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {skillsList.map(skill => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted border border-border text-foreground text-xs font-semibold rounded-full"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-muted-foreground hover:text-destructive transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {skillsList.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">No skills specified yet. Enter skills above.</p>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-2xl px-4 py-3 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-5 h-5" />
                Generate AI Pathways
              </button>
            </form>
          </motion.div>
        )}

        {/* Loading / Scanning state screen */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card/45 backdrop-blur-md border border-border rounded-3xl p-12 text-center shadow-xl max-w-2xl mx-auto my-10"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6 relative border border-primary/20">
              <RefreshCw className="w-10 h-10 text-primary animate-spin" />
            </div>
            
            <h3 className="text-2xl font-bold text-foreground mb-2">Analyzing Career Trajectories</h3>
            <p className="text-muted-foreground mb-8 text-sm max-w-md mx-auto">
              Our advanced model is computing ideal milestones and analyzing industry matrices...
            </p>

            {/* Stepped loading status items */}
            <div className="space-y-4 max-w-md mx-auto text-left">
              {loadingSteps.map((stepText, idx) => {
                const isPassed = loadingStep > idx
                const isActive = loadingStep === idx
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                      isPassed ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      isActive ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 animate-pulse' :
                      'bg-muted-foreground/10 text-muted-foreground/30 border-muted-foreground/20'
                    }`}>
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${
                      isPassed ? 'text-foreground/75 line-through' :
                      isActive ? 'text-primary font-bold' :
                      'text-muted-foreground/40'
                    }`}>
                      {stepText}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Pathways / Results View */}
        {results && activePath && (
          <div className="space-y-8">
            
            {/* Top overview widget */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card/45 backdrop-blur-md border border-border rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg"
            >
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">Generated Roadmap Pathways</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> starting from: <strong>{currentRole}</strong></span>
                  <span className="flex items-center gap-1"><Award className="w-4 h-4" /> industry: <strong>{industry}</strong></span>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => {
                    setResults(null)
                    setSelectedResumeId('')
                  }}
                  className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-muted/65 hover:bg-muted text-foreground border border-border rounded-xl text-sm font-bold transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Reset Inputs
                </button>
              </div>
            </motion.div>

            {/* Trajectory Pathways Sub-tabs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-foreground tracking-wider uppercase">Select Trajectory Direction</h4>
                <span className="text-xs text-muted-foreground font-semibold">3 pathways predicted</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {results.trajectories.map((trajectory, index) => (
                  <button
                    key={index}
                    onClick={() => setActivePathIndex(index)}
                    className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden cursor-pointer ${
                      activePathIndex === index
                        ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/20'
                        : 'bg-card/35 hover:bg-card/55 border-border hover:border-border/80'
                    }`}
                  >
                    {activePathIndex === index && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                        Selected
                      </div>
                    )}
                    <h5 className="font-bold text-foreground text-sm leading-tight mb-2 truncate pr-6">
                      {trajectory.pathName || `Trajectory Pathway ${index + 1}`}
                    </h5>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                      {trajectory.roles?.length || 0} Milestones predicted
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Content view depending on Active Section */}
            <AnimatePresence mode="wait">
              {activeSection === 'trajectory' && (
                <motion.div
                  key="trajectory-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 border-b border-border pb-3 mb-6">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-xl font-bold text-foreground">Interactive Pathway Timeline</h2>
                  </div>

                  {/* Vertical Timeline Tree */}
                  <div className="relative pl-6 md:pl-10 border-l-2 border-dashed border-border/85 space-y-12 ml-4">
                    {activePath.roles?.map((role, idx) => {
                      const readiness = getRoleReadiness(role)
                      const isAcquired = readiness === 100
                      
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative"
                        >
                          {/* Timeline Glowing Node Dot */}
                          <div className={`absolute -left-[39px] md:-left-[55px] top-1.5 w-[26px] h-[26px] rounded-full border-4 border-background flex items-center justify-center transition-all ${
                            isAcquired 
                              ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.45)]' 
                              : 'bg-muted-foreground/35 border-border'
                          }`}>
                            {isAcquired ? (
                              <Check className="w-3.5 h-3.5 text-white" />
                            ) : (
                              <span className="text-[10px] font-bold text-foreground">{idx + 1}</span>
                            )}
                          </div>

                          {/* Step Milestone Card Layout */}
                          <div className="bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-5 md:p-6 hover:border-border/90 transition-all shadow-md">
                            
                            {/* Card Header information */}
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                              <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                  <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold rounded-full uppercase">
                                    {role.level || 'Mid Level'}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" /> Est. {role.timeToReach || '1-2 Years'}
                                  </span>
                                </div>
                                <h4 className="text-lg md:text-xl font-bold text-foreground leading-tight">
                                  {role.title || 'Target Milestone Role'}
                                </h4>
                              </div>

                              <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 border-border/40 pt-3 md:pt-0">
                                {/* Salary Bracket Badge */}
                                <div className="text-left md:text-right">
                                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Est. Salary</p>
                                  <p className="text-sm font-extrabold text-indigo-400 flex items-center gap-0.5"><DollarSign className="w-3.5 h-3.5" />{role.estimatedSalary || 'TBD'}</p>
                                </div>

                                {/* Readiness Ring Widget */}
                                <ScoreRing score={readiness} label="Readiness" />
                              </div>
                            </div>

                            {/* Skills acquired checklist block */}
                            <div className="space-y-3 bg-muted/20 border border-border/40 rounded-2xl p-4 mb-5">
                              <p className="text-xs font-bold text-foreground/80 flex items-center gap-1.5">
                                <Target className="w-4 h-4 text-primary" /> Target Skills for this Milestone
                              </p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {role.skills?.map((skill, sIdx) => {
                                  // Determine if user has already supplied this skill in initial list
                                  const isInitialAcquired = skillsList.some(
                                    userSkill => userSkill.toLowerCase() === skill.toLowerCase()
                                  )
                                  const isChecked = isInitialAcquired || userCheckedSkills[role.title]?.[skill] === true

                                  return (
                                    <div
                                      key={sIdx}
                                      onClick={() => !isInitialAcquired && handleToggleSkillCheck(role.title, skill)}
                                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer select-none transition-all ${
                                        isInitialAcquired
                                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                          : isChecked
                                          ? 'bg-primary/10 border-primary/30 text-primary'
                                          : 'bg-background/45 border-border hover:bg-muted/40 text-muted-foreground'
                                      }`}
                                    >
                                      <div className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition ${
                                        isInitialAcquired ? 'bg-emerald-500 border-emerald-500 text-white' :
                                        isChecked ? 'bg-primary border-primary text-primary-foreground' :
                                        'bg-background border-muted-foreground/30'
                                      }`}>
                                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                      </div>
                                      <span className="truncate">{skill}</span>
                                      {isInitialAcquired && (
                                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.25 rounded-md ml-auto flex-shrink-0">
                                          Acquired
                                        </span>
                                      )}
                                    </div>
                                  )
                                })}
                                {(!role.skills || role.skills.length === 0) && (
                                  <p className="text-xs text-muted-foreground italic col-span-2">No target skills listed.</p>
                                )}
                              </div>
                            </div>

                            {/* Study Guide trigger button */}
                            <button
                              onClick={() => handleFetchMilestoneGuide(role)}
                              className="w-full md:w-auto px-5 py-2.5 bg-muted/65 hover:bg-muted text-foreground border border-border rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <BookOpen className="w-4 h-4 text-indigo-400" />
                              Generate AI Study Guide & Project Blueprint
                            </button>

                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  <p className="text-[11px] text-muted-foreground italic text-center pt-8 max-w-lg mx-auto">
                    {results.disclaimer}
                  </p>
                </motion.div>
              )}

              {activeSection === 'skills' && (
                <motion.div
                  key="skills-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 border-b border-border pb-3 mb-6">
                    <Target className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-xl font-bold text-foreground">Skills Gap Analysis Matrix</h2>
                  </div>

                  {/* Consolidate all milestone skills to map user gaps */}
                  {(() => {
                    const allMilestoneSkills = [...new Set(
                      activePath.roles?.reduce((acc, role) => [...acc, ...(role.skills || [])], []) || []
                    )]
                    
                    const acquiredSkills = allMilestoneSkills.filter(skill => {
                      const isInitial = skillsList.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
                      if (isInitial) return true
                      return activePath.roles?.some(role => userCheckedSkills[role.title]?.[skill] === true)
                    })
                    
                    const gapSkills = allMilestoneSkills.filter(skill => {
                      const isInitial = skillsList.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
                      if (isInitial) return false
                      const isChecked = activePath.roles?.some(role => userCheckedSkills[role.title]?.[skill] === true)
                      return !isChecked
                    })

                    const overallCompletion = allMilestoneSkills.length > 0 
                      ? Math.round((acquiredSkills.length / allMilestoneSkills.length) * 100)
                      : 0

                    return (
                      <div className="space-y-6">
                        {/* Overall path score widget */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-1 bg-card/40 border border-border rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-md">
                            <ScoreRing score={overallCompletion} label="Path Competency" size="lg" />
                            <p className="text-xs text-muted-foreground mt-4 max-w-xs">
                              This represent the ratio of matching target skills you currently possess across all predicted milestone tiers.
                            </p>
                          </div>

                          <div className="md:col-span-2 bg-card/40 border border-border rounded-3xl p-6 shadow-md flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-foreground text-base mb-2 flex items-center gap-1.5">
                                <Award className="w-5 h-5 text-amber-500" /> Skill Competency Breakdown
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                Achieving complete trajectory readiness requires filling key core skill gaps. Your starting profile contains {acquiredSkills.length} of the {allMilestoneSkills.length} recommended pathway competencies.
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                                <span>Starting Competence</span>
                                <span>{overallCompletion}% Tiers Unlocked</span>
                              </div>
                              <div className="h-3 bg-muted rounded-full overflow-hidden border border-border/40">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${overallCompletion}%` }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* List acquired and gap side by side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Gaps List */}
                          <div className="bg-card/40 border border-border rounded-3xl p-6 shadow-md">
                            <h4 className="font-bold text-foreground text-sm flex items-center gap-2 mb-4">
                              <AlertCircle className="w-5 h-5 text-rose-400" />
                              Pathway Skill Gaps ({gapSkills.length})
                            </h4>
                            
                            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
                              {gapSkills.map((skill, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-start gap-3 p-3 bg-rose-500/5 border border-rose-500/20 rounded-2xl"
                                >
                                  <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-bold text-foreground">{skill}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      Required competency predicted for advancement. Click the Trajectory tab to generate tailored milestone blueprints.
                                    </p>
                                  </div>
                                </motion.div>
                              ))}
                              {gapSkills.length === 0 && (
                                <p className="text-sm text-muted-foreground italic text-center py-6">You possess all predicted pathway skills!</p>
                              )}
                            </div>
                          </div>

                          {/* Acquired List */}
                          <div className="bg-card/40 border border-border rounded-3xl p-6 shadow-md">
                            <h4 className="font-bold text-foreground text-sm flex items-center gap-2 mb-4">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              Acquired Competencies ({acquiredSkills.length})
                            </h4>
                            
                            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
                              {acquiredSkills.map((skill, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center gap-2.5 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl"
                                >
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                  <span className="text-sm font-bold text-foreground">{skill}</span>
                                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 ml-auto font-bold uppercase">
                                    Verified
                                  </span>
                                </motion.div>
                              ))}
                              {acquiredSkills.length === 0 && (
                                <p className="text-sm text-muted-foreground italic text-center py-6">None of your starting skills match path guidelines.</p>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    )
                  })()}
                </motion.div>
              )}

              {activeSection === 'salary' && (
                <motion.div
                  key="salary-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 border-b border-border pb-3 mb-6">
                    <DollarSign className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-xl font-bold text-foreground">Estimated Salary Pathways</h2>
                  </div>

                  {/* Visualizing estimated salary values */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Progression bar chart details */}
                    <div className="md:col-span-2 bg-card/40 border border-border rounded-3xl p-6 shadow-md space-y-6">
                      <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                        <BarChart3 className="w-5 h-5 text-indigo-400" /> Compensation Growth Escalation
                      </h4>

                      <div className="space-y-6 pt-2">
                        {activePath.roles?.map((role, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="font-bold text-foreground leading-tight">{role.title}</span>
                              <span className="font-extrabold text-indigo-400">{role.estimatedSalary}</span>
                            </div>
                            
                            {/* Bar length heuristic parsing */}
                            {(() => {
                              const val = parseSalary(role.estimatedSalary) / 1000
                              const ratio = Math.min(100, Math.round((val / 250) * 100))

                              return (
                                <div className="h-2.5 bg-muted rounded-full overflow-hidden border border-border/40">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${ratio}%` }}
                                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                  />
                                </div>
                              )
                            })()}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stat detail sidebar */}
                    <div className="bg-card/40 border border-border rounded-3xl p-6 shadow-md flex flex-col justify-between text-center gap-6">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 border border-primary/20">
                          <DollarSign className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-foreground text-base leading-tight mb-2">Compensation Forecast</h4>
                        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                          Predicted path growth demonstrates high premium potential for senior and lead categories in this industry bracket.
                        </p>
                      </div>

                      {/* Progression summary multiplier */}
                      {(() => {
                        const sVal = parseSalary(activePath.roles?.[0]?.estimatedSalary)
                        const eVal = parseSalary(activePath.roles?.[activePath.roles.length - 1]?.estimatedSalary)
                        const multiplier = sVal > 0 ? (eVal / sVal).toFixed(1) : '1.0'

                        return (
                          <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4">
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Growth Multiplier</p>
                            <p className="text-3xl font-extrabold text-primary leading-none mb-1">{multiplier}x</p>
                            <p className="text-[10px] text-muted-foreground font-medium">Estimated salary increase from start to endpoint</p>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

      </div>

      {/* Slide-In Milestone Study Guide / Project Blueprint Drawer Modal */}
      <AnimatePresence>
        {guideModalOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            
            {/* Modal backdrop background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !guideLoading && setGuideModalOpen(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            />

            {/* Sidebar drawer container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-card border-l border-border shadow-2xl h-full flex flex-col overflow-hidden z-10"
            >
              {/* Drawer header */}
              <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/40">
                <div>
                  <span className="text-[10px] bg-primary/15 border border-primary/25 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    AI Roadmap Blueprint
                  </span>
                  <h3 className="text-lg font-extrabold text-foreground mt-1">
                    {activeGuideRole} Blueprint
                  </h3>
                </div>
                <button
                  disabled={guideLoading}
                  onClick={() => setGuideModalOpen(false)}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer body details scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                
                {/* Generating guide status */}
                {guideLoading && (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center text-primary relative">
                      <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">Synthesizing Blueprint Guide...</h4>
                      <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                        Generating customized 3-week study guide and project structures for this role...
                      </p>
                    </div>
                  </div>
                )}

                {/* Guide generated results loaded */}
                {!guideLoading && guideData && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    
                    {/* Section 1: Study plan week-by-week */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                        <Calendar className="w-4.5 h-4.5 text-indigo-400" />
                        Customized 3-Week Study Syllabus
                      </h4>

                      <div className="space-y-3">
                        {guideData.studyPlan?.map((week, idx) => (
                          <div
                            key={idx}
                            className="bg-muted/30 border border-border/60 rounded-2xl p-4 space-y-2 hover:border-border transition"
                          >
                            <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                              {week.week}
                            </span>
                            <ul className="space-y-1 pl-4 list-disc text-xs text-foreground/80 font-medium">
                              {week.topics?.map((topic, tIdx) => (
                                <li key={tIdx}>{topic}</li>
                              ))}
                            </ul>
                            <div className="pt-2 border-t border-border/40 text-[10px] text-muted-foreground flex items-center gap-1">
                              <Play className="w-3.5 h-3.5 text-indigo-400" />
                              Resource: <strong className="text-foreground/75 truncate">{week.recommendedResource}</strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 2: Custom portfolio project blueprint */}
                    {guideData.projectBlueprint && (
                      <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20 rounded-3xl p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-indigo-500/10 pb-3">
                          <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                            <Star className="w-4.5 h-4.5 text-amber-500" />
                            Portfolio Project Blueprint
                          </h4>
                          <span className="text-[9px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                            Recommended
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-extrabold text-foreground text-sm">
                            {guideData.projectBlueprint.title}
                          </h5>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {guideData.projectBlueprint.description}
                          </p>
                        </div>

                        {/* Project features */}
                        <div className="space-y-2">
                          <p className="text-[10px] text-foreground font-bold uppercase tracking-wider">Key features to build:</p>
                          <ul className="space-y-1.5">
                            {guideData.projectBlueprint.features?.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2 text-xs text-foreground/85 font-medium">
                                <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Project Tech stack */}
                        <div className="space-y-2">
                          <p className="text-[10px] text-foreground font-bold uppercase tracking-wider">Recommended Tech stack:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {guideData.projectBlueprint.techStack?.map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-1 bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded-lg"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Section 3: Expert interview preparation QA */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                        <ClipboardList className="w-4.5 h-4.5 text-indigo-400" />
                        Targeted Interview Preparation Q&A
                      </h4>

                      <div className="space-y-3">
                        {guideData.interviewPreparation?.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-card border border-border rounded-2xl p-4 space-y-2 shadow-sm"
                          >
                            <p className="text-xs font-bold text-foreground flex items-start gap-1">
                              <span className="text-indigo-400 font-extrabold flex-shrink-0">Q:</span>
                              <span>{item.question}</span>
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed pl-3 border-l-2 border-primary/20 whitespace-pre-wrap">
                              {item.answer}
                            </p>
                            <div className="pt-2 flex justify-end">
                              <button
                                onClick={() => copyToClipboard(`Q: ${item.question}\nA: ${item.answer}`, `q-${idx}`)}
                                className="text-[10px] text-muted-foreground hover:text-primary transition flex items-center gap-1"
                              >
                                {copiedTextKey === `q-${idx}` ? (
                                  <><Check className="w-3 h-3 text-green-400" /> Copied</>
                                ) : (
                                  <><Copy className="w-3 h-3" /> Copy Question</>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                )}

              </div>

              {/* Drawer footer details */}
              <div className="px-6 py-4 border-t border-border bg-muted/40 flex justify-end">
                <button
                  disabled={guideLoading}
                  onClick={() => setGuideModalOpen(false)}
                  className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow hover:opacity-95 transition cursor-pointer"
                >
                  Close Blueprint
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
