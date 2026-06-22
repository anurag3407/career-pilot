import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";
import { Quote, MessageSquare } from "lucide-react";

export default function Testimonials() {
  const { portfolioData: data } = usePortfolio();
  const testimonials = data?.testimonials || [];

  if (testimonials.length === 0) return null;

  return (
    <section className="relative w-full py-20 px-4 md:px-8 bg-gradient-to-bl from-green-950 via-emerald-950 to-green-900 overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-700/50 text-green-300 text-xs tracking-widest uppercase px-5 py-2 rounded-full mb-5">
            <MessageSquare className="w-3 h-3" />
            Voices
            <MessageSquare className="w-3 h-3" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Words From{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              The Trail
            </span>
          </h2>
          <div className="w-20 h-1 bg-green-600 rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-green-900/20 border border-green-800/40 rounded-2xl p-8 hover:border-green-500/50 hover:bg-green-900/40 transition-all duration-300 relative group"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-green-700/20 group-hover:text-green-500/20 transition-colors" />
              
              <p className="text-gray-300 leading-relaxed mb-6 relative z-10 italic">
                "{t.content}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-green-800/40 pt-6">
                <div className="w-12 h-12 rounded-full bg-green-800 flex items-center justify-center text-green-300 font-bold text-lg">
                  {t.author?.charAt(0) || "U"}
                </div>
                <div>
                  <h4 className="text-white font-bold group-hover:text-green-300 transition-colors">
                    {t.author}
                  </h4>
                  <p className="text-green-500/80 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}