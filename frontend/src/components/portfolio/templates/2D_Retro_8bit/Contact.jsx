import React, { useState } from "react";
import { Mail, Github, Linkedin, Twitter, Send, TerminalSquare } from "lucide-react";

export default function Contact({ personal, socials }) {
  const [hoverState, setHoverState] = useState(null);

  if (!personal && !socials) return null;

  return (
    <section id="contact" className="relative w-full bg-black py-24 px-4 sm:px-6 lg:px-8 border-b-8 border-[#ff007f] select-none overflow-hidden">
      {/* Intense scanline background */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[#ff007f]/5 opacity-50 mix-blend-overlay" />

      <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
        {/* GAME OVER / CONTINUE Heading */}
        <div className="text-center mb-12">
          <h2 className="font-retro-title text-4xl sm:text-5xl md:text-6xl text-[#ff007f] tracking-widest mb-6 animate-pulse drop-shadow-[0_0_15px_#ff007f]">
            GAME CLEAR!
          </h2>
          <p className="font-retro-body text-2xl md:text-3xl text-white uppercase tracking-widest">
            WOULD YOU LIKE TO START A NEW CO-OP SESSION?
          </p>
        </div>

        {/* High Score / Stats Summary Box */}
        <div className="w-full bg-neutral-900 border-4 border-white p-6 shadow-[8px_8px_0px_0px_#ff007f] mb-16 max-w-2xl">
          <div className="flex items-center justify-between border-b-4 border-dashed border-neutral-700 pb-4 mb-4">
            <span className="font-retro-title text-sm text-[#00f0ff]">PLAYER: {personal?.name || "PLAYER 1"}</span>
            <span className="font-retro-title text-sm text-[#ffde00]">STATUS: AVAILABLE FOR HIRE</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center group cursor-crosshair">
              <span className="font-retro-title text-xs text-neutral-400 group-hover:text-white transition-colors">BASE OF OPERATIONS</span>
              <span className="font-retro-body text-xl text-white group-hover:text-[#00f0ff]">{personal?.location || "EARTH"}</span>
            </div>
            <div className="flex justify-between items-center group cursor-crosshair">
              <span className="font-retro-title text-xs text-neutral-400 group-hover:text-white transition-colors">CURRENT MISSION</span>
              <span className="font-retro-body text-xl text-white group-hover:text-[#ff007f]">{personal?.role || "SEEKING NEW QUESTS"}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Social Links & Email) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
          {socials?.email && (
            <a 
              href={`mailto:${socials.email}`}
              className="col-span-1 sm:col-span-2 flex flex-col items-center justify-center gap-3 bg-[#00f0ff] hover:bg-white text-black border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all group"
            >
              <Mail className="w-8 h-8 group-hover:animate-bounce" />
              <span className="font-retro-title text-sm sm:text-base">TRANSMIT DIRECT MESSAGE</span>
            </a>
          )}

          {socials?.github && (
            <a 
              href={socials.github} target="_blank" rel="noopener noreferrer"
              onMouseEnter={() => setHoverState("github")} onMouseLeave={() => setHoverState(null)}
              className="flex items-center justify-center gap-3 bg-neutral-800 hover:bg-neutral-700 text-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all"
            >
              <Github className={`w-6 h-6 ${hoverState === 'github' ? 'text-[#ffde00]' : ''}`} />
              <span className="font-retro-title text-xs">SOURCE CODE</span>
            </a>
          )}

          {socials?.linkedin && (
            <a 
              href={socials.linkedin} target="_blank" rel="noopener noreferrer"
              onMouseEnter={() => setHoverState("linkedin")} onMouseLeave={() => setHoverState(null)}
              className="flex items-center justify-center gap-3 bg-neutral-800 hover:bg-neutral-700 text-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all"
            >
              <Linkedin className={`w-6 h-6 ${hoverState === 'linkedin' ? 'text-[#00f0ff]' : ''}`} />
              <span className="font-retro-title text-xs">NETWORK LOBBY</span>
            </a>
          )}

          {socials?.twitter && (
            <a 
              href={socials.twitter} target="_blank" rel="noopener noreferrer"
              onMouseEnter={() => setHoverState("twitter")} onMouseLeave={() => setHoverState(null)}
              className="flex items-center justify-center gap-3 bg-neutral-800 hover:bg-neutral-700 text-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all sm:col-span-2 md:col-span-1"
            >
              <Twitter className={`w-6 h-6 ${hoverState === 'twitter' ? 'text-[#ff007f]' : ''}`} />
              <span className="font-retro-title text-xs">GLOBAL CHAT</span>
            </a>
          )}
        </div>

        {/* Footer / Credits */}
        <div className="mt-24 flex flex-col items-center gap-4 text-center">
          <TerminalSquare className="w-6 h-6 text-neutral-600" />
          <p className="font-retro-title text-[8px] sm:text-[10px] text-neutral-500 tracking-widest leading-loose">
            © {new Date().getFullYear()} {personal?.name?.toUpperCase() || "PLAYER 1"}. ALL RIGHTS RESERVED.<br/>
            INSERT COIN TO RESTART
          </p>
        </div>

      </div>
    </section>
  );
}
