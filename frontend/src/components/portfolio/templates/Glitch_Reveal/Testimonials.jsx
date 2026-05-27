import React from 'react';
import { MessageSquare } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { GlitchText, SectionWrapper } from './shared';

export default function Testimonials() {
  return (
    <SectionWrapper id="testimonials">
      {/* Testimonials are displayed as compact cards to keep the section scannable. */}
      <div className="flex items-center gap-4 mb-12">
        <MessageSquare className="text-fuchsia-500 animate-pulse" />
        <GlitchText text="Transmissions" as="h2" className="text-4xl font-bold text-white" />
      </div>
      {/* Two columns on desktop prevent the quotes from becoming too tall. */}
      <div className="grid md:grid-cols-2 gap-6">
        {data.testimonials.map((test, idx) => (
          <div key={idx} className="p-6 bg-zinc-900 border border-zinc-800 hover:border-fuchsia-500 transition-all duration-300 relative group hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-6xl text-fuchsia-500 group-hover:text-cyan-500 transition-colors">"</div>
            <p className="text-zinc-300 font-mono text-sm italic mb-6 relative z-10">"{test.text}"</p>
            <div className="flex items-center gap-4">
              <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full border border-cyan-500 grayscale group-hover:grayscale-0 transition-all" />
              <div>
                <h4 className="text-white font-bold uppercase vibrate-hover inline-block cursor-crosshair">{test.name}</h4>
                <p className="text-cyan-400 text-xs font-mono">{test.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
