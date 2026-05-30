import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const isValidExternalUrl = (url) => {
  if (typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export default function Projects({ data }) {
  const projects = data.projects || [];

  return (
    <section className="relative px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 flex items-center justify-center gap-3"
        >
          <div className="h-1.5 w-20 rounded-full bg-amber-200/90" />
          <span className="text-[10px] tracking-[0.35em] uppercase text-amber-200/70 font-semibold">
            Projects
          </span>
          <div className="h-1.5 w-20 rounded-full bg-amber-200/90" />
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.article
              key={`${project.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: index * 0.06 }}
              whileHover={{ y: -6 }}
              className="group overflow-hidden rounded-[2rem] border border-amber-200/20 bg-slate-900/80 shadow-[0_30px_80px_rgba(15,23,42,0.3)]"
            >
              <div className="relative h-72 overflow-hidden bg-slate-950">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-serif font-black text-amber-100 mb-4">
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed text-amber-100/80">
                  {project.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {(project.techStack || []).map((tech) => (
                    <span
                      key={`${project.title}-${tech}`}
                      className="rounded-full border border-amber-200/20 bg-amber-100/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-amber-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  {isValidExternalUrl(project.liveUrl) && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.26em] text-amber-100 hover:text-white transition"
                    >
                      <ExternalLink size={14} /> Live
                    </a>
                  )}
                  {isValidExternalUrl(project.githubUrl) && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.26em] text-amber-100 hover:text-white transition"
                    >
                      <Github size={14} /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
