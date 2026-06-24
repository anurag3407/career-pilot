import React from 'react';
import { motion } from 'framer-motion';

export default function ConsistencyPanel({ errors = [] }) {
  if (errors.length === 0) return null;

  // Defensive Severity Color Map Configuration
  const severityStyles = {
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    fallback: 'bg-muted border-border text-muted-foreground'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-6 p-4 border border-border bg-card rounded-xl shadow-lg"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-black bg-foreground text-background px-2 py-0.5 rounded uppercase tracking-tighter">
          Analysis // Flags ({errors.length})
        </span>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
        {errors.map((err, idx) => {
          const currentStyle = severityStyles[err.severity] || severityStyles.fallback;

          return (
            <div key={idx} className={`p-3 rounded-lg border text-sm ${currentStyle}`}>
              <p className="font-bold tracking-tight">{err.message}</p>
              {err.offendingText && (
                <blockquote className="mt-1.5 pl-2 border-l-2 border-current italic text-xs opacity-85 line-clamp-2">
                  "{err.offendingText}"
                </blockquote>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}