import React from 'react';
import { motion } from 'framer-motion';

export default function PortfolioBuilderMockup() {
  return (
    <div className="w-full h-[500px] rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col relative">
      {/* Browser Chrome */}
      <div className="h-10 border-b border-border bg-background/50 flex items-center px-4 space-x-2 shrink-0">
        <div className="w-3 h-3 rounded-full bg-destructive/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="mx-auto flex items-center bg-muted rounded-full px-3 py-1">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
          <div className="h-2 w-24 bg-muted-foreground/30 rounded" />
        </div>
      </div>

      {/* App UI */}
      <div className="flex-1 p-6 bg-background/30 flex flex-col gap-6 relative">
        <div className="flex justify-between items-center">
          <div className="h-6 w-32 bg-foreground/20 rounded" />
          <div className="flex space-x-2">
            <div className="h-8 w-8 rounded-full bg-card border border-border" />
            <div className="h-8 w-24 rounded-full bg-primary flex items-center justify-center">
              <div className="h-2 w-12 bg-primary-foreground/50 rounded" />
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {/* Template 1 (Active) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl border-2 border-primary bg-card p-2 flex flex-col relative"
          >
            <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
            </div>
            <div className="flex-1 bg-muted rounded-lg overflow-hidden flex flex-col items-center justify-center p-4">
              <div className="h-8 w-8 rounded-full bg-foreground/20 mb-2" />
              <div className="h-2 w-16 bg-foreground/20 rounded mb-1" />
              <div className="h-1.5 w-12 bg-muted-foreground/30 rounded" />
            </div>
            <div className="h-3 w-20 bg-muted rounded mt-2 mx-1" />
          </motion.div>

          {/* Template 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-2 flex flex-col"
          >
            <div className="flex-1 bg-muted rounded-lg overflow-hidden flex flex-col justify-center p-4">
              <div className="w-full flex space-x-2 mb-2">
                <div className="h-4 w-4 bg-foreground/20 rounded-full" />
                <div className="h-2 w-10 bg-foreground/20 rounded mt-1" />
              </div>
              <div className="h-2 w-full bg-muted-foreground/30 rounded mb-1" />
              <div className="h-2 w-3/4 bg-muted-foreground/30 rounded" />
            </div>
            <div className="h-3 w-20 bg-muted rounded mt-2 mx-1" />
          </motion.div>
          
          {/* Settings Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-2 rounded-xl border border-border bg-card p-4 flex items-center gap-4 mt-2"
          >
             <div className="flex-1 space-y-2">
               <div className="h-3 w-24 bg-foreground/20 rounded" />
               <div className="flex gap-2">
                 <div className="h-6 w-6 rounded-full bg-primary" />
                 <div className="h-6 w-6 rounded-full bg-secondary" />
                 <div className="h-6 w-6 rounded-full bg-foreground" />
               </div>
             </div>
             <div className="h-8 w-24 bg-muted rounded-lg" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
