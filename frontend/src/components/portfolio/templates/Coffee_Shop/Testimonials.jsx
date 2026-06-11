import React from 'react';
import { Quote, ThumbsUp } from 'lucide-react';
import { usePortfolio } from "../../../../context/PortfolioContext";

const Testimonials = () => {
  const { portfolioData } = usePortfolio();
  const testimonials = portfolioData?.testimonials || [];

  if (testimonials.length === 0) return null;

  return (
    <section className="w-full bg-[#2d1a12] py-24 relative border-y-[12px] border-[#161210] font-sans">
      {/* Wood texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,rgba(0,0,0,1)_2px,transparent_2px)] bg-[size:40px_100%] pointer-events-none" />
      <div className="absolute inset-0 bg-[#3e271a]/20 opacity-50 mix-blend-multiply pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="text-center mb-16">
          <div className="inline-block bg-[#161210] px-6 py-2 rounded-xl border border-[#3e271a] mb-6 transform -rotate-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-widest text-amber-400 font-serif uppercase">
              Patron Reviews
            </h2>
          </div>
          <p className="text-stone-300 font-mono text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <ThumbsUp className="w-4 h-4 text-amber-600" />
            Notes Left On Napkins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((test, idx) => (
            <div 
              key={idx}
              className="bg-[#fbfaf5] p-8 shadow-[10px_15px_30px_rgba(0,0,0,0.6)] relative group cursor-default"
              style={{
                borderRadius: '2px 15px 2px 20px',
                transform: `rotate(${idx % 2 === 0 ? '-2deg' : '3deg'}) translateY(${idx % 3 === 0 ? '10px' : '0px'})`
              }}
            >
              {/* Coffee ring stain decorations */}
              <div className="absolute -top-6 -right-6 w-20 h-20 border-[4px] border-[#5c4033]/15 rounded-full pointer-events-none transform rotate-12" />
              <div className="absolute top-2 -right-4 w-14 h-14 border-[3px] border-[#5c4033]/10 rounded-full pointer-events-none" />
              
              {/* Napkin crinkle effect (CSS trick with box-shadow) */}
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.03)] pointer-events-none rounded-[inherit]" />

              <Quote className="w-10 h-10 text-amber-800/15 mb-6 group-hover:text-amber-800/30 transition-colors" />
              
              <p className="text-[#2c1a11] font-serif italic text-lg leading-relaxed mb-8 font-medium">
                "{test.content || test.text || test.quote || "Great coffee, great code."}"
              </p>
              
              <div className="border-t-[3px] border-double border-stone-300 pt-5 flex items-center justify-between">
                <div>
                  <h4 className="font-mono font-black text-sm text-[#2c1a11] uppercase tracking-widest">
                    {test.author || test.name || "Happy Client"}
                  </h4>
                  <p className="font-mono text-[10px] text-stone-500 font-bold uppercase mt-1">
                    {test.role || test.title || "Regular Customer"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
