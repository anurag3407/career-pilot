import React from 'react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <section className="py-20 px-6 font-mono border-t border-foreground/20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-12 uppercase tracking-widest border-b border-foreground/20 pb-4">
          // Testimonials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 border border-dashed border-foreground/30 relative group hover:border-foreground/60 transition-colors">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-foreground" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-foreground" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-foreground" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-foreground" />
              
              <p className="text-sm mb-6 opacity-80 leading-relaxed italic">
                "{t.content}"
              </p>
              <div className="flex flex-col">
                <span className="font-bold tracking-wider">{t.author}</span>
                <span className="text-xs opacity-60 uppercase mt-1">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}