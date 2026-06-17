import React from 'react';

export default function MovieCredits({ data }) {
  return (
    <footer className="w-full bg-black py-32 text-center text-white font-sans overflow-hidden relative">
      {/* Subtle Grain */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay z-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      
      <div className="relative z-20 max-w-2xl mx-auto flex flex-col items-center gap-12 animate-cinematic">
        <div className="flex flex-col gap-2">
           <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500">Directed By</span>
           <span className="text-xl md:text-2xl font-bold uppercase tracking-widest">{data?.personal?.name || 'Director'}</span>
        </div>

        <div className="flex flex-col gap-2">
           <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500">Produced By</span>
           <span className="text-sm md:text-base font-medium uppercase tracking-[0.2em]">{data?.personal?.role || 'Creator'}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-16 gap-y-8 mt-8">
           <div className="flex flex-col gap-1">
             <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-600">Cinematography</span>
             <span className="text-xs tracking-widest uppercase text-neutral-300">Visual Studio Code</span>
           </div>
           <div className="flex flex-col gap-1">
             <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-600">Special Effects</span>
             <span className="text-xs tracking-widest uppercase text-neutral-300">React & Tailwind</span>
           </div>
           <div className="flex flex-col gap-1">
             <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-600">Soundtrack</span>
             <span className="text-xs tracking-widest uppercase text-neutral-300">Spotify Playlists</span>
           </div>
           <div className="flex flex-col gap-1">
             <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-600">Location</span>
             <span className="text-xs tracking-widest uppercase text-neutral-300">{data?.personal?.location || 'Global'}</span>
           </div>
        </div>

        <div className="mt-16 pt-16 border-t border-neutral-900 w-full flex flex-col items-center gap-4">
           <p className="text-[8px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-600">
             © {new Date().getFullYear()} {data?.personal?.name}. All Rights Reserved.
           </p>
           <p className="text-[8px] sm:text-[10px] tracking-[0.3em] uppercase text-neutral-700">
             No pixels were harmed in the making of this portfolio.
           </p>
        </div>
      </div>
    </footer>
  );
}
