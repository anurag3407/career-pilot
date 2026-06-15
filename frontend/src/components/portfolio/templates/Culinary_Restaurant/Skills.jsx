import React from 'react';
import { Flame, Star } from 'lucide-react';

function GoldDivider({ icon: Icon }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <div className="h-px w-12 bg-[#c5a880]" />
      {Icon && <Icon className="w-5 h-5 text-[#c5a880]" />}
      <div className="h-px w-12 bg-[#c5a880]" />
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <span className="block text-center text-[10px] font-medium tracking-[0.25em] uppercase text-[#c5a880] mb-4">
      {children}
    </span>
  );
}

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="w-full bg-[#0d0d0d] text-white py-24 lg:py-32 border-t border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <GoldDivider icon={Flame} />
          <Eyebrow>The Repertoire</Eyebrow>
          <h2 className="font-serif text-4xl md:text-5xl font-light tracking-wide text-white">
            Culinary Expertise
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {skills.map((skill, i) => (
            <div 
              key={i} 
              className="group relative px-6 py-3 border border-[#222222] bg-[#111111] hover:border-[#c5a880]/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c5a880]/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
              <div className="relative flex items-center gap-3 z-10">
                <Star className="w-3 h-3 text-[#c5a880]" />
                <span className="font-serif text-lg font-light text-gray-200 group-hover:text-white transition-colors duration-300">
                  {skill.name || skill}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}