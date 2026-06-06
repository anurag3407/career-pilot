import React from 'react';
import { 
  Disc3, Mic2, Radio, Headphones, Sparkles, ListMusic, 
  Play, MapPin, CalendarDays, Github, Linkedin, Twitter, Mail, Link2, Instagram
} from 'lucide-react';

export default function About() {
  return (
    // Main Container: Retro dark wood aesthetic
    <section className="w-full min-h-screen bg-gradient-to-br from-[#2c1b12] via-[#1a0f0a] to-[#0a0502] text-amber-50 py-20 px-4 sm:px-8 md:px-12 lg:px-20 font-serif overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* TOP SECTION: The Turntable & Liner Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: The Vintage Record - FLUID & RESPONSIVE FIX */}
          <div className="flex justify-center items-center py-8 lg:py-0 w-full">
            <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[420px] aspect-square bg-zinc-900 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-zinc-800 flex items-center justify-center mx-auto shrink-0">
              
              {/* Record Grooves */}
              <div className="w-[94%] h-[94%] bg-black rounded-full border border-zinc-800 flex items-center justify-center relative animate-[spin_4s_linear_infinite]">
                <div className="absolute inset-[3%] rounded-full border border-zinc-800/60"></div>
                <div className="absolute inset-[8%] rounded-full border border-zinc-800/40"></div>
                <div className="absolute inset-[15%] rounded-full border border-zinc-800/30"></div>
                <div className="absolute inset-[24%] rounded-full border border-zinc-800/50 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]"></div>
                
                {/* Center Label */}
                <div className="w-[38%] h-[38%] bg-gradient-to-br from-amber-600 to-orange-700 rounded-full flex flex-col items-center justify-center shadow-inner relative z-10 border-4 border-amber-900/50">
                   <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-orange-100 mb-1">Mixed By</span>
                   <span className="text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-widest text-orange-950 mb-2 sm:mb-3 text-center leading-none">
                     Ludwig<br/>Mozart
                   </span>
                   {/* Spindle Hole */}
                   <div className="w-3 h-3 sm:w-4 sm:h-4 bg-zinc-300 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"></div>
                </div>
                
                {/* Vinyl Sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* Right: Liner Notes */}
          <div className="space-y-6 md:space-y-8 lg:pl-10 relative z-10 text-center lg:text-left">
            <div className="space-y-3">
              <div className="flex items-center justify-center lg:justify-start space-x-3 text-amber-500">
                <Mic2 className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="uppercase tracking-widest text-xs sm:text-sm font-bold">Meet the Artist</span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400 leading-tight">
                The Architect <br className="hidden sm:block" />Behind the Audio.
              </h2>
            </div>
            
            <div className="prose prose-invert prose-base sm:prose-lg text-amber-200/80 font-sans leading-relaxed mx-auto lg:mx-0">
              <p>
                Every great application, like a classic vinyl record, requires a meticulous mix of rhythm, structure, and soul. 
                A Full-Stack Developer treating code like a composition—layering robust backend architectures 
                with dynamic, responsive frontend melodies.
              </p>
              <p>
                Currently spinning tracks in the open-source world, specializing in crafting digital experiences that 
                don&apos;t just function perfectly, but feel genuinely resonant to the user.
              </p>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: Sonic Spectrum (Skills) */}
        <div className="pt-16 border-t border-amber-900/30">
          <div className="flex items-center justify-center space-x-3 text-amber-500 mb-10">
            <Radio className="w-6 h-6" />
            <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-amber-100">Sonic Spectrum</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: "Frontend Frequencies", icon: Headphones, color: "text-amber-500", desc: "Crafting pixel-perfect user interfaces with React, Tailwind CSS, and Framer Motion." },
              { title: "Backend Basslines", icon: Disc3, color: "text-orange-500", desc: "Building scalable server architectures using Node.js, Express, and modern databases." },
              { title: "Open Source Remixes", icon: Sparkles, color: "text-amber-400", desc: "Collaborating with global developers and fine-tuning projects for the community." }
            ].map((skill) => (
              <div key={skill.title} className="bg-[#1a110a] p-6 sm:p-8 rounded-xl border border-amber-900/40 shadow-xl transition-transform hover:-translate-y-2">
                <skill.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${skill.color} mb-4 sm:mb-6`} />
                <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-amber-100">{skill.title}</h4>
                <p className="text-amber-200/70 font-sans text-xs sm:text-sm leading-relaxed mb-6">
                  {skill.desc}
                </p>
                <div className="flex items-end space-x-1 h-6 sm:h-8 opacity-70">
                  <div className="w-full bg-amber-600/80 rounded-t-sm" style={{ height: '60%' }}></div>
                  <div className="w-full bg-orange-500/80 rounded-t-sm" style={{ height: '100%' }}></div>
                  <div className="w-full bg-amber-700/80 rounded-t-sm" style={{ height: '40%' }}></div>
                  <div className="w-full bg-amber-500/80 rounded-t-sm" style={{ height: '80%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM GRID: Top Charts & Broken Records (Experience) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-16 border-t border-amber-900/30">
          
          {/* LEFT: Top Chart Collections */}
          <div>
            <div className="flex items-center space-x-3 text-amber-500 mb-8 justify-center lg:justify-start">
              <ListMusic className="w-6 h-6" />
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-amber-100">Top Chart Collections</h3>
            </div>
            
            <div className="space-y-4 font-sans">
              {[
                { 
                  rank: "01", 
                  title: "Fur Elise", 
                  desc: "Sophisticated app melody with Swift and REST API integration", 
                  tags: "Swift • REST API",
                  repoUrl: "#" 
                },
                { 
                  rank: "02", 
                  title: "Moonlight Sonata", 
                  desc: "Soul stirring SQL query optimizer", 
                  tags: "SQL • React",
                  repoUrl: "#" 
                },
                { 
                  rank: "03", 
                  title: "Clair de Lune", 
                  desc: "Complex algorithmic symphony", 
                  tags: "Algorithm Design • Python",
                  repoUrl: "#" 
                },
              ].map((track) => (
                <div key={track.title} className="group flex items-center p-3 sm:p-4 bg-[#1a110a]/50 hover:bg-[#1a110a] border border-amber-900/20 hover:border-amber-500/50 rounded-lg transition-all">
                  <div className="text-2xl sm:text-3xl font-black text-amber-900/60 group-hover:text-amber-500/80 w-12 sm:w-16 transition-colors shrink-0">
                    {track.rank}
                  </div>
                  <div className="flex-grow pr-2 min-w-0">
                    <h4 className="text-base sm:text-lg font-bold text-amber-100 truncate">{track.title}</h4>
                    <p className="text-xs sm:text-sm text-amber-200/60 truncate">{track.desc}</p>
                  </div>
                  <div className="hidden sm:block text-xs font-mono text-orange-500/70 mr-4 whitespace-nowrap">
                    {track.tags}
                  </div>
                  
                  {/* Valid Link Check Implementation */}
                  {track.repoUrl && track.repoUrl !== "#" ? (
                    <a 
                      href={track.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500/10 group-hover:bg-amber-500 flex items-center justify-center transition-colors shrink-0 ml-2"
                      aria-label={`View ${track.title} repository`}
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 group-hover:text-amber-950 ml-1" />
                    </a>
                  ) : (
                    <div 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-900/10 flex items-center justify-center shrink-0 ml-2 opacity-50 cursor-not-allowed"
                      aria-label={`${track.title} repository link unavailable`}
                      title="Link unavailable"
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 ml-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Broken Records (Experience) */}
          <div>
            <div className="flex items-center space-x-3 text-amber-500 mb-8 justify-center lg:justify-start">
              <MapPin className="w-6 h-6" />
              <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-amber-100">Broken Records</h3>
            </div>

            <div className="relative border-l-2 border-amber-900/50 ml-3 sm:ml-4 space-y-8 pb-4">
              {[
                { year: "2024 - Present", role: "Open Source Contributor", venue: "GSoC &apos;26 / GSSOC" },
                { year: "2023 - 2024", role: "Software Developer", venue: "Web Development" },
                { year: "2024 - 2028", role: "Computer Engineering", venue: "Oxford University" },
              ].map((gig) => (
                <div key={gig.role} className="relative pl-6 sm:pl-8 font-sans">
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#1a0f0a] border-2 border-amber-500"></div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm text-orange-400 mb-1 font-mono">
                    <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{gig.year}</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-amber-100 font-serif">{gig.role}</h4>
                  <p className="text-sm sm:text-base text-amber-200/60 uppercase tracking-wider mt-1">{gig.venue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER SECTION: Record Labels (Socials) */}
        <div className="pt-16 border-t border-amber-900/30 text-center pb-10">
          <div className="flex items-center justify-center space-x-3 text-amber-500 mb-8">
            <Link2 className="w-6 h-6" />
            <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-amber-100">Record Labels</h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {[
              { name: "GitHub", icon: Github, url: "#" },
              { name: "LinkedIn", icon: Linkedin, url: "#" },
              { name: "Instagram", icon: Instagram, url: "#" },
              { name: "Contact", icon: Mail, url: "#" },
            ].map((social) => (
              social.url && social.url !== "#" ? (
                <a 
                  key={social.name} 
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center space-x-3 px-6 py-4 bg-[#1a110a] border border-amber-900/40 border-dashed rounded-lg hover:border-amber-500 hover:bg-amber-900/20 transition-all hover:-translate-y-1"
                >
                  <social.icon className="w-5 h-5 text-amber-500 group-hover:text-amber-400 transition-colors" />
                  <span className="font-bold text-amber-100 uppercase tracking-widest text-sm">{social.name}</span>
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#0a0502] rounded-full border border-amber-900/40 group-hover:border-amber-500 transition-colors"></div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#0a0502] rounded-full border border-amber-900/40 group-hover:border-amber-500 transition-colors"></div>
                </a>
              ) : (
                <div 
                  key={social.name} 
                  className="relative flex items-center space-x-3 px-6 py-4 bg-[#1a110a] border border-amber-900/20 border-dashed rounded-lg opacity-50 cursor-not-allowed"
                  title="Link unavailable"
                >
                  <social.icon className="w-5 h-5 text-amber-700" />
                  <span className="font-bold text-amber-700 uppercase tracking-widest text-sm">{social.name}</span>
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#0a0502] rounded-full border border-amber-900/20"></div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#0a0502] rounded-full border border-amber-900/20"></div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}