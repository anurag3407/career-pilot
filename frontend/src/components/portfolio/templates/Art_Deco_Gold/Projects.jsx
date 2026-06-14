import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const isSafeUrl = (url) => {
  if (!url || url === '#') {
    return false;
  }

  try {
    const parsed = new URL(url);

    return (
      parsed.protocol === 'http:' ||
      parsed.protocol === 'https:'
    );
  } catch {
    return false;
  }
};

export default function Projects({ data }) {
  const projects = data?.projects || [];

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

          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-200/70">
            Projects
          </span>

          <div className="h-1.5 w-20 rounded-full bg-amber-200/90" />
        </motion.div>

        {projects.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-2">
            {projects.map((project, index) => {
              const hasLiveUrl = isSafeUrl(project?.liveUrl);
              const hasGithubUrl = isSafeUrl(project?.githubUrl);

              const techStack = Array.isArray(project?.techStack)
                ? project.techStack
                : [];

              return (
                <motion.article
                  key={`${project?.title || 'project'}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.65,
                    delay: index * 0.06,
                  }}
                  whileHover={{ y: -6 }}
                  className="group overflow-hidden rounded-[2rem] border border-amber-200/20 bg-slate-900/80 shadow-[0_30px_80px_rgba(15,23,42,0.3)]"
                >
                  <div className="relative h-72 overflow-hidden bg-slate-950">
                    {project?.image ? (
                      <img
                        src={project.image}
                        alt={project?.title || 'Project'}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-amber-200/50">
                        No image available
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent" />
                  </div>

                  <div className="p-8">
                    <h3 className="mb-4 text-2xl font-serif font-black text-amber-100">
                      {project?.title || 'Untitled Project'}
                    </h3>

                    <p className="text-sm leading-relaxed text-amber-100/80">
                      {project?.description ||
                        'No description available.'}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {techStack.map((tech) => (
                        <span
                          key={`${project?.title}-${tech}`}
                          className="rounded-full border border-amber-200/20 bg-amber-100/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-amber-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {(hasLiveUrl || hasGithubUrl) && (
                      <div className="mt-8 flex flex-wrap gap-4">
                        {hasLiveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.26em] text-amber-100 transition hover:text-white"
                          >
                            <ExternalLink size={14} />
                            Live
                          </a>
                        )}

                        {hasGithubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.26em] text-amber-100 transition hover:text-white"
                          >
                            <Github size={14} />
                            Code
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-amber-200/20 bg-slate-900/80 p-8 text-center shadow-[0_30px_80px_rgba(15,23,42,0.3)]">
            <p className="text-amber-100/80">
              No projects available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}