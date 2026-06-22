import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import MosaicImage from './MosaicImage';
import TileSnappingText from './TileSnappingText';
import { ExternalLink, Github, Layers } from 'lucide-react';

const Projects = ({ projects = [] }) => {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const headingWidth = useMemo(() => {
    const available = Math.max(0, viewportWidth - 48);
    return Math.max(Math.min(available, 760), Math.min(160, available));
  }, [viewportWidth]);

  return (
    <section id="projects" className="py-32 px-6 max-w-7xl mx-auto border-t border-slate-950 relative z-20">
      <div className="mb-24 flex flex-col items-center text-center">
        <div className="flex items-center gap-3 mb-3 text-cyan-400">
          <Layers size={14} />
          <TileSnappingText text="Production Outputs" className="text-xs font-mono uppercase tracking-[0.4em]" baseDelay={0.1} />
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight" style={{ width: `${headingWidth}px` }}>
          <TileSnappingText text="Featured Work" baseDelay={0.2} />
        </h2>
      </div>

      <div className="space-y-40">
        {projects.map((proj, idx) => {
          const isReversed = idx % 2 === 1;
          return (
            <div key={`${proj?.title || 'project'}-${idx}`} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Mosaic Image Grid */}
              <motion.div
                className={`w-full lg:col-span-7 relative group ${isReversed ? 'lg:order-2' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute inset-0 bg-slate-900 border border-slate-800 rounded-2xl -rotate-1 scale-[1.01] group-hover:rotate-0 transition-transform duration-500" />
                <div className="relative p-2 bg-[#080b11] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                  <MosaicImage src={proj.image} alt={proj.title} rows={6} cols={6} className="aspect-video object-cover rounded-xl" />
                </div>
              </motion.div>

              {/* Data Specifications Content Panel */}
              <div className={`w-full lg:col-span-5 flex flex-col items-start ${isReversed ? 'lg:order-1' : ''}`}>
                <span className="font-mono text-xs text-slate-600 mb-2 uppercase tracking-widest">// Project Reference 0{idx + 1}</span>
                <h3 className="text-3xl font-black mb-4 text-white tracking-tight">
                  <TileSnappingText text={proj.title} baseDelay={0.1} />
                </h3>
                <div className="text-slate-400 text-base leading-relaxed mb-6 bg-slate-950/60 p-5 rounded-xl border border-slate-900 backdrop-blur-sm w-full">
                  <TileSnappingText text={proj.description} variant="subtle" stagger={0.005} baseDelay={0.2} />
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {(proj.techStack || []).map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-950 text-slate-400 text-xs font-mono rounded border border-slate-900">
                      <TileSnappingText text={tech} baseDelay={0.1 + (i * 0.05)} stagger={0.01} />
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  {proj.liveUrl && (
                    <motion.a
                      href={proj.liveUrl}
                      whileHover={{ y: -4 }}
                      className="flex items-center gap-2 bg-white text-slate-950 px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-white/5"
                    >
                      <ExternalLink size={14} />
                      Live Matrix
                    </motion.a>
                  )}
                  {proj.githubUrl && (
                    <motion.a
                      href={proj.githubUrl}
                      whileHover={{ y: -4 }}
                      className="flex items-center gap-2 bg-slate-950 text-slate-300 px-4 py-2 rounded-lg font-bold text-sm border border-slate-900 hover:border-slate-800"
                    >
                      <Github size={14} />
                      Source
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;