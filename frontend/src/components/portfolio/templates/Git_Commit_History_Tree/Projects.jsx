import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { GitBranch, GitMerge, Github, ExternalLink, Check, Code2, Star } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

/* ─── Slugify ─────────────────────────────────────────────────── */
const slugify = str =>
  str?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'project';

/* ─── Branch colors (cycle) ───────────────────────────────────── */
const BRANCH_COLORS = [
  { line: '#58A6FF', bg: 'rgba(88,166,255,0.08)',  border: 'rgba(88,166,255,0.25)' },
  { line: '#3FB950', bg: 'rgba(63,185,80,0.08)',   border: 'rgba(63,185,80,0.25)'  },
  { line: '#BC8CFF', bg: 'rgba(188,140,255,0.08)', border: 'rgba(188,140,255,0.25)'},
  { line: '#F0883E', bg: 'rgba(240,136,62,0.08)',  border: 'rgba(240,136,62,0.25)' },
];

/* ─── Project Card ────────────────────────────────────────────── */
function ProjectCard({ project, index, inView }) {
  const [expanded, setExpanded] = useState(false);
  const theme = BRANCH_COLORS[index % BRANCH_COLORS.length];
  const branchName = `feature/${slugify(project.title)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex gap-4"
    >
      {/* Branch indicator line */}
      <div className="flex flex-col items-center shrink-0 w-4 pt-4">
        <div
          className="w-0.5 flex-1 min-h-full rounded-full"
          style={{ backgroundColor: theme.line + '50' }}
        />
      </div>

      {/* Card */}
      <div
        className="flex-1 mb-4 rounded-lg border overflow-hidden transition-all"
        style={{ backgroundColor: theme.bg, borderColor: theme.border }}
      >
        {/* Branch name header */}
        <button type="button"
          onClick={() => setExpanded(v => !v)}
          className="w-full flex items-center gap-3 px-4 py-3 border-b text-left hover:opacity-90 transition-all"
          style={{ borderColor: theme.border }}
          aria-expanded={expanded}
          id={`project-expand-${index}`}
        >
          <GitBranch size={14} style={{ color: theme.line }} />
          <span className="font-mono text-sm flex-1" style={{ color: theme.line }}>
            {branchName}
          </span>

          {/* Merged badge */}
          <span
            className="flex items-center gap-1 text-[10px] font-mono border rounded-full px-2 py-0.5"
            style={{ color: '#3FB950', borderColor: '#3FB95040', backgroundColor: 'rgba(63,185,80,0.1)' }}
          >
            <Check size={9} />
            Merged into main ✓
          </span>

          <GitMerge size={14} className="text-[#8B949E]" />
        </button>

        {/* Collapsed preview */}
        <div className="flex items-center gap-3 px-4 py-2.5">
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="w-10 h-10 rounded object-cover border border-[#30363D]"
              loading="lazy"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium text-sm">{project.title}</div>
            <div className="text-[#8B949E] text-xs truncate">{project.description}</div>
          </div>
          <div className="flex gap-2 shrink-0">
            {project.techStack?.slice(0, 2).map(t => (
              <span key={t} className="text-[10px] border border-[#30363D] text-[#8B949E] px-1.5 py-0.5 rounded font-mono">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t" style={{ borderColor: theme.border }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  {/* Screenshot */}
                  {project.image && (
                    <div className="relative overflow-hidden border-r" style={{ borderColor: theme.border }}>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0D1117]/60 border-b font-mono text-xs text-[#8B949E]" style={{ borderColor: theme.border }}>
                        <Code2 size={10} />
                        <span>preview.png</span>
                      </div>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-44 object-cover opacity-80 hover:opacity-100 transition-opacity"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-4 space-y-3 font-mono text-sm">
                    <div>
                      <span className="text-[#8B949E] text-xs">## </span>
                      <span className="text-white font-semibold">{project.title}</span>
                    </div>

                    <p className="text-[#8B949E] text-xs leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tech stack */}
                    {project.techStack?.length > 0 && (
                      <div>
                        <div className="text-[#8B949E] text-[10px] mb-1.5">## tech_stack</div>
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.map((t, ti) => {
                            const tagColor = BRANCH_COLORS[ti % BRANCH_COLORS.length];
                            return (
                              <span
                                key={t}
                                className="text-[10px] border rounded px-2 py-0.5"
                                style={{ color: tagColor.line, borderColor: tagColor.border, backgroundColor: tagColor.bg }}
                              >
                                {t}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-2 pt-1">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          id={`project-github-${index}`}
                          aria-label={`View ${project.title} on GitHub`}
                          className="flex items-center gap-1.5 bg-[#21262D] border border-[#30363D] hover:border-[#58A6FF]/50 text-[#8B949E] hover:text-white rounded px-3 py-1.5 text-xs transition-all"
                        >
                          <Github size={11} />
                          <span>Source</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          id={`project-live-${index}`}
                          aria-label={`View ${project.title} live`}
                          className="flex items-center gap-1.5 bg-[#238636]/20 border border-[#3FB950]/30 hover:border-[#3FB950]/60 text-[#3FB950] rounded px-3 py-1.5 text-xs transition-all"
                        >
                          <ExternalLink size={11} />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Projects Section ────────────────────────────────────────── */
export default function Projects() {
  const { portfolioData } = usePortfolio();
  const { projects } = portfolioData;
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="projects"
      ref={ref}
      className="bg-[#0D1117] py-24 px-4 border-t border-[#30363D]"
      aria-label="Projects"
    >
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-3">
            <GitBranch size={20} className="text-[#58A6FF]" />
            <h2 className="text-white font-semibold text-xl">
              <span className="text-[#8B949E] font-mono">$ </span>
              git branch --all
            </h2>
          </div>
          <p className="text-[#8B949E] font-mono text-sm pl-9">
            # {projects.length} feature branches — all merged into main ✓
          </p>
        </motion.div>

        {/* Main branch line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="flex items-center gap-2 font-mono text-xs text-[#3FB950] bg-[#161B22] border border-[#30363D] rounded-lg px-4 py-2.5"
        >
          <GitBranch size={12} />
          <span>* main</span>
          <span className="text-[#8B949E] ml-2">← all feature branches merged here</span>
          <Star size={11} className="ml-auto text-[#F0883E]" />
        </motion.div>

        {/* Feature branches */}
        <div className="relative">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
