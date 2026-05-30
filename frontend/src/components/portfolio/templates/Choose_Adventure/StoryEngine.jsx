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
            aria-label="Restart adventure"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-700/60 bg-violet-950/70 px-4 py-2 text-sm text-slate-100 transition hover:border-amber-400/50 hover:text-amber-300"
          >
            <RotateCcw size={14} />
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
                    onClick={() => onChoice(choice)}
                    aria-label={`Choose: ${choice.label}`}
                    className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-violet-800/60 bg-[#14142b]/80 px-5 py-4 text-left text-slate-100 transition hover:border-amber-400/50 hover:bg-violet-900/70"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-sm">{choice.label}</span>
                    <ChevronRight size={14} className="text-violet-400 group-hover:text-amber-400 transition-colors shrink-0" />
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
