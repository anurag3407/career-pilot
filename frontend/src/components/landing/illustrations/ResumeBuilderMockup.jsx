import React from 'react';
import { motion } from 'framer-motion';

export default function ResumeBuilderMockup() {
  return (
    <div className="w-full h-[500px] rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col relative">
      {/* Browser Chrome */}
      <div className="h-10 border-b border-border bg-background/50 flex items-center px-4 space-x-2 shrink-0">
        <div className="w-3 h-3 rounded-full bg-destructive/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="mx-auto h-4 w-32 bg-muted rounded-full" />
      </div>

      {/* Editor App UI */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4 bg-background/30">
        {/* Sidebar / Form */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-1/3 flex flex-col gap-3"
        >
          <div className="h-6 w-24 bg-muted rounded mb-2" />
          <div className="h-10 w-full bg-card border border-border rounded-lg" />
          <div className="h-10 w-full bg-card border border-border rounded-lg" />
          
          <div className="h-6 w-32 bg-muted rounded mt-4 mb-2" />
          <div className="h-20 w-full bg-card border border-border rounded-lg p-2 flex flex-col gap-2">
            <div className="h-3 w-3/4 bg-muted rounded" />
            <div className="h-3 w-1/2 bg-muted rounded" />
          </div>
          
          <div className="mt-auto h-10 w-full bg-primary rounded-lg flex items-center justify-center">
            <div className="h-4 w-16 bg-primary-foreground/50 rounded" />
          </div>
        </motion.div>

        {/* Live Preview */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex-1 bg-card border border-border rounded-xl shadow-lg p-6 flex flex-col gap-4 relative overflow-hidden"
        >
          {/* AI Score Badge overlay */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.8 }}
            className="absolute top-4 right-4 h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 text-primary-foreground font-bold text-sm ring-4 ring-background"
          >
            95
          </motion.div>

          <div className="h-8 w-1/2 bg-foreground/20 rounded mb-2" />
          <div className="h-4 w-1/3 bg-muted-foreground/30 rounded" />
          
          <div className="w-full h-px bg-border my-2" />
          
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="space-y-2 mt-2">
            <div className="flex justify-between items-center">
              <div className="h-4 w-1/3 bg-foreground/20 rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>
            <div className="h-3 w-full bg-muted rounded" />
            <div className="h-3 w-5/6 bg-muted rounded" />
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center">
              <div className="h-4 w-1/4 bg-foreground/20 rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>
            <div className="h-3 w-full bg-muted rounded" />
            <div className="h-3 w-4/5 bg-muted rounded" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
