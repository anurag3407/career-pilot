import React, { useState, useEffect } from 'react';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';
import { projectVisualizerApi } from '../../services/api';
import { ShieldAlert, HelpCircle, Loader2, Play, Eye, EyeOff, BrainCircuit, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const InterviewPrep = () => {
  const { sessionId, setChatExpanded, setChatMode, addMessage } = useProjectVisualizerStore();
  const [questions, setQuestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState(0);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await projectVisualizerApi.getInterviewQuestions(sessionId);
      if (data && data.categories) {
        setQuestions(data.categories);
      } else {
        toast.error('Invalid response format');
      }
    } catch (e) {
      toast.error('Failed to generate interview questions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!questions && !isLoading) {
      fetchQuestions();
    }
  }, []);

  const toggleAnswer = (idx) => {
    const newRevealed = new Set(revealedAnswers);
    if (newRevealed.has(idx)) newRevealed.delete(idx);
    else newRevealed.add(idx);
    setRevealedAnswers(newRevealed);
  };

  const startMockInterview = (questionStr) => {
    setChatExpanded(true);
    setChatMode('interview');
    addMessage({
      role: 'user',
      content: `I want to practice answering this question: "${questionStr}". Please evaluate my answer when I provide it.`
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Generating Interview Questions</h2>
        <p className="text-slate-400 max-w-md text-center">
          Analyzing the codebase architecture, modules, and identified risks to create tailored interview questions...
        </p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <ShieldAlert className="w-16 h-16 text-slate-500 mb-4" />
        <p className="text-slate-400 mb-4">No questions available.</p>
        <button 
          onClick={fetchQuestions}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const category = questions[activeCategory];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full max-w-7xl mx-auto w-full">
      {/* Sidebar */}
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
        <div className="bg-[#0a0f1c] border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
            <h3 className="font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-red-400" />
              Categories
            </h3>
            <button 
              onClick={fetchQuestions}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
              title="Regenerate Questions"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {questions.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveCategory(i)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  activeCategory === i 
                    ? "bg-red-500/10 text-red-400 font-medium border border-red-500/20" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
          <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Interview Mode
          </h4>
          <p className="text-xs text-red-400/80 leading-relaxed mb-4">
            These questions are tailored specifically to this codebase. Use the Mock Interview feature to practice your answers against an elite Principal Engineer AI.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-white/10">
              {category?.name}
            </h2>
            
            {category?.questions?.map((q, idx) => (
              <div key={idx} className="bg-[#0a0f1c] border border-white/10 rounded-2xl p-6 transition-colors hover:border-white/20">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-lg font-medium text-slate-200 leading-relaxed">
                    {q.question}
                  </h3>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0",
                    q.difficulty === 'hard' ? "bg-red-500/20 text-red-400 border border-red-500/20" :
                    q.difficulty === 'medium' ? "bg-amber-500/20 text-amber-400 border border-amber-500/20" :
                    "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                  )}>
                    {q.difficulty || 'medium'}
                  </span>
                </div>
                
                {q.hint && (
                  <div className="mb-6 p-3 rounded-xl bg-white/5 border border-white/10 flex gap-3 text-sm">
                    <HelpCircle className="w-5 h-5 text-violet-400 shrink-0" />
                    <p className="text-slate-400">{q.hint}</p>
                  </div>
                )}
                
                <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-4">
                  <button
                    onClick={() => toggleAnswer(idx)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-slate-300 transition-colors"
                  >
                    {revealedAnswers.has(idx) ? (
                      <><EyeOff className="w-4 h-4" /> Hide Answer</>
                    ) : (
                      <><Eye className="w-4 h-4" /> Reveal Answer</>
                    )}
                  </button>
                  <button
                    onClick={() => startMockInterview(q.question)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-sm font-medium text-red-400 transition-colors"
                  >
                    <Play className="w-4 h-4" /> Start Mock Interview
                  </button>
                </div>
                
                {revealedAnswers.has(idx) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 rounded-xl bg-cyan-900/10 border border-cyan-500/20"
                  >
                    <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Ideal Answer</h5>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {q.idealAnswer}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewPrep;
