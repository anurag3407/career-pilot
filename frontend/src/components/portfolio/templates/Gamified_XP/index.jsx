import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Shield, Sword, Scroll, MessageSquare, Save, Play, ExternalLink, Github, Terminal } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

// Reusable retro blocky container
const PixelBox = ({ children, className = "", noBg = false }) => (
  <div className={`
    relative p-6 border-4 border-emerald-500
    shadow-[4px_4px_0px_0px_rgba(16,185,129,0.5)]
    ${noBg ? '' : 'bg-gray-900'}
    ${className}
  `}>
    {/* Corner accents */}
    <div className="absolute -top-1 -left-1 w-2 h-2 bg-emerald-500" />
    <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500" />
    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-emerald-500" />
    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-emerald-500" />
    {children}
  </div>
);

export default function GamifiedXP() {
  const { personal, socials, skills, projects, experience, testimonials, stats } = data;

  // Calculate pseudo XP based on experience
  const level = stats.yearsExperience * 5 + 10;
  const xpCurrent = 8750;
  const xpNext = 10000;
  const xpPercent = (xpCurrent / xpNext) * 100;

  return (
    <div className="min-h-screen bg-black text-emerald-400 font-mono selection:bg-emerald-500 selection:text-black overflow-hidden relative pb-20">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 space-y-24">
        
        {/* HERO / PLAYER PROFILE */}
        <section>
          <PixelBox className="flex flex-col md:flex-row gap-8 items-center bg-gray-950">
            <div className="relative group">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-none border-4 border-emerald-400 p-2 overflow-hidden shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                <img src={personal.avatar} alt="Player Avatar" className="w-full h-full object-cover filter contrast-125 grayscale hue-rotate-180 brightness-75 group-hover:filter-none transition-all duration-500" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black border-2 border-emerald-400 px-3 py-1 text-sm font-bold shadow-[2px_2px_0px_rgba(52,211,153,1)]">
                LVL {level}
              </div>
            </div>
            
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-2">
                <Gamepad2 className="w-6 h-6 animate-pulse" />
                <h1 className="text-3xl md:text-5xl font-black tracking-widest uppercase text-white drop-shadow-[2px_2px_0px_#10b981]">
                  {personal.name}
                </h1>
              </div>
              <p className="text-lg text-emerald-300 mb-6 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Class: {personal.title}
              </p>
              
              {/* XP Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span>EXP: {xpCurrent} / {xpNext}</span>
                  <span>Next Level: {(100 - xpPercent).toFixed(1)}%</span>
                </div>
                <div className="h-4 w-full border-2 border-emerald-500 bg-gray-900 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercent}%` }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                  />
                </div>
              </div>
            </div>
          </PixelBox>
        </section>

        {/* ABOUT / CHARACTER STATS */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <Shield className="w-8 h-8 text-fuchsia-500" />
            <h2 className="text-2xl md:text-4xl font-bold uppercase text-fuchsia-400 tracking-widest">Character Stats</h2>
            <div className="flex-1 h-1 bg-fuchsia-500/30 ml-4 hidden md:block" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PixelBox className="border-fuchsia-500 shadow-[4px_4px_0px_0px_rgba(217,70,239,0.5)]">
              <h3 className="text-xl text-white mb-4 border-b-2 border-fuchsia-500/50 pb-2">Lore</h3>
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                {personal.bio}
              </p>
            </PixelBox>
            
            <PixelBox className="border-fuchsia-500 shadow-[4px_4px_0px_0px_rgba(217,70,239,0.5)] flex flex-col justify-center gap-6">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <span className="text-gray-400 uppercase">Quests Completed</span>
                <span className="text-2xl font-bold text-fuchsia-400">{stats.projectsCompleted}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <span className="text-gray-400 uppercase">Allies Rescued</span>
                <span className="text-2xl font-bold text-fuchsia-400">{stats.happyClients}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 uppercase">Base Location</span>
                <span className="text-lg font-bold text-white uppercase">{personal.location}</span>
              </div>
            </PixelBox>
          </div>
        </section>

        {/* SKILLS / SKILL TREE */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <Sword className="w-8 h-8 text-cyan-500" />
            <h2 className="text-2xl md:text-4xl font-bold uppercase text-cyan-400 tracking-widest">Skill Tree</h2>
            <div className="flex-1 h-1 bg-cyan-500/30 ml-4 hidden md:block" />
          </div>
          
          <PixelBox className="border-cyan-500 shadow-[4px_4px_0px_0px_rgba(6,182,212,0.5)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {skills.map((skill, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between text-sm mb-1 uppercase tracking-wide">
                    <span className="text-white group-hover:text-cyan-300 transition-colors">{skill.name}</span>
                    <span className="text-cyan-500">LVL {Math.floor(skill.level / 10)}</span>
                  </div>
                  <div className="flex gap-1 h-3">
                    {[...Array(10)].map((_, j) => (
                      <div 
                        key={j} 
                        className={`flex-1 border border-cyan-900/50 ${j < Math.floor(skill.level / 10) ? 'bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.8)]' : 'bg-gray-900'}`} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PixelBox>
        </section>

        {/* PROJECTS / INVENTORY */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <Gamepad2 className="w-8 h-8 text-amber-500" />
            <h2 className="text-2xl md:text-4xl font-bold uppercase text-amber-400 tracking-widest">Inventory (Projects)</h2>
            <div className="flex-1 h-1 bg-amber-500/30 ml-4 hidden md:block" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <PixelBox className="h-full flex flex-col border-amber-500 shadow-[4px_4px_0px_0px_rgba(245,158,11,0.5)] bg-gray-950 hover:bg-gray-900 transition-colors">
                  <div className="h-32 mb-4 border-2 border-amber-900 overflow-hidden relative">
                    <div className="absolute inset-0 bg-amber-500/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors" />
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase mb-2 line-clamp-1">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tech, j) => (
                      <span key={j} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 mt-auto">
                    {project.liveUrl && (
                      <a href={project.liveUrl} className="flex-1 flex justify-center items-center gap-2 py-2 border-2 border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black font-bold uppercase text-xs transition-colors">
                        <Play className="w-3 h-3" /> Equip
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} className="flex-1 flex justify-center items-center gap-2 py-2 border-2 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white font-bold uppercase text-xs transition-colors">
                        <Github className="w-3 h-3" /> Inspect
                      </a>
                    )}
                  </div>
                </PixelBox>
              </motion.div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE / QUEST HISTORY */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <Scroll className="w-8 h-8 text-blue-500" />
            <h2 className="text-2xl md:text-4xl font-bold uppercase text-blue-400 tracking-widest">Quest History</h2>
            <div className="flex-1 h-1 bg-blue-500/30 ml-4 hidden md:block" />
          </div>
          
          <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-4 before:w-1 before:bg-blue-900/50">
            {experience.map((exp, i) => (
              <div key={i} className="relative pl-12 pr-4 md:pr-0">
                <div className="absolute left-2.5 top-5 w-4 h-4 bg-black border-2 border-blue-400 rotate-45 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                <PixelBox className="border-blue-500 shadow-[4px_4px_0px_0px_rgba(59,130,246,0.5)]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-gray-800 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white uppercase">{exp.role}</h3>
                      <p className="text-blue-300 font-bold">{exp.company}</p>
                    </div>
                    <span className="text-gray-500 text-sm mt-2 md:mt-0 font-bold bg-gray-900 px-3 py-1 border border-gray-700">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                </PixelBox>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS / NPC DIALOGUE */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <MessageSquare className="w-8 h-8 text-rose-500" />
            <h2 className="text-2xl md:text-4xl font-bold uppercase text-rose-400 tracking-widest">NPC Dialogue</h2>
            <div className="flex-1 h-1 bg-rose-500/30 ml-4 hidden md:block" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-16 h-16 shrink-0 border-2 border-rose-500 p-1 bg-black overflow-hidden relative mt-2 shadow-[2px_2px_0px_rgba(244,63,94,0.5)]">
                  <img src={test.avatar} alt={test.name} className="w-full h-full object-cover pixelated opacity-80" />
                </div>
                <div className="flex-1 relative">
                  {/* Dialogue tail */}
                  <div className="absolute top-6 -left-3 w-0 h-0 border-y-8 border-y-transparent border-r-[12px] border-r-rose-500 drop-shadow-[-2px_0_0_#f43f5e]" />
                  <PixelBox className="border-rose-500 shadow-[4px_4px_0px_0px_rgba(244,63,94,0.5)]">
                    <p className="text-white text-sm md:text-base leading-relaxed mb-4">
                      "{test.text}"
                    </p>
                    <div className="text-right border-t border-gray-800 pt-2">
                      <span className="text-rose-400 font-bold uppercase">{test.name}</span>
                      <span className="text-gray-500 text-xs ml-2 block">{test.role}</span>
                    </div>
                  </PixelBox>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT / SAVE GAME */}
        <section className="text-center pt-12">
          <PixelBox className="inline-block mx-auto border-emerald-500 bg-gray-950 px-8 py-12 md:px-24">
            <Save className="w-12 h-12 text-emerald-400 mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-2 drop-shadow-[2px_2px_0px_#10b981]">
              Save Game?
            </h2>
            <p className="text-emerald-300 mb-8">Would you like to initiate contact?</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href={`mailto:${socials.email}`} className="px-8 py-3 bg-emerald-500 text-black font-black uppercase tracking-widest border-2 border-emerald-400 hover:bg-emerald-400 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition-all active:translate-y-1 active:shadow-none">
                Yes (Email)
              </a>
              <div className="flex gap-4 justify-center">
                {socials.github && (
                  <a href={socials.github} className="p-3 bg-gray-800 text-white border-2 border-gray-600 hover:bg-gray-700 hover:border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] transition-all active:translate-y-1 active:shadow-none">
                    <Github className="w-6 h-6" />
                  </a>
                )}
                {socials.linkedin && (
                  <a href={socials.linkedin} className="p-3 bg-blue-900 text-white border-2 border-blue-600 hover:bg-blue-800 hover:border-blue-400 shadow-[4px_4px_0px_0px_rgba(59,130,246,0.3)] transition-all active:translate-y-1 active:shadow-none">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                )}
              </div>
            </div>
          </PixelBox>
        </section>
        
      </div>
    </div>
  );
}
