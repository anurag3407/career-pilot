import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, MessageSquare, Award, Brain, CheckCircle, AlertCircle, Zap, Lightbulb } from 'lucide-react';
import CopyButton from '../CopyButton';

export default function QuestionAnalysisCard({ answer, index }) {
  const [expanded, setExpanded] = useState(false);
  const analysis = answer.analysis || {};
  const avgScore = Math.round(((analysis.relevance || 0) + (analysis.clarity || 0) + (analysis.confidence || 0)) / 3);

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score >= 60) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getScoreTextColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  return (
    <div className="rounded-2xl bg-muted/30 border border-border/50 overflow-hidden transition-all duration-300 hover:border-border/80/50">
      <button type="button" onClick={() => setExpanded(!expanded)} className="w-full p-4 flex items-center gap-4 text-left cursor-pointer">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
          <span className="text-violet-400 font-bold text-sm">{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-foreground font-medium truncate pr-4">{answer.question}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-muted-foreground">{answer.duration}s</span>
            <span className={`text-xs ${getScoreTextColor(avgScore)}`}>
              {getScoreLabel(avgScore)}
            </span>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg border text-sm font-semibold ${getScoreBadgeColor(avgScore)}`}>
          {avgScore}%
        </div>
        <div className="text-muted-foreground">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-4 pb-4 border-t border-border/50">
          <div className="pt-4 space-y-4">
            {/* Score Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-center">
                <p className="text-2xl font-bold text-sky-400">{analysis.relevance || 0}%</p>
                <p className="text-xs text-muted-foreground mt-1">Relevance</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-2xl font-bold text-emerald-400">{analysis.clarity || 0}%</p>
                <p className="text-xs text-muted-foreground mt-1">Clarity</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                <p className="text-2xl font-bold text-purple-400">{analysis.confidence || 0}%</p>
                <p className="text-xs text-muted-foreground mt-1">Confidence</p>
              </div>
            </div>

            {/* Your Response vs Ideal Answer - Side by Side Comparison */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Your Response */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Your Response</p>
                  </div>
                  <CopyButton text={answer.transcript} label="" size={13} variant="ghost" className="shrink-0" />
                </div>
                <p className="text-foreground text-sm leading-relaxed">"{answer.transcript}"</p>
              </div>

              {/* Ideal Answer */}
              {analysis.idealAnswer && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <p className="text-xs text-emerald-400 uppercase tracking-wide font-medium">Model Answer Example</p>
                    </div>
                    <CopyButton text={analysis.idealAnswer} label="" size={13} variant="ghost" className="shrink-0 text-emerald-400 hover:text-emerald-300" />
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">{analysis.idealAnswer}</p>
                </div>
              )}
            </div>

            {/* Professional Feedback */}
            {analysis.feedback && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <p className="text-xs text-primary uppercase tracking-wide font-medium">Professional Assessment</p>
                  </div>
                  <CopyButton text={analysis.feedback} label="" size={13} variant="ghost" className="shrink-0" />
                </div>
                <p className="text-foreground text-sm leading-relaxed">{analysis.feedback}</p>
              </div>
            )}

            {/* What You Did Well & What Was Missing */}
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.whatYouDidWell && analysis.whatYouDidWell.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs text-emerald-400 uppercase tracking-wide mb-3 font-medium">✓ What You Did Well</p>
                  <ul className="space-y-2">
                    {analysis.whatYouDidWell.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.whatWasMissing && analysis.whatWasMissing.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-400 uppercase tracking-wide mb-3 font-medium">⚠ What Was Missing</p>
                  <ul className="space-y-2">
                    {analysis.whatWasMissing.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground text-sm">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Communication Style Analysis */}
            {analysis.communicationStyle && (
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 font-medium">Communication Style</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Pace</p>
                    <p className={`text-sm font-medium ${analysis.communicationStyle.pace === 'appropriate' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {analysis.communicationStyle.pace}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Structure</p>
                    <p className={`text-sm font-medium ${analysis.communicationStyle.structure === 'well-organized' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {analysis.communicationStyle.structure}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Specificity</p>
                    <p className={`text-sm font-medium ${analysis.communicationStyle.specificity?.includes('specific') ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {analysis.communicationStyle.specificity}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Key Takeaway */}
            {analysis.keyTakeaway && (
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs text-violet-400 uppercase tracking-wide font-medium">Key Takeaway</p>
                      <CopyButton text={analysis.keyTakeaway} label="" size={13} variant="ghost" className="shrink-0 text-violet-400 hover:text-violet-300" />
                    </div>
                    <p className="text-foreground text-sm font-medium">{analysis.keyTakeaway}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actionable Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <p className="text-xs text-sky-400 uppercase tracking-wide mb-3 font-medium">Action Items for Improvement</p>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-2 text-foreground text-sm">
                      <Lightbulb className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Filler Words */}
            {analysis.fillerWords && analysis.fillerWords.count > 0 && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400 uppercase tracking-wide mb-2 font-medium">Filler Words Detected ({analysis.fillerWords.count})</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.fillerWords.words?.map((word, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-red-500/20 text-red-300 text-xs">{word}</span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Tip: Practice pausing instead of using filler words to sound more confident.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
