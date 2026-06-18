import React from 'react';
import { Star } from 'lucide-react';

const DotPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="comic-dots-tests" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="4" r="2.5" fill="black" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#comic-dots-tests)" />
  </svg>
);

const SpeechBubble = ({ text }) => (
  <div className="relative inline-block">
    <div className="bg-white border-4 border-black px-6 py-3 rounded-2xl font-black text-black uppercase text-lg tracking-widest shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
      {text}
    </div>
    <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-[14px] border-l-transparent border-t-[18px] border-t-black border-r-[0px] border-r-transparent" />
    <div className="absolute -bottom-[13px] left-[35px] w-0 h-0 border-l-[10px] border-l-transparent border-t-[14px] border-t-white border-r-[0px] border-r-transparent" />
  </div>
);

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="relative w-full overflow-hidden bg-sky-400 py-20 px-4 sm:px-8 border-b-4 border-black">
      <DotPattern />
      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-6 mb-16 text-center">
          <div className="relative inline-block">
            <h2 className="relative z-10 text-5xl sm:text-7xl font-black uppercase text-black tracking-tighter rotate-1 drop-shadow-[6px_6px_0px_rgba(255,255,255,1)]">
              Fan Mail
            </h2>
            <div className="absolute -bottom-2 right-0 w-full h-4 bg-pink-500 border-2 border-black rotate-1 -z-0" />
          </div>
          <div className="mt-6 -rotate-1">
            <SpeechBubble text="🗣️ Word on the street..." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {testimonials.map((t, i) => {
            const rotate = i % 2 === 0 ? '-rotate-1' : 'rotate-2';
            return (
              <div key={i} className={`relative bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${rotate} transition-transform hover:scale-[1.03] flex flex-col`}>
                <div className="absolute -top-5 -left-5 bg-yellow-400 border-4 border-black p-3 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-12">
                  <Star className="w-8 h-8 text-black" fill="currentColor" />
                </div>
                <div className="flex-grow">
                  <p className="text-xl font-bold text-gray-800 leading-snug mt-2 mb-6 relative z-10 italic">
                    "{t.content}"
                  </p>
                </div>
                <div className="flex flex-col border-t-4 border-black pt-4">
                  <span className="font-black text-black uppercase text-xl">{t.author}</span>
                  <span className="font-bold text-pink-600 uppercase tracking-widest text-sm">{t.role}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}