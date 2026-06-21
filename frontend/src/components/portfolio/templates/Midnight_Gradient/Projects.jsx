import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, ExternalLink, Github } from 'lucide-react';

const GlowingCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut", delay }}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
    className={`relative group rounded-2xl border border-indigo-500/10 hover:border-cyan-400/40 bg-[#0a0d24]/60 backdrop-blur-md hover:shadow-[0_0_35px_rgba(34,211,238,0.12)] transition-all duration-300 ${className}`}
  >
    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-cyan-500/5 group-hover:to-purple-500/5 blur-xl transition-all duration-500" />
    {children}
  </motion.div>
);

export default function Projects({ data }) {
  return (
    <section className="relative px-6 py-24 bg-[#030514]/40 border-y border-indigo-950/20 text-left">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-14">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-cyan-400">
            <Star size={20} />
          </div>
          <div>
            <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">Showcase</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Featured Projects</h2>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(data.projects || []).map((project, idx) => (
            <GlowingCard key={project.title} className="flex flex-col h-full overflow-hidden" delay={idx * 0.08}>
              {/* Image Container */}
              <div className="relative overflow-hidden group/img">
                <img
                  src={project.image}
                  alt={project.title || "Project Screenshot"}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover/img:scale-108"
                />
                {/* Visual shadow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />
                {project.featured && (
                  <span className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/25 border border-cyan-400/30 text-cyan-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                    <Award size={12} /> Featured
                  </span>
                )}
              </div>

              {/* Content body */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-white font-bold text-xl mb-2.5 group-hover:text-cyan-400 transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">
                  {project.description}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 rounded-md bg-[#0e1236]/80 border border-indigo-500/10 text-cyan-300/80 text-2xs font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Interactive Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-indigo-500/10">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
                    >
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-gray-200 transition-colors duration-200 ml-auto"
                    >
                      <Github size={14} /> Source Code
                    </a>
                  )}
                </div>
              </div>
            </GlowingCard>
          ))}
        </div>
      </div>
    </section>
  );
}
