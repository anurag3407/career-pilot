import React from 'react';
import { Quote } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <>
      <style>{`
        .sb-body  { font-family: 'Patrick Hand', cursive; }
        .sb-hand  { font-family: 'Caveat', cursive; }
        .sb-marker{ font-family: 'Permanent Marker', cursive; }
      `}</style>
      <section className="relative w-full py-20 px-4 sm:px-8 bg-[#f5efe6] overflow-hidden"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(180,160,130,0.15) 27px, rgba(180,160,130,0.15) 28px),
            repeating-linear-gradient(90deg, transparent, transparent 27px, rgba(180,160,130,0.10) 27px, rgba(180,160,130,0.10) 28px)
          `,
        }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-16 relative w-fit mx-auto">
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-yellow-200/55 border border-yellow-400/30 rounded-sm -rotate-2 z-20" />
             <h2 className="sb-marker text-5xl sm:text-6xl text-[#2d1f0e] rotate-[1.5deg] relative z-10 bg-[#fff8e1] px-4 py-1 border-[1.5px] border-[#f0cc72] shadow-[2px_3px_8px_rgba(0,0,0,0.10)]">
               Words of Love 💌
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {testimonials.map((t, i) => {
              const rots = ['-rotate-[2deg]', 'rotate-[1.5deg]', '-rotate-[1deg]', 'rotate-[2deg]'];
              const rot = rots[i % rots.length];
              const paperColors = ['bg-[#fff9e6]', 'bg-[#f0f7ff]', 'bg-[#fff0f5]'];
              const borderColors = ['border-[#f0cc72]', 'border-[#9fa8da]', 'border-[#e8a4b8]'];
              const paper = paperColors[i % paperColors.length];
              const border = borderColors[i % borderColors.length];
              
              return (
                <div key={i} className={`relative ${paper} p-8 shadow-[3px_5px_15px_rgba(0,0,0,0.08)] border-[1.5px] ${border} ${rot} hover:rotate-0 transition-transform duration-300 flex flex-col`}>
                   {/* Tape */}
                   <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-stone-200/60 backdrop-blur-sm -rotate-2 border border-stone-300/30 mix-blend-multiply`} />
                   
                   <Quote className="w-8 h-8 text-stone-400 mb-4 opacity-50" />
                   
                   <p className="sb-body text-xl text-[#4a3828] leading-relaxed mb-6 flex-grow">
                     "{t.content}"
                   </p>
                   
                   <div className="mt-auto pt-4 border-t border-stone-300/50 border-dashed">
                     <p className="sb-hand font-bold text-[24px] text-[#2d1f0e]">{t.author}</p>
                     <p className="sb-body text-[#a07850] text-[17px]">{t.role}</p>
                   </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}