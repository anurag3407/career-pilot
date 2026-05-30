import React from 'react';
import { Play } from 'lucide-react';

export default function Hero({ data, onNext }) {
  return (
    <div className="flex-1 flex flex-col justify-between h-full font-mono text-[#00f3ff]">
      {/* Blinking REC Overlay & Tape Indicators */}
      <div className="flex items-center justify-between text-xs md:text-sm font-bold tracking-widest text-[#ff0055] select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff0055] animate-ping absolute" />
          <span className="w-3 h-3 rounded-full bg-[#ff0055]" />
          <span>REC</span>
        </div>
        <div className="text-cyan-400">
          OSD PLAY: 0:00:00
        </div>
      </div>

      {/* Main Retrowave Neon Grid Title */}
      <div className="my-auto text-center flex flex-col items-center justify-center p-4">
        {/* VHS Glitch Tag */}
        <span className="px-3 py-1 text-[11px] font-bold border border-cyan-400/40 rounded-full bg-cyan-950/40 text-cyan-300 uppercase tracking-[0.2em] mb-6 animate-pulse">
          AUTO LOADED PORTFOLIO TAPE
        </span>

        {/* Dynamic Name with dual shadow glow */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase select-text" 
            style={{ textShadow: '0 0 10px rgba(0,243,255,0.8), 0 0 20px rgba(255,0,85,0.5)' }}>
          {data.personal.name}
        </h1>

        {/* Dynamic Title */}
        <p className="mt-4 text-base md:text-xl font-bold tracking-wide text-pink-400 max-w-xl select-text">
          // {data.personal.title}
        </p>

        {/* Tagline */}
        {data.personal.tagline && (
          <p className="mt-2 text-xs md:text-sm text-gray-400 italic max-w-md select-text">
            "{data.personal.tagline}"
          </p>
        )}

        {/* Big play button to begin */}
        <button
          onClick={onNext}
          className="mt-10 px-8 py-3 rounded-full bg-[#00f3ff] text-black font-extrabold text-sm uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] cursor-pointer active:scale-95 flex items-center gap-3 group"
        >
          <Play className="w-4 h-4 fill-black group-hover:scale-110 transition-transform" />
          PLAY TAPE
        </button>
      </div>

      {/* Retro VHS VCR Status Bar */}
      <div className="border-t border-cyan-900/30 pt-4 flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
        <div>SYS: SP MODE</div>
        <div>TAPE FORMAT: VHS-C</div>
        <div>AUDIO: HI-FI STEREO</div>
      </div>
    </div>
  );
}
