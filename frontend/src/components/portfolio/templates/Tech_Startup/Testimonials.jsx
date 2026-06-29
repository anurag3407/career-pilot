import React from 'react';
import { Quote } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="bg-[#0A192F] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-16 justify-end">
          <div className="flex-grow h-px bg-[#233554] max-w-[300px]"></div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#CCD6F6]">
            <span className="text-[#64FFDA] font-mono text-xl md:text-2xl mr-2">04.</span>
            What People Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div 
              key={index} 
              className="bg-[#112240] p-8 rounded-2xl border border-[#233554] hover:border-[#64FFDA]/50 transition-all duration-300 relative group flex flex-col justify-between"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-[#233554] group-hover:text-[#64FFDA]/20 transition-colors" />
              
              <div className="relative z-10 mb-8">
                <p className="text-[#8892B0] leading-relaxed italic text-sm md:text-base">
                  "{t.content}"
                </p>
              </div>
              
              <div className="relative z-10 flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-[#0A192F] border border-[#233554] group-hover:border-[#64FFDA] flex items-center justify-center text-[#64FFDA] font-bold text-lg transition-colors">
                  {t.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-[#CCD6F6] font-semibold">{t.author}</h4>
                  <p className="text-[#64FFDA] text-xs font-mono">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}