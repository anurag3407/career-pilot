import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Layers } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

function ProjectLinks({ project }) {
  return (
    <div className="flex items-center gap-3">
      {project?.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-[#8884A8] transition hover:border-[#6366F1]/40 hover:bg-[#6366F1]/10 hover:text-white"
        >
          Live Demo
          <ExternalLink size={16} strokeWidth={1.8} />
        </a>
      ) : null}
      {project?.githubUrl ? (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-[#8884A8] transition hover:border-[#6366F1]/40 hover:bg-[#6366F1]/10 hover:text-white"
        >
          Source Code
          <Github size={16} strokeWidth={1.8} />
        </a>
      ) : null}
    </div>
  );
}

export default function Projects({ data }) {
  const [featured, ...rest] = data.projects || [];

  return (
    <section id="projects" className="bg-[#0D0D12] px-5 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease }}
        className="mx-auto max-w-7xl"
      >
        <div className="mb-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-3 py-1.5 text-sm text-indigo-300">
            <Layers size={15} strokeWidth={1.8} />
            Portfolio
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            Selected <span className="saas-gradient-text">Projects</span>
          </h2>
        </div>

        {featured ? (
          <motion.article
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="mb-7 grid overflow-hidden rounded-3xl border border-white/8 bg-[#13131A] p-4 shadow-2xl shadow-black/20 transition hover:border-[#6366F1]/40 lg:grid-cols-2"
          >
            <div className="relative overflow-hidden rounded-2xl">
              {featured?.image ? (
                <img
                  src={featured.image}
                  alt={featured?.title || 'Featured project'}
                  className="h-64 w-full object-cover transition duration-700 hover:scale-[1.02] lg:h-full"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/80 to-transparent" />
            </div>

            <div className="flex flex-col justify-center p-5 lg:p-10">
              <span className="mb-5 w-fit rounded-full border border-[#6366F1]/20 bg-[#6366F1]/10 px-3 py-1 text-xs font-medium text-indigo-300">
                Featured Project
              </span>
              <h3 className="text-2xl font-bold text-[#F1F0FF] md:text-3xl">{featured?.title}</h3>
              <p className="mt-4 leading-relaxed text-[#8884A8]">{featured?.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {(featured?.techStack || []).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-[#6366F1]/20 bg-[#6366F1]/10 px-3 py-1.5 font-mono text-xs text-indigo-300"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <ProjectLinks project={featured} />
              </div>
            </div>
          </motion.article>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((project, index) => (
            <motion.article
              key={project?.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="overflow-hidden rounded-2xl border border-white/8 bg-[#13131A] transition hover:border-[#6366F1]/40 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <div className="relative h-48 overflow-hidden">
                {project?.image ? (
                  <img
                    src={project.image}
                    alt={project?.title || 'Project preview'}
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/90 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-[#F1F0FF]">{project?.title}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#8884A8]">{project?.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(project?.techStack || []).slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-white/8 bg-[#0D0D12] px-2.5 py-1 font-mono text-[11px] text-[#8884A8]"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {tech}
                    </span>
                  ))}
                  {(project?.techStack || []).length > 3 ? (
                    <span className="rounded-md border border-white/8 bg-[#0D0D12] px-2.5 py-1 font-mono text-[11px] text-[#4B4870]">
                      +{(project?.techStack || []).length - 3} more
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  {project?.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project?.title || 'Project'} live demo`}
                      className="text-[#8884A8] transition hover:text-white"
                    >
                      <ExternalLink size={19} strokeWidth={1.8} />
                    </a>
                  ) : null}
                  {project?.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project?.title || 'Project'} source code`}
                      className="text-[#8884A8] transition hover:text-white"
                    >
                      <Github size={19} strokeWidth={1.8} />
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
