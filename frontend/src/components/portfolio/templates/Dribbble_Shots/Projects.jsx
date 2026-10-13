import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Heart, Bookmark, Eye, Github, ExternalLink } from "lucide-react";
import SectionLabel from "./SectionLabel";
import data from "../../../../data/dummy_data.json";

export default function Projects() {
  const { projects } = data;
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="projects" ref={ref} className="py-28 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Projects</SectionLabel>
        <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-4xl md:text-5xl font-black text-[#1a1a1a]"
          >
            Selected Work
          </motion.h2>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[#ccc] text-sm"
          >
            {projects?.length || 0} shots
          </motion.span>
        </div>

        {/* Dribbble-style shot grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects?.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group bg-white border border-[#f0f0f0] rounded-[1.75rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#ea4c89]/8 transition-all cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Shot image */}
              <div className="relative h-48 overflow-hidden bg-[#f9f5f7]">
                <motion.img
                  src={project.image || `https://picsum.photos/seed/${i + 20}/600/400`}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  animate={{ scale: hovered === i ? 1.07 : 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

                {/* Hover overlay with links */}
                <AnimatePresence>
                  {hovered === i && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-[#ea4c89]/12 backdrop-blur-[1px] flex items-center justify-center gap-3"
                    >
                      {project.liveUrl && (
                        <motion.a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.04 }}
                          whileHover={{ scale: 1.12 }}
                          onClick={e => e.stopPropagation()}
                          className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#ea4c89]"
                        >
                          <ExternalLink size={14} />
                        </motion.a>
                      )}
                      {project.githubUrl && (
                        <motion.a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.09 }}
                          whileHover={{ scale: 1.12 }}
                          onClick={e => e.stopPropagation()}
                          className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-[#555]"
                        >
                          <Github size={14} />
                        </motion.a>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Card body */}
              <div className="p-5">
                <h3 className="text-[#1a1a1a] font-bold text-sm mb-1 group-hover:text-[#ea4c89] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[#aaa] text-xs leading-relaxed mb-4 line-clamp-2">{project.description}</p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack?.slice(0, 3).map(tech => (
                    <span key={tech} className="px-2.5 py-0.5 rounded-full bg-[#f7f7f7] text-[#999] text-[10px] border border-[#f0f0f0]">
                      {tech}
                    </span>
                  ))}
                  {project.techStack?.length > 3 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#fef0f5] text-[#ea4c89] text-[10px] border border-[#fad7e8]">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>

                {/* Like / save / views — Dribbble style */}
                <div className="flex items-center gap-4 pt-3 border-t border-[#f5f5f5]">
                  <button type="button"
                    onClick={() => setLiked(p => ({ ...p, [i]: !p[i] }))}
                    className="flex items-center gap-1.5"
                  >
                    <motion.div animate={{ scale: liked[i] ? [1, 1.5, 1] : 1 }} transition={{ duration: 0.3 }}>
                      <Heart
                        size={13}
                        className={liked[i] ? "fill-[#ea4c89] text-[#ea4c89]" : "text-[#ccc] hover:text-[#ea4c89] transition-colors"}
                      />
                    </motion.div>
                    <span className="text-[#ccc] text-[10px]">{(42 + i * 11) + (liked[i] ? 1 : 0)}</span>
                  </button>

                  <button type="button"
                    onClick={() => setSaved(p => ({ ...p, [i]: !p[i] }))}
                    className="flex items-center gap-1.5"
                  >
                    <Bookmark
                      size={13}
                      className={saved[i] ? "fill-[#ea4c89] text-[#ea4c89]" : "text-[#ccc] hover:text-[#ea4c89] transition-colors"}
                    />
                    <span className="text-[#ccc] text-[10px]">{(12 + i * 7) + (saved[i] ? 1 : 0)}</span>
                  </button>

                  <div className="flex items-center gap-1 ml-auto">
                    <Eye size={12} className="text-[#ddd]" />
                    <span className="text-[#ddd] text-[10px]">{(900 + i * 350).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}