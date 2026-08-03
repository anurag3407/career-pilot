import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, FolderKanban, Github } from 'lucide-react';
import { normalizeExternalUrl } from '../../../../utils/externalUrl';

const ease = [0.22, 1, 0.36, 1];

export default function Projects({ data }) {
  return (
    <section id="projects" className="bg-[#FFFDF8] px-5 py-24 md:px-8 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease }}
        className="mx-auto max-w-7xl"
      >
        <div className="mb-12">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#C58A63]">
            <FolderKanban size={16} />
            Projects
          </p>
          <h2 className="scandi-serif mt-4 text-4xl font-semibold text-[#283028] md:text-5xl">
            Selected work in warm, spacious frames.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(data.projects || []).map((project, index) => {
            const liveUrl = normalizeExternalUrl(project?.liveUrl);
            const githubUrl = normalizeExternalUrl(project?.githubUrl);

            return (
              <motion.article
                key={`${project?.title || 'project'}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: index * 0.07, ease }}
                whileHover={{ y: -6 }}
                className={`group overflow-hidden rounded-[1.75rem] border border-[#E7DED1] bg-[#F7F3EA] shadow-[0_18px_55px_rgba(70,56,39,0.08)] ${
                  index === 0 ? 'lg:col-span-2' : ''
                }`}
              >
                <div className={index === 0 ? 'h-72 overflow-hidden' : 'h-56 overflow-hidden'}>
                  {project?.image ? (
                    <img
                      src={project.image}
                      alt={project?.title || 'Project preview'}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="p-6">
                  <h3 className="scandi-serif text-2xl font-semibold text-[#283028]">{project?.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#6F746B]">{project?.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {(project?.techStack || []).map((tech, techIndex) => (
                      <span
                        key={`${tech || 'tech'}-${techIndex}`}
                        className="rounded-full bg-[#FFFDF8] px-3 py-1 text-xs font-semibold text-[#526053]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    {liveUrl ? (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project?.title || 'Project'} live site`}
                        className="rounded-full border border-[#D9C3A8] bg-[#FFFDF8] p-2 text-[#315343] transition hover:border-[#315343] hover:bg-[#315343] hover:text-white"
                      >
                        <ExternalLink size={18} />
                      </a>
                    ) : null}
                    {githubUrl ? (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project?.title || 'Project'} GitHub repository`}
                        className="rounded-full border border-[#D9C3A8] bg-[#FFFDF8] p-2 text-[#315343] transition hover:border-[#315343] hover:bg-[#315343] hover:text-white"
                      >
                        <Github size={18} />
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
