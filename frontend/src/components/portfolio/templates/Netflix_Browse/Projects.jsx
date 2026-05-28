import { useRef } from "react";
import { motion } from "framer-motion";
import { GithubIcon, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

export default function Projects({ projects }) {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 340, behavior: "smooth" });
    }
  };

  return (
    <section id="projects" className="py-10">
      {/* Row header */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-12">
        <h2 className="text-white text-xl md:text-2xl font-bold tracking-wide">
          🎬 Featured Projects
          <span className="ml-3 text-[#E50914] text-sm font-semibold border border-[#E50914] px-2 py-0.5 rounded">
            {projects.length} titles
          </span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#E50914] flex items-center justify-center transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#E50914] flex items-center justify-center transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Horizontal carousel */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto pb-4 px-4 md:px-12 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={i} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.06, zIndex: 10 }}
      className="relative flex-shrink-0 w-72 md:w-80 rounded-lg overflow-hidden cursor-pointer group"
      style={{ transformOrigin: "center bottom" }}
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/30 to-transparent" />

        {/* Hover action buttons */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E50914] text-white text-xs font-bold rounded-md hover:bg-red-700 transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur text-white text-xs font-bold rounded-md hover:bg-white/30 transition-colors"
            >
              <Github className="w-3 h-3" /> Code
            </a>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="bg-[#1f1f1f] p-4 border-t-2 border-[#E50914]">
        <h3 className="text-white font-bold text-base mb-1 truncate">{project.title}</h3>
        <p className="text-[#a3a3a3] text-xs leading-relaxed line-clamp-2 mb-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-semibold bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/30 px-2 py-0.5 rounded"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="text-[10px] text-[#737373] px-1">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
