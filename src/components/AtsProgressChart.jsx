import React, { useState, useEffect } from 'react'
import { resumeApi } from '../services/api'
import { Sparkles, TrendingUp, AlertCircle, ArrowUpRight, BarChart3, Star, Layers } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function AtsProgressChart({ resumeId }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredPoint, setHoveredPoint] = useState(null)

  useEffect(() => {
    fetchHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const res = await resumeApi.getAtsHistory(resumeId)
      setHistory(res.data || [])
    } catch (err) {
      toast.error('Failed to load ATS progression history')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-2xl p-10 text-center text-muted-foreground bg-card/10">
        <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-55" />
        <p className="text-sm mb-2">No ATS score history logged yet.</p>
        <p className="text-xs">Analyze your resume in the preview tab to start tracking progress!</p>
      </div>
    )
  }

  // Calculate Key metrics
  const startingScore = history[0].atsScore
  const currentScore = history[history.length - 1].atsScore
  const totalDifference = currentScore - startingScore
  const totalOptimizations = history.length
  
  // Latest log data
  const latestLog = history[history.length - 1]
  const breakdown = latestLog.scoreBreakdown || {}
  const keywordScore = breakdown.keywordMatch ?? breakdown.projects ?? 0
  const formattingScore = breakdown.formatting ?? breakdown.summary ?? 0
  const experienceScore = breakdown.experienceRelevance ?? breakdown.experience ?? 0
  const skillsScore = breakdown.skillsAlignment ?? breakdown.skills ?? 0
  const educationScore = breakdown.educationMatch ?? breakdown.education ?? 0

  // Chart Dimensions
  const width = 600
  const height = 240
  const paddingLeft = 40
  const paddingRight = 20
  const paddingTop = 20
  const paddingBottom = 35

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom

  // Coordinates calculation
  const getCoordinates = () => {
    if (history.length === 0) return []
    if (history.length === 1) {
      return [{ x: paddingLeft + chartWidth / 2, y: paddingTop + chartHeight - (history[0].atsScore / 100) * chartHeight, ...history[0] }]
    }

    return history.map((point, index) => {
      const x = paddingLeft + (index / (history.length - 1)) * chartWidth
      const y = paddingTop + chartHeight - (point.atsScore / 100) * chartHeight
      return { x, y, ...point }
    })
  }

  const points = getCoordinates()

  // Generate SVG path string
  const generatePath = () => {
    if (points.length < 2) return ''
    return points.reduce((path, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`
    }, '')
  }

  // Generate path string for gradient area underneath
  const generateAreaPath = () => {
    if (points.length < 2) return ''
    const linePath = generatePath()
    return `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
  }

  const linePath = generatePath()
  const areaPath = generateAreaPath()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card/30 border border-border p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Starting Score</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold text-foreground">{startingScore}</span>
            <span className="text-xs text-muted-foreground">pts</span>
          </div>
        </div>

        <div className="bg-card/30 border border-border p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Current ATS Score</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold text-primary">{currentScore}</span>
            <span className="text-xs text-muted-foreground">pts</span>
          </div>
        </div>

        <div className="bg-card/30 border border-border p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Total Improvement</span>
          <div className="flex items-center gap-1.5 mt-2">
            <span className={`text-2xl font-bold ${totalDifference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalDifference >= 0 ? `+${totalDifference}` : totalDifference}
            </span>
            {totalDifference > 0 && <ArrowUpRight className="w-5 h-5 text-green-400" />}
          </div>
        </div>

        <div className="bg-card/30 border border-border p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Optimizations Logged</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-2xl font-bold text-foreground">{totalOptimizations}</span>
            <span className="text-xs text-muted-foreground">runs</span>
          </div>
        </div>
      </div>

      {/* Main Chart Panel */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* SVG Progress Graph */}
        <div className="lg:col-span-2 bg-card/40 border border-border rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-primary" />
              ATS Score Progression
            </h4>
            <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-muted/60 border border-border/50">
              Interactive Hover
            </span>
          </div>

          <div className="relative w-full overflow-x-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map(val => {
                const y = paddingTop + chartHeight - (val / 100) * chartHeight
                return (
                  <g key={val}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={width - paddingRight}
                      y2={y}
                      stroke="var(--border)"
                      strokeWidth="0.5"
                      strokeDasharray="4,4"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 3}
                      fill="var(--muted-foreground)"
                      fontSize="9"
                      textAnchor="end"
                      fontWeight="bold"
                    >
                      {val}
                    </text>
                  </g>
                )
              })}

              {/* Horizontal Dates Label */}
              {points.map((p, idx) => (
                <text
                  key={idx}
                  x={p.x}
                  y={height - paddingBottom + 16}
                  fill="var(--muted-foreground)"
                  fontSize="8"
                  textAnchor="middle"
                >
                  {formatDate(p.createdAt)}
                </text>
              ))}

              {points.length > 1 && (
                <>
                  {/* Fill Area */}
                  <path d={areaPath} fill="url(#chartGradient)" />

                  {/* Line Path */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter="url(#glowEffect)"
                  />
                </>
              )}

              {/* Points */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.id === p.id ? "7" : "4.5"}
                    fill={hoveredPoint?.id === p.id ? "var(--primary)" : "var(--background)"}
                    stroke="var(--primary)"
                    strokeWidth="2.5"
                    style={{ transition: 'all 0.15s ease' }}
                    onMouseEnter={() => setHoveredPoint(p)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="cursor-pointer"
                  />
                </g>
              ))}
            </svg>
          </div>

          {/* Interactive Tooltip HUD */}
          <div className="mt-3 p-3 bg-muted/40 border border-border/80 rounded-xl min-h-[60px] flex items-center justify-between text-xs transition-all">
            {hoveredPoint ? (
              <div className="flex justify-between items-center w-full">
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">Role: {hoveredPoint.jobRole}</p>
                  <p className="text-muted-foreground text-[10px]">Analyzed: {new Date(hoveredPoint.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{hoveredPoint.atsScore}%</p>
                  <p className="text-[10px] text-muted-foreground">{hoveredPoint.improvementsCount} improvements suggested</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground italic text-center w-full">Hover over any graph point to inspect specific run details.</p>
            )}
          </div>
        </div>

        {/* Latest score category breakdown */}
        <div className="bg-card/40 border border-border rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-secondary" />
              Latest Category Levels
            </h4>

            <div className="space-y-3.5">
              {[
                { name: 'Keyword Match', score: keywordScore },
                { name: 'Formatting & Layout', score: formattingScore },
                { name: 'Experience Relevance', score: experienceScore },
                { name: 'Skills Alignment', score: skillsScore },
                { name: 'Education Alignment', score: educationScore },
              ].map((category, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{category.name}</span>
                    <span className="font-semibold text-foreground">{category.score}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.score}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${
                        category.score >= 80 ? 'bg-green-500' :
                        category.score >= 60 ? 'bg-yellow-500' :
                        category.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground leading-snug">
            <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Scores correspond to: <strong className="text-foreground">{latestLog.jobRole}</strong></span>
          </div>
        </div>
      </div>

      {/* Smart Resume Improvement Recommendations */}
      <div className="bg-card/40 border border-border rounded-2xl p-5">
        <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4.5 h-4.5 text-yellow-400" />
          Smart Recommendations & Insights
        </h4>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Trend Analysis
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {totalDifference > 0 ? (
                `Great work! Your ATS optimization efforts have resulted in a significant score surge of +${totalDifference} points, from initial ${startingScore} to ${currentScore}. Keep focusing on keyword density to hit 90+.`
              ) : totalDifference === 0 ? (
                `Your score has remained stable at ${currentScore}. Try targeting more specific industry keywords or enhancing the experience bullet points using STAR format to boost the score.`
              ) : (
                `Your score declined by ${Math.abs(totalDifference)} points, likely due to changing job roles or removal of key skills. Re-add relevant keywords to recover your score.`
              )}
            </p>
          </div>

          <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Target Optimization Areas
            </div>
            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1.5">
              {keywordScore < 80 && (
                <li>Keyword Match is at {keywordScore}%. Tailor resume to include missing target terms.</li>
              )}
              {experienceScore < 80 && (
                <li>Experience score is {experienceScore}%. Quantify achievements with metrics.</li>
              )}
              {skillsScore < 80 && (
                <li>Skills alignment is {skillsScore}%. Align core skills with job criteria.</li>
              )}
              {latestLog.missingKeywords && latestLog.missingKeywords.length > 0 && (
                <li>Missing Keywords: {latestLog.missingKeywords.slice(0, 4).join(', ')}</li>
              )}
              {keywordScore >= 80 && experienceScore >= 80 && skillsScore >= 80 && (
                <li>Your resume sections are highly optimized! Try adding custom sections or formatting tweaks.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
