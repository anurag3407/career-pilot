import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Github } from 'lucide-react';

export default function Projects({ data }) {
  const projects = Array.isArray(data?.projects) ? data.projects : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="relative mt-16 rounded-xl border border-slate-600/50 bg-[#0b0b0b]/98 p-8 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.016),rgba(255,255,255,0.016)_1px,transparent_1px,transparent_8px),repeating-linear-gradient(135deg,rgba(255,255,255,0.016),rgba(255,255,255,0.016)_1px,transparent_1px,transparent_8px)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.36em] text-slate-500">Projects</p>
          <h2 className="mt-4 text-3xl font-bold bg-gradient-to-r from-gray-100 via-slate-200 to-gray-100 bg-clip-text text-transparent sm:text-4xl">A showcase built for velocity.</h2>
        </div>
        <div className="rounded-sm border border-slate-600/50 bg-[#0d0d0d] px-4 py-2.5 text-[10px] uppercase tracking-[0.28em] text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          {projects.length} live case studies
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.title}
            className="group relative overflow-hidden rounded-sm border border-slate-700/50 bg-[#0a0a0a] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            {/* Chrome top rail */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300/60 to-transparent z-10" />
            <div className="relative overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="h-52 w-full object-cover transition duration-500 group-hover:scale-105 brightness-75"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),transparent_60%)]" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold bg-gradient-to-r from-gray-100 to-slate-200 bg-clip-text text-transparent tracking-tight">{project.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(project.techStack || []).map((tech) => (
                  <span
                    key={`${project.title}-${tech}`}
                    className="rounded-none border border-slate-700/50 bg-[#111] px-2.5 py-1 text-[10px] uppercase tracking-[0.28em] text-slate-500"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm border border-slate-400/70 bg-gradient-to-b from-slate-300/70 to-slate-400/70 px-4 py-2 text-xs font-semibold text-slate-900 transition hover:border-slate-300 hover:from-slate-200 hover:to-slate-300 hover:shadow-[0_4px_12px_rgba(192,192,192,0.3)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                  >
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                    Live site
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm border border-slate-500/70 bg-gradient-to-b from-slate-400/50 to-slate-500/50 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-slate-400 hover:from-slate-300/60 hover:to-slate-400/60 hover:text-slate-50 hover:shadow-[0_4px_12px_rgba(192,192,192,0.2)]"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Code
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}