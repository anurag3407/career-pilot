import { motion } from 'framer-motion';
import { Award, Sparkles, BarChart3, Target, MessageSquare, Brain, Eye, CheckCircle, Clock, TrendingUp, Zap, Lightbulb, AlertTriangle } from 'lucide-react';
import LearningRecommendations from '../../../components/LearningRecommendations';

export default function FeedbackPanel({
  overallResults,
  progressData,
  formatTime
}) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'emerald';
    if (score >= 60) return 'amber';
    return 'red';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Needs Work';
    return 'Needs Improvement';
  };

  const scoreColor = getScoreColor(overallResults.overallScore);
  const scoreGradientClass = {
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600'
  }[scoreColor] || 'from-emerald-500 to-emerald-600';
  const scoreShadowClass = {
    emerald: 'shadow-emerald-500/30',
    amber: 'shadow-amber-500/30',
    red: 'shadow-red-500/30'
  }[scoreColor] || 'shadow-emerald-500/30';
  
  const avgRelevance = overallResults.answers?.reduce((sum, a) => sum + (a.analysis?.relevance || 0), 0) / (overallResults.answers?.length || 1) || 0;
  const avgClarity = overallResults.answers?.reduce((sum, a) => sum + (a.analysis?.clarity || 0), 0) / (overallResults.answers?.length || 1) || 0;
  const avgConfidence = overallResults.answers?.reduce((sum, a) => sum + (a.analysis?.confidence || 0), 0) / (overallResults.answers?.length || 1) || 0;
  const totalFillerWords = overallResults.answers?.reduce((sum, a) => sum + (a.analysis?.fillerWords?.count || 0), 0) || 0;
  const expressionScore = overallResults.overallFeedback?.expressionAnalysis?.overallConfidence || 0;
  
  const getCommunicationRating = () => {
    if (avgClarity >= 85 && avgConfidence >= 85) return 'Excellent';
    if (avgClarity >= 75 && avgConfidence >= 75) return 'Strong';
    if (avgClarity >= 65 && avgConfidence >= 65) return 'Good';
    return 'Needs Improvement';
  };

  const communicationTips = [];
  if (avgConfidence < 70) {
    communicationTips.push('Practice speaking more confidently and reduce hesitation.');
  }
  if (avgClarity < 70) {
    communicationTips.push('Structure responses using the STAR method.');
  }
  if (totalFillerWords > 5) {
    communicationTips.push("Reduce filler words such as 'um', 'uh', and 'like'.");
  }
  if (communicationTips.length === 0) {
    communicationTips.push('Excellent communication skills. Keep practicing regularly.');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="relative inline-block mb-6">
            <div className={`w-24 h-24 bg-gradient-to-br ${scoreGradientClass} rounded-3xl flex items-center justify-center shadow-2xl ${scoreShadowClass}`}>
              <Award className="w-14 h-14 text-foreground" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-foreground" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Interview Complete!</h1>

          <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 mb-6 max-w-xl mx-auto">
            <h3 className="text-xl font-bold mb-2">Interview Readiness Score</h3>
            <p className="text-5xl font-bold text-primary">{overallResults.overallScore}%</p>
            <p className="text-muted-foreground mt-2">Based on confidence, communication, and answer quality.</p>
          </div>

          <p className="text-lg text-muted-foreground">Here's your comprehensive performance analysis</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <h2 className="text-2xl font-bold mb-4">Adaptive Interview Progress</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Current Level</p>
                <p className="text-xl font-bold">{progressData.level}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Average Score</p>
                <p className="text-xl font-bold">{progressData.averageScore}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Interviews Completed</p>
                <p className="text-xl font-bold">{progressData.completedInterviews}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Success Streak</p>
                <p className="text-xl font-bold">{progressData.streak}/3</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="mb-2 text-sm text-muted-foreground">Progress To Next Level</p>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressData.streak * 33}%` }} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 border border-border backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row items-center gap-8 mb-8">
              <div className="relative">
                <svg className="w-44 h-44 transform -rotate-90">
                  <circle cx="88" cy="88" r="76" stroke="currentColor" strokeWidth="12" fill="none" className="text-muted-foreground/60" />
                  <motion.circle initial={{ strokeDashoffset: 478 }} animate={{ strokeDashoffset: 478 - (478 * overallResults.overallScore) / 100 }} transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }} cx="88" cy="88" r="76" stroke="url(#scoreGradient)" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray="478" />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {overallResults.overallScore}%
                  </motion.span>
                  <span className="text-muted-foreground text-sm font-medium mt-1">{getScoreLabel(overallResults.overallScore)}</span>
                </div>
              </div>

              <div className="flex-1 w-full">
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Performance Breakdown
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-foreground text-sm flex items-center gap-2"><Target className="w-4 h-4 text-sky-400" />Answer Relevance</span>
                      <span className="text-sky-400 font-semibold">{Math.round(avgRelevance)}%</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${avgRelevance}%` }} transition={{ delay: 0.6, duration: 1 }} className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-foreground text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-emerald-400" />Communication Clarity</span>
                      <span className="text-emerald-400 font-semibold">{Math.round(avgClarity)}%</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${avgClarity}%` }} transition={{ delay: 0.7, duration: 1 }} className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-foreground text-sm flex items-center gap-2"><Brain className="w-4 h-4 text-purple-400" />Verbal Confidence</span>
                      <span className="text-purple-400 font-semibold">{Math.round(avgConfidence)}%</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${avgConfidence}%` }} transition={{ delay: 0.8, duration: 1 }} className="h-full bg-gradient-to-r from-secondary to-purple-400 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-foreground text-sm flex items-center gap-2"><Eye className="w-4 h-4 text-amber-400" />Body Language & Expression</span>
                      <span className="text-amber-400 font-semibold">{Math.round(expressionScore)}%</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${expressionScore}%` }} transition={{ delay: 0.9, duration: 1 }} className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-primary">{overallResults.answeredQuestions}/{overallResults.totalQuestions}</p>
                <p className="text-xs text-muted-foreground mt-1">Questions Answered</p>
              </div>
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-center">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-5 h-5 text-sky-400" />
                </div>
                <p className="text-2xl font-bold text-sky-400">{formatTime(overallResults.duration)}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Duration</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-emerald-400">{Math.round((avgRelevance + avgClarity + avgConfidence) / 3)}%</p>
                <p className="text-xs text-muted-foreground mt-1">Avg Answer Quality</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-2">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-amber-400">{totalFillerWords}</p>
                <p className="text-xs text-muted-foreground mt-1">Filler Words Used</p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-purple-400">{overallResults.answers?.length > 0 ? Math.round(overallResults.duration / overallResults.answers.length) : 0}s</p>
                <p className="text-xs text-muted-foreground mt-1">Avg Response Time</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="p-8 rounded-3xl bg-background/50 border border-border">
            <h2 className="text-2xl font-bold mb-6">Communication & Confidence Analysis</h2>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-sm text-muted-foreground">Communication Score</p>
                <p className="text-3xl font-bold text-emerald-400">{Math.round(avgClarity)}</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-sm text-muted-foreground">Confidence Score</p>
                <p className="text-3xl font-bold text-purple-400">{Math.round(avgConfidence)}</p>
              </div>
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-muted-foreground">Filler Words</p>
                <p className="text-3xl font-bold text-red-400">{totalFillerWords}</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-xl font-bold text-amber-400">{getCommunicationRating()}</p>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-primary/10 border border-primary/20">
              <h3 className="font-semibold mb-3">Communication Improvement Roadmap</h3>
              <ul className="space-y-2">
                {communicationTips.map((tip, index) => (
                  <li key={index}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {overallResults.overallFeedback && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 border border-border backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">AI Performance Summary</h3>
                  <p className="text-muted-foreground text-sm">Personalized feedback based on your interview</p>
                </div>
              </div>
              <p className="text-foreground leading-relaxed text-lg bg-muted/30 p-5 rounded-2xl border border-border/50">{overallResults.overallFeedback.summary}</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="h-full p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Your Strengths</h3>
                  <p className="text-emerald-400/70 text-sm">Areas where you excelled</p>
                </div>
              </div>
              <ul className="space-y-3">
                {overallResults.overallFeedback?.topStrengths?.map((s, i) => (
                  <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/10">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-emerald-400 text-sm font-bold">{i + 1}</span>
                    </div>
                    <span className="text-foreground/90">{s}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="h-full p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Areas to Develop</h3>
                  <p className="text-amber-400/70 text-sm">Focus on these for improvement</p>
                </div>
              </div>
              <ul className="space-y-3">
                {overallResults.overallFeedback?.areasToImprove?.map((a, i) => (
                  <motion.li initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }} key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/10">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <ArrowRight className="w-3 h-3 text-amber-400" />
                    </div>
                    <span className="text-foreground/90">{a}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-8">
          <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20">
            <h2 className="text-2xl font-bold mb-4">Areas To Improve</h2>
            <p className="text-muted-foreground mb-5">Focus on these areas before your next interview.</p>
            <div className="space-y-3">
              {overallResults.overallFeedback?.areasToImprove?.map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-background/50 border border-border">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <LearningRecommendations areasToImprove={overallResults.overallFeedback?.areasToImprove || []} />
      </div>
    </div>
  );
}

const ArrowRight = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
