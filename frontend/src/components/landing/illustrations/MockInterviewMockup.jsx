import React from 'react';
import { motion } from 'framer-motion';

export default function MockInterviewMockup() {
  return (
    <div className="w-full h-[500px] rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden flex flex-col relative">
      <div className="h-10 border-b border-border bg-background/50 flex items-center px-4 space-x-2 shrink-0">
        <div className="w-3 h-3 rounded-full bg-destructive/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="mx-auto h-4 w-32 bg-muted rounded-full" />
      </div>

      <div className="flex-1 p-6 bg-background/30 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Audio Waveform Animation */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="flex items-center justify-center gap-2 h-32 w-full max-w-md">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: ["20%", "80%", "30%", "100%", "40%", "20%"]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1
                }}
                className="w-2 bg-primary rounded-full"
                style={{ height: "20%" }}
              />
            ))}
          </div>
        </div>

        {/* AI Avatar / Status */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          {/* Avatar Ring */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping opacity-50" />
            <div className="relative h-32 w-32 rounded-full bg-card border-4 border-primary shadow-xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20" />
              <div className="h-12 w-12 text-primary">
                {/* SVG Mic Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </div>
            </div>
            {/* Live Indicator */}
            <div className="absolute top-2 right-2 h-4 w-4 bg-destructive rounded-full border-2 border-card flex items-center justify-center">
              <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>

          <div className="text-center space-y-2 bg-card/80 backdrop-blur-md p-4 rounded-xl border border-border">
            <div className="h-4 w-48 bg-foreground/20 rounded mx-auto" />
            <div className="h-3 w-32 bg-muted-foreground/40 rounded mx-auto" />
          </div>
        </motion.div>

        {/* Control Bar */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-card border border-border rounded-full px-6 py-3 shadow-lg z-10"
        >
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center" />
          <div className="h-12 w-12 rounded-full bg-destructive flex items-center justify-center shadow-lg" />
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center" />
        </motion.div>
      </div>
    </div>
  );
}
