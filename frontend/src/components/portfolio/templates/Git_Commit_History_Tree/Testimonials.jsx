import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GitPullRequest, Check, MessageSquare, User } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

/* ─── PR Status badge ─────────────────────────────────────────── */
function StatusBadge({ status = 'merged' }) {
  const styles = {
    merged: { color: '#BC8CFF', bg: 'rgba(188,140,255,0.1)', border: 'rgba(188,140,255,0.25)', label: 'Merged' },
    open:   { color: '#3FB950', bg: 'rgba(63,185,80,0.1)',   border: 'rgba(63,185,80,0.25)',   label: 'Open'   },
    closed: { color: '#F85149', bg: 'rgba(248,81,73,0.1)',   border: 'rgba(248,81,73,0.25)',   label: 'Closed' },
  };
  const s = styles[status] || styles.merged;
  return (
    <span
      className="flex items-center gap-1.5 text-xs border rounded-full px-2.5 py-1 font-medium"
      style={{ color: s.color, backgroundColor: s.bg, borderColor: s.border }}
    >
      <Check size={10} />
      {s.label}
    </span>
  );
}

/* ─── PR Number generator (seeded) ─────────────────────────────── */
function prNum(index) {
  return 100 + index * 13 + (index % 3 === 0 ? 7 : 0);
}

/* ─── Single PR card ──────────────────────────────────────────── */
function PRCard({ testimonial, index, inView }) {
  const num = prNum(index);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="bg-[#161B22] border border-[#30363D] hover:border-[#58A6FF]/30 rounded-lg overflow-hidden transition-all group"
    >
      {/* PR header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#30363D] bg-[#0D1117]/40">
        <GitPullRequest size={14} className="text-[#BC8CFF] shrink-0" />
        <span className="font-mono text-sm text-[#8B949E]">#{num}</span>
        <span className="font-mono text-sm text-white flex-1 truncate">
          review: {testimonial.name?.toLowerCase().replace(/\s+/g, '-')}
        </span>
        <StatusBadge status="merged" />
      </div>

      {/* PR body */}
      <div className="p-4 space-y-4">
        {/* Review comment */}
        <div className="relative bg-[#0D1117] border border-[#30363D] rounded-lg p-4">
          {/* Speech bubble arrow */}
          <div
            className="absolute -top-2.5 left-5 w-0 h-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '10px solid #30363D',
            }}
            aria-hidden="true"
          />
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={12} className="text-[#8B949E]" />
            <span className="text-[#8B949E] text-xs font-mono">Review comment</span>
          </div>
          <p className="text-[#C9D1D9] text-sm leading-relaxed">
            "{testimonial.text}"
          </p>
        </div>

        {/* Reviewer info */}
        <div className="flex items-center gap-3">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-9 h-9 rounded-full border border-[#30363D] object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#21262D] flex items-center justify-center border border-[#30363D]">
              <User size={16} className="text-[#8B949E]" />
            </div>
          )}
          <div>
            <div className="text-white text-sm font-medium">{testimonial.name}</div>
            <div className="text-[#8B949E] text-xs font-mono">{testimonial.role}</div>
          </div>

          {/* Approved badge */}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-[#3FB950] bg-[#3FB950]/10 border border-[#3FB950]/25 rounded-full px-2.5 py-1 font-mono">
            <Check size={10} />
            Approved
          </div>
        </div>

        {/* PR merge info */}
        <div className="font-mono text-xs text-[#484F58] flex items-center gap-2 pt-1 border-t border-[#21262D]">
          <Check size={10} className="text-[#BC8CFF]" />
          <span>
            <span className="text-[#BC8CFF]">{testimonial.name?.split(' ')[0]}</span>
            {' '}merged this review into{' '}
            <span className="text-[#3FB950]">main</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Testimonials Section ────────────────────────────────────── */
export default function Testimonials() {
  const { portfolioData } = usePortfolio();
  const { testimonials } = portfolioData;
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="testimonials"
      ref={ref}
      className="bg-[#0D1117] py-24 px-4 border-t border-[#30363D]"
      aria-label="Testimonials — Pull Requests"
    >
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-3">
            <GitPullRequest size={20} className="text-[#BC8CFF]" />
            <h2 className="text-white font-semibold text-xl">
              <span className="text-[#8B949E] font-mono">$ </span>
              Pull Requests — Reviews
            </h2>
          </div>
          <p className="text-[#8B949E] font-mono text-sm pl-9">
            # {testimonials.length} reviews · all merged ✓
          </p>
        </motion.div>

        {/* PR filter bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="flex flex-wrap items-center gap-2 bg-[#161B22] border border-[#30363D] rounded-lg px-4 py-2.5 font-mono text-xs"
        >
          <span className="text-[#3FB950]">● Open</span>
          <span className="text-[#8B949E]">0</span>
          <span className="mx-2 text-[#30363D]">|</span>
          <Check size={11} className="text-[#BC8CFF]" />
          <span className="text-white">Merged</span>
          <span className="text-[#8B949E]">{testimonials.length}</span>
          <span className="ml-auto text-[#8B949E]">Sorted by: Most recent</span>
        </motion.div>

        {/* PR grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <PRCard
              key={`${t.name}-${i}`}
              testimonial={t}
              index={i}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
