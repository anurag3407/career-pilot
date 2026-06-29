import React from 'react';

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-gray-50 text-gray-900 border-t border-gray-100">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-light mb-8 tracking-wide text-center">Selected Works</h2>
        <div className="w-12 h-px bg-gray-300 mx-auto mb-16"></div>
        
        <div className="space-y-24">
          {projects.map((project, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-8 items-center">
              {/* If there's an image, could go here. Minimalist uses large type. */}
              <div className="w-full">
                <h3 className="text-2xl font-normal mb-2">{project.title}</h3>
                <p className="text-sm tracking-widest text-gray-400 uppercase mb-4">{project.technologies?.join(' • ')}</p>
                <p className="text-gray-500 font-light leading-relaxed mb-6 max-w-2xl">
                  {project.description}
                </p>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-block border-b border-gray-900 pb-1 text-sm uppercase tracking-widest hover:text-gray-500 hover:border-gray-500 transition-colors">
                    View Project
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
