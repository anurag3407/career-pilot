import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, FlaskConical, ArrowUpRight } from "lucide-react";

export default function Projects({ data }) {
  const { projects } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" ref={ref} className="py-24 bg-gradient-to-br from-blue-50/40 to-slate-50">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase block mb-3">Research & Work</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Featured Projects
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto text-base">Clinical research, publications, and initiatives that demonstrate commitment to advancing medical knowledge.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {(projects ?? []).map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/60 transition-all duration-300 flex flex-col"
            >
              <div className="h-44 bg-gradient-to-br from-blue-100 via-sky-100 to-teal-50 relative overflow-hidden flex items-center justify-center">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-20">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        <circle cx="100" cy="100" r="80" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
                        <circle cx="100" cy="100" r="60" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
                        <circle cx="100" cy="100" r="40" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
                        <line x1="20" y1="100" x2="180" y2="100" stroke="#3b82f6" strokeWidth="0.5" />
                        <line x1="100" y1="20" x2="100" y2="180" stroke="#3b82f6" strokeWidth="0.5" />
                      </svg>
                    </div>
                    <FlaskConical className="w-14 h-14 text-blue-300 relative z-10" />
                  </>
                )}
                {project.status && (
                  <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full ${
                    project.status === "Completed" || project.status === "Published"
                      ? "bg-green-100 text-green-700"
                      : project.status === "Ongoing" || project.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {project.status}
                  </span>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug flex-1">
                    {project.title}
                  </h3>
                  {(project.link || project.url) && (
                    <a href={project.link ?? project.url} target="_blank" rel="noopener noreferrer" className="shrink-0 w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
                {project.category && (
                  <p className="text-xs text-blue-600 font-semibold mb-2 uppercase tracking-wide">{project.category}</p>
                )}
                <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-4">
                  {project.description}
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tags.map((tag) => (
                      <span key={tag} className="bg-slate-50 border border-slate-200 text-slate-500 text-xs px-2.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}