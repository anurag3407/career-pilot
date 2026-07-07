
import { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import { Star, ExternalLink, Github } from 'lucide-react';
import { SectionHeading } from './Shared';
import data from '../../../../data/dummy_data.json';

function ProjectCard({ project, index, projectsLength, scrollYProgress, step }) {
  const p0 = index * step;
  const p1 = (index + 1) * step;
  const p2 = (index + 2) * step;
  const p3 = (index + 3) * step;

  const scale = useTransform(scrollYProgress, [p0, p1, p2, p3], [0.1, 1, 1, 15]);
  const opacity = useTransform(scrollYProgress, [p0, p1, p2, p3], [0, 1, 1, 0]);

  const pointerEvents = useTransform(scrollYProgress, (p) => {
    return (p >= p1 && p <= p2) ? 'auto' : 'none';
  });

  const zIndex = projectsLength - index;
  const rotation = index % 2 === 0 ? 1 : -1;

  return (
    <motion.div
      style={{ scale, opacity, pointerEvents, zIndex }}
      className="absolute inset-0 flex items-center justify-center p-4 md:p-8 origin-center w-full h-full"
    >
      <div
        style={{ transform: `rotate(${rotation}deg)` }}
        className="bg-zinc-900/95 border border-zinc-800 p-6 md:p-10 rounded-[2rem] w-full max-w-5xl shadow-2xl group hover:border-cyan-500/50 transition-colors duration-500"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">

          <div className="relative overflow-hidden rounded-2xl h-56 sm:h-72 lg:h-[420px] bg-zinc-800">
            <img
              src={project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80'}
              alt={project.title}
              className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
          </div>

          <div className="flex flex-col justify-center">
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              {project.title}
            </h3>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.techStack?.map((tech, i) => (
                <span key={i} className="px-4 py-1.5 text-sm bg-zinc-950 text-cyan-300 rounded-full border border-cyan-500/20 shadow-sm">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-4">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-zinc-50 text-zinc-950 font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-lg">
                  <ExternalLink size={18} /> View Live
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white font-bold rounded-full hover:bg-zinc-700 transition-colors border border-zinc-700">
                  <Github size={18} /> Source
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsZoom() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const projects = data.projects || [];
  if (projects.length === 0) return null;

  const step = 1 / (projects.length + 2);

  const titleScale = useTransform(scrollYProgress, [0, step, step * 1.5], [1, 1, 15]);
  const titleOpacity = useTransform(scrollYProgress, [0, step, step * 1.5], [1, 1, 0]);

  return (
    <section className="bg-zinc-950 relative z-10">
      <div ref={containerRef} className="relative w-full" style={{ height: `${(projects.length + 2) * 100}vh` }}>
        <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-zinc-950">
          
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          {/* Intro Title with Static Dark White Heading */}
          <motion.div
            style={{
              opacity: titleOpacity,
              scale: titleScale,
              zIndex: projects.length + 10 
            }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            <SectionHeading icon={Star} className="flex items-center justify-center gap-4 mb-4" disableAnimation={true}>
              Projects
            </SectionHeading>
            <p className="text-zinc-500 mt-6 tracking-[0.3em] uppercase text-sm font-bold animate-pulse">Keep Scrolling</p>
          </motion.div>

          {projects.map((project, index) => {
            const p0 = index * step;           
            const p1 = (index + 1) * step;     
            const p2 = (index + 2) * step;     
            const p3 = (index + 3) * step;     

            const scale = useTransform(scrollYProgress, [p0, p1, p2, p3], [0.1, 1, 1, 15]);
            const opacity = useTransform(scrollYProgress, [p0, p1, p2, p3], [0, 1, 1, 0]);

            const pointerEvents = useTransform(scrollYProgress, (p) => {
              return (p >= p1 && p <= p2) ? "auto" : "none";
            });

            const zIndex = projects.length - index;
            const rotation = index % 2 === 0 ? 1 : -1;

            return (
              <motion.div
                key={index}
                style={{ scale, opacity, pointerEvents, zIndex }}
                className="absolute inset-0 flex items-center justify-center p-4 md:p-8 origin-center w-full h-full"
              >
                <div 
                  style={{ transform: `rotate(${rotation}deg)` }}
                  className="bg-zinc-900/95 border border-zinc-800 p-6 md:p-10 rounded-4xl w-full max-w-5xl shadow-2xl group hover:border-cyan-500/50 transition-colors duration-500"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                    
                    <div className="relative overflow-hidden rounded-2xl h-56 sm:h-72 lg:h-105 bg-zinc-800">
                      <img 
                        src={project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80'} 
                        alt={project.title} 
                        className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out" 
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                    </div>

                    <div className="flex flex-col justify-center">
                      <h3 className="text-3xl md:text-5xl font-bold text-transparent mb-4 bg-clip-text bg-linear-to-r from-white to-zinc-400">
                        {project.title}
                      </h3>
                      <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.techStack?.map((tech, i) => (
                          <span key={i} className="px-4 py-1.5 text-sm bg-zinc-950 text-cyan-300 rounded-full border border-cyan-500/20 shadow-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-4">
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-zinc-50 text-zinc-950 font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-lg">
                            <ExternalLink size={18} /> View Live
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white font-bold rounded-full hover:bg-zinc-700 transition-colors border border-zinc-700">
                            <Github size={18} /> Source
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
