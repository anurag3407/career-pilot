import React from 'react';
import { motion } from 'framer-motion';

export default function ResumeRoastMockup() {
  return (
    <div className="w-full h-[500px] rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col relative">
      <div className="h-10 border-b border-border bg-background/50 flex items-center px-4 space-x-2 shrink-0">
        <div className="w-3 h-3 rounded-full bg-destructive/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="mx-auto h-4 w-24 bg-muted rounded-full" />
      </div>

      <div className="flex-1 p-6 bg-background/30 flex flex-col items-center justify-center gap-6 relative">
        {/* Score Gauge */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative w-40 h-40 flex items-center justify-center"
        >
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-destructive/20" />
          {/* Progress Ring (fake SVG stroke) */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-destructive)" strokeWidth="8" strokeDasharray="289" strokeDashoffset="120" strokeLinecap="round" />
          </svg>
          <div className="flex flex-col items-center justify-center z-10 text-center">
            <span className="text-4xl font-black text-destructive">48</span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Ouch</span>
          </div>
        </motion.div>

        {/* Roast feedback cards */}
        <div className="w-full max-w-sm space-y-3">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full bg-card border border-border rounded-xl p-4 flex gap-3 shadow-sm relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive" />
            <div className="h-6 w-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <div className="h-2 w-2 rounded-full bg-destructive" />
            </div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 w-1/2 bg-foreground/30 rounded" />
              <div className="h-2 w-full bg-muted-foreground/40 rounded" />
              <div className="h-2 w-4/5 bg-muted-foreground/40 rounded" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full bg-card border border-border rounded-xl p-4 flex gap-3 shadow-sm relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500" />
            <div className="h-6 w-6 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
            </div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 w-1/3 bg-foreground/30 rounded" />
              <div className="h-2 w-11/12 bg-muted-foreground/40 rounded" />
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
