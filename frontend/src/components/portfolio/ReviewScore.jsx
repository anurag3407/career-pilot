import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2, AlertCircle, TrendingUp, RefreshCw, BarChart2 } from 'lucide-react';

const MOCK_DATA = {
  overallScore: 84,
  metrics: [
    { name: 'Performance', score: 92 },
    { name: 'Accessibility', score: 88 },
    { name: 'Best Practices', score: 76 },
    { name: 'SEO', score: 95 },
    { name: 'Design Consistency', score: 68 },
  ],
  improvements: [
    { id: 1, text: 'Optimize 3 large hero images to WebP format', type: 'warning' },
    { id: 2, text: 'Add descriptive aria-labels to social links', type: 'success' },
    { id: 3, text: 'Increase contrast ratio on footer text', type: 'warning' },
    { id: 4, text: 'Minify custom CSS bundle', type: 'warning' },
  ]
};

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    
    const duration = 1000;
    const incrementTime = Math.max(16, duration / end);
    
    const timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
};

export default function ReviewScore() {
  const [hasRun, setHasRun] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState(null);

  const handleRunReview = () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setHasRun(false);
    
    // Simulate API delay
    setTimeout(() => {
      setData(MOCK_DATA);
      setHasRun(true);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStrokeColor = (score) => {
    if (score >= 80) return 'stroke-emerald-500';
    if (score >= 50) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  const circleRadius = 55;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const scoreOffset = data ? circleCircumference - (data.overallScore / 100) * circleCircumference : circleCircumference;

  return (
    <div className="col-span-full mt-6 bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-primary" />
            AI Portfolio Analysis
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Evaluate your portfolio's performance, SEO, and accessibility.
          </p>
        </div>
        
        <button
          onClick={handleRunReview}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isAnalyzing ? 'Analyzing...' : hasRun ? 'Re-run Analysis' : 'Run Review'}
        </button>
      </div>

      {!hasRun && !isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-xl border border-dashed border-border">
          <TrendingUp className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">Ready for Review</h3>
          <p className="text-sm text-muted-foreground max-w-md mt-2">
            Click the "Run Review" button to generate a comprehensive analysis of your deployed portfolio.
          </p>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium animate-pulse text-muted-foreground">Running comprehensive checks...</p>
        </div>
      )}

      {hasRun && data && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Score Gauge */}
          <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-xl border border-border">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Background Circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r={circleRadius}
                  className="stroke-muted fill-transparent"
                  strokeWidth="10"
                />
                {/* Foreground Animated Circle */}
                <motion.circle
                  cx="80"
                  cy="80"
                  r={circleRadius}
                  className={`${getStrokeColor(data.overallScore)} fill-transparent`}
                  strokeWidth="10"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circleCircumference }}
                  animate={{ strokeDashoffset: scoreOffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeDasharray={circleCircumference}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColor(data.overallScore)}`}>
                  <AnimatedNumber value={data.overallScore} />
                </span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Score</span>
              </div>
            </div>
          </div>

          {/* Metrics Breakdown */}
          <div className="space-y-4 flex flex-col justify-center">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-2">Category Breakdown</h3>
            {data.metrics.map((metric, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{metric.name}</span>
                  <span className="font-semibold text-foreground">{metric.score}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.score}%` }}
                    transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                    className={`h-full rounded-full ${
                      metric.score >= 80 ? 'bg-emerald-500' :
                      metric.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Actionable Checklist */}
          <div className="bg-muted/30 p-5 rounded-xl border border-border">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4">Improvement Checklist</h3>
            <ul className="space-y-3">
              {data.improvements.map((item) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + item.id * 0.1 }}
                  className="flex items-start gap-3 text-sm"
                >
                  {item.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  )}
                  <span className="text-foreground/90 leading-snug">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
