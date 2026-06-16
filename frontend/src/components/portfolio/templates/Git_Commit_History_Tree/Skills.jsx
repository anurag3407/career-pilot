import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Tag, ChevronRight, ChevronDown, GitBranch } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

/* ─── Version tag colors per category ────────────────────────── */
const CATEGORY_META = {
  Frontend: { color: '#58A6FF', bg: 'rgba(88,166,255,0.1)',  branch: 'frontend/',  border: 'rgba(88,166,255,0.25)' },
  Backend:  { color: '#3FB950', bg: 'rgba(63,185,80,0.1)',   branch: 'backend/',   border: 'rgba(63,185,80,0.25)'  },
  DevOps:   { color: '#F0883E', bg: 'rgba(240,136,62,0.1)',  branch: 'devops/',    border: 'rgba(240,136,62,0.25)' },
  Design:   { color: '#BC8CFF', bg: 'rgba(188,140,255,0.1)', branch: 'design/',    border: 'rgba(188,140,255,0.25)'},
  Other:    { color: '#8B949E', bg: 'rgba(139,148,158,0.1)', branch: 'other/',     border: 'rgba(139,148,158,0.25)'},
};

/* ─── Single Tag Pill ─────────────────────────────────────────── */
function TagPill({ skill, index, inView }) {
  const pct = skill.level || 72;
  const ver = `v.${skill.name.replace(/[^a-zA-Z0-9.]/g, '-')}`;
  const meta = CATEGORY_META[skill.category] || CATEGORY_META.Other;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="group relative flex items-center gap-2 rounded-full px-3 py-1.5 border text-sm font-mono cursor-default transition-all hover:scale-105"
      style={{ backgroundColor: meta.bg, borderColor: meta.border, color: meta.color }}
      title={`Proficiency: ${pct}%`}
    >
      <Tag size={11} />
      <span>{ver}</span>
      {/* Tooltip */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#161B22] border border-[#30363D] rounded px-2 py-1 text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {pct}% proficiency
      </div>
    </motion.div>
  );
}

/* ─── Branch Group ────────────────────────────────────────────── */
function BranchGroup({ category, skills, meta, inView, globalIdx }) {
  const [open, setOpen] = useState(true);
  const groupRef = useRef(null);

  return (
    <motion.div
      ref={groupRef}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden"
    >
      {/* Branch header / toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 border-b border-[#30363D] hover:bg-[#1C2128] transition-colors text-left"
        aria-expanded={open}
        id={`skills-branch-${category}`}
      >
        {open
          ? <ChevronDown size={14} style={{ color: meta.color }} />
          : <ChevronRight size={14} style={{ color: meta.color }} />
        }
        <GitBranch size={14} style={{ color: meta.color }} />
        <span className="font-mono text-sm" style={{ color: meta.color }}>
          {meta.branch}
        </span>
        <span className="font-mono text-sm text-white">{category}</span>
        <span
          className="ml-auto text-xs rounded-full px-2 py-0.5 border font-mono"
          style={{ backgroundColor: meta.bg, borderColor: meta.border, color: meta.color }}
        >
          {skills.length} tags
        </span>
      </button>

      {/* Skill tags */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 p-4">
              {skills.map((skill, i) => (
                <TagPill
                  key={skill.name}
                  skill={skill}
                  index={globalIdx + i}
                  inView={inView}
                />
              ))}
            </div>

            {/* Skill level bars */}
            <div className="border-t border-[#30363D] px-4 py-3 space-y-2">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: (globalIdx + i) * 0.06 }}
                  className="flex items-center gap-3 font-mono text-xs"
                >
                  <span className="text-[#8B949E] w-28 truncate shrink-0">{skill.name}</span>
                  <div className="flex-1 h-1.5 bg-[#21262D] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.level || 72}%` } : { width: 0 }}
                      transition={{ delay: (globalIdx + i) * 0.06 + 0.3, duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                  </div>
                  <span style={{ color: meta.color }} className="w-8 text-right shrink-0">
                    {skill.level || 72}%
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Skills Section ──────────────────────────────────────────── */
export default function Skills() {
  const { portfolioData } = usePortfolio();
  const { skills } = portfolioData;
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  // Group by category
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  let globalIdx = 0;

  return (
    <section
      id="skills"
      ref={ref}
      className="bg-[#0D1117] py-24 px-4 border-t border-[#30363D]"
      aria-label="Skills"
    >
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <Tag size={20} className="text-[#BC8CFF]" />
            <h2 className="text-white font-semibold text-xl">
              <span className="text-[#8B949E] font-mono">$ </span>git tag --list
            </h2>
          </div>
          <p className="text-[#8B949E] font-mono text-sm pl-9">
            # {skills.length} tags found across {Object.keys(grouped).length} branches
          </p>
        </motion.div>

        {/* All tags overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-[#161B22] border border-[#30363D] rounded-lg p-5"
        >
          <div className="flex items-center gap-2 mb-4 font-mono text-xs text-[#8B949E] border-b border-[#30363D] pb-3">
            <Tag size={12} className="text-[#BC8CFF]" />
            <span>All release tags</span>
            <span className="ml-auto text-[#BC8CFF]">{skills.length} total</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <TagPill key={skill.name} skill={skill} index={i} inView={inView} />
            ))}
          </div>
        </motion.div>

        {/* Branch groups */}
        <div className="space-y-4">
          <div className="font-mono text-xs text-[#8B949E] flex items-center gap-2">
            <GitBranch size={12} className="text-[#3FB950]" />
            Branch breakdown
          </div>
          {Object.entries(grouped).map(([category, categorySkills]) => {
            const meta = CATEGORY_META[category] || CATEGORY_META.Other;
            const startIdx = globalIdx;
            globalIdx += categorySkills.length;
            return (
              <BranchGroup
                key={category}
                category={category}
                skills={categorySkills}
                meta={meta}
                inView={inView}
                globalIdx={startIdx}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
