import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

const projects = [
  {
    title: 'AI Resume Assistant',
    description:
      'An intelligent tool that analyzes resumes, suggests improvements, and helps candidates optimize their job applications.',
    tags: ['React', 'Tailwind', 'AI'],
    emoji: '📄',
    rotation: '-rotate-2',
    tape: 'left-6',
  },
  {
    title: 'Task Manager Pro',
    description:
      'A productivity-focused task manager with deadlines, reminders, progress tracking, and a beautiful dashboard experience.',
    tags: ['React', 'Dashboard', 'Productivity'],
    emoji: '📝',
    rotation: 'rotate-1',
    tape: 'left-1/2 -translate-x-1/2',
  },
  {
    title: 'Weather Snapshot',
    description:
      'A sleek weather application providing real-time weather insights, forecasts, and interactive location search.',
    tags: ['API', 'Frontend', 'UI'],
    emoji: '☀️',
    rotation: '-rotate-1',
    tape: 'right-6',
  },
  {
    title: 'Portfolio Showcase',
    description:
      'A modern portfolio platform with smooth animations, project galleries, and customizable personal branding.',
    tags: ['Portfolio', 'Design', 'React'],
    emoji: '🎨',
    rotation: 'rotate-2',
    tape: 'left-10',
  },
];

export default function Projects() {
  const handleProjectClick = () => {
    alert('Project preview coming soon!');
  };

  return (
    <section className="relative w-full py-20 px-6 md:px-12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      
      {/* Background doodles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-16 left-10 text-6xl">✦</div>
        <div className="absolute top-40 right-20 text-5xl">✂️</div>
        <div className="absolute bottom-24 left-20 text-5xl">📌</div>
        <div className="absolute bottom-16 right-12 text-6xl">✨</div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-200/10 border border-amber-300/20 text-amber-200 text-sm font-medium mb-5">
            <Sparkles className="w-4 h-4" />
            Scrapbook Collection
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-5 tracking-tight">
            My Creative Projects
          </h2>

          <p className="max-w-2xl mx-auto text-slate-300 text-lg leading-relaxed">
            A curated scrapbook of ideas, experiments, and creations that reflect
            my passion for building meaningful digital experiences.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`relative ${project.rotation} hover:rotate-0 transition-all duration-500 hover:scale-105`}
            >
              
              {/* Tape */}
              <div
                className={`absolute -top-4 ${project.tape} w-16 h-6 bg-yellow-200/70 backdrop-blur-sm rotate-2 shadow-md z-20`}
              />

              {/* Card */}
              <div className="bg-stone-100 text-slate-900 rounded-lg shadow-2xl border border-stone-300 p-6 min-h-[420px] flex flex-col justify-between hover:shadow-amber-100/20">
                
                <div>
                  <div className="text-5xl mb-5">{project.emoji}</div>

                  <h3 className="text-2xl font-extrabold mb-4 leading-tight">
                    {project.title}
                  </h3>

                  <p className="text-slate-700 leading-relaxed text-sm md:text-base mb-6">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Button */}
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={handleProjectClick}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 transition cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Project
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-slate-400 italic text-sm md:text-base">
            “Every project starts as a small scrapbook idea before becoming something real.”
          </p>
        </div>
      </div>
    </section>
  );
}