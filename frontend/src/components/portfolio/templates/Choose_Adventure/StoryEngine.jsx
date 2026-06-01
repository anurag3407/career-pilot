import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RotateCcw } from 'lucide-react';

const fadeVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

export default function StoryEngine({ node, onChoice, onReset, history = [] }) {
  if (!node) return null;

  return (
    <div className="min-h-screen bg-[#0f0e17] text-[#fffffe] flex flex-col items-center justify-center px-4 py-12 font-mono relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-900/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {history.length > 0 && (
          <button
            onClick={onReset}
            className="mb-8 flex items-center gap-2 text-xs text-violet-400 hover:text-violet-200 transition-colors"
          >
            <RotateCcw size={12} />
            Restart adventure
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={node.id}
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {node.chapter && (
              <p className="text-xs text-amber-400 uppercase tracking-widest mb-4">
                Chapter {node.chapter}
              </p>
            )}

            <div className="border border-violet-800/50 rounded-2xl bg-[#1a1a2e]/80 backdrop-blur p-8 mb-8 shadow-xl shadow-violet-950/40">
              <p className="text-lg leading-relaxed text-slate-200 whitespace-pre-line">
                {node.text}
              </p>
            </div>

            {node.choices && node.choices.length > 0 && (
              <div className="space-y-3">
                {node.choices.map((choice, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.15 + i * 0.08 } }}
                    whileHover={{ x: 6 }}
                    onClick={() => onChoice(choice.next)}
                    className="w-full flex items-center gap-3 text-left px-5 py-4 rounded-xl border border-violet-700/40 hover:border-violet-400/70 bg-violet-950/30 hover:bg-violet-900/40 text-violet-200 hover:text-white transition-all duration-200 group"
                  >
                    <ChevronRight size={14} className="text-violet-400 group-hover:text-amber-400 transition-colors shrink-0" />
                    <span className="text-sm">{choice.label}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {(!node.choices || node.choices.length === 0) && node.cta && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.4 } }}
                className="mt-6"
              >
                {node.cta}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
