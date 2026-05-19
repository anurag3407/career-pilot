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
      <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-sm">
        <p className="font-bold text-foreground mb-1">{payload[0]?.payload?.skill}</p>
        <p className="text-primary">Your Level: <span className="font-semibold">{payload[0]?.value}%</span></p>
        <p className="text-muted-foreground">Required: <span className="font-semibold">{payload[1]?.value}%</span></p>
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
      transition={{ delay: index * 0.07 }}
      className={`rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
          <span className="font-semibold text-foreground">{skill.skill}</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
            {skill.priority}
          </span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border/50 pt-3 space-y-3">
              <p className="text-sm text-muted-foreground">{skill.reason}</p>
              {skill.resources?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Learning Resources
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skill.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-background/60 border border-border hover:border-primary/50 text-foreground transition group"
                      >
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${RESOURCE_TYPE_COLORS[res.type] || RESOURCE_TYPE_COLORS.Other}`}>
                          {res.type}
                        </span>
                        {res.title}
                        <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition" />
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
    <div className="min-h-screen bg-background">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-4">
            <BrainCircuit className="w-4 h-4" />
            AI Skills Gap Analyzer
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Know Your Skills Gap
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare your current skills against your target role and get a personalized learning roadmap powered by AI.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border shadow-xl mb-10 overflow-hidden"
        >
          <div className="bg-violet-600 px-6 py-4 flex items-center gap-2 text-white font-semibold">
            <BrainCircuit className="w-5 h-5" />
            Enter Your Details
          </div>
          <form onSubmit={handleAnalyze} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <Zap className="w-4 h-4 text-violet-400" />
                  Your Current Skills
                </label>
                <textarea
                  className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition h-44 resize-none text-foreground placeholder:text-muted-foreground text-sm"
                  placeholder="e.g. React, Node.js, REST APIs, Git, basic Python, 2 years frontend experience..."
                  required
                  value={formData.userSkills}
                  onChange={(e) => setFormData({ ...formData, userSkills: e.target.value })}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <Target className="w-4 h-4 text-violet-400" />
                  Target Role
                </label>
                <textarea
                  className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition h-44 resize-none text-foreground placeholder:text-muted-foreground text-sm"
                  placeholder="e.g. Senior Full Stack Engineer at a fintech startup, focusing on React, TypeScript, Microservices, AWS..."
                  required
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              id="analyze-skills-btn"
              className="w-full md:w-auto px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing your profile...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze My Skills
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Summary bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Overall match */}
                <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Overall Match</p>
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                    <circle
                      cx="40" cy="40" r="32" fill="none" strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 32}`}
                      strokeDashoffset={`${2 * Math.PI * 32 * (1 - results.overallMatch / 100)}`}
                      strokeLinecap="round"
                      className={`transition-all duration-700 ${matchRingColor}`}
                    />
                  </svg>
                  <p className={`text-4xl font-bold -mt-16 ${matchColor}`}>{results.overallMatch}%</p>
                  <p className="text-xs text-muted-foreground mt-10">Profile Readiness</p>
                </div>

                {/* Summary text */}
                <div className="md:col-span-2 bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-400" /> AI Analysis Summary
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{results.summary}</p>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Your Existing Strengths
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {results.existingStrengths?.map((s, i) => (
                        <span key={i} className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/30 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Radar Chart */}
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-violet-400" /> Skills Radar Chart
                </h2>
                <ResponsiveContainer width="100%" height={360}>
                  <RadarChart data={results.radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <PolarGrid stroke="rgba(255,255,255,0.07)" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'transparent' }} />
                    <Radar
                      name="Your Level"
                      dataKey="userLevel"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.35}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Required"
                      dataKey="required"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.12}
                      strokeWidth={2}
                      strokeDasharray="5 3"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span className="text-xs font-medium text-muted-foreground">{value}</span>
                      )}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Missing Skills */}
              {results.missingSkills?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-violet-400" /> Skills to Develop (Priority Ranked)
                  </h2>
                  <div className="space-y-3">
                    {results.missingSkills.map((skill, i) => (
                      <SkillCard key={i} skill={skill} index={i} />
                    ))}
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
