import React from 'react';
import { Star, MessageSquareQuote, PlayCircle } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="w-full bg-[#1a0f0a] text-amber-50 py-20 px-4 sm:px-8 md:px-12 lg:px-20 font-serif border-t border-amber-900/30 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 text-amber-500 mb-16 justify-center">
          <MessageSquareQuote className="w-8 h-8" />
          <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-widest text-amber-100">Critical Acclaim</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((test, i) => (
            <div key={i} className="relative bg-gradient-to-br from-[#2c1b12] to-[#1a0f0a] p-8 rounded-xl border border-amber-900/50 shadow-2xl group">
              {/* Decorative elements representing a cassette tape or vintage record player */}
              <div className="absolute top-4 right-4 flex space-x-2 opacity-30 group-hover:opacity-60 transition-opacity">
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"></div>
              </div>
              
              <div className="mb-6 flex space-x-1">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-5 h-5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              
              <blockquote className="font-sans text-amber-100/90 text-lg leading-relaxed mb-8 italic">
                "{test.content || test.review || test.text || test.quote}"
              </blockquote>
              
              <div className="flex items-center space-x-4 border-t border-amber-900/40 pt-4">
                <div className="w-12 h-12 rounded-full bg-amber-900/50 flex items-center justify-center border-2 border-amber-700/50">
                   <PlayCircle className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-50 uppercase tracking-widest">{test.name}</h4>
                  <p className="text-orange-400/80 text-sm font-mono">{test.role || test.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}