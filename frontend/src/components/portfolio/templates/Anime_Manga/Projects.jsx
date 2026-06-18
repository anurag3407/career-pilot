import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="relative w-full py-8">
      <div className="absolute -top-10 left-8 z-20">
        <div className="bg-black text-white px-8 py-2 border-4 border-black manga-title text-4xl shadow-[8px_8px_0_white,-2px_-2px_0_white] transform -rotate-2">
          MASTERPIECES / PROJECTS
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
        {projects.map((project, idx) => (
          <div key={idx} className="group relative">
            <div className="manga-panel bg-white p-6 h-full flex flex-col relative z-10 transition-transform group-hover:-translate-y-2 group-hover:-translate-x-2">
              <div className="flex justify-between items-start mb-4 border-b-4 border-black pb-4">
                <h3 className="text-3xl font-black uppercase tracking-tight">{project.title}</h3>
                <div className="flex gap-2">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
                      <Github size={24} strokeWidth={3} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
                      <ExternalLink size={24} strokeWidth={3} />
                    </a>
                  )}
                </div>
              </div>
              
              <p className="text-lg font-bold mb-6 flex-grow">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="bg-black text-white px-3 py-1 text-sm font-bold skew-x-[-10deg]">
                    <span className="skew-x-[10deg] block">{tech}</span>
                  </span>
                ))}
              </div>
            </div>
            {/* Action lines background for the card */}
            <div className="absolute inset-0 action-lines opacity-20 -z-10 translate-x-4 translate-y-4" />
          </div>
        ))}
      </div>
    </section>
  );
}
