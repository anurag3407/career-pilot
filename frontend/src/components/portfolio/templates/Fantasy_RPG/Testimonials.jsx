import React, { useRef, useEffect, useState } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { MessageSquare, Quote, Star, Award } from 'lucide-react';

export default function Testimonials() {
  const { portfolioData } = usePortfolio();
  const data = portfolioData?.testimonials || [];
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!data || data.length === 0) return null;

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className={`relative min-h-screen w-full bg-[#0a090e] text-amber-100/90 py-20 px-4 sm:px-6 lg:px-8 border-t-4 border-amber-900/60 overflow-hidden select-none transition-all duration-700 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#201910_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-45" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 relative">
          <div className="flex items-center gap-4 mb-3">
            <MessageSquare className="w-7 h-7 text-amber-500 animate-pulse" />
            <span className="font-fantasy-game text-sm text-amber-400 tracking-widest uppercase bg-amber-950/40 px-4 py-1.5 border border-amber-800/60 rounded">
              TAVERN TALES
            </span>
            <MessageSquare className="w-7 h-7 text-amber-500 animate-pulse" />
          </div>

          <h2 className="font-fantasy-title text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 tracking-wider my-2 uppercase select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            WORDS OF THE ELDERS
          </h2>

          <p className="font-fantasy-game text-base md:text-lg text-amber-500/80 max-w-2xl tracking-wide uppercase mt-1">
            WHAT ALLIES AND LORDS SAY OF MY DEEDS
          </p>

          <div className="w-64 h-3 flex items-center justify-center gap-2 mt-4 text-amber-600/40">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent to-amber-700/40" />
            <span className="text-amber-500/60 font-fantasy-game">✦</span>
            <div className="w-full h-0.5 bg-gradient-to-l from-transparent to-amber-700/40" />
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {data.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-[#121118]/90 border-2 border-[#302718] p-8 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative gold-border-glow group"
            >
              {/* Corner Ornaments */}
              <div className="metal-corner-tl" />
              <div className="metal-corner-tr" />
              <div className="metal-corner-bl" />
              <div className="metal-corner-br" />

              <Quote className="absolute top-6 right-6 w-12 h-12 text-amber-900/40 group-hover:text-amber-700/40 transition-colors" />

              <div className="flex flex-col h-full relative z-10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                <p className="font-fantasy-body italic text-sm text-amber-100/80 leading-relaxed mb-8 flex-grow">
                  "{testimonial.content || testimonial.text}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-amber-900/40 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-amber-950 border-2 border-amber-600 flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.3)] overflow-hidden">
                    {testimonial.image ? (
                      <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                    ) : (
                      <Award className="w-6 h-6 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-fantasy-title font-bold text-amber-200 tracking-wider">
                      {testimonial.name}
                    </h4>
                    <p className="font-fantasy-game text-[10px] text-amber-500/80 uppercase">
                      {testimonial.role || testimonial.position}
                    </p>
                    {testimonial.company && (
                      <p className="font-fantasy-game text-[9px] text-amber-600/60 uppercase">
                        of {testimonial.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}