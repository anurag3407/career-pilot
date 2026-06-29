import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const ACCENT = '#E63946';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Label({ children }) {
  return (
    <span className="text-[10px] md:text-xs font-black tracking-[0.22em] uppercase" style={{ color: ACCENT }}>
      {children}
    </span>
  );
}

export default function Projects({ data }) {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="border-b border-black text-left">
      <div className="px-5 md:px-12 py-3 border-b border-black flex items-center justify-between">
        <Label>04 — Projects</Label>
        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
          {data.projects.length} works
        </span>
      </div>

      <div className="divide-y divide-black">
        {data.projects.map((project, i) => (
          <motion.div
            key={project.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
            variants={fadeUp}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="grid grid-cols-1 md:grid-cols-12 transition-colors duration-200"
            style={{ backgroundColor: hovered === i ? '#f7f7f7' : 'white' }}
          >
            {/* index */}
            <div className="hidden md:flex md:col-span-1 px-5 md:px-8 pt-6 items-start">
              <span className="text-xs font-black" style={{ color: ACCENT }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>

            {/* title */}
            <div className="md:col-span-3 px-5 md:px-4 pt-5 pb-1 md:py-6">
              <div className="flex items-center gap-2 md:hidden mb-1">
                <span className="text-[10px] font-black" style={{ color: ACCENT }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-black">
                {project.title}
              </h3>
              {project.featured && (
                <span
                  className="inline-block mt-1 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5"
                  style={{ backgroundColor: ACCENT, color: 'white' }}
                >
                  Featured
                </span>
              )}
            </div>

            {/* description + tags */}
            <div className="md:col-span-5 px-5 md:px-4 py-2 md:py-6">
              <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.techStack.map((t) => (
                  <span
                    key={t}
                    className="text-[9px] font-black uppercase tracking-widest border border-gray-300 px-1.5 py-0.5 text-gray-500"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* links */}
            <div className="md:col-span-3 px-5 md:px-8 pb-5 pt-1 md:py-6 md:border-l border-black flex flex-row md:flex-col gap-4 md:gap-3 md:justify-center">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-black hover:opacity-60 transition-opacity"
                >
                  <ExternalLink size={10} /> Live Site
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-black hover:opacity-60 transition-opacity"
                >
                  <Github size={10} /> Source
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
