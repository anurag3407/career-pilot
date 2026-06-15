import React from 'react';
import { UtensilsCrossed, Quote } from 'lucide-react';

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

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="w-full bg-[#0a0a0a] text-white py-24 lg:py-32 border-t border-[#1a1a1a] relative overflow-hidden">
      
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #c5a880 0px, #c5a880 1px, transparent 1px, transparent 40px)`
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <GoldDivider icon={UtensilsCrossed} />
          <Eyebrow>Words of the Critics</Eyebrow>
          <h2 className="font-serif text-4xl md:text-5xl font-light tracking-wide text-white">
            Guest Experiences
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div 
              key={i} 
              className="relative p-8 border border-[#222222] bg-[#0d0d0d] hover:border-[#c5a880]/30 transition-all duration-500 group flex flex-col h-full"
            >
              <Quote className="w-8 h-8 text-[#c5a880]/20 absolute top-6 right-6 group-hover:text-[#c5a880]/40 transition-colors duration-500" />
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, idx) => (
                  <svg key={idx} className="w-4 h-4 text-[#c5a880] fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-400 font-light italic leading-relaxed mb-8 text-[15px] flex-grow">
                "{t.content || t.text}"
              </p>
              
              <div className="border-t border-[#222222] pt-6 group-hover:border-[#c5a880]/20 transition-colors duration-500">
                <p className="font-serif text-lg text-white mb-1">{t.author || t.name}</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#c5a880]">{t.role || t.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}