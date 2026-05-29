import { motion as Motion } from 'framer-motion';
import { getScoreColorTier, getScoreLabel } from '../../utils/resumeAnalyzer';

const TIER_STYLES = {
  red: {
    ring: '#ef4444',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
  },
  yellow: {
    ring: '#eab308',
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
  },
  green: {
    ring: '#22c55e',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
  },
};

export default function ScoreCard({ score, breakdown }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score ?? 0)));
  const tier = getScoreColorTier(safeScore);
  const styles = TIER_STYLES[tier];
  const label = getScoreLabel(safeScore);

  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (safeScore / 100) * circumference;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-6 sm:p-8 ${styles.bg} ${styles.border}`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-8">
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
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
            <Motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              stroke={styles.ring}
              fill="transparent"
              r={radius}
              cx={size / 2}
              cy={size / 2}
              style={{ strokeDasharray: circumference }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className={`text-5xl font-bold ${styles.text}`}
            >
              {safeScore}
            </Motion.span>
            <span className="text-xs text-muted-foreground mt-0.5">/ 100</span>
          </div>
        </div>

        <div className="text-center sm:text-left flex-1">
          <p className={`text-3xl font-bold ${styles.text}`}>{label}</p>
          <p className="text-muted-foreground mt-1">Resume Strength Score</p>

          {breakdown && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: 'Sections', value: breakdown.sections, max: 30 },
                { label: 'ATS', value: breakdown.ats, max: 25 },
                { label: 'Keywords', value: breakdown.keywords, max: 25 },
                { label: 'Formatting', value: breakdown.formatting, max: 20 },
              ].map((item) => (
                <div key={item.label} className="bg-background/50 rounded-lg px-3 py-2 border border-border/50">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">
                    {item.value}
                    <span className="text-muted-foreground font-normal"> / {item.max}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Motion.div>
  );
}
