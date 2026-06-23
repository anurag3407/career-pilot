import React from 'react';
import { motion } from 'framer-motion';

export default function GithubPortfolioMockup() {
  return (
    <div className="w-full h-[500px] rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col relative">
      <div className="h-10 border-b border-border bg-background/50 flex items-center px-4 space-x-2 shrink-0">
        <div className="w-3 h-3 rounded-full bg-destructive/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="mx-auto h-4 w-32 bg-muted rounded-full" />
      </div>

      <div className="flex-1 p-6 bg-background/30 flex flex-col gap-6 relative overflow-hidden">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 border-b border-border pb-4"
        >
          <div className="h-16 w-16 rounded-full bg-muted border-2 border-primary" />
          <div className="space-y-2">
            <div className="h-5 w-32 bg-foreground/20 rounded" />
            <div className="h-3 w-48 bg-muted-foreground/30 rounded" />
          </div>
          <div className="ml-auto h-8 w-24 bg-primary rounded-lg" />
        </motion.div>

        {/* Selected Repos Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <div className="h-4 w-24 bg-foreground/30 rounded" />
              <div className="h-4 w-12 bg-muted rounded-full" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2 w-full bg-muted-foreground/30 rounded" />
              <div className="h-2 w-5/6 bg-muted-foreground/30 rounded" />
            </div>
            <div className="mt-auto flex gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-10 bg-muted rounded" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <div className="h-4 w-20 bg-foreground/30 rounded" />
              <div className="h-4 w-12 bg-muted rounded-full" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2 w-full bg-muted-foreground/30 rounded" />
              <div className="h-2 w-2/3 bg-muted-foreground/30 rounded" />
            </div>
            <div className="mt-auto flex gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <div className="h-3 w-10 bg-muted rounded" />
            </div>
          </motion.div>
        </div>

        {/* Activity Graph */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-card border border-border rounded-xl p-4 mt-auto"
        >
          <div className="h-3 w-24 bg-foreground/20 rounded mb-4" />
          <div className="flex gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                {Array.from({ length: 5 }).map((_, j) => {
                  const isActive = Math.random() > 0.6;
                  return (
                    <div 
                      key={j} 
                      className={`h-2.5 w-2.5 rounded-[2px] ${isActive ? 'bg-primary/60' : 'bg-muted'}`} 
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
