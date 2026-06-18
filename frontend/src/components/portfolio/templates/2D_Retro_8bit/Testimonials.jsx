import React, { useState } from "react";
import { MessageSquare, ThumbsUp, User } from "lucide-react";

export default function Testimonials({ testimonials = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="relative min-h-[80vh] w-full bg-[#0c051a] py-20 px-4 sm:px-6 lg:px-8 border-b-8 border-black select-none flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(#1c0f3a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      <div className="relative z-20 w-full max-w-4xl flex flex-col items-center">
        {/* Header Marquee */}
        <div className="w-full bg-neutral-900 border-4 border-black p-4 md:p-6 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-6 h-6 text-[#ff007f]" />
            <span className="font-retro-title text-[#ff007f] text-[10px] sm:text-xs bg-black px-3 py-1 border-2 border-[#ff007f]">
              CO-OP ALLIES
            </span>
            <MessageSquare className="w-6 h-6 text-[#ff007f]" />
          </div>
          <h2 className="font-retro-title text-xl sm:text-2xl md:text-3xl text-white tracking-wider my-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffde00] to-[#ff007f]">
              PARTY FEEDBACK
            </span>
          </h2>
        </div>

        {/* NPC Dialog Box Style */}
        <div className="w-full bg-[#120a2a] border-4 border-[#00f0ff] p-6 md:p-10 relative shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          {/* Dialog Box Notch */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#0c051a] border-r-4 border-b-4 border-[#00f0ff]" />
          <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#0c051a] border-l-4 border-t-4 border-[#00f0ff]" />

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start min-h-[250px]">
            {/* Avatar Section */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-24 h-24 bg-neutral-900 border-4 border-black p-1 shadow-[4px_4px_0px_0px_#00f0ff] mb-4 overflow-hidden relative">
                {testimonials[activeIndex].avatar ? (
                  <img src={testimonials[activeIndex].avatar} alt={testimonials[activeIndex].name} className="w-full h-full object-cover pixelated grayscale hover:grayscale-0 transition-all" style={{ imageRendering: 'pixelated' }} />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <User className="w-12 h-12 text-[#00f0ff]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none" />
              </div>
              <div className="bg-black border-2 border-neutral-700 px-3 py-1 flex items-center gap-1">
                <ThumbsUp className="w-3 h-3 text-[#ffde00]" />
                <span className="font-retro-title text-[8px] text-[#ffde00]">TRUSTED</span>
              </div>
            </div>

            {/* Dialog Content Section */}
            <div className="flex-grow flex flex-col justify-between">
              <div className="mb-6">
                <div className="flex items-end gap-3 mb-4 border-b-2 border-dashed border-neutral-800 pb-3">
                  <h3 className="font-retro-title text-sm md:text-lg text-[#00f0ff] uppercase">
                    {testimonials[activeIndex].name}
                  </h3>
                  <span className="font-retro-title text-[8px] text-neutral-500 uppercase pb-0.5">
                    LVL. 99 {testimonials[activeIndex].role}
                  </span>
                </div>
                
                {/* Typewriter text effect container */}
                <div className="relative">
                  <p className="font-retro-body text-xl md:text-2xl text-white leading-relaxed tracking-wide min-h-[100px]">
                    "{testimonials[activeIndex].text}"
                  </p>
                  <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#ff007f] animate-ping" />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-neutral-800">
                <span className="font-retro-title text-[8px] text-neutral-500">
                  MSG {activeIndex + 1} / {testimonials.length}
                </span>
                <div className="flex gap-4">
                  <button 
                    onClick={prevTestimonial}
                    className="font-retro-title text-[10px] px-3 py-2 bg-neutral-900 border-2 border-black text-[#ffde00] hover:bg-neutral-800 active:translate-y-1 shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
                  >
                    ◀ PREV
                  </button>
                  <button 
                    onClick={nextTestimonial}
                    className="font-retro-title text-[10px] px-3 py-2 bg-[#ffde00] border-2 border-black text-black hover:bg-[#ffea00] active:translate-y-1 shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
                  >
                    NEXT ▶
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
