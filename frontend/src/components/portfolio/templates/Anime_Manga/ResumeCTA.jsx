import React from 'react';
import { Download } from 'lucide-react';

export default function ResumeCTA({ data }) {
  if (!data?.personal?.resumeUrl) return null;

  return (
    <section className="relative w-full py-4 text-center">
      <a 
        href={data.personal.resumeUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative inline-flex items-center justify-center gap-4 px-12 py-6 bg-white text-black border-4 border-black text-3xl font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors overflow-hidden"
      >
        <div className="absolute inset-0 action-lines opacity-20 pointer-events-none group-hover:invert" />
        <span className="relative z-10 flex items-center gap-4">
          <Download size={32} strokeWidth={3} className="group-hover:animate-bounce" />
          DOWNLOAD DOSSIER
        </span>
      </a>
    </section>
  );
}
