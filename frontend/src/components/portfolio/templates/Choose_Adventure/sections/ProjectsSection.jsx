import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Code2, ChevronRight, ChevronLeft } from 'lucide-react';

export default function ProjectsSection({ data, onChoice }) {
  const projects = data.projects ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  const active = projects[activeIndex] ?? null;

  const choices = [
    { label: 'Read my work experience', next: 'experience' },
    { label: 'Learn about my skills', next: 'skills' },
    { label: 'Get in touch with me', next: 'contact' },
  ];

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f0e17] flex items-center justify-center font-mono">
        <p className="text-slate-500 text-sm">No projects available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0e17] flex flex-col items-center justify-center px-4 py-16 font-mono relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-violet-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.p
          className="text-xs text-amber-400 uppercase tracking-widest mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Chapter 3 — The Artefacts
        </motion.p>

        <motion.div
          className="border border-violet-800/50 rounded-2xl bg-[#1a1a2e]/80 backdrop-blur mb-8 shadow-xl shadow-violet-950/40 overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative h-40 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIndex}
                src={active.image}
                alt={active.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Code2 size={14} className="text-violet-400" />
              <span className="text-xs text-violet-400 uppercase tracking-wider">Project</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-bold text-white mb-2">{active.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">{active.description}</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {active.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2.5 py-1 rounded-full bg-violet-900/50 border border-violet-700/40 text-violet-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  {active.liveUrl && (
                    <a
                      href={active.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                    >
                      <ExternalLink size={11} />
                      Live Demo
                    </a>
                  )}
                  {active.githubUrl && (
                    <a
                      href={active.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white transition-colors"
                    >
                      <Github size={11} />
                      Source
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between px-6 pb-5">
            <button type="button"
              onClick={() => setActiveIndex((p) => Math.max(0, p - 1))}
              disabled={activeIndex === 0}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <div className="flex gap-1.5">
              {projects.map((p, i) => (
                <button type="button"
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`View project: ${p.title}`}
                  aria-current={i === activeIndex ? 'true' : undefined}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeIndex ? 'bg-violet-400' : 'bg-slate-700 hover:bg-slate-500'}`}
                />
              ))}
            </div>
            <button type="button"
              onClick={() => setActiveIndex((p) => Math.min(projects.length - 1, p + 1))}
              disabled={activeIndex === projects.length - 1}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={14} />
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
              <ChevronRight size={14} className="text-violet-400 group-hover:text-amber-400 transition-colors shrink-0" />
              <span className="text-sm">{choice.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
