import React from 'react';
import { motion } from 'framer-motion';

export default function ConsistencyPanel({ errors = [] }) {
  if (errors.length === 0) return null;

  // Defensive Severity Color Map Configuration
  const severityStyles = {
    error: 'bg-rose-50 border-rose-100 text-rose-800',
    warning: 'bg-amber-50 border-amber-100 text-amber-800',
    fallback: 'bg-slate-50 border-slate-200 text-slate-700'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-6 p-4 border-2 border-black bg-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-black bg-black text-white px-2 py-0.5 uppercase tracking-tighter">
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