import { motion } from 'framer-motion'
import { CheckCircle, Lightbulb, RefreshCw } from 'lucide-react'

const getScoreColor = (score) => {
  if (score >= 70) return { bar: 'bg-green-500', text: 'text-green-400', ring: '#22c55e' }
  if (score >= 40) return { bar: 'bg-yellow-500', text: 'text-yellow-400', ring: '#eab308' }
  return { bar: 'bg-red-500', text: 'text-red-400', ring: '#ef4444' }
}

const ScoreRing = ({ score }) => {
  const size = 140
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference
  const { ring } = getScoreColor(score)

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          strokeWidth={strokeWidth}
          stroke="currentColor"
          className="text-muted-foreground/20"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={ring}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="text-4xl font-bold text-foreground"
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground mt-0.5">/ 100</span>
      </div>
    </div>
  )
}

const SectionBar = ({ section, score, feedback, index }) => {
  const { bar, text } = getScoreColor(score)
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index }}
      className="space-y-1"
    >
      <div className="flex justify-between text-sm">
        <span className="text-foreground capitalize font-medium">{section}</span>
        <span className={`font-semibold ${text}`}>{score}</span>
      </div>
      <div className="h-2 bg-card rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay: 0.15 * index, ease: 'easeOut' }}
          className={`h-full rounded-full ${bar}`}
        />
      </div>
      <p className="text-xs text-muted-foreground">{feedback}</p>
    </motion.div>
  )
}

export default function ResumeScore({ data, onRescore }) {
  if (!data) return null

  const { overallScore, sections, topSuggestions } = data
  const { text: scoreText } = getScoreColor(overallScore)

  const label =
    overallScore >= 80 ? 'Excellent!' :
    overallScore >= 60 ? 'Good Progress' :
    overallScore >= 40 ? 'Needs Work' :
    'Major Improvements Needed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Overall Score */}
      <div className="bg-background/50 border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <ScoreRing score={overallScore} />
        <div className="text-center sm:text-left">
          <p className={`text-2xl font-bold ${scoreText}`}>{label}</p>
          <p className="text-muted-foreground text-sm mt-1">Overall Resume Score</p>
          {onRescore && (
            <button type="button"
              onClick={onRescore}
              className="mt-3 text-sm text-primary hover:text-primary/80 flex items-center gap-1 mx-auto sm:mx-0"
            >
              <RefreshCw className="w-4 h-4" />
              Re-score
            </button>
          )}
        </div>
      </div>

      {/* Section Breakdown */}
      {sections && (
        <div className="bg-background/50 border border-border rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-semibold text-foreground">Section Breakdown</h3>
          {Object.entries(sections).map(([section, { score, feedback }], i) => (
            <SectionBar key={section} section={section} score={score} feedback={feedback} index={i} />
          ))}
        </div>
      )}

      {/* Suggestions */}
      {topSuggestions?.length > 0 && (
        <div className="bg-background/50 border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Top Suggestions
          </h3>
          <ul className="space-y-3">
            {topSuggestions.map((tip, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground text-sm">{tip}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}