import React from 'react';
import { ChefHat, MapPin } from 'lucide-react';

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

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section className="w-full bg-[#0a0a0a] text-white py-28 lg:py-36 border-t border-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <GoldDivider icon={ChefHat} />
          <Eyebrow>The Culinary Journey</Eyebrow>
          <h2 className="font-serif text-4xl md:text-5xl font-light tracking-wide text-white">
            Professional Experience
          </h2>
        </div>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#c5a880]/30 to-transparent md:-translate-x-1/2" />

          <div className="space-y-16">
            {experience.map((exp, i) => (
              <div key={i} className={`relative flex flex-col md:flex-row items-start ${i % 2 === 0 ? 'md:flex-row-reverse' : ''} gap-8 md:gap-16 group`}>
                
                {/* Timeline Dot */}
                <div className="absolute left-[20px] md:left-1/2 top-6 w-3 h-3 rounded-full bg-[#c5a880] md:-translate-x-1/2 shadow-[0_0_10px_rgba(197,168,128,0.5)] z-10 transition-transform duration-500 group-hover:scale-150" />
                
                {/* Content */}
                <div className={`pl-12 md:pl-0 w-full md:w-1/2 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right md:pr-16 md:pl-0'}`}>
                  <div className="inline-block px-4 py-1.5 border border-[#c5a880]/30 bg-[#c5a880]/5 text-[#c5a880] text-[10px] tracking-[0.2em] uppercase mb-4 rounded-full">
                    {exp.startDate} — {exp.endDate || 'Present'}
                  </div>
                  
                  <h3 className="font-serif text-2xl md:text-3xl font-light text-white mb-2 group-hover:text-[#c5a880] transition-colors duration-300">
                    {exp.title}
                  </h3>
                  
                  <div className={`flex items-center gap-2 mb-4 text-gray-400 text-sm ${i % 2 === 0 ? 'justify-start' : 'md:justify-end justify-start'}`}>
                    <MapPin className="w-4 h-4 text-[#c5a880]/70" />
                    <span>{exp.company}</span>
                  </div>
                  
                  <p className="text-gray-400 font-light leading-relaxed text-[15px]">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}