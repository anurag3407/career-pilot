import React, { useState, useEffect } from 'react'
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Map, 
  Sparkles, 
  Plus, 
  Play, 
  Trash2, 
  History, 
  Layers, 
  Award, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  ShieldAlert, 
  Gauge, 
  ChevronRight, 
  ChevronDown,
  Info
} from 'lucide-react'
import { resumeApi, careerSimulationApi } from '../services/api'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from '../hooks/useAuth'
const loadingSteps = [
  "Parsing candidate resume & metadata...",
  "Analyzing technical stack & missing technologies...",
  "Benchmarking experience & project complexity...",
  "Simulating automated recruitment pipeline rounds...",
  "Compiling hiring risk assessments...",
  "Synthesizing personalized learning roadmaps..."
]

export default function CareerSimulator() {
  const { user } = useAuth()
  const userId = user?._id || 'anon'
  
  const [resumes, setResumes] = useState([])
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState([])
  const [selectedResumeId, setSelectedResumeId] = useLocalStorage(`career_sim_resumeId_${userId}`, '')
  const [jobRole, setJobRole] = useLocalStorage(`career_sim_jobRole_${userId}`, '')
  const [experienceLevel, setExperienceLevel] = useLocalStorage(`career_sim_experienceLevel_${userId}`, 'entry')
  const [activeSimulation, setActiveSimulation] = useState(null)
  
  // UI states
  const [loading, setLoading] = useState(false)
  const [loadingStepIdx, setLoadingStepIdx] = useState(0)
  const [fetchingHistory, setFetchingHistory] = useState(true)
  const [activePipelineStageIdx, setActivePipelineStageIdx] = useState(0)
  const [viewingHistoryId, setViewingHistoryId] = useState(null)
  
  // Hovered state for stats graph
  const [hoveredPoint, setHoveredPoint] = useState(null)

  useEffect(() => {
    fetchResumesAndHistory()
  }, [])

  // Rotate loading steps
  useEffect(() => {
    let interval
    if (loading) {
      interval = setInterval(() => {
        setLoadingStepIdx(prev => (prev + 1) % loadingSteps.length)
      }, 2500)
    } else {
      setLoadingStepIdx(0)
    }
    return () => clearInterval(interval)
  }, [loading])

  const fetchResumesAndHistory = async () => {
    try {
      setFetchingHistory(true)
      const [resumesRes, historyRes, statsRes] = await Promise.all([
        resumeApi.getAll().catch(() => ({ data: [] })),
        careerSimulationApi.getAll().catch(() => ({ data: [] })),
        careerSimulationApi.getStats().catch(() => ({ data: [] }))
      ])

      const fetchedResumes = Array.isArray(resumesRes.data) 
        ? resumesRes.data 
        : (resumesRes.resumes || resumesRes.data?.resumes || [])
      setResumes(fetchedResumes)
      
      const fetchedHistory = historyRes.data || []
      setHistory(fetchedHistory)
      setStats(statsRes.data || [])

      if (fetchedResumes.length > 0) {
        setSelectedResumeId(prev => {
          if (prev && fetchedResumes.some(r => r._id === prev)) return prev;
          return fetchedResumes[0]._id;
        });
        setJobRole(prev => prev || fetchedResumes[0].jobRole || '');
      }
      
      if (fetchedHistory.length > 0) {
        setActiveSimulation(fetchedHistory[0])
      }
    } catch (err) {
      toast.error('Failed to load initial simulation history')
    } finally {
      setFetchingHistory(false)
    }
  }

  const handleResumeChange = (e) => {
    const rId = e.target.value
    setSelectedResumeId(rId)
    const selected = resumes.find(r => r._id === rId)
    if (selected && selected.jobRole) {
      setJobRole(selected.jobRole)
    }
  }

  const handleStartSimulation = async (e) => {
    e.preventDefault()
    if (!selectedResumeId) {
      toast.error('Please select a resume to analyze')
      return
    }
    if (!jobRole.trim()) {
      toast.error('Please enter a target job role')
      return
    }

    try {
      setLoading(true)
      const res = await careerSimulationApi.create({
        resumeId: selectedResumeId,
        jobRole: jobRole.trim(),
        experienceLevel
      })

      toast.success('Simulation assessment completed!')
      setActiveSimulation(res.data)
      
      // Refresh history & stats
      const [historyRes, statsRes] = await Promise.all([
        careerSimulationApi.getAll(),
        careerSimulationApi.getStats()
      ])
      setHistory(historyRes.data || [])
      setStats(statsRes.data || [])
      setActivePipelineStageIdx(0)
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Simulation generation failed. Ensure your API key is set.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSimulation = async (id, e) => {
    e.stopPropagation()
    const confirm = window.confirm('Are you sure you want to delete this simulation record?')
    if (!confirm) return

    try {
      await careerSimulationApi.delete(id)
      toast.success('Simulation deleted')
      
      setHistory(prev => {
        const updatedHistory = prev.filter(h => h._id !== id)
        
        // Update active simulation if deleted was active
        if (activeSimulation && activeSimulation._id === id) {
          setActiveSimulation(updatedHistory.length > 0 ? updatedHistory[0] : null)
          setActivePipelineStageIdx(0)
        }
        
        return updatedHistory
      })
      
      // Refresh stats
      const statsRes = await careerSimulationApi.getStats()
      setStats(statsRes.data || [])
    } catch (err) {
      toast.error('Failed to delete simulation')
    }
  }

  // SVG Coordinates calculation
  const getCoordinates = () => {
    if (stats.length === 0) return []
    const width = 500
    const height = 150
    const paddingLeft = 30
    const paddingRight = 10
    const paddingTop = 15
    const paddingBottom = 20

    const chartWidth = width - paddingLeft - paddingRight
    const chartHeight = height - paddingTop - paddingBottom

    if (stats.length === 1) {
      return [{ x: paddingLeft + chartWidth / 2, y: paddingTop + chartHeight - (stats[0].readinessScore / 100) * chartHeight, ...stats[0] }]
    }

    return stats.map((point, index) => {
      const x = paddingLeft + (index / (stats.length - 1)) * chartWidth
      const y = paddingTop + chartHeight - (point.readinessScore / 100) * chartHeight
      return { x, y, ...point }
    })
  }

  const chartPoints = getCoordinates()

  const generatePath = () => {
    if (chartPoints.length < 2) return ''
    return chartPoints.reduce((path, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`
    }, '')
  }

  const generateAreaPath = () => {
    if (chartPoints.length < 2) return ''
    const linePath = generatePath()
    const height = 150
    const paddingBottom = 20
    const chartHeight = height - 15 - paddingBottom
    return `${linePath} L ${chartPoints[chartPoints.length - 1].x} ${15 + chartHeight} L ${chartPoints[0].x} ${15 + chartHeight} Z`
  }

  const linePath = generatePath()
  const areaPath = generateAreaPath()

  const activeStage = activeSimulation?.pipelineStages?.[activePipelineStageIdx]

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            AI Career Simulator & Interview Pipeline
          </h1>
          <p className="text-muted-foreground mt-1">
            Simulate recruitment pipelines, discover skill gaps, inspect hiring risks, and review personalized learning roadmaps.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Panel: Launcher Form & Progression History */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Launcher Form */}
          <div className="bg-card/40 border border-border rounded-3xl p-6 glass shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-1.5">
              <Play className="w-5 h-5 text-primary" />
              Start New Simulation
            </h3>

            {resumes.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-border rounded-2xl bg-muted/10 space-y-3">
                <Info className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-xs text-muted-foreground">You must upload or build a resume first to run assessments.</p>
              </div>
            ) : (
              <form onSubmit={handleStartSimulation} className="space-y-4">
                <div>
                  <label htmlFor="resume-select" className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase">Select Resume</label>
                  <select
                    id="resume-select"
                    value={selectedResumeId}
                    onChange={handleResumeChange}
                    className="w-full px-3 py-2.5 bg-muted/40 border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    {resumes.map(r => (
                      <option key={r._id} value={r._id} className="bg-card">
                        {r.title || 'Untitled Resume'} ({r.jobRole || 'No target role'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="job-role-input" className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase">Target Job Role</label>
                  <input
                    id="job-role-input"
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="e.g. Fullstack Developer"
                    className="w-full px-3 py-2.5 bg-muted/40 border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                <fieldset>
                  <legend className="block text-xs font-bold text-muted-foreground mb-1.5 uppercase">Experience Level</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {['internship', 'entry', 'mid', 'senior'].map(lvl => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setExperienceLevel(lvl)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border capitalize transition-all ${
                          experienceLevel === lvl
                            ? 'bg-primary/20 border-primary text-primary shadow-sm shadow-primary/10'
                            : 'bg-muted/10 border-border text-muted-foreground hover:bg-muted/30'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold hover:opacity-95 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md shadow-primary/20"
                >
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  {loading ? "Simulating..." : "Generate AI Simulation"}
                </button>
              </form>
            )}
          </div>

          {/* Progress Tracker (Historical scores line chart) */}
          {stats.length > 0 && (
            <div className="bg-card/40 border border-border rounded-3xl p-6 glass shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <TrendingUp className="w-4.5 h-4.5 text-primary" />
                Interview Readiness Tracker
              </h3>

              <div className="relative">
                <svg viewBox="0 0 500 150" className="w-full h-auto">
                  <defs>
                    <linearGradient id="readyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Guide grids */}
                  {[0, 50, 100].map(val => {
                    const y = 15 + 115 - (val / 100) * 115
                    return (
                      <line
                        key={val}
                        x1="30"
                        y1={y}
                        x2="490"
                        y2={y}
                        stroke="var(--border)"
                        strokeWidth="0.5"
                        strokeDasharray="4,4"
                      />
                    )
                  })}

                  {chartPoints.length > 1 && (
                    <>
                      <path d={areaPath} fill="url(#readyGrad)" />
                      <path
                        d={linePath}
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </>
                  )}

                  {chartPoints.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r={(hoveredPoint?.id === p.id || hoveredPoint?._id === p._id) ? "6" : "3.5"}
                      fill="var(--background)"
                      stroke="var(--primary)"
                      strokeWidth="2"
                      style={{ transition: 'all 0.15s ease' }}
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="cursor-pointer"
                    />
                  ))}
                </svg>

                {/* HUD HUD tooltip */}
                <div className="mt-2 p-2 bg-muted/40 border border-border rounded-xl text-center min-h-[45px] text-xs text-muted-foreground">
                  {hoveredPoint ? (
                    <p>
                      <strong>{hoveredPoint.jobRole}</strong>: <span className="text-primary font-bold">{hoveredPoint.readinessScore}%</span> on {new Date(hoveredPoint.createdAt).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="italic">Hover over timeline nodes to inspect past readiness runs.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Progression History List */}
          <div className="bg-card/40 border border-border rounded-3xl p-6 glass shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <History className="w-4.5 h-4.5 text-secondary" />
              Simulation History
            </h3>

            {fetchingHistory ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-full animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-4">No simulation history recorded.</p>
            ) : (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto scrollbar-hide">
                {history.map(item => {
                  const isActive = activeSimulation?._id === item._id
                  return (
                    <div
                      key={item._id}
                      onClick={() => {
                        setActiveSimulation(item)
                        setActivePipelineStageIdx(0)
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        isActive
                          ? 'bg-primary/10 border-primary shadow-sm'
                          : 'bg-muted/10 border-border/80 hover:bg-muted/30 hover:border-border'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">{item.jobRole}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()} • <span className="capitalize">{item.experienceLevel}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                          item.readinessScore >= 80 ? 'bg-green-500/10 text-green-400' :
                          item.readinessScore >= 60 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {item.readinessScore}%
                        </span>
                        <button
                          onClick={(e) => handleDeleteSimulation(item._id, e)}
                          className="p-1 rounded bg-transparent hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Panel: Simulation Detailed Visualizations */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* Loading Overlay */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-card/65 border border-border rounded-3xl p-12 flex flex-col items-center justify-center min-h-[500px] text-center glass relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 opacity-50" />
                <div className="space-y-6 z-10">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto" />
                    <Brain className="w-8 h-8 text-primary absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">Running Assessment Simulation</h3>
                    <p className="text-sm font-semibold text-primary/80 animate-pulse">{loadingSteps[loadingStepIdx]}</p>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    We parse your resume experience levels, technical skills alignments, and project profiles, and model them against targeted market role demands.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Simulated Data Dashboard */}
            {!loading && activeSimulation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                
                {/* Dashboard Summary Header Banner */}
                <div className="bg-card/40 border border-border rounded-3xl p-6 glass shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                  <div className="space-y-1 z-10 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary uppercase rounded-full">
                        {activeSimulation.experienceLevel}
                      </span>
                      <span className="text-xs text-muted-foreground font-semibold">
                        Assessed on {new Date(activeSimulation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{activeSimulation.jobRole}</h2>
                    <p className="text-xs text-muted-foreground">Simulated pipeline overview based on resume insights</p>
                  </div>

                  <div className="flex items-center gap-4 bg-muted/20 border border-border p-4 rounded-2xl z-10">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-semibold">Interview Readiness</p>
                      <p className="text-3xl font-extrabold text-primary">{activeSimulation.readinessScore}%</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Gauge className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>

                {/* 1. Hiring Pipeline simulated track */}
                {activeSimulation.pipelineStages && activeSimulation.pipelineStages.length > 0 && (
                  <div className="bg-card/40 border border-border rounded-3xl p-6 glass shadow-xl space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
                        <Layers className="w-5 h-5 text-primary" />
                        Hiring Pipeline Simulation
                      </h3>
                      <p className="text-xs text-muted-foreground">Select a recruitment stage to inspect required skills, weak points, and suggestions.</p>
                    </div>

                    {/* Pipeline track layout */}
                    <div className="relative">
                      {/* Connection Line */}
                      <div className="absolute top-6 left-6 right-6 h-1 bg-border hidden md:block z-0" />
                      
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative z-10">
                        {activeSimulation.pipelineStages.map((stage, idx) => {
                          const isActive = activePipelineStageIdx === idx
                          return (
                            <button
                              key={stage.stageName}
                              type="button"
                              onClick={() => setActivePipelineStageIdx(idx)}
                              className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-primary/10 border-primary shadow'
                                  : 'bg-muted/10 border-border hover:bg-muted/20'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                                isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border border-border'
                              }`}>
                                {idx + 1}
                              </div>
                              <span className="text-[10px] font-extrabold text-foreground truncate w-full">{stage.stageName}</span>
                              <span className={`text-[10px] font-bold mt-1 ${
                                stage.successProbability >= 80 ? 'text-green-400' :
                                stage.successProbability >= 60 ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {stage.successProbability}% pass
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Active Stage Detail Panel */}
                    {activeStage && (
                      <div className="p-5 bg-muted/20 border border-border/80 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-border/60 pb-3">
                          <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            Stage {activePipelineStageIdx + 1}: {activeStage.stageName}
                          </h4>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                            activeStage.successProbability >= 80 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            activeStage.successProbability >= 60 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            Success Probability: {activeStage.successProbability}%
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-secondary" /> Required Skills & Knowledge
                            </p>
                            {activeStage.requiredSkills && activeStage.requiredSkills.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {activeStage.requiredSkills.map(s => (
                                  <span key={s} className="text-[10px] px-2 py-0.5 bg-muted border border-border/60 rounded text-foreground">{s}</span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[10px] text-muted-foreground italic">No specific skills listed.</p>
                            )}

                            <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1 mt-4">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Detected Weak Points
                            </p>
                            {activeStage.weakPoints && activeStage.weakPoints.length > 0 ? (
                              <ul className="list-disc list-inside text-[11px] text-muted-foreground space-y-1">
                                {activeStage.weakPoints.map(wp => (
                                  <li key={wp}>{wp}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-[10px] text-muted-foreground italic">No immediate weak points detected.</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                              <Award className="w-3.5 h-3.5 text-yellow-400" /> Improvement Suggestions
                            </p>
                            {activeStage.suggestions && activeStage.suggestions.length > 0 ? (
                              <ul className="list-disc list-inside text-[11px] text-muted-foreground space-y-1.5">
                                {activeStage.suggestions.map(s => (
                                  <li key={s} className="leading-normal">{s}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-[10px] text-muted-foreground italic">No immediate improvement suggestions.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Skill Gap Heatmap Panel */}
                {activeSimulation.skillGap && (
                  <div className="bg-card/40 border border-border rounded-3xl p-6 glass shadow-xl space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
                        <Layers className="w-5 h-5 text-secondary" />
                        Skill Gap Heatmap & Depth Analysis
                      </h3>
                      <p className="text-xs text-muted-foreground">Benchmarks your technical credentials against role expectations.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      
                      {/* Depth circular progress or indicator */}
                      <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-muted/10 border border-border rounded-2xl text-center">
                        <span className="text-xs font-semibold text-muted-foreground">Project Complexity Depth</span>
                        
                        <div className="relative w-24 h-24 my-3 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="48"
                              cy="48"
                              r="38"
                              stroke="var(--border)"
                              strokeWidth="8"
                              fill="transparent"
                            />
                            <circle
                              cx="48"
                              cy="48"
                              r="38"
                              stroke="var(--primary)"
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 38}
                              strokeDashoffset={2 * Math.PI * 38 * (1 - (activeSimulation.skillGap.projectDepth || 0) / 100)}
                              strokeLinecap="round"
                              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                            />
                          </svg>
                          <span className="absolute text-lg font-extrabold text-foreground">{activeSimulation.skillGap.projectDepth || 0}%</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground px-2">Evaluates the architecture complexity of your listed projects.</p>
                      </div>

                      {/* Pill grids */}
                      <div className="md:col-span-2 space-y-4">
                        <div className="space-y-1.5">
                          <p className="text-xs font-bold text-green-400 uppercase">Strong Matching Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {activeSimulation.skillGap.strongSkills && activeSimulation.skillGap.strongSkills.length > 0 ? (
                              activeSimulation.skillGap.strongSkills.map(s => (
                                <span key={s} className="text-[10px] font-bold px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full">{s}</span>
                              ))
                            ) : (
                              <p className="text-xs text-muted-foreground italic">None identified.</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-xs font-bold text-red-400 uppercase">Missing Tech stack/gaps</p>
                          <div className="flex flex-wrap gap-1">
                            {activeSimulation.skillGap.missingTechnologies && activeSimulation.skillGap.missingTechnologies.length > 0 ? (
                              activeSimulation.skillGap.missingTechnologies.map(s => (
                                <span key={s} className="text-[10px] font-bold px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full">{s}</span>
                              ))
                            ) : (
                              <p className="text-xs text-muted-foreground italic">None identified.</p>
                            )}
                          </div>
                        </div>

                        {activeSimulation.skillGap.communicationGaps && activeSimulation.skillGap.communicationGaps.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-muted-foreground uppercase">Soft Skills & Communication Gaps</p>
                            <ul className="list-disc list-inside text-[11px] text-muted-foreground">
                              {activeSimulation.skillGap.communicationGaps.map(g => (
                                <li key={g}>{g}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. AI Career Roadmap Panel */}
                {activeSimulation.roadmap && activeSimulation.roadmap.length > 0 && (
                  <div className="bg-card/40 border border-border rounded-3xl p-6 glass shadow-xl space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
                        <Map className="w-5 h-5 text-primary" />
                        AI-Generated Preparation Roadmap
                      </h3>
                      <p className="text-xs text-muted-foreground">Step-by-step career path alignment to bridge your identified knowledge gaps.</p>
                    </div>

                    <div className="relative border-l border-border/80 pl-6 ml-3 space-y-6 py-2">
                      {activeSimulation.roadmap.map((step, idx) => (
                        <div key={idx} className="relative group">
                          {/* Chrono timeline node dot */}
                          <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />

                          <div className="bg-muted/10 border border-border/80 hover:border-primary/20 p-4 rounded-2xl transition-all shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-2 mb-3">
                              <h4 className="text-sm font-extrabold text-foreground">{step.phase}</h4>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <p className="text-xs font-bold text-muted-foreground uppercase">Skills to Acquire</p>
                                <div className="flex flex-wrap gap-1">
                                  {step.skillsToLearn?.map(s => (
                                    <span key={s} className="text-[10px] px-2 py-0.5 bg-muted rounded border border-border/60 text-foreground">{s}</span>
                                  ))}
                                </div>

                                {step.certifications && step.certifications.length > 0 && (
                                  <>
                                    <p className="text-xs font-bold text-muted-foreground uppercase mt-3">Target Certifications/Paths</p>
                                    <ul className="list-disc list-inside text-[10px] text-muted-foreground">
                                      {step.certifications.map(c => (
                                        <li key={c}>{c}</li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                              </div>

                              <div className="space-y-2">
                                <p className="text-xs font-bold text-muted-foreground uppercase">Recommended Action Projects</p>
                                {step.recommendedProjects && step.recommendedProjects.length > 0 ? (
                                  <div className="space-y-2">
                                    {step.recommendedProjects.map((p, pIdx) => (
                                      <div key={pIdx} className="p-2 bg-card/60 border border-border/60 rounded-xl space-y-1">
                                        <p className="text-xs font-bold text-foreground flex items-center gap-1">
                                          <Briefcase className="w-3.5 h-3.5 text-primary" /> {p.title}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground leading-normal">{p.description}</p>
                                        {p.techStack && p.techStack.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {p.techStack.map(ts => (
                                              <span key={ts} className="text-[8px] px-1 py-0.2 bg-muted text-muted-foreground rounded">{ts}</span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-[10px] text-muted-foreground italic">Focus fully on technical revision.</p>
                                )}

                                {step.prepStrategy && (
                                  <p className="text-[10px] text-muted-foreground mt-3 leading-normal">
                                    <strong>Prep Strategy:</strong> {step.prepStrategy}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Risk Analysis Panel */}
                {activeSimulation.riskAnalysis && activeSimulation.riskAnalysis.length > 0 && (
                  <div className="bg-card/40 border border-border rounded-3xl p-6 glass shadow-xl space-y-6">
                    <div>
                      <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
                        <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
                        Hiring & Rejection Risk Analysis
                      </h3>
                      <p className="text-xs text-muted-foreground">Preemptively points out areas where hiring managers might reject your application.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {activeSimulation.riskAnalysis.map(risk => (
                        <div key={risk.riskName} className="p-4 bg-muted/10 border border-border hover:border-red-500/20 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-foreground uppercase">{risk.riskName}</h4>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              risk.severity === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                              risk.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                            }`}>
                              {risk.severity} Risk
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-normal">
                            <strong>Reason:</strong> {risk.reason}
                          </p>
                          <p className="text-[11px] text-primary/80 leading-normal">
                            <strong>Mitigation:</strong> {risk.mitigation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
            )}

            {/* Empty State when no assessment is loaded */}
            {!loading && !activeSimulation && (
              <div className="bg-card/40 border border-dashed border-border rounded-3xl p-12 text-center text-muted-foreground bg-card/10 flex flex-col items-center justify-center min-h-[450px]">
                <Brain className="w-16 h-16 mx-auto mb-4 opacity-55 text-primary" />
                <h3 className="text-lg font-bold text-foreground">No assessment loaded</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
                  Select an uploaded resume and input your target job role in the left configuration panel to run the AI simulation.
                </p>
              </div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
