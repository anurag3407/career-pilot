import React from 'react';
import { User, Award } from 'lucide-react';

export default function About({ data }) {
  if (!data?.personal) return null;

  return (
    <section className="relative w-full py-32 bg-[#050505] text-white font-sans selection:bg-neutral-800 border-t border-neutral-900 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neutral-900/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-24 max-w-6xl mx-auto">
          
          {/* Profile Image / Abstract Representation */}
          <div className="w-full md:w-5/12 relative group">
            <div className="aspect-[3/4] bg-[#0a0a0a] border border-neutral-800 relative overflow-hidden flex items-center justify-center rounded-sm">
              <div className="absolute inset-0 opacity-20 mix-blend-overlay z-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
              
              <div className="relative z-20 flex flex-col items-center gap-4 text-neutral-600 group-hover:text-neutral-400 transition-colors duration-700">
                 <User size={48} strokeWidth={1} />
                 <span className="text-[10px] tracking-[0.3em] uppercase">Portrait</span>
              </div>

              {/* Cinematic Corner Accents */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-neutral-600"></div>
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-neutral-600"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-neutral-600"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-neutral-600"></div>
            </div>
          </div>

          {/* About Text */}
          <div className="w-full md:w-7/12">
            <div className="mb-8">
              <p className="text-[10px] sm:text-xs font-medium tracking-[0.5em] text-neutral-500 uppercase mb-4 flex items-center gap-3">
                <Award size={14} className="text-neutral-600" /> Biography
              </p>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 drop-shadow-lg mb-8">
                The Origin Story
              </h2>
            </div>
            
            <div className="space-y-6 text-neutral-300 font-serif italic text-base sm:text-lg leading-relaxed opacity-90">
              <p>
                {data.personal.bio || "An artisan of the digital realm, weaving code and creativity into unforgettable experiences. Every project is a new scene, meticulously lit and perfectly framed."}
              </p>
              <p>
                {"With a profound appreciation for aesthetics and performance, the journey has been one of continuous refinement, mastering the tools of the trade to bring imaginative visions to life."}
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-neutral-800/50 flex gap-12">
              <div>
                <span className="block text-3xl font-black tracking-tighter text-white mb-2">
                  {data.experience?.length || 5}+
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Years Experience</span>
              </div>
              <div>
                <span className="block text-3xl font-black tracking-tighter text-white mb-2">
                  {data.projects?.length || 10}+
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Projects Completed</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
