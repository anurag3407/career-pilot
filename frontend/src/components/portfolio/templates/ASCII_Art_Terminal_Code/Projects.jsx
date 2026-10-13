import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, ChevronRight, ChevronDown, Code2, Folder, FolderOpen } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

/* ─── Project Card — code-editor style ──────────────────────────── */
function ProjectCard({ project, index, isOpen, onToggle }) {
  const slugify = str => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="border border-green-900/40 bg-black/80 hover:border-green-700/60 transition-colors"
    >
      {/* File tree row */}
      <button type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-4 py-2.5 font-mono text-sm text-left hover:bg-green-900/10 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-green-500"
        aria-expanded={isOpen}
        aria-controls={`project-${index}`}
        id={`project-btn-${index}`}
      >
        <ChevronRight
          size={14}
          className={`text-green-600 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
        {isOpen
          ? <FolderOpen size={14} className="text-amber-400 shrink-0" />
          : <Folder size={14} className="text-amber-700 shrink-0" />
        }
        <span className="text-green-300">├──</span>
        <span className="text-white flex-1">{slugify(project.title)}/</span>
        <div className="flex gap-1.5 flex-wrap">
          {project.techStack?.slice(0, 3).map(t => (
            <span
              key={t}
              className="text-[10px] border border-green-900/60 text-green-700 px-1.5 py-0.5 rounded-sm"
            >
              {t}
            </span>
          ))}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`project-${index}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-green-900/30">
              {/* Editor header */}
              <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-950/80 border-b border-green-900/20 font-mono text-xs text-green-800">
                <Code2 size={10} />
                <span>README.md</span>
                <span className="ml-auto text-green-900">utf-8</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Screenshot */}
                {project.image && (
                  <div className="relative overflow-hidden border-r border-green-900/20 bg-gray-950">
                    <div className="font-mono text-xs text-green-900 px-3 pt-2 pb-1">
                      {`// preview`}
                    </div>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-40 object-cover opacity-70 hover:opacity-90 transition-opacity"
                      loading="lazy"
                    />
                    {/* CRT overlay on image */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px)' }}
                    />
                  </div>
                )}

                {/* Text info */}
                <div className="p-4 font-mono text-xs space-y-3">
                  {/* Title */}
                  <div>
                    <span className="text-green-700"># </span>
                    <span className="text-amber-400 font-bold text-sm">{project.title}</span>
                  </div>

                  {/* Description */}
                  <div className="text-green-300/70 leading-relaxed">
                    {project.description}
                  </div>

                  {/* Tech stack */}
                  {project.techStack?.length > 0 && (
                    <div>
                      <div className="text-green-700 mb-1">{'/* tech_stack */'}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map(t => (
                          <span
                            key={t}
                            className="border border-cyan-900/60 text-cyan-400 px-2 py-0.5 text-[10px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-3 pt-1">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        id={`project-github-${index}`}
                        className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors border border-green-900/50 hover:border-green-700/60 px-2 py-1"
                        aria-label={`View ${project.title} on GitHub`}
                      >
                        <Github size={11} />
                        <span>$ git clone</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        id={`project-live-${index}`}
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors border border-cyan-900/50 hover:border-cyan-700/60 px-2 py-1"
                        aria-label={`View ${project.title} live demo`}
                      >
                        <ExternalLink size={11} />
                        <span>$ open --live</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Projects Section ────────────────────────────────────────────── */
export default function Projects() {
  const data = usePortfolio();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = i => setOpenIndex(prev => (prev === i ? null : i));

  return (
    <section
      id="projects"
      ref={ref}
      className="bg-black py-20 px-4 border-t border-green-900/30"
      aria-label="Projects"
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Command */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="font-mono"
        >
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-700">user@portfolio:~/projects$</span>
            <span className="text-white"> ls -la projects/</span>
          </div>
          <div className="text-green-700 text-xs mt-1 mb-2">
            {'# total '}{data.projects.length}{' projects found'}
          </div>
        </motion.div>

        {/* File tree header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="font-mono text-xs flex items-center gap-3 text-green-800 border-b border-green-900/30 pb-2"
        >
          <span className="w-4" />
          <span className="w-48">name</span>
          <span>stack</span>
        </motion.div>

        {/* Project tree root */}
        <div className="font-mono text-xs text-green-700 mb-1">
          <span>projects/</span>
        </div>

        {/* Project list */}
        <div className="space-y-2">
          {data.projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
          <div className="font-mono text-xs text-green-900 pl-4">└── (end of directory)</div>
        </div>

        {/* Footer prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="font-mono text-xs text-green-900"
        >
          <div>{`# ${data.projects.length} entries — click to expand`}</div>
          <div className="flex items-center gap-1 text-green-500 mt-1">
            <span>user@portfolio:~/projects$</span>
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
