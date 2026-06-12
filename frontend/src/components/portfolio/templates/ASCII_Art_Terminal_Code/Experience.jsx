import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GitCommit, GitBranch, Circle } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

/* ─── Single commit node ─────────────────────────────────────────── */
function CommitNode({ job, index, isLast, inView }) {
  // Parse a year from the period string (e.g. "2022 – Present" → "2022")
  const yearMatch = job.period?.match(/\d{4}/);
  const year = yearMatch ? yearMatch[0] : '';
  const isCurrent = /present/i.test(job.period || '');

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="flex gap-4 font-mono"
    >
      {/* Git graph column */}
      <div className="flex flex-col items-center w-8 shrink-0">
        {/* Connector line above */}
        {index > 0 && (
          <div className="w-px flex-none h-4 bg-green-800/60" style={{ minHeight: '1rem' }} />
        )}

        {/* Commit dot */}
        <div
          className={`w-3 h-3 rounded-full border-2 flex-none shrink-0 z-10 ${
            isCurrent
              ? 'border-green-400 bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]'
              : 'border-green-700 bg-black'
          }`}
        />

        {/* Connector line below */}
        {!isLast && (
          <div className="w-px flex-1 bg-green-800/60 mt-0" style={{ minHeight: '2rem' }} />
        )}
      </div>

      {/* Content */}
      <div className="pb-8 flex-1 min-w-0">
        {/* Commit hash line */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-green-700 mb-1">
          <span className="text-amber-700">commit</span>
          <span className="text-green-800">{`${Math.random().toString(16).slice(2, 9)}`}</span>
          {isCurrent && (
            <span className="text-green-500 border border-green-700/50 px-1.5 py-0.5 text-[10px]">
              HEAD → main
            </span>
          )}
        </div>

        {/* Author/Date */}
        <div className="text-xs text-green-700 mb-2">
          <span className="text-green-800">Author: </span>
          <span className="text-green-500">{job.company}</span>
          <span className="text-green-800">  Date: </span>
          <span className="text-green-600">{job.period}</span>
        </div>

        {/* Commit message (role) */}
        <div className="text-sm text-white mb-2">
          <span className="text-green-500">feat: </span>
          <span>{job.role}</span>
          {year && (
            <span className="ml-2 text-xs text-green-800">@ {job.company}</span>
          )}
        </div>

        {/* Description as diff-style block */}
        <div className="border-l-2 border-green-900/50 pl-3 text-xs text-green-300/60 leading-relaxed">
          {job.description}
        </div>

        {/* Diff summary */}
        <div className="flex gap-3 mt-2 text-[10px] font-mono">
          <span className="text-green-500">
            +{Math.floor(Math.random() * 5000 + 500)} lines added
          </span>
          <span className="text-red-700">
            -{Math.floor(Math.random() * 200 + 10)} legacy removed
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Experience Section ─────────────────────────────────────────── */
export default function Experience() {
  const data = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="experience"
      ref={ref}
      className="bg-black py-20 px-4 border-t border-green-900/30"
      aria-label="Experience"
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
            <span className="text-white"> git log --oneline --graph --all</span>
          </div>
          <div className="text-green-700 text-xs mt-1 mb-2">
            {'# ── commit history ─────────────────────────────────────────'}
          </div>
        </motion.div>

        {/* Branch info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="font-mono text-xs flex flex-wrap gap-4 text-green-800 border border-green-900/30 bg-green-950/10 px-4 py-2"
        >
          <span className="flex items-center gap-1">
            <GitBranch size={11} className="text-green-600" />
            <span className="text-green-500">main</span>
          </span>
          <span>|</span>
          <span>{data.experience.length} commits on record</span>
          <span>|</span>
          <span className="text-green-600">branch: career</span>
        </motion.div>

        {/* Commit graph */}
        <div className="pl-2">
          {data.experience.map((job, i) => (
            <CommitNode
              key={`${job.company}-${i}`}
              job={job}
              index={i}
              isLast={i === data.experience.length - 1}
              inView={inView}
            />
          ))}
        </div>

        {/* Root commit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: data.experience.length * 0.15 + 0.2, duration: 0.4 }}
          className="font-mono text-xs text-green-900 pl-6 flex items-center gap-2"
        >
          <Circle size={8} className="text-green-900" />
          <span>init: career began</span>
        </motion.div>

        {/* Footer prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="font-mono text-xs text-green-900"
        >
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
