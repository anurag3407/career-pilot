import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { ChevronDown, Github, Linkedin, ExternalLink, Mail } from 'lucide-react';

const ChiragChrg_Theme = () => {
  const { portfolioData } = usePortfolio();
  const [themeName, setThemeName] = useState('Custom');
  const [primaryColor, setPrimaryColor] = useState('hsl(264, 100%, 50%)');
  const [secondaryColor, setSecondaryColor] = useState('hsl(315.1, 100%, 50%)');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!portfolioData) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  const { personal, projects, skills, experience } = portfolioData;

  const themes = [
    { name: 'Custom', p: 'hsl(264, 100%, 50%)', s: 'hsl(315.1, 100%, 50%)' },
    { name: 'Ocean', p: 'hsl(211.3, 100%, 50%)', s: 'hsl(176.2, 100%, 50%)' },
    { name: 'Forest', p: 'hsl(148.2, 100%, 32.9%)', s: 'hsl(193.1, 99.2%, 52.7%)' },
    { name: 'Sunset', p: 'hsl(20, 100%, 50%)', s: 'hsl(44.9, 100%, 54.9%)' }
  ];

  return (
    <div className="relative min-h-screen bg-[#0f0f11] text-white font-poppins selection:bg-white/20 overflow-x-hidden scroll-smooth" style={{
      '--primary': primaryColor,
      '--secondary': secondaryColor,
      '--gradient-linear': `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
      '--gradient-radial': `radial-gradient(circle at center, ${primaryColor}40, transparent 60%)`,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Satisfy&family=Ubuntu:wght@700&display=swap');
        
        .font-poppins { font-family: 'Poppins', sans-serif; }
        .font-satisfy { font-family: 'Satisfy', cursive; }
        .font-ubuntu { font-family: 'Ubuntu', sans-serif; }
        
        .gradient-text {
          background: var(--gradient-linear);
          -webkit-background-clip: text;
          color: transparent;
          display: inline-block;
        }

        .header-gradient {
          background: linear-gradient(to bottom, rgba(15,15,17,0.95), rgba(15,15,17,0.7));
        }

        .skill-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        .skill-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--primary);
          transform: translateY(-2px);
        }

        .project-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .project-card:hover {
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-4px);
          box-shadow: 0 10px 40px -10px var(--primary);
        }

        .nav-link {
          position: relative;
          color: rgba(255,255,255,0.7);
          transition: color 0.2s;
          font-weight: 500;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
        }
        .nav-link:hover { color: #fff; }
        
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 header-gradient backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#hero" className="font-satisfy text-2xl font-bold">
            <span className="gradient-text">Portfolio.</span>
          </a>
          
          <nav className="hidden md:flex gap-8">
            <a href="#about" className="nav-link uppercase">About</a>
            <a href="#skills" className="nav-link uppercase">Skills</a>
            <a href="#projects" className="nav-link uppercase">Projects</a>
            <a href="#experience" className="nav-link uppercase">Experience</a>
          </nav>

          {/* Theme Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors"
            >
              <div className="w-4 h-4 rounded-full" style={{ background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})` }} />
              <span className="text-sm hidden sm:block">{themeName}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-[#18181b] border border-white/10 rounded-lg shadow-xl overflow-hidden py-1 z-50">
                {themes.map(t => (
                  <button
                    key={t.name}
                    onClick={() => {
                      setThemeName(t.name);
                      setPrimaryColor(t.p);
                      setSecondaryColor(t.s);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 text-left transition-colors"
                  >
                    <div className="w-4 h-4 rounded-full" style={{ background: `linear-gradient(45deg, ${t.p}, ${t.s})` }} />
                    <span className="text-sm">{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="w-full min-h-screen pt-16 flex items-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] opacity-30" style={{ background: 'var(--gradient-radial)' }} />
        <div className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] opacity-30" style={{ background: 'var(--gradient-radial)' }} />
        
        <div className="max-w-[1400px] mx-auto w-full px-6 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <p className="text-xl md:text-2xl text-white/80">Hi👋🏻 My name is</p>
            <h1 className="font-ubuntu text-5xl md:text-7xl lg:text-8xl xl:text-9xl leading-none gradient-text font-bold tracking-tight">
              {personal?.name?.split(' ')[0] || 'Developer'}.
            </h1>
            <p className="text-xl md:text-2xl text-white/80">
              I'm a {personal?.title || 'Software Engineer'}.
            </p>
            <p className="text-xl md:text-2xl text-white/80">
              I create <span className="font-ubuntu gradient-text font-bold">Exciting Stuff</span> on the Internet.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-6 pt-6">
              {personal?.github && (
                <a href={personal.github} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors">
                  <Github className="w-8 h-8" />
                </a>
              )}
              {personal?.linkedin && (
                <a href={personal.linkedin} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors">
                  <Linkedin className="w-8 h-8" />
                </a>
              )}
              {personal?.email && (
                <a href={`mailto:${personal.email}`} className="text-white/60 hover:text-white transition-colors">
                  <Mail className="w-8 h-8" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="font-ubuntu text-3xl md:text-4xl lg:text-5xl font-bold">
            &lt; <span className="gradient-text">About Me</span> &gt;
          </h2>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>
        <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-4xl">
          {personal?.bio || "I'm a passionate developer focused on creating engaging, performant, and accessible user experiences. I love tackling complex problems and learning new technologies along the way."}
        </p>
      </section>

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section id="skills" className="py-24 max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-ubuntu text-3xl md:text-4xl lg:text-5xl font-bold">
              &lt; <span className="gradient-text">Tech Stack</span> /&gt;
            </h2>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>
          <div className="flex flex-wrap gap-4">
            {skills.map((skill, idx) => (
              <div key={idx} className="skill-card px-6 py-3 rounded-full text-white/90 font-medium tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--gradient-linear)' }} />
                {skill.name || skill}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section id="projects" className="py-24 max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-ubuntu text-3xl md:text-4xl lg:text-5xl font-bold">
              &lt; <span className="gradient-text">Projects</span> /&gt;
            </h2>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((proj, idx) => (
              <div key={idx} className="project-card flex flex-col h-full group">
                <div className="p-8 flex flex-col flex-grow relative">
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-bl-full" style={{ background: 'var(--gradient-radial)' }} />
                  
                  <h3 className="text-2xl font-bold mb-3 font-ubuntu">{proj.title}</h3>
                  <p className="text-white/60 mb-6 flex-grow">{proj.description}</p>
                  
                  {proj.technologies && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {proj.technologies.map((tech, j) => (
                        <span key={j} className="text-xs font-mono px-2 py-1 bg-white/5 rounded text-white/80">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium hover:text-white transition-colors" style={{ color: primaryColor }}>
                      View Project <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <section id="experience" className="py-24 max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-ubuntu text-3xl md:text-4xl lg:text-5xl font-bold">
              &lt; <span className="gradient-text">Experience</span> /&gt;
            </h2>
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>
          
          <div className="space-y-12 border-l border-white/10 ml-4 md:ml-8">
            {experience.map((exp, idx) => (
              <div key={idx} className="relative pl-8 md:pl-12 group">
                <div className="absolute top-0 -left-[5px] w-[10px] h-[10px] rounded-full bg-white/20 group-hover:scale-150 transition-all duration-300" style={{ background: 'var(--gradient-linear)' }} />
                <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
                  <h3 className="text-xl font-bold">{exp.role || exp.title}</h3>
                  <span className="text-white/50 text-sm font-mono mt-1 md:mt-0">{exp.duration || exp.year}</span>
                </div>
                <h4 className="text-lg mb-4" style={{ color: primaryColor }}>{exp.company || exp.organization}</h4>
                <p className="text-white/70 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 text-center text-white/40 border-t border-white/5 mt-24">
        <p>© {new Date().getFullYear()} {personal?.name || 'Developer'}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ChiragChrg_Theme;
