import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

/* ─── Log level label ────────────────────────────────────────────── */
const LOG_LEVELS = ['INFO', 'INFO', 'INFO', 'NOTICE'];
const LOG_COLORS = {
  INFO: 'text-cyan-400',
  NOTICE: 'text-green-400',
  WARN: 'text-amber-400',
};

function LogEntry({ text, level = 'INFO' }) {
  const ts = new Date().toISOString().slice(11, 19);
  return (
    <div className="font-mono text-xs leading-relaxed flex gap-2 flex-wrap">
      <span className="text-green-800 shrink-0">{ts}</span>
      <span className={`${LOG_COLORS[level] || 'text-cyan-400'} shrink-0 w-14`}>[{level}]</span>
      <span className="text-green-300/80 flex-1">{text}</span>
    </div>
  );
}

/* ─── Single Testimonial Card ─────────────────────────────────────── */
function TestimonialCard({ testimonial, index }) {
  const lines = [
    testimonial.text,
    `— ${testimonial.name}`,
    `   ${testimonial.role}`,
  ];

  return (
    <div className="border border-green-900/40 bg-black/80">
      {/* Log file header */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-950/80 border-b border-green-900/20 font-mono text-xs text-green-800">
        <span className="text-green-600">$</span>
        <span>cat testimonials.log | grep -A3 &quot;entry_{String(index + 1).padStart(3, '0')}&quot;</span>
      </div>

      <div className="p-4 space-y-2">
        {/* Timestamp header */}
        <div className="font-mono text-[10px] text-green-900 mb-3">
          {`# entry_${String(index + 1).padStart(3, '0')} — testimonials.log`}
        </div>

        {/* Log lines */}
        <LogEntry text={testimonial.text} level="INFO" />
        <div className="h-px bg-green-900/20 my-2" />

        {/* Author block */}
        <div className="flex items-center gap-3 mt-3">
          {testimonial.avatar && (
            <div className="relative flex-shrink-0">
              <img
                src={testimonial.avatar}
                alt={testimonial.name || "Profile Avatar"}
                className="w-10 h-10 rounded-sm object-cover grayscale opacity-70 border border-green-900/50"
                loading="lazy"
              />
              {/* CRT filter overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.2) 2px,rgba(0,0,0,0.2) 4px)' }}
              />
            </div>
          )}
          <div className="font-mono text-xs">
            <div className="text-white">{testimonial.name}</div>
            <div className="text-green-600">{testimonial.role}</div>
          </div>
          <div className="ml-auto font-mono text-[10px] text-green-900">
            [verified ✓]
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Testimonials Section ────────────────────────────────────────── */
export default function Testimonials() {
  const data = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [page, setPage] = useState(0);

  const perPage = 2;
  const totalPages = Math.ceil(data.testimonials.length / perPage);
  const visible = data.testimonials.slice(page * perPage, (page + 1) * perPage);

  return (
    <section
      id="testimonials"
      ref={ref}
      className="bg-black py-20 px-4 border-t border-green-900/30"
      aria-label="Testimonials"
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Command header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="font-mono"
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-700">user@portfolio:~$</span>
            <span className="text-white"> cat testimonials.log</span>
          </div>
          <div className="text-green-700 text-xs mt-1">
            {'# ── testimonials.log ───────────────────────────────────────'}
          </div>
          <div className="text-green-800 text-xs">
            {`# ${data.testimonials.length} records found`}
          </div>
        </motion.div>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {visible.map((t, i) => (
              <TestimonialCard
                key={`${t.name}-${page}`}
                testimonial={t}
                index={page * perPage + i}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex items-center gap-4 justify-center font-mono text-xs"
          >
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              id="testimonials-prev"
              aria-label="Previous testimonials"
              className="flex items-center gap-1 border border-green-900/50 text-green-600 px-3 py-1.5 hover:border-green-700/70 hover:text-green-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={12} />
              prev
            </button>

            <span className="text-green-800">
              page {page + 1}/{totalPages}
            </span>

            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              id="testimonials-next"
              aria-label="Next testimonials"
              className="flex items-center gap-1 border border-green-900/50 text-green-600 px-3 py-1.5 hover:border-green-700/70 hover:text-green-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              next
              <ChevronRight size={12} />
            </button>
          </motion.div>
        )}

        {/* Log tail */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="font-mono text-xs space-y-0.5"
        >
          <div className="text-green-900">{'# ── EOF: testimonials.log ──────────────────────────────────'}</div>
          <div className="flex items-center gap-1 text-green-500 mt-1">
            <span>user@portfolio:~$</span>
            <span
              className="inline-block w-2 h-3.5 bg-green-400 ml-0.5 align-middle"
              style={{ animation: 'termBlink 1s step-end infinite' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
