import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

export default function Projects({ data, isMaximized }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <h2 className={`font-bold text-white text-center ${isMaximized ? 'text-4xl mb-12' : 'text-2xl md:text-3xl mb-8'}`}>
        My <span className="text-[#0078D4]">Projects</span>
      </h2>
      <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 ${isMaximized ? 'gap-6' : 'gap-4'}`}>
        {(data.projects ?? []).map((project, i) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="backdrop-blur-xl bg-white/[0.07] border border-white/15 rounded-xl overflow-hidden hover:scale-[1.02] hover:bg-white/15 transition-all duration-300 flex flex-col"
          >
            <img
              src={project?.image}
              alt={project?.title || 'Project'}
              onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300'; }}
              className={`w-full object-cover ${isMaximized ? 'h-48' : 'h-36 md:h-40'}`}
            />
            <div className="p-4 md:p-6 flex flex-col gap-3 flex-1">
              <h3 className={`font-semibold text-white ${isMaximized ? 'text-lg md:text-xl' : 'text-sm md:text-base'}`}>{project?.title}</h3>
              <p className={`text-white/60 line-clamp-2 ${isMaximized ? 'text-base' : 'text-sm'}`}>{project?.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                {(project?.techStack ?? []).map(tech => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 text-xs rounded-full bg-[#0078D4]/20 text-blue-200 border border-[#0078D4]/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-2 border-t border-white/10">
                {project?.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-white/60 hover:text-[#0078D4] transition-colors"
                  >
                    <ExternalLink size={13} /> Live
                  </a>
                )}
                {project?.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-white/60 hover:text-[#0078D4] transition-colors"
                  >
                    <Github size={13} /> Code
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
