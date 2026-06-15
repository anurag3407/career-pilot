import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Github, ExternalLink, Layers } from "lucide-react";
import data from "../../../../data/dummy_data.json";
import SectionHeading from "./SectionHeading";

const SEC = "relative z-10 py-24 px-4";

export default function Projects() {
  const { projects } = data;
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className={SEC}>
      <div className="max-w-6xl mx-auto">
        <SectionHeading>Projects</SectionHeading>
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(projects || []).map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{
                y: -8,
                borderColor: "rgba(139,92,246,0.35)",
                boxShadow: "0 20px 40px -20px rgba(139,92,246,0.25)",
              }}
              className="bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-white/5 overflow-hidden flex flex-col h-full group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-950">
                {project.image ? (
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Layers size={40} className="text-slate-700 group-hover:text-indigo-500/50 transition-colors duration-300" />
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5 z-10">
                  {(project.techStack || []).slice(0, 3).map(tech => (
                    <span key={tech} className="text-[10px] px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md border border-white/10 text-indigo-300 font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 tracking-wide group-hover:text-indigo-300 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                  {project.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                  {project.githubUrl ? (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
                      <Github size={14} /> Repository
                    </a>
                  ) : <div />}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500 text-indigo-300 hover:text-white border border-indigo-500/20 hover:border-transparent flex items-center gap-1.5 transition-all duration-300">
                      Live Demo <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}