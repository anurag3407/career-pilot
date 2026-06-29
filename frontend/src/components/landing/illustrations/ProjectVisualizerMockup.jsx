import React from 'react';
import { motion } from 'framer-motion';

export default function ProjectVisualizerMockup() {
  return (
    <div className="w-full h-[500px] rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col relative">
      <div className="h-10 border-b border-border bg-background/50 flex items-center px-4 space-x-2 shrink-0">
        <div className="w-3 h-3 rounded-full bg-destructive/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="mx-auto h-4 w-40 bg-muted rounded-full" />
      </div>

      <div className="flex-1 p-6 bg-background/30 flex relative overflow-hidden">
        {/* Nodes and edges (Graph) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="30%" y1="40%" x2="50%" y2="50%" stroke="var(--color-primary)" strokeWidth="2" />
            <line x1="70%" y1="35%" x2="50%" y2="50%" stroke="var(--color-primary)" strokeWidth="2" />
            <line x1="45%" y1="70%" x2="50%" y2="50%" stroke="var(--color-primary)" strokeWidth="2" />
          </svg>
        </div>

        {/* Node: Frontend */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="absolute top-[30%] left-[20%] w-24 h-12 bg-primary/20 border border-primary rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md"
        >
          <div className="h-2 w-12 bg-primary/80 rounded" />
        </motion.div>

        {/* Node: Backend */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-[25%] right-[20%] w-24 h-12 bg-secondary/20 border border-secondary rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md"
        >
          <div className="h-2 w-12 bg-secondary/80 rounded" />
        </motion.div>

        {/* Node: Database */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-[20%] left-[40%] w-24 h-12 bg-amber-500/20 border border-amber-500 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md"
        >
          <div className="h-2 w-12 bg-amber-500/80 rounded" />
        </motion.div>

        {/* Node: Core (Center) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute top-[45%] left-[45%] w-24 h-12 bg-foreground/10 border border-foreground/30 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-md"
        >
          <div className="h-2 w-12 bg-foreground/50 rounded" />
        </motion.div>

        {/* Chat / Sidebar Overlap */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute right-4 bottom-4 top-4 w-64 bg-card border border-border rounded-xl shadow-2xl flex flex-col p-4 z-10"
        >
          <div className="h-4 w-24 bg-foreground/20 rounded mb-4" />
          <div className="flex-1 space-y-4">
            <div className="w-full flex justify-end">
              <div className="bg-primary/20 rounded-lg p-2 max-w-[80%] rounded-tr-none">
                <div className="h-2 w-20 bg-primary/80 rounded mb-1" />
                <div className="h-2 w-16 bg-primary/80 rounded" />
              </div>
            </div>
            <div className="w-full flex justify-start">
              <div className="bg-muted rounded-lg p-2 max-w-[90%] rounded-tl-none">
                <div className="h-2 w-32 bg-foreground/50 rounded mb-1" />
                <div className="h-2 w-24 bg-foreground/50 rounded mb-1" />
                <div className="h-2 w-28 bg-foreground/50 rounded" />
              </div>
            </div>
          </div>
          <div className="mt-auto h-8 w-full bg-muted rounded-lg border border-border" />
        </motion.div>
      </div>
    </div>
  );
}
