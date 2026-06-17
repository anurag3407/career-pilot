import React from 'react';
import { Download, FileText } from 'lucide-react';

export default function ResumeCTA({ data }) {
  if (!data?.personal?.resumeUrl) return null;

  return (
    <section className="relative w-full py-32 bg-[#050505] text-white font-sans selection:bg-neutral-800 border-t border-neutral-900 flex items-center justify-center overflow-hidden">
      {/* Cinematic Lighting Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-600/20 via-transparent to-transparent z-0 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        
        <div className="w-16 h-16 bg-[#0a0a0a] border border-neutral-700 rounded-sm flex items-center justify-center mb-8 rotate-45 transform transition-transform duration-700 hover:rotate-180 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
           <FileText size={24} className="-rotate-45 text-neutral-300" />
        </div>

        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-6 drop-shadow-lg">
          The Official Script
        </h2>
        
        <p className="text-neutral-400 font-serif italic text-base md:text-lg mb-12 max-w-2xl mx-auto">
          Download the comprehensive breakdown of my professional journey, technical skills, and educational background.
        </p>

        <a 
          href={data.personal.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center gap-3 px-12 py-5 bg-transparent border border-white text-white font-bold uppercase tracking-[0.2em] text-xs sm:text-sm rounded-sm hover:text-black transition-colors duration-500 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
          <span className="relative z-10 flex items-center gap-2">
            Download Resume <Download size={16} className="group-hover:-translate-y-1 transition-transform duration-500" />
          </span>
        </a>

      </div>
    </section>
  );
}
