import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../../../context/PortfolioContext';

export default function ChooseYourFighter() {
  const { portfolioData } = usePortfolio();
  const { personal, skills, projects, experience, testimonials, socials } = portfolioData;

  // State for Main Section Navigation
  const [activeSection, setActiveSection] = useState('about');
  const [isSectionChanging, setIsSectionChanging] = useState(false);

  // State for the interactive Projects selection
  const [selectedFighter, setSelectedFighter] = useState(projects?.[0] || null);
  const [isFighterAnimating, setIsFighterAnimating] = useState(false);

  // Navigation Options mapped to Circular Cars with Standard Wording
  const menuOptions = [
    { id: 'about', title: 'ABOUT', subtitle: 'Background', icon: '👤' },
    { id: 'skills', title: 'SKILLS', subtitle: 'Technologies', icon: '⚡' },
    { id: 'projects', title: 'PROJECTS', subtitle: 'Portfolio', icon: '📁' },
    { id: 'experience', title: 'EXPERIENCE', subtitle: 'Work History', icon: '🏢' },
    { id: 'testimonials', title: 'REVIEWS', subtitle: 'Testimonials', icon: '⭐' },
    { id: 'contact', title: 'CONTACT', subtitle: 'Get in touch', icon: '✉️' },
  ];

  // Smooth fade transition when changing main sections
  const handleSectionChange = (sectionId) => {
    if (activeSection === sectionId) return;
    setIsSectionChanging(true);
    setTimeout(() => {
      setActiveSection(sectionId);
      setIsSectionChanging(false);
    }, 200);
  };

  // Quick glitch animation for project selection
  useEffect(() => {
    setIsFighterAnimating(true);
    const timer = setTimeout(() => setIsFighterAnimating(false), 200);
    return () => clearTimeout(timer);
  }, [selectedFighter]);

  if (!portfolioData) return <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center animate-pulse">Loading...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-mono uppercase tracking-wider selection:bg-red-600 relative overflow-x-hidden">
      
      {/* Global CRT Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 relative z-10 flex flex-col min-h-screen">

        {/* --- HERO / 3D ORBIT SELECT SECTION --- */}
        <section className="flex flex-col items-center text-center space-y-2 mb-16 border-b-4 border-neutral-800 pb-16">
          <div className="inline-block border-4 border-yellow-400 p-2 mb-2 animate-pulse shadow-[0_0_20px_rgba(250,204,21,0.5)] bg-black">
            <span className="text-yellow-400 font-black text-sm md:text-xl">{personal?.name || 'PORTFOLIO'}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 drop-shadow-[2px_2px_0_rgba(220,38,38,1)]">
            SELECT SECTION
          </h1>

          {/* 3D Orbiting Menu System */}
          <div className="relative flex items-center justify-center w-full h-[350px] md:h-[450px] mt-8">
            
            {/* Center: Pure CSS Pixel Art Character */}
            <div className="absolute z-20 flex items-center justify-center pointer-events-none">
              <PixelHero />
            </div>

            {/* Orbiting Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute z-10 w-[240px] h-[240px] md:w-[320px] md:h-[320px] rounded-full border border-neutral-800/50 border-dashed"
            >
              {menuOptions.map((option, index) => {
                const angle = (index * 360) / menuOptions.length;
                const isActive = activeSection === option.id;

                return (
                  <div
                    key={option.id}
                    className="absolute inset-0 pointer-events-none"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      >
                        <button
                          onClick={() => handleSectionChange(option.id)}
                          className={`
                            flex flex-col items-center justify-center rounded-full border-4 transition-all duration-300
                            w-20 h-20 md:w-24 md:h-24 
                            ${isActive 
                              ? 'border-red-500 bg-red-950/90 scale-110 shadow-[0_0_25px_rgba(220,38,38,0.8)] z-30' 
                              : 'border-neutral-600 bg-neutral-900/90 hover:border-yellow-400 hover:bg-black hover:scale-110 shadow-lg z-20'
                            }
                          `}
                        >
                          <span className={`text-2xl md:text-3xl mb-1 ${isActive ? 'animate-bounce' : ''}`}>
                            {option.icon}
                          </span>
                          <span className={`text-[10px] md:text-xs font-black tracking-tighter ${isActive ? 'text-red-400' : 'text-white'}`}>
                            {option.title}
                          </span>
                        </button>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* --- DYNAMIC RENDER AREA --- */}
        <div className={`flex-1 transition-all duration-200 transform ${isSectionChanging ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
          
          {/* 1. ABOUT */}
          {activeSection === 'about' && (
            <section>
              <SectionHeader title="About Me" subtitle="Background" color="text-yellow-400" borderColor="border-yellow-400" />
              <div className="bg-neutral-900 border-4 border-neutral-700 p-6 md:p-12 shadow-[8px_8px_0_0_rgba(250,204,21,0.3)]">
                <h3 className="text-3xl text-white font-black mb-6">{personal?.title || 'Developer'}</h3>
                <p className="text-lg md:text-xl leading-relaxed normal-case text-neutral-300 border-l-4 border-yellow-400 pl-6">
                  {personal?.bio}
                </p>
                <div className="mt-8 flex flex-wrap gap-4 text-sm font-bold text-yellow-400">
                  <span className="border-2 border-yellow-400 px-4 py-2 bg-yellow-400/10 shadow-[0_0_10px_rgba(250,204,21,0.2)]">Location: {personal?.location || 'Unknown'}</span>
                  <span className="border-2 border-yellow-400 px-4 py-2 bg-yellow-400/10 shadow-[0_0_10px_rgba(250,204,21,0.2)]">Experience: {portfolioData?.stats?.yearsExperience || 0} Years</span>
                </div>
              </div>
            </section>
          )}

          {/* 2. SKILLS */}
          {activeSection === 'skills' && (
            <section>
              <SectionHeader title="Skills" subtitle="Technologies" color="text-blue-400" borderColor="border-blue-400" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 bg-neutral-900 border-4 border-neutral-700 p-6 md:p-10 shadow-[8px_8px_0_0_rgba(59,130,246,0.3)]">
                {skills?.map((skill, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-white">{typeof skill === 'string' ? skill : skill.name}</span>
                      <span className="text-blue-400">{typeof skill === 'string' ? 'Expert' : `${skill.level}%`}</span>
                    </div>
                    <div className="h-5 w-full bg-black border-2 border-neutral-600 p-[2px]">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${typeof skill === 'string' ? 90 : skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. PROJECTS */}
          {activeSection === 'projects' && (
            <section>
              <SectionHeader title="Projects" subtitle="Portfolio" color="text-red-500" borderColor="border-red-500" />
              
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Left: Selected Project Stats */}
                <div className="w-full lg:w-5/12 bg-neutral-900 border-4 border-red-600 p-2 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                  <div className="border-2 border-red-500/50 p-4 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white font-black px-4 py-1 text-sm border-2 border-red-400 animate-pulse">
                      VIEWING
                    </div>
                    
                    <div className={`mt-4 transition-all duration-200 ${isFighterAnimating ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-none'}`}>
                      <div className="h-64 w-full bg-black border-4 border-neutral-800 mb-6 relative overflow-hidden group">
                        <img 
                          src={selectedFighter?.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop'} 
                          alt={selectedFighter?.title}
                          className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=450&fit=crop'; }}
                        />
                        <div className="absolute inset-0 bg-red-600/20 mix-blend-overlay group-hover:bg-transparent"></div>
                      </div>

                      <h3 className="text-3xl font-black text-white text-center mb-2 drop-shadow-[0_2px_2px_rgba(220,38,38,0.8)]">{selectedFighter?.title}</h3>
                      <p className="text-sm text-neutral-400 text-center px-2 normal-case line-clamp-3 mb-6">
                        {selectedFighter?.description}
                      </p>

                      <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {selectedFighter?.techStack?.map((tech, i) => (
                          <span key={i} className="text-xs bg-red-950 border border-red-800 text-red-300 px-3 py-1 font-bold">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        {selectedFighter?.liveUrl && (
                          <a href={selectedFighter.liveUrl} target="_blank" rel="noreferrer" className="flex-1 bg-red-600 hover:bg-red-500 text-center py-3 font-black text-white border-b-4 border-red-800 active:translate-y-1 active:border-b-0 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                            LIVE DEMO
                          </a>
                        )}
                        {selectedFighter?.githubUrl && (
                          <a href={selectedFighter.githubUrl} target="_blank" rel="noreferrer" className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-center py-3 font-black text-white border-b-4 border-neutral-900 active:translate-y-1 active:border-b-0 transition-all">
                            SOURCE
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Project Grid */}
                <div className="w-full lg:w-7/12 bg-neutral-900 border-4 border-neutral-700 p-4 shadow-[8px_8px_0_0_rgba(220,38,38,0.3)]">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {projects?.map((project, index) => {
                      const isSelected = selectedFighter?.title === project.title;
                      return (
                        <button
                          key={index}
                          onMouseEnter={() => !isSelected && setSelectedFighter(project)}
                          onClick={() => setSelectedFighter(project)}
                          className={`
                            relative group overflow-hidden border-4 transition-all duration-100 aspect-square bg-black
                            ${isSelected ? 'border-red-500 scale-105 z-10 shadow-[0_0_15px_rgba(220,38,38,0.6)]' : 'border-neutral-800 hover:border-yellow-400'}
                          `}
                        >
                          <img 
                            src={project.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop'} 
                            alt={project.title}
                            className={`w-full h-full object-cover transition-all duration-300 ${isSelected ? 'grayscale-0 opacity-100' : 'grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100'}`}
                          />
                          <div className={`absolute bottom-0 left-0 right-0 p-2 transform transition-all duration-200 ${isSelected ? 'bg-red-600 translate-y-0' : 'bg-black/90 translate-y-full group-hover:translate-y-0'}`}>
                            <span className={`text-[10px] block truncate font-bold text-center ${isSelected ? 'text-white' : 'text-yellow-400'}`}>
                              {project.title}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* 4. EXPERIENCE */}
          {activeSection === 'experience' && (
            <section>
              <SectionHeader title="Experience" subtitle="Work History" color="text-green-400" borderColor="border-green-400" />
              <div className="space-y-6">
                {experience?.map((job, idx) => (
                  <div key={idx} className="bg-neutral-900 border-4 border-neutral-700 p-6 md:p-8 shadow-[8px_8px_0_0_rgba(74,222,128,0.2)] hover:border-green-500 transition-colors group">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4 border-b-2 border-neutral-800 pb-4 group-hover:border-green-500/30">
                      <div>
                        <h3 className="text-2xl font-black text-white">{job.role}</h3>
                        <h4 className="text-green-400 font-bold text-lg mt-1">@ {job.company}</h4>
                      </div>
                      <div className="bg-black border-2 border-green-500/50 px-4 py-2 text-sm text-green-400 font-bold shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                        {job.period}
                      </div>
                    </div>
                    <p className="text-neutral-300 normal-case leading-relaxed text-lg">
                      {job.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. TESTIMONIALS */}
          {activeSection === 'testimonials' && (
            <section>
              <SectionHeader title="Testimonials" subtitle="Reviews" color="text-purple-400" borderColor="border-purple-400" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials?.map((test, idx) => (
                  <div key={idx} className="bg-neutral-900 border-4 border-neutral-700 p-8 relative shadow-[8px_8px_0_0_rgba(192,132,252,0.2)] hover:border-purple-500 transition-colors">
                    <div className="text-6xl text-purple-500/20 absolute top-4 right-6 font-serif">"</div>
                    <p className="text-neutral-300 normal-case italic mb-8 relative z-10 text-lg">
                      {test.text}
                    </p>
                    <div className="flex items-center gap-4">
                      <img 
                        src={test.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(test.name)}&background=random`} 
                        alt={test.name} 
                        className="w-16 h-16 border-4 border-purple-400 object-cover shadow-[0_0_10px_rgba(192,132,252,0.4)]"
                      />
                      <div>
                        <h4 className="text-white font-black text-lg">{test.name}</h4>
                        <p className="text-purple-400 font-bold text-sm tracking-widest">{test.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6. CONTACT */}
          {activeSection === 'contact' && (
            <section className="pb-12">
              <SectionHeader title="Contact" subtitle="Get in touch" color="text-white" borderColor="border-white" />
              <div className="bg-neutral-900 border-4 border-white p-8 md:p-16 shadow-[0_0_40px_rgba(255,255,255,0.2)] text-center">
                <p className="text-2xl text-neutral-300 mb-10 normal-case border-y-2 border-neutral-800 py-4 max-w-2xl mx-auto">
                  Interested in working together? Drop me a message or connect on social media.
                </p>
                
                <div className="flex flex-wrap justify-center gap-6">
                  {socials?.email && (
                    <SocialButton href={`mailto:${socials.email}`} label="EMAIL" color="hover:bg-blue-600 border-blue-400 text-blue-400 hover:text-white" />
                  )}
                  {socials?.github && (
                    <SocialButton href={socials.github} label="GITHUB" color="hover:bg-neutral-600 border-neutral-400 text-neutral-400 hover:text-white" />
                  )}
                  {socials?.linkedin && (
                    <SocialButton href={socials.linkedin} label="LINKEDIN" color="hover:bg-blue-800 border-blue-600 text-blue-500 hover:text-white" />
                  )}
                  {socials?.twitter && (
                    <SocialButton href={socials.twitter} label="TWITTER" color="hover:bg-sky-500 border-sky-400 text-sky-400 hover:text-white" />
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Helper Component: CSS Pixel Art Hero
// ---------------------------------------------------------
function PixelHero() {
  const sprite = [
    0,0,1,0,0,0,0,0,1,0,0,
    0,0,0,1,0,0,0,1,0,0,0,
    0,0,1,1,1,1,1,1,1,0,0,
    0,1,1,0,1,1,1,0,1,1,0,
    1,1,1,1,1,1,1,1,1,1,1,
    1,0,1,1,1,1,1,1,1,0,1,
    1,0,1,0,0,0,0,0,1,0,1,
    0,0,0,1,1,0,1,1,0,0,0,
  ];

  return (
    <div className="relative group">
      <div className="absolute -inset-10 bg-yellow-400/20 blur-2xl rounded-full group-hover:bg-red-500/30 transition-colors duration-500"></div>
      
      <div className="grid grid-cols-11 gap-0 w-24 h-16 md:w-32 md:h-24 relative z-10 animate-bounce" style={{ animationDuration: '2s' }}>
        {sprite.map((val, i) => (
          <div 
            key={i} 
            className={val ? 'bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.8)] group-hover:bg-red-500 transition-colors duration-300' : 'bg-transparent'} 
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Helper component for uniform section headers
// ---------------------------------------------------------
function SectionHeader({ title, subtitle, color, borderColor }) {
  return (
    <div className="mb-10 text-center md:text-left">
      <span className="text-neutral-500 text-sm tracking-[0.3em] uppercase block mb-2">{subtitle}</span>
      <h2 className={`text-4xl md:text-5xl font-black ${color} uppercase inline-block border-b-4 ${borderColor} pb-2`}>
        {title}
      </h2>
    </div>
  );
}

// ---------------------------------------------------------
// Helper component for buttons
// ---------------------------------------------------------
function SocialButton({ href, label, color }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className={`bg-black border-4 font-black py-4 px-8 transition-all duration-200 hover:scale-105 active:scale-95 shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] ${color}`}
    >
      {label}
    </a>
  );
}