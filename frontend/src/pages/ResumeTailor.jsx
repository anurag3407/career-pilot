import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Sparkles, Loader2, Check, X, ArrowRight, ChevronDown, Lightbulb } from 'lucide-react';

function ScoreRing({ score }) {
  const circumference = Math.PI * 120;
  const filled = (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="60" fill="none" stroke="var(--border)" strokeWidth="12" />
        <motion.circle
          cx="80" cy="80" r="60" fill="none"
          stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${filled} ${circumference - filled}` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground font-medium">Match Score</span>
      </div>
    </div>
  );
}

export default function ResumeTailor() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedBullet, setExpandedBullet] = useState(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return setError('Please paste your resume text');
    if (!jobDescription.trim()) return setError('Please paste the job description');

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { auth } = await import('../config/firebase');
      const user = auth?.currentUser;
      if (!user) throw new Error('Not authenticated');

      const token = await user.getIdToken();
      const API_BASE = import.meta.env.VITE_API_BASE || '/api';

      const response = await fetch(`${API_BASE}/resume-tailor/analyze`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to analyze');
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container py-8 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Resume Tailor</h1>
            <p className="text-muted-foreground text-sm">Match your resume to any job description with AI precision</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="premium-card p-5">
          <label className="block text-sm font-semibold text-foreground mb-2">Your Resume *</label>
          <textarea
            id="resume-tailor-resume"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your full resume text here..."
            rows={12}
            className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="premium-card p-5">
          <label className="block text-sm font-semibold text-foreground mb-2">Job Description *</label>
          <textarea
            id="resume-tailor-jd"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the target job description here..."
            rows={12}
            className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-sm"
          />
        </motion.div>
      </div>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm mb-4">{error}</motion.p>
      )}

      <button
        id="resume-tailor-analyze-btn"
        onClick={handleAnalyze}
        disabled={loading}
        className="px-8 py-3 rounded-xl font-semibold text-white transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer hover:scale-[1.02] active:scale-[0.98] mb-8"
        style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
        {loading ? 'Analyzing...' : 'Analyze Match'}
      </button>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-16">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Target className="w-7 h-7 text-white animate-pulse" />
            </div>
            <p className="text-muted-foreground font-medium text-sm">Comparing your resume against the job description...</p>
            <div className="mt-4 w-48 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #10b981, #059669)' }}
                initial={{ width: '0%' }} animate={{ width: '85%' }} transition={{ duration: 6, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {result && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="premium-card p-6 flex flex-col items-center justify-center">
              <ScoreRing score={result.matchScore} />
              <p className="text-sm text-muted-foreground mt-3 text-center">{result.summary}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card p-6">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" /> Matched Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.matchedKeywords?.map((kw, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-500/10 text-green-600 border border-green-500/20">
                    {kw}
                  </span>
                ))}
                {(!result.matchedKeywords || result.matchedKeywords.length === 0) && (
                  <p className="text-muted-foreground text-sm">No matched keywords found</p>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card p-6">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <X className="w-4 h-4 text-red-500" /> Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords?.map((kw, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
                    {kw}
                  </span>
                ))}
                {(!result.missingKeywords || result.missingKeywords.length === 0) && (
                  <p className="text-muted-foreground text-sm">No missing keywords — great match!</p>
                )}
              </div>
            </motion.div>
          </div>

          {result.tailoredBullets && result.tailoredBullets.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="premium-card p-6 mb-8">
              <h3 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" /> Tailored Bullet Points
              </h3>
              <div className="space-y-4">
                {result.tailoredBullets.map((bullet, i) => {
                  const isExpanded = expandedBullet === i;
                  return (
                    <div key={i} className="rounded-xl border border-border overflow-hidden">
                      <button
                        onClick={() => setExpandedBullet(isExpanded ? null : i)}
                        className="w-full p-4 flex items-start justify-between text-left cursor-pointer hover:bg-muted/30 transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}>{i + 1}</span>
                            <span className="text-xs font-semibold text-red-400">Original</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-through decoration-red-400/30">{bullet.original}</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="px-4 pb-4 pt-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>✓</span>
                                <span className="text-xs font-semibold text-green-500">Tailored</span>
                              </div>
                              <p className="text-sm text-foreground font-medium">{bullet.tailored}</p>
                              {bullet.reasoning && (
                                <p className="text-xs text-muted-foreground mt-2 italic">💡 {bullet.reasoning}</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {result.suggestions && result.suggestions.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="premium-card p-6">
              <h3 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Improvement Suggestions
              </h3>
              <ul className="space-y-3">
                {result.suggestions.map((suggestion, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                      {i + 1}
                    </span>
                    <span>{suggestion}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
