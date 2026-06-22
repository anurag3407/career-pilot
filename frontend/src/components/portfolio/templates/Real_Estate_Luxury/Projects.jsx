import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const ease = [0.25, 0.1, 0.25, 1];

export default function Projects({ data }) {
  return (
    <section className="bg-[#111118] px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease }}
        className="mx-auto max-w-7xl"
      >
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-[#C9A96E]">03 / PORTFOLIO</p>
            <h2
              className="font-serif text-4xl font-light text-[#F5F0E8] md:text-6xl"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Selected Works
            </h2>
          </div>
          <div className="h-px w-28 bg-[#C9A96E]/60 md:w-40" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(data.projects || []).map((project, index) => (
            <motion.article
              key={project?.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: index * 0.1, ease }}
              whileHover={{ y: -4 }}
              className={`group overflow-hidden border border-[#1E1E2A] bg-[#0A0A0F] transition-all duration-300 hover:border-[#C9A96E]/50 ${
                index === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${index === 0 ? 'h-72' : 'h-56'}`}>
                {project?.image ? (
                  <img
                    src={project.image}
                    alt={project?.title || 'Project preview'}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/20 to-transparent" />
                <div className="absolute bottom-4 left-4 flex gap-3 text-xs uppercase tracking-[0.2em] text-[#E8D5A3]">
                  <span>{data.stats?.yearsExperience}Y</span>
                  <span className="text-[#C9A96E]/50">/</span>
                  <span>{data.stats?.projectsCompleted} Works</span>
                </div>
              </div>

              <div className="p-6">
                <h3
                  className="font-serif text-2xl font-light text-[#F5F0E8]"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  {project?.title}
                </h3>
                <div className="my-4 h-px w-8 bg-[#C9A96E]" />
                <p className="line-clamp-3 text-sm font-light leading-relaxed text-[#A8A090]">
                  {project?.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(project?.techStack || []).map((tech) => (
                    <span
                      key={tech}
                      className="border border-[#C9A96E]/30 px-2 py-0.5 text-xs tracking-wide text-[#C9A96E]/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {project?.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project?.title || 'Project'} live preview`}
                        className="text-[#A8A090] transition-colors hover:text-[#E8D5A3]"
                      >
                        <ExternalLink size={20} strokeWidth={1.5} />
                      </a>
                    ) : null}
                    {project?.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project?.title || 'Project'} GitHub repository`}
                        className="text-[#A8A090] transition-colors hover:text-[#E8D5A3]"
                      >
                        <Github size={20} strokeWidth={1.5} />
                      </a>
                    ) : null}
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A96E]">
                    VIEW PROJECT -&gt;
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
