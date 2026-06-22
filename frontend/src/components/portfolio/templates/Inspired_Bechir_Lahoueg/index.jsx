import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';

const InspiredBechirLahoueg = () => {
  const { portfolioData: data } = usePortfolio();

  // Fallback structural data if context is initially empty
  const profile = data?.profile || { name: 'Your Name', role: 'Full Stack Developer', bio: 'Crafting digital experiences.' };
  const projects = data?.projects || [];
  const experiences = data?.experience || [];
  const skills = data?.skills || [];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#f3f4f6] font-sans selection:bg-purple-500 selection:text-white">
      {/* Header/Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a0c]/70 border-b border-zinc-800/50 px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
          {profile.name.split(' ')[0]}.dev
        </div>
        <nav className="hidden md:flex space-x-8 text-sm text-zinc-400 font-medium">
          <a href="#about" className="hover:text-white transition">About</a>
          <a href="#projects" className="hover:text-white transition">Projects</a>
          <a href="#experience" className="hover:text-white transition">Experience</a>
          <a href="#skills" className="hover:text-white transition">Skills</a>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-32">
        {/* Introduction Section */}
        <section id="about" className="pt-10 flex flex-col justify-center min-h-[60vh]">
          <p className="text-purple-400 font-mono tracking-wider text-sm mb-3">HI THERE, I AM</p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-4">
            {profile.name}
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-zinc-400 mb-6">
            {profile.role || "Software Engineer"}
          </h2>
          <p className="max-w-2xl text-zinc-400 text-base md:text-lg leading-relaxed">
            {profile.bio || "Passionate about building clean, performant, and user-centric web applications with modern technologies."}
          </p>
        </section>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-white border-b border-zinc-800 pb-4 mb-10 flex items-center gap-2">
            <span className="text-purple-500">01.</span> Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.length > 0 ? (
              projects.map((proj, idx) => (
                <div key={idx} className="group relative bg-[#121214] border border-zinc-800/60 p-6 rounded-xl hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-purple-400 transition mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-3">{proj.description}</p>
                  </div>
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-900">
                      {proj.technologies.map((tech, tIdx) => (
                        <span key={tIdx} className="text-xs bg-zinc-900 text-zinc-400 px-2.5 py-1 rounded-md font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-zinc-500 col-span-2">No projects available yet.</p>
            )}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-white border-b border-zinc-800 pb-4 mb-10 flex items-center gap-2">
            <span className="text-purple-500">02.</span> Experience
          </h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:right-auto before:left-3.5 before:w-px before:bg-zinc-800">
            {experiences.length > 0 ? (
              experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-10 group">
                  <div className="absolute left-2.5 top-1.5 w-2 h-2 rounded-full bg-zinc-600 group-hover:bg-purple-500 transition-colors duration-300" />
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                    <h3 className="text-lg font-semibold text-zinc-200">
                      {exp.role} <span className="text-purple-400">@ {exp.company}</span>
                    </h3>
                    <span className="text-xs font-mono text-zinc-500">{exp.duration || exp.period}</span>
                  </div>
                  <p className="text-zinc-400 text-sm max-w-3xl">{exp.description}</p>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 pl-10">No experience timeline specified.</p>
            )}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-white border-b border-zinc-800 pb-4 mb-10 flex items-center gap-2">
            <span className="text-purple-500">03.</span> Core Expertise
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.length > 0 ? (
              skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="bg-[#121214] border border-zinc-800 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium hover:text-white hover:border-zinc-700 transition"
                >
                  {typeof skill === 'object' ? skill.name : skill}
                </span>
              ))
            ) : (
              <p className="text-zinc-500">No skills added yet.</p>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 mt-20 py-8 text-center text-xs text-zinc-600 font-mono">
        &copy; {new Date().getFullYear()} {profile.name}. Designed with care.
      </footer>
    </div>
  );
};

export default InspiredBechirLahoueg;
