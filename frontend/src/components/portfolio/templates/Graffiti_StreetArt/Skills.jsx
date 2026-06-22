import React from 'react';
import { Zap } from 'lucide-react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="relative py-24 bg-gray-900 overflow-hidden">
      {/* Graffiti stencil background */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '32px 32px'
      }} />
      
      <div className="absolute -left-32 top-1/3 h-96 w-96 animate-pulse rounded-full bg-yellow-500 opacity-10 blur-[120px]" />
      
      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12">
        <div className="mb-16 flex flex-col items-center text-center">
          <Zap className="mb-4 h-12 w-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
          <h2 className="text-5xl font-black uppercase tracking-tighter md:text-7xl">
            <span className="text-white drop-shadow-lg">STREET</span>{' '}
            <span className="bg-gradient-to-r from-green-400 to-yellow-500 bg-clip-text text-transparent">
              CRED
            </span>
          </h2>
          <p className="mt-4 text-xl font-bold uppercase tracking-widest text-gray-400">
            Skills & Arsenal
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {skills.map((skill, i) => (
            <div
              key={i}
              className="group relative cursor-default"
              style={{
                animationDelay: `${i * 0.1}s`
              }}
            >
              {/* Background splatter hover effect */}
              <div className="absolute inset-0 -m-2 scale-0 rounded-full bg-pink-500 opacity-20 blur-xl transition-transform duration-300 group-hover:scale-100" />
              
              <div className="relative transform border-2 border-white/20 bg-black/80 px-6 py-3 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:-rotate-3 hover:border-pink-500 hover:shadow-[5px_5px_0px_0px_rgba(236,72,153,1)]">
                <span className="text-lg font-bold uppercase tracking-wider text-gray-200 group-hover:text-white">
                  {skill.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}