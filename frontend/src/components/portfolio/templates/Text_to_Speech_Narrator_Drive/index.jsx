import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';

export default function TextToSpeechNarratorDrive() {
  const { portfolioData } = usePortfolio();
  const { personal, socials, stats, skills, projects, experience, testimonials } = portfolioData;
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [currentTime, setCurrentTime] = useState(0);
  const audioContextRef = useRef(null);

  const tabs = ['Overview', 'Projects', 'Experience', 'Equalizer', 'Testimonials', 'Contact'];

  // Fake audio progression loop
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= 100 ? 0 : prev + 0.2));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <>
      {/* Injecting custom advanced keyframes directly into the component 
        to ensure pure, unique animations without modifying global Tailwind config.
      */}
      <style>{`
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes eq-bounce {
          0%, 100% { transform: scaleY(0.2); }
          50% { transform: scaleY(1); }
        }
        @keyframes float-card {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 15px rgba(245, 158, 11, 0.1); }
          50% { box-shadow: 0 0 35px rgba(245, 158, 11, 0.4); border-color: rgba(245, 158, 11, 0.6); }
        }
        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes signal-wave {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        .animate-vinyl { animation: vinyl-spin 8s linear infinite; }
        .animate-vinyl-paused { animation: vinyl-spin 8s linear infinite; animation-play-state: paused; }
        .eq-bar { transform-origin: bottom; }
        .animate-slide-up { animation: slide-up-fade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#0a0a0a] text-neutral-300 font-sans selection:bg-amber-500/30 overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT PANEL: The Drive Player */}
        <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#111] border-b lg:border-b-0 lg:border-r border-neutral-800 p-6 lg:p-8 flex flex-col justify-between relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)] lg:h-screen lg:sticky top-0">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-neutral-600'}`} />
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-neutral-500 uppercase">
                TTS // Engine.v2
              </span>
            </div>
            <span className="text-xs font-mono text-amber-500/70">192kbps / Stereo</span>
          </div>
          
          {/* Core Player UI */}
          <div className="flex-1 flex flex-col items-center justify-center py-8 lg:py-0">
            {/* Spinning Avatar / Vinyl */}
            <div className="relative mb-10 group perspective-1000">
              <div className={`absolute -inset-4 bg-amber-500/20 rounded-full blur-2xl transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
              <div 
                className={`w-48 h-48 lg:w-56 lg:h-56 rounded-full border-[6px] border-neutral-900 shadow-2xl relative overflow-hidden ring-1 ring-white/10 ${isPlaying ? 'animate-vinyl' : 'animate-vinyl-paused'}`}
              >
                <img src={personal.avatar} alt={personal.name} className="w-full h-full object-cover scale-110" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent" />
                {/* Vinyl inner ring hole */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#0a0a0a] rounded-full border border-neutral-700 shadow-inner" />
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="text-center w-full mb-8">
              <h1 className="text-3xl lg:text-4xl font-light text-white mb-3 tracking-tight">{personal.name}</h1>
              <p className="text-amber-500/90 font-mono text-sm tracking-wider uppercase mb-2">{personal.title}</p>
              <p className="text-neutral-500 text-sm max-w-[280px] mx-auto italic">"{personal.tagline}"</p>
            </div>

            {/* Scrubber & Audio Wave */}
            <div className="w-full mb-8">
              {/* Decorative Audio Waveform */}
              <div className="flex items-end justify-between h-12 mb-4 gap-[2px]">
                {[...Array(40)].map((_, i) => {
                  const delay = (i * 0.05).toFixed(2);
                  const isHigh = i % 4 === 0;
                  return (
                    <div 
                      key={i} 
                      className={`eq-bar w-full bg-amber-500 rounded-t-sm transition-opacity duration-300 ${isPlaying ? 'opacity-80' : 'opacity-20 h-1!'}`}
                      style={{ 
                        height: isPlaying ? `${Math.max(10, Math.random() * (isHigh ? 100 : 50))}%` : '10%',
                        animation: isPlaying ? `eq-bounce ${0.5 + Math.random()}s ease-in-out infinite alternate` : 'none',
                        animationDelay: `${delay}s`
                      }}
                    />
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="group relative w-full h-1.5 bg-neutral-800 rounded-full cursor-pointer hover:h-2 transition-all">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full relative"
                  style={{ width: `${currentTime}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(245,158,11,1)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex justify-between font-mono text-[10px] text-neutral-500 mt-3 tracking-widest">
                <span>{`00:${Math.floor(currentTime * 0.6).toString().padStart(2, '0')}`}</span>
                <span>01:00</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-6 lg:space-x-8">
            <button className="text-neutral-600 hover:text-white transition-all hover:scale-110 active:scale-90">
              <svg className="w-6 h-6 lg:w-7 lg:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" /></svg>
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] relative overflow-hidden group"
            >
              {/* Play button hover sweep effect */}
              <div className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              {isPlaying ? (
                <svg className="w-8 h-8 lg:w-10 lg:h-10 relative z-10 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z" /></svg>
              ) : (
                <svg className="w-8 h-8 lg:w-10 lg:h-10 ml-2 relative z-10 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <button className="text-neutral-600 hover:text-white transition-all hover:scale-110 active:scale-90">
              <svg className="w-6 h-6 lg:w-7 lg:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.334-4z" /></svg>
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Content Tracklist */}
        <div className="flex-1 flex flex-col h-auto lg:h-screen overflow-hidden bg-[#0f0f0f] relative">
          
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #333 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          {/* Navigation Tabs */}
          <div className="px-6 lg:px-12 pt-8 lg:pt-12 pb-4 border-b border-neutral-800/50 bg-[#0f0f0f]/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex space-x-8 overflow-x-auto hide-scrollbar pb-2 relative">
              {tabs.map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap text-xs lg:text-sm font-bold tracking-widest uppercase transition-all duration-300 relative py-2 ${activeTab === tab ? 'text-amber-500' : 'text-neutral-600 hover:text-white'}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 rounded-t-lg shadow-[0_-2px_10px_rgba(245,158,11,0.8)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 overflow-y-auto px-6 lg:px-12 py-8 lg:py-12 scroll-smooth">
            
            {/* OVERVIEW */}
            {activeTab === 'Overview' && (
              <div className="max-w-4xl mx-auto space-y-12 animate-slide-up">
                {/* Bio Card */}
                <div className="relative group p-[1px] rounded-2xl bg-gradient-to-b from-neutral-800 to-transparent overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="bg-[#111] p-8 lg:p-10 rounded-2xl relative">
                    <div className="absolute top-0 left-8 w-12 h-1 bg-amber-500 group-hover:w-full transition-all duration-700 ease-out" />
                    <h2 className="text-xl font-light text-white mb-6 tracking-wide">Track 01. <span className="font-bold">Introduction</span></h2>
                    <p className="text-neutral-400 text-lg leading-relaxed font-light">{personal.bio}</p>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(stats).map(([key, value], i) => (
                    <div key={key} style={{ animationDelay: `${i * 0.1}s` }} className="animate-slide-up group bg-[#111] p-8 rounded-2xl border border-neutral-800/50 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)] relative overflow-hidden">
                      {/* Audio visualizer accent on hover */}
                      <div className="absolute right-4 bottom-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         {[1,2,3].map(n => <div key={n} className="w-1 bg-amber-500 rounded-t animate-pulse" style={{ height: `${n * 8}px`, animationDelay: `${n * 0.1}s` }} />)}
                      </div>
                      <div className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tighter group-hover:text-amber-500 transition-colors">{value}</div>
                      <div className="text-xs text-neutral-500 font-mono uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROJECTS */}
            {activeTab === 'Projects' && (
              <div className="max-w-4xl mx-auto space-y-6">
                {projects.map((project, idx) => (
                  <div key={idx} style={{ animationDelay: `${idx * 0.1}s` }} className="animate-slide-up group relative bg-[#111] rounded-2xl border border-neutral-800 overflow-hidden hover:border-amber-500/40 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-in-out" />
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center p-6 relative z-10">
                      {/* Track Number */}
                      <div className="font-mono text-2xl font-bold text-neutral-800 group-hover:text-amber-500/50 transition-colors w-16 mb-4 sm:mb-0">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      
                      {/* Image */}
                      <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden shrink-0 mb-4 sm:mb-0">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      
                      {/* Content */}
                      <div className="sm:ml-8 flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{project.title}</h3>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-4">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map(tech => (
                            <span key={tech} className="text-xs font-mono bg-[#1a1a1a] text-neutral-500 px-3 py-1 rounded-full border border-neutral-800 group-hover:border-neutral-700 transition-colors">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Links */}
                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-3 bg-[#111]/80 backdrop-blur-sm p-2 rounded-lg">
                         {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-white hover:text-amber-500"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg></a>}
                         {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-white hover:text-amber-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EXPERIENCE */}
            {activeTab === 'Experience' && (
              <div className="max-w-4xl mx-auto relative before:absolute before:inset-0 before:left-[19px] md:before:left-1/2 md:before:-translate-x-[1px] before:h-full before:w-[2px] before:bg-gradient-to-b before:from-amber-500/50 before:via-neutral-800 before:to-transparent">
                {experience.map((exp, idx) => (
                  <div key={idx} style={{ animationDelay: `${idx * 0.15}s` }} className="animate-slide-up relative flex flex-col md:flex-row items-start md:items-center justify-between mb-12 md:even:flex-row-reverse group">
                    
                    {/* Glowing Node on Timeline */}
                    <div className="absolute left-[11px] md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-4 h-4 rounded-full bg-[#111] border-[3px] border-neutral-700 group-hover:border-amber-500 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.8)] transition-all duration-500 z-10" />
                    
                    <div className="w-full pl-12 md:pl-0 md:w-[45%]">
                      <div className="bg-[#111] p-6 lg:p-8 rounded-2xl border border-neutral-800/80 group-hover:border-amber-500/30 group-hover:bg-neutral-900/50 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors duration-500" />
                        <div className="flex flex-col mb-4">
                          <span className="text-amber-500 font-mono text-xs font-bold tracking-widest mb-2">{exp.period}</span>
                          <h4 className="font-bold text-white text-xl">{exp.role}</h4>
                          <span className="text-neutral-500 text-sm">{exp.company}</span>
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed font-light">{exp.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EQUALIZER (SKILLS) */}
            {activeTab === 'Equalizer' && (
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {skills.map((skill, idx) => {
                    // Slight randomization to make equalizer look alive
                    const offset = isPlaying ? Math.random() * 10 - 5 : 0; 
                    const displayLevel = Math.max(0, Math.min(100, skill.level + offset));

                    return (
                      <div key={idx} style={{ animationDelay: `${idx * 0.05}s` }} className="animate-slide-up group">
                        <div className="flex justify-between text-sm mb-2 font-mono">
                          <span className="text-white font-bold tracking-wide">{skill.name}</span>
                          <span className="text-amber-500/80">{skill.level}dB</span>
                        </div>
                        <div className="h-2 w-full bg-[#111] rounded-full overflow-hidden border border-neutral-800 relative">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-300 transition-all duration-500 ease-out"
                            style={{ width: `${displayLevel}%` }}
                          >
                            {/* Blip effect at the end of the bar */}
                            <div className={`absolute right-0 top-0 h-full w-2 bg-white/50 blur-[1px] ${isPlaying ? 'animate-pulse' : ''}`} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TESTIMONIALS */}
            {activeTab === 'Testimonials' && (
              <div className="max-w-5xl mx-auto columns-1 md:columns-2 gap-8 space-y-8">
                {testimonials.map((test, idx) => (
                  <div key={idx} style={{ animationDelay: `${idx * 0.1}s` }} className="animate-slide-up break-inside-avoid bg-[#111] p-8 rounded-3xl border border-neutral-800/80 hover:-translate-y-2 hover:border-amber-500/40 transition-all duration-500 relative group">
                    {/* Big quote icon decoration */}
                    <div className="absolute top-4 right-6 text-6xl font-serif text-neutral-800 group-hover:text-amber-500/20 transition-colors duration-500">"</div>
                    
                    <p className="text-neutral-300 italic leading-relaxed mb-8 relative z-10 text-lg">"{test.text}"</p>
                    
                    <div className="flex items-center space-x-4 relative z-10">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-neutral-800 group-hover:border-amber-500 transition-colors">
                        <img src={test.avatar} alt={test.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{test.name}</h4>
                        <p className="text-amber-500/80 text-xs font-mono uppercase">{test.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CONTACT / TRANSMISSION */}
            {activeTab === 'Contact' && (
              <div className="max-w-2xl mx-auto animate-slide-up mt-8">
                <div className="bg-[#111] p-12 rounded-[2.5rem] border border-neutral-800/80 text-center relative overflow-hidden group hover:border-amber-500/50 transition-colors duration-700">
                  
                  {/* Radar/Sonar background effect */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                    <div className="absolute w-32 h-32 border border-amber-500/20 rounded-full" style={{ animation: 'signal-wave 3s linear infinite' }} />
                    <div className="absolute w-32 h-32 border border-amber-500/20 rounded-full" style={{ animation: 'signal-wave 3s linear infinite 1s' }} />
                    <div className="absolute w-32 h-32 border border-amber-500/20 rounded-full" style={{ animation: 'signal-wave 3s linear infinite 2s' }} />
                  </div>

                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <h2 className="text-3xl font-light text-white mb-2 tracking-wide">Open Frequency</h2>
                    <p className="text-neutral-400 mb-8 font-light">Currently broadcasting from <span className="text-amber-500">{personal.location}</span>. Reach out to establish a connection.</p>
                    
                    <a href={`mailto:${socials.email}`} className="inline-block bg-white text-black font-bold font-mono tracking-widest uppercase px-8 py-4 rounded-full hover:bg-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 mb-12">
                      Initialize Contact
                    </a>

                    <div className="flex items-center justify-center space-x-8 pt-8 border-t border-neutral-800">
                      {Object.entries(socials).filter(([key, val]) => key !== 'email' && val).map(([platform, url]) => (
                        <a key={platform} href={url} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-amber-500 uppercase text-xs font-bold tracking-widest transition-colors hover:-translate-y-1 transform inline-block">
                          {platform}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </>
  );
}