import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';

export default function TestimonialsSection({ data, onChoice }) {
  const { testimonials } = data;
  const [active, setActive] = useState(0);

  const choices = [
    { label: 'Reach out and work together', next: 'contact' },
    { label: 'See my skills and tools', next: 'skills' },
    { label: 'Review my projects once more', next: 'projects' },
  ];

  const count = testimonials?.length ?? 0;
  const prev = () => { if (count > 0) setActive((p) => (p - 1 + count) % count); };
  const next = () => { if (count > 0) setActive((p) => (p + 1) % count); };
  const current = count > 0 ? testimonials[active] : null;

  if (count === 0) {
    return (
      <div className="min-h-screen bg-[#0f0e17] flex items-center justify-center font-mono">
        <p className="text-slate-500 text-sm">No testimonials available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0e17] flex flex-col items-center justify-center px-4 py-16 font-mono relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-violet-900/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.p
          className="text-xs text-amber-400 uppercase tracking-widest mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Chapter 5 — The Witnesses
        </motion.p>

        <motion.div
          className="border border-violet-800/50 rounded-2xl bg-[#1a1a2e]/80 backdrop-blur p-8 mb-8 shadow-xl shadow-violet-950/40"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-8">
            <Quote size={16} className="text-amber-400" />
            <h2 className="text-xl font-bold text-white">What Others Say</h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
            >
              <Quote size={32} className="text-violet-800/60 mb-4" />
              <p className="text-slate-200 text-base leading-relaxed italic mb-7">
                "{current.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-violet-600/30 shrink-0 bg-violet-900">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{current.name}</p>
                  <p className="text-xs text-violet-400">{current.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-violet-800/30">
            <button type="button"
              onClick={prev}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((t, i) => (
                <button type="button"
                  key={i}
                  onClick={() => setActive(i)}
                  aria-label={`View testimonial from ${t.name}`}
                  aria-current={i === active ? 'true' : undefined}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === active ? 'bg-amber-400' : 'bg-slate-700 hover:bg-slate-500'}`}
                />
              ))}
            </div>
            <button type="button"
              onClick={next}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Next
              <ChevronRightIcon size={14} />
            </button>
          </div>
        </motion.div>

        <div className="space-y-3">
          {choices.map((choice, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.2 + i * 0.08 } }}
              whileHover={{ x: 6 }}
              onClick={() => onChoice(choice.next)}
              className="w-full flex items-center gap-3 text-left px-5 py-4 rounded-xl border border-violet-700/40 hover:border-violet-400/70 bg-violet-950/30 hover:bg-violet-900/40 text-violet-200 hover:text-white transition-all duration-200 group"
            >
              <ChevronRightIcon size={14} className="text-violet-400 group-hover:text-amber-400 transition-colors shrink-0" />
              <span className="text-sm">{choice.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
