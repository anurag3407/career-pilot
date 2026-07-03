import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";
import { MessageSquare, CheckCircle, Quote } from 'lucide-react';

export default function Testimonials() {
  const { portfolioData: data } = usePortfolio();

  if (!data?.testimonials || data.testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="relative w-full bg-[#030e1a] py-24 px-6 md:px-16 font-mono text-cyan-50 border-t border-cyan-900/50">
      {/* Blueprint Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0ea5e9 1px, transparent 1px),
            linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col mb-16">
          <div className="flex items-center gap-4 text-cyan-400 text-xs md:text-sm tracking-[0.2em] uppercase mb-4">
            <span className="w-12 h-px bg-cyan-400"></span>
            <span>QA Reports: Peer Reviews</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light uppercase tracking-tight text-cyan-50">
            Structural <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Integrity</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.testimonials.map((testimonial, index) => (
            <div key={index} className="relative border border-cyan-800/60 bg-[#030e1a]/90 backdrop-blur-md p-8 group hover:border-cyan-400/60 transition-colors">
              {/* Decorative nodes */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-900 group-hover:bg-cyan-400 transition-colors"></div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-900 group-hover:bg-cyan-400 transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-cyan-900 group-hover:bg-cyan-400 transition-colors"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-900 group-hover:bg-cyan-400 transition-colors"></div>

              {/* Verified Stamp */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold">Verified</span>
              </div>

              <Quote className="w-8 h-8 text-cyan-800/60 mb-6 group-hover:text-cyan-600 transition-colors" />
              
              <p className="text-sm text-cyan-100/70 leading-relaxed mb-8 italic min-h-[100px]">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4 border-t border-cyan-900/50 pt-6">
                {testimonial.image ? (
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-none border border-cyan-500/50 p-1 object-cover grayscale group-hover:grayscale-0 transition-all" />
                ) : (
                  <div className="w-12 h-12 rounded-none border border-cyan-500/50 p-1 flex items-center justify-center bg-cyan-950/40">
                    <MessageSquare className="w-5 h-5 text-cyan-600" />
                  </div>
                )}
                <div>
                  <h4 className="text-cyan-200 font-bold uppercase tracking-widest text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-cyan-600 mt-1 uppercase tracking-wide">{testimonial.role}</p>
                  {testimonial.company && (
                    <p className="text-[10px] text-cyan-500 mt-0.5">{testimonial.company}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
