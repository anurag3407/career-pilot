import React from 'react';

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4">
      {projects.map((project, i) => (
        <a 
          key={i}
          href={project.link || project.github}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center group cursor-pointer p-4 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
        >
          <div className="w-20 h-20 mb-3 relative">
            {/* Folder Icon SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md text-blue-400 fill-current">
              <path d="M10,20 C10,14.4771525 14.4771525,10 20,10 L40,10 C43.3137085,10 46.4020203,11.6666667 48,14 L52,20 L80,20 C85.5228475,20 90,24.4771525 90,30 L90,80 C90,85.5228475 85.5228475,90 80,90 L20,90 C14.4771525,90 10,85.5228475 10,80 L10,20 Z" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-bold bg-black/40 px-2 py-1 rounded-full">
                {project.tech?.[0] || "App"}
              </span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-center text-gray-800 dark:text-gray-200 line-clamp-2">
            {project.title}
          </h3>
        </a>
      ))}
    </div>
  );
}
