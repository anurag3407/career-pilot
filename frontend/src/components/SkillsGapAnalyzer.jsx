import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import {
  Sparkles, BrainCircuit, Target, BookOpen, ArrowUpRight,
  ChevronDown, ChevronUp, Zap, TrendingUp, CheckCircle2, AlertCircle
} from 'lucide-react';
import { enhanceApi } from '../services/api';

const PRIORITY_CONFIG = {
  High:   { color: 'text-red-400',    bg: 'bg-red-500/10',   border: 'border-red-500/30',   dot: 'bg-red-400'   },
  Medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
  Low:    { color: 'text-green-400',  bg: 'bg-green-500/10', border: 'border-green-500/30', dot: 'bg-green-400'  },
};

const RESOURCE_TYPE_COLORS = {
  Course:  'bg-blue-500/20 text-blue-300',
  Article: 'bg-purple-500/20 text-purple-300',
  Video:   'bg-red-500/20 text-red-300',
  Docs:    'bg-green-500/20 text-green-300',
  Other:   'bg-gray-500/20 text-gray-300',
};

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl text-sm">
        <p className="font-bold text-white mb-2 text-base">{payload[0]?.payload?.skill}</p>
        <div className="flex justify-between items-center gap-6 mb-1">
          <span className="text-gray-400">Your Capability</span>
          <span className="text-violet-400 font-bold">{payload[0]?.value}%</span>
        </div>
        <div className="flex justify-between items-center gap-6">
          <span className="text-gray-400">Market Standard</span>
          <span className="text-cyan-400 font-bold">{payload[1]?.value}%</span>
        </div>
      </div>
    );
  }
  return null;
}

function SkillCard({ skill, index }) {
  const [open, setOpen] = useState(false);
  const cfg = PRIORITY_CONFIG[skill.priority] || PRIORITY_CONFIG.Low;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className={`relative group rounded-2xl overflow-hidden bg-black/40 border border-white/5 hover:border-white/20 transition-all duration-300 ${open ? 'shadow-[0_0_30px_rgba(255,255,255,0.05)]' : ''}`}
    >
      <div className={`absolute top-0 left-0 w-1.5 h-full ${cfg.dot}`} />
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-gradient-to-r hover:from-white/[0.03] hover:to-transparent transition-colors"
      >
        <div className="flex items-center gap-4 pl-2">
          <span className="font-semibold text-white text-lg tracking-wide">{skill.skill}</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border} tracking-wider uppercase`}>
            {skill.priority} Priority
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors">
          {open ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 border-t border-white/5 pt-4 space-y-5 bg-white/[0.01]">
              <p className="text-base text-gray-300 font-light leading-relaxed pl-2">{skill.reason}</p>
              {skill.resources?.length > 0 && (
                <div className="pl-2">
                  <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-violet-400" /> Recommended Learning Path
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {skill.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10 text-gray-200 transition-all group/link"
                      >
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${RESOURCE_TYPE_COLORS[res.type] || RESOURCE_TYPE_COLORS.Other}`}>
                          {res.type}
                        </span>
                        <span className="font-medium group-hover/link:text-white transition-colors">{res.title}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-gray-500 group-hover/link:text-violet-400 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const SkillsGapAnalyzer = () => {
  const [formData, setFormData] = useState({ userSkills: '', targetRole: '' });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const response = await enhanceApi.analyzeSkillsGap(formData)
      setResults(response)
    } catch (err) {
      console.error('Skills gap analysis error:', err)
      setError('Failed to analyze skills gap. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const matchColor =
    results?.overallMatch >= 75 ? 'text-green-400' :
    results?.overallMatch >= 50 ? 'text-yellow-400' : 'text-red-400';

  const matchRingColor =
    results?.overallMatch >= 75 ? 'stroke-green-400' :
    results?.overallMatch >= 50 ? 'stroke-yellow-400' : 'stroke-red-400';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden font-sans">
      {/* Premium Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-cyan-600/15 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] bg-fuchsia-600/15 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-violet-300 text-sm font-medium tracking-wide mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(139,92,246,0.15)]">
            <Sparkles className="w-4 h-4 text-violet-400" />
            AI-Powered Career Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Discover Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
              Skills Gap
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Map your current abilities against your dream role. Let our AI build a personalized, high-impact learning trajectory just for you.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative group mb-16 max-w-5xl mx-auto"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/30 to-cyan-600/30 rounded-[2rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-white/[0.02] backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-white/5 flex items-center gap-3 bg-white/[0.01]">
              <BrainCircuit className="w-6 h-6 text-violet-400" />
              <h2 className="text-xl font-semibold tracking-wide">Configure Analysis</h2>
            </div>
            
            <form onSubmit={handleAnalyze} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    Current Tech Stack & Skills
                  </label>
                  <textarea
                    className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all h-48 resize-none text-gray-100 placeholder:text-gray-600 text-base"
                    placeholder="e.g. React, Node.js, GraphQL, Docker, 3 years frontend experience, responsive design..."
                    required
                    value={formData.userSkills}
                    onChange={(e) => setFormData({ ...formData, userSkills: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Target className="w-4 h-4 text-fuchsia-400" />
                    Target Role & Industry
                  </label>
                  <textarea
                    className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all h-48 resize-none text-gray-100 placeholder:text-gray-600 text-base"
                    placeholder="e.g. Senior Full Stack Engineer at a fintech company, focusing on Next.js, Microservices, AWS..."
                    required
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  />
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-3 text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-10 py-4 bg-white text-black hover:bg-gray-100 font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Synthesizing Profile...
                    </>
                  ) : (
                    <>
                      Generate Readiness Report
                      <ArrowUpRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8 max-w-6xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Overall Match */}
                <div className="relative group rounded-[2rem] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/[0.01] border border-white/10 rounded-[2rem] backdrop-blur-xl" />
                  <div className="relative p-8 flex flex-col items-center justify-center text-center h-full">
                    <p className="text-sm text-gray-400 mb-6 font-medium tracking-wide uppercase">Match Score</p>
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-2xl" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <motion.circle
                          initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - results.overallMatch / 100) }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                          cx="50" cy="50" r="42" fill="none" strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 42}`}
                          strokeLinecap="round"
                          className={`${matchRingColor} drop-shadow-[0_0_10px_rgba(currentColor,0.5)]`}
                        />
                      </svg>
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        className={`text-5xl font-extrabold ${matchColor}`}
                      >
                        {results.overallMatch}%
                      </motion.span>
                    </div>
                    <p className="text-sm text-gray-400 mt-8">Overall Readiness</p>
                  </div>
                </div>

                {/* Summary text */}
                <div className="lg:col-span-2 relative rounded-[2rem] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 rounded-[2rem] backdrop-blur-xl" />
                  <div className="relative p-8 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-violet-400" /> Executive Summary
                      </h3>
                      <p className="text-gray-300 text-lg leading-relaxed mb-8 font-light">{results.summary}</p>
                    </div>
                    
                    <div className="bg-black/20 rounded-2xl p-5 border border-white/5">
                      <p className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Capitalize on these strengths
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {results.existingStrengths?.map((s, i) => (
                          <span key={i} className="px-4 py-2 text-sm rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium tracking-wide">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Radar Chart */}
              <div className="relative rounded-[2rem] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/[0.01] border border-white/10 rounded-[2rem] backdrop-blur-xl" />
                <div className="relative p-8">
                  <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <BrainCircuit className="w-6 h-6 text-cyan-400" /> 
                    Competency Radar
                  </h2>
                  <div className="w-full h-[450px] bg-black/20 rounded-3xl border border-white/5 pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={results.radarData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
                        <PolarAngleAxis
                          dataKey="skill"
                          tick={{ fill: '#a1a1aa', fontSize: 13, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'transparent' }} />
                        <Radar
                          name="Your Capability"
                          dataKey="userLevel"
                          stroke="#a855f7"
                          fill="url(#colorUser)"
                          fillOpacity={0.6}
                          strokeWidth={3}
                        />
                        <Radar
                          name="Market Standard"
                          dataKey="required"
                          stroke="#22d3ee"
                          fill="url(#colorRequired)"
                          fillOpacity={0.2}
                          strokeWidth={2}
                          strokeDasharray="4 4"
                        />
                        <defs>
                          <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2}/>
                          </linearGradient>
                          <linearGradient id="colorRequired" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                        <Legend
                          wrapperStyle={{ paddingTop: '20px' }}
                          formatter={(value) => <span className="text-sm font-medium text-gray-300 ml-1">{value}</span>}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Missing Skills */}
              {results.missingSkills?.length > 0 && (
                <div className="relative rounded-[2rem] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tl from-white/5 to-white/[0.01] border border-white/10 rounded-[2rem] backdrop-blur-xl" />
                  <div className="relative p-8">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                      <Target className="w-6 h-6 text-fuchsia-400" /> 
                      Strategic Growth Areas
                    </h2>
                    <p className="text-gray-400 mb-8 font-light">Focus on these prioritized competencies to maximize your role alignment.</p>
                    
                    <div className="space-y-4">
                      {results.missingSkills.map((skill, i) => (
                        <SkillCard key={i} skill={skill} index={i} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SkillsGapAnalyzer;
