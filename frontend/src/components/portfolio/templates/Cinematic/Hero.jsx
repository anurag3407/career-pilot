import React from 'react';
import { Play, ChevronRight, Film, Award } from 'lucide-react';

export default function Hero({ data }) {
  const name = data?.personal?.name || 'John Doe';
  const tagline = data?.personal?.bio || "Crafting digital experiences with a touch of magic and relentless precision.";
  
  return (
    <>
      <style>
        {`
          @keyframes cinematic-fade-up {
            0% { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(8px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }
          .animate-cinematic {
            animation: cinematic-fade-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-cinematic {
              animation: none;
              opacity: 1;
              transform: none;
              filter: none;
            }
          }
        `}
      </style>
      <section className="relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] text-white font-sans selection:bg-neutral-800">
        {/* Cinematic Backdrop - Deep Gradient and Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-[#050505] to-[#050505] z-0"></div>
        
        {/* Subtle Film Grain Noise Overlay */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay z-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' 
          }}>
        </div>

        {/* Letterbox Bars (Cinematic aspect ratio feel) */}
        <div className="absolute top-0 left-0 w-full h-[8vh] bg-black z-30 pointer-events-none shadow-[0_20px_40px_rgba(0,0,0,0.8)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-[8vh] bg-black z-30 pointer-events-none shadow-[0_-20px_40px_rgba(0,0,0,0.8)] flex items-center justify-center">
            {/* Production info on bottom bar */}
            <div className="flex items-center gap-4 sm:gap-6 text-[9px] sm:text-[10px] text-neutral-500 font-mono tracking-[0.3em] uppercase opacity-80">
                <span className="flex items-center gap-1.5"><Award size={12} className="text-neutral-400" /> Official Selection {new Date().getFullYear()}</span>
                <span className="hidden sm:inline opacity-50">|</span>
                <span className="hidden sm:inline">Dolby Digital</span>
            </div>
        </div>

        {/* Main Content */}
        <div className="relative z-20 container mx-auto px-6 md:px-12 flex flex-col items-center text-center">
          
          {/* Pre-title */}
          <div className="animate-cinematic" style={{ animationDelay: '0.2s' }}>
            <p className="text-[10px] sm:text-xs font-medium tracking-[0.5em] text-neutral-400 uppercase mb-8 flex items-center justify-center gap-3">
               <Film size={14} className="text-neutral-500" /> A Portfolio Production
            </p>
          </div>

          {/* Main Title */}
          <div className="animate-cinematic w-full" style={{ animationDelay: '0.7s' }}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-300 to-neutral-700 drop-shadow-2xl filter drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] leading-none px-4">
              {name}
            </h1>
          </div>

          {/* Subtitle / Tagline */}
          <div className="animate-cinematic px-4" style={{ animationDelay: '1.2s' }}>
            <p className="text-base sm:text-xl md:text-2xl font-light tracking-wide text-neutral-300 max-w-3xl mb-12 italic opacity-90 font-serif">
              "{tagline}"
            </p>
          </div>

          {/* Roles / Credits */}
          <div className="animate-cinematic flex flex-col sm:flex-row flex-wrap justify-center gap-8 sm:gap-16 mb-14 text-xs sm:text-sm text-neutral-400 uppercase tracking-widest font-semibold w-full px-4" style={{ animationDelay: '1.7s' }}>
            <div className="flex flex-col items-center">
               <span className="text-neutral-600 text-[9px] sm:text-[10px] mb-2 tracking-[0.25em]">Starring</span>
               <span className="text-neutral-100">Frontend Dev</span>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-neutral-600 text-[9px] sm:text-[10px] mb-2 tracking-[0.25em]">Director</span>
               <span className="text-neutral-100">UI/UX Design</span>
            </div>
            <div className="flex flex-col items-center">
               <span className="text-neutral-600 text-[9px] sm:text-[10px] mb-2 tracking-[0.25em]">Producer</span>
               <span className="text-neutral-100">Creative Coder</span>
            </div>
          </div>

          {/* Actions */}
          <div className="animate-cinematic flex flex-col sm:flex-row gap-4 sm:gap-6 items-center w-full sm:w-auto px-4" style={{ animationDelay: '2.2s' }}>
            <button className="group relative flex items-center justify-center gap-3 px-10 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs sm:text-sm rounded-sm hover:bg-neutral-200 transition-all duration-500 overflow-hidden w-full sm:w-auto shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              <div className="absolute inset-0 bg-neutral-900/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              <Play size={16} className="fill-black group-hover:scale-110 transition-transform duration-500" />
              <span className="relative z-10">Play Showreel</span>
            </button>
            
            <button className="group flex items-center justify-center gap-2 px-10 py-4 bg-transparent border border-neutral-700 text-white font-bold uppercase tracking-[0.2em] text-xs sm:text-sm rounded-sm hover:border-neutral-400 hover:text-white transition-all duration-500 w-full sm:w-auto">
              <span className="group-hover:translate-x-1 transition-transform duration-500">View Credits</span>
              <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform duration-500 text-neutral-500 group-hover:text-white" />
            </button>
          </div>

        </div>
      </section>
    </>
  );
}
