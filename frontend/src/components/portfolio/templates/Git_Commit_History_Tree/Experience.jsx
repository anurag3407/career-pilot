import React, { useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { GitCommit, GitBranch, GitMerge, Tag as TagIcon } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

/* ─── Deterministic hash for commit SHAs ─────────────────────── */
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(16).padStart(7, '0').slice(0, 7);
}

/* ─── Commit type label ───────────────────────────────────────── */
function commitType(index, total) {
  if (index === 0)           return { label: 'release', color: '#F0883E', icon: TagIcon };
  if (index === total - 1)  return { label: 'init',    color: '#BC8CFF', icon: GitBranch };
  if (index % 3 === 0)      return { label: 'feat',    color: '#3FB950', icon: GitCommit };
  return                           { label: 'feat',    color: '#58A6FF', icon: GitCommit };
}

/* ─── Single commit node ──────────────────────────────────────── */
function CommitNode({ job, index, total, inView }) {
  const isFirst   = index === 0;
  const isLast    = index === total - 1;
  const isCurrent = /present/i.test(job.period || '') || isFirst;
  const sha       = useMemo(() => hashStr(`${job.company}${job.role}${index}`), [job, index]);
  const { label: ctype, color, icon: CIcon } = commitType(index, total);

  // Diff stat fake but seeded
  const added   = useMemo(() => (hashStr(job.role + 'a') % 4000) + 500, [job.role]);
  const removed = useMemo(() => (hashStr(job.role + 'r') % 200)  + 10,  [job.role]);

  // Version tag for releases
  const version = isFirst ? 'v3.0' : isLast ? 'v1.0' : index === 1 ? 'v2.0' : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="flex gap-4"
    >
      {/* ── Graph column ── */}
      <div className="flex flex-col items-center shrink-0 w-8">
        {/* Connector line above */}
        {!isFirst && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ delay: index * 0.12, duration: 0.4, origin: 'top' }}
            className="w-px h-6 origin-top"
            style={{ backgroundColor: color + '60' }}
          />
        )}

        {/* Commit dot */}
        <div
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center z-10 transition-all ${
            isCurrent
              ? 'shadow-lg'
              : ''
          }`}
          style={{
            borderColor: color,
            backgroundColor: isCurrent ? color : '#0D1117',
            boxShadow: isCurrent ? `0 0 12px ${color}80` : 'none',
          }}
        >
          {isCurrent && (
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          )}
        </div>

        {/* Connector line below */}
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ delay: index * 0.12 + 0.1, duration: 0.4 }}
            className="w-px flex-1 min-h-[3rem] origin-top"
            style={{ backgroundColor: color + '40' }}
          />
        )}
      </div>

      {/* ── Commit card ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.12 + 0.05, duration: 0.45 }}
        className="flex-1 mb-6"
      >
        <div className="bg-[#161B22] border border-[#30363D] hover:border-[#58A6FF]/30 rounded-lg overflow-hidden transition-all group">
          {/* Commit header */}
          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-[#0D1117]/60 border-b border-[#30363D] font-mono text-xs">
            <CIcon size={11} style={{ color }} />
            <span style={{ color }}>{ctype}:</span>
            <span className="text-white font-medium flex-1 truncate">{job.role}</span>

            {/* Version tag */}
            {version && (
              <span
                className="flex items-center gap-1 border rounded px-1.5 py-0.5 text-[10px]"
                style={{ color: '#BC8CFF', borderColor: '#BC8CFF40', backgroundColor: 'rgba(188,140,255,0.1)' }}
              >
                <TagIcon size={9} />
                {version}
              </span>
            )}

            {/* HEAD badge */}
            {isCurrent && (
              <span className="text-[#3FB950] border border-[#3FB950]/40 bg-[#3FB950]/10 px-1.5 py-0.5 rounded text-[10px]">
                HEAD → main
              </span>
            )}
          </div>

          {/* Commit body */}
          <div className="px-4 py-3 space-y-2">
            {/* SHA + meta */}
            <div className="flex flex-wrap gap-4 font-mono text-xs text-[#8B949E]">
              <span>
                commit <span className="text-[#F0883E]">{sha}</span>
              </span>
              <span>
                Author: <span className="text-[#58A6FF]">{job.company}</span>
              </span>
              <span>
                Date: <span className="text-white">{job.period}</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-[#8B949E] text-sm leading-relaxed border-l-2 pl-3" style={{ borderColor: color + '50' }}>
              {job.description}
            </p>

            {/* Diff stat */}
            <div className="flex items-center gap-4 text-xs font-mono pt-1">
              <div className="flex items-center gap-1">
                <span className="text-[#3FB950]">+{added.toLocaleString()}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-sm"
                      style={{ backgroundColor: i < Math.ceil((added / 5000) * 5) ? '#3FB950' : '#21262D' }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#F85149]">-{removed.toLocaleString()}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-sm"
                      style={{ backgroundColor: i < Math.ceil((removed / 250) * 2) ? '#F85149' : '#21262D' }}
                    />
                  ))}
                </div>
              </div>
              <span className="text-[#484F58] ml-auto">{job.period}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Experience / Commit Graph Section ──────────────────────── */
export default function Experience() {
  const { portfolioData } = usePortfolio();
  const { experience } = portfolioData;
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="experience"
      ref={ref}
      className="bg-[#0D1117] py-24 px-4 border-t border-[#30363D]"
      aria-label="Experience"
    >
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-3">
            <GitCommit size={20} className="text-[#3FB950]" />
            <h2 className="text-white font-semibold text-xl">
              <span className="text-[#8B949E] font-mono">$ </span>
              git log --graph --all --oneline
            </h2>
          </div>
          <p className="text-[#8B949E] font-mono text-sm pl-9">
            # {experience.length} commits on branch <span className="text-[#3FB950]">career/main</span>
          </p>
        </motion.div>

        {/* Branch info bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-[#161B22] border border-[#30363D] rounded-lg px-4 py-3 flex flex-wrap gap-4 font-mono text-xs text-[#8B949E]"
        >
          <span className="flex items-center gap-1.5">
            <GitBranch size={11} className="text-[#3FB950]" />
            <span className="text-[#3FB950]">main</span>
          </span>
          <span>|</span>
          <span>{experience.length} commits</span>
          <span>|</span>
          <span className="text-[#58A6FF]">branch: career</span>
          <span>|</span>
          <span className="flex items-center gap-1">
            <GitMerge size={11} className="text-[#BC8CFF]" />
            upstream/main
          </span>
        </motion.div>

        {/* Commit log */}
        <div className="relative pl-4">
          {/* Vertical spine */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ delay: 0.2, duration: 1.2, ease: 'easeOut' }}
            className="absolute left-7 top-2 bottom-2 w-px origin-top"
            style={{ backgroundColor: '#30363D' }}
            aria-hidden="true"
          />

          {experience.map((job, i) => (
            <CommitNode
              key={`${job.company}-${i}`}
              job={job}
              index={i}
              total={experience.length}
              inView={inView}
            />
          ))}

          {/* Root init commit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: experience.length * 0.12 + 0.2, duration: 0.4 }}
            className="flex items-center gap-3 font-mono text-xs text-[#484F58] pl-0"
          >
            <div className="w-8 flex justify-center">
              <div className="w-3 h-3 rounded-full border border-[#484F58]" />
            </div>
            <span>init: career journey began</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
