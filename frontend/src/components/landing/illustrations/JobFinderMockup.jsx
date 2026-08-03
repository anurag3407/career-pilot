import React from 'react';
import { motion } from 'framer-motion';

export default function JobFinderMockup() {
  return (
    <div className="w-full h-[500px] rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col relative">
      <div className="h-10 border-b border-border bg-background/50 flex items-center px-4 space-x-2 shrink-0">
        <div className="w-3 h-3 rounded-full bg-destructive/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="mx-auto h-4 w-48 bg-muted rounded-full flex items-center px-2">
          <div className="h-2 w-16 bg-muted-foreground/30 rounded" />
        </div>
      </div>

      <div className="flex-1 p-4 bg-background/30 flex gap-4 relative overflow-hidden">
        {/* Filters Sidebar */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-1/4 h-full flex flex-col gap-4"
        >
          <div className="h-8 w-full bg-card border border-border rounded-lg" />
          <div className="flex-1 bg-card border border-border rounded-lg p-3 space-y-3">
            <div className="h-3 w-16 bg-foreground/20 rounded mb-2" />
            <div className="h-2 w-full bg-muted rounded" />
            <div className="h-2 w-3/4 bg-muted rounded" />
            <div className="h-2 w-4/5 bg-muted rounded" />
            
            <div className="h-3 w-20 bg-foreground/20 rounded mt-4 mb-2" />
            <div className="flex gap-2">
              <div className="h-4 w-12 bg-primary/20 rounded-full" />
              <div className="h-4 w-16 bg-muted rounded-full" />
            </div>
          </div>
        </motion.div>

        {/* Job Listings */}
        <div className="flex-1 flex flex-col gap-3">
          {/* Active Job Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full bg-card border-2 border-primary rounded-xl p-4 flex gap-4 relative overflow-hidden"
          >
            {/* Match Score Badge */}
            <div className="absolute top-4 right-4 bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-bold border border-primary/20">
              98% Match
            </div>
            
            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0">
              <div className="h-6 w-6 rounded-full bg-primary/50" />
            </div>
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 w-1/3 bg-foreground/30 rounded" />
              <div className="h-2 w-1/4 bg-muted-foreground/40 rounded" />
              <div className="flex gap-2 mt-2">
                <div className="h-3 w-16 bg-muted rounded-full" />
                <div className="h-3 w-12 bg-muted rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Job Card 2 */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full bg-card border border-border rounded-xl p-4 flex gap-4"
          >
            <div className="absolute top-4 right-4 bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs font-bold">
              85% Match
            </div>
            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0">
              <div className="h-6 w-6 rounded-full bg-blue-500/50" />
            </div>
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 w-2/5 bg-foreground/30 rounded" />
              <div className="h-2 w-1/3 bg-muted-foreground/40 rounded" />
              <div className="flex gap-2 mt-2">
                <div className="h-3 w-14 bg-muted rounded-full" />
                <div className="h-3 w-20 bg-muted rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Job Card 3 */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full bg-card border border-border rounded-xl p-4 flex gap-4 opacity-50"
          >
            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0">
              <div className="h-6 w-6 rounded-full bg-purple-500/50" />
            </div>
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 w-1/3 bg-foreground/30 rounded" />
              <div className="h-2 w-1/4 bg-muted-foreground/40 rounded" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
