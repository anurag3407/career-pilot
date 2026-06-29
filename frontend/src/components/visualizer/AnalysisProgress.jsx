import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, FileCode, Network, ShieldAlert, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const AnalysisProgress = ({ status }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { icon: GitBranch, label: 'Cloning repository' },
    { icon: FileCode, label: 'Scanning files & languages' },
    { icon: Network, label: 'Building dependency graph' },
    { icon: ShieldAlert, label: 'Detecting risks' },
    { icon: Sparkles, label: 'Generating AI insights' }
  ];

  useEffect(() => {
    if (status !== 'analyzing') return;
    
    // Simulate progress through the steps since backend doesn't send SSE events for progress yet
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setActiveStep(currentStep);
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [status]);

  if (status !== 'analyzing') return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-32 bg-cyan-500/20 blur-[100px] pointer-events-none" />
        
        <h2 className="text-2xl font-bold text-white text-center mb-8">Analyzing Codebase</h2>
        
        <div className="space-y-6 relative z-10">
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            const isPast = i < activeStep;
            
            return (
              <div key={i} className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500",
                  isPast ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                  isActive ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" :
                  "bg-white/5 text-slate-500 border border-white/5"
                )}>
                  {isPast ? <CheckCircle2 className="w-5 h-5" /> :
                   isActive ? <Loader2 className="w-5 h-5 animate-spin" /> :
                   <step.icon className="w-5 h-5" />}
                </div>
                
                <span className={cn(
                  "font-medium transition-colors duration-500",
                  isPast ? "text-slate-300" :
                  isActive ? "text-white" :
                  "text-slate-500"
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-10 h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-500 to-violet-500"
            initial={{ width: '0%' }}
            animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalysisProgress;
