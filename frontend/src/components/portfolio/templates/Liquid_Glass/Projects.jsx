import React from "react";
import { motion } from "framer-motion";
import { Star, ExternalLink, Github } from "lucide-react";

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] ${className}`}
  >
    {children}
  </div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Projects({ data }) {
  return (
    <section className="relative px-6 py-20 text-left">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-pink-500/20 blur-[100px] pointer-events-none" />
      <motion.div
        className="max-w-5xl mx-auto"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
          <Star size={20} className="text-cyan-400" />
          <h2 className="text-3xl font-black text-white">Projects</h2>
        </motion.div>

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data.projects || []).map((project, index) => (
            <motion.div key={index} variants={fadeUp}>
              <GlassCard className="overflow-hidden h-full flex flex-col">
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title || "Project Screenshot"}
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {project.featured && (
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-medium backdrop-blur-sm">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">{project.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-white/60 text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                        <ExternalLink size={13} /> Live
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors">
                        <Github size={13} /> Code
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
