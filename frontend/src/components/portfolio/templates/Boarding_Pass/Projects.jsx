import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Github, ExternalLink } from 'lucide-react';

export default function Projects({ projects }) {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tighter uppercase mb-1">Flight Schedule</h2>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Recent Departures (Projects)</span>
        </div>
        <Plane className="w-8 h-8 text-stone-300 transform rotate-45" />
      </div>

      <div className="space-y-8">
        {projects.map((project, idx) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="w-full bg-white rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow border border-stone-200"
          >
            {/* Left Image Section */}
            <div className="w-full md:w-1/3 h-48 md:h-auto bg-stone-100 shrink-0 border-b md:border-b-0 md:border-r border-stone-200">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
            </div>

            {/* Middle Content (The Main Ticket) */}
            <div className="flex-1 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r-2 border-dashed border-stone-300">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black text-stone-800 uppercase tracking-tight">{project.title}</h3>
                  <span className="text-[9px] font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded-sm uppercase">Status: Boarding</span>
                </div>
                <p className="text-stone-500 text-sm leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 p-3 border border-stone-100 rounded-sm">
                  <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1">Departure (Stack)</span>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.map(tech => (
                      <span key={tech} className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-stone-50 p-3 border border-stone-100 rounded-sm">
                  <span className="block text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-1">Arrival (Links)</span>
                  <div className="flex items-center gap-3 mt-1">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-stone-600 hover:text-stone-900 transition-colors">
                        <Github className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Repo</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Live</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Stub (Tear-off) */}
            <div className="w-full md:w-48 bg-stone-50 p-6 flex flex-col justify-between items-center relative overflow-hidden">
               {/* Half-circles for the perforated tear effect on desktop */}
              <div className="hidden md:block absolute -left-3 top-0 bottom-0 w-6 flex flex-col justify-between py-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-stone-100 shadow-inner" />
                ))}
              </div>

              <div className="w-full text-center">
                <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-2">Gate</span>
                <span className="text-4xl font-black text-stone-800 font-mono">{(idx + 1).toString().padStart(2, '0')}</span>
              </div>

              {/* CSS Barcode */}
              <div className="w-full flex flex-col items-center mt-4">
                <div className="w-full h-8 flex items-center justify-between opacity-70 mix-blend-multiply px-2">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i} 
                      className="h-full bg-stone-800" 
                      style={{ width: `${Math.random() * 3 + 1}px` }}
                    />
                  ))}
                </div>
                <span className="text-[8px] font-mono text-stone-400 mt-1 tracking-widest">{project.title.substring(0,3).toUpperCase()}-{(idx + 1) * 100}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
