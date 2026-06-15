import React from 'react';
import { Eye, Quote, ShieldAlert } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="relative isolate overflow-hidden bg-[#030406] px-4 py-20 text-stone-100 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_80%_20%,rgba(19,83,75,0.15),transparent_40%),linear-gradient(180deg,#030406_0%,#0b0a0d_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(rgba(245,230,190,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(245,230,190,0.6)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-16">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-amber-100/70">
            <ShieldAlert className="h-4 w-4" />
            Witness Accounts
          </p>
          <h2 className="font-serif text-4xl leading-tight text-stone-50 sm:text-5xl">
            Declassified Statements.
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="relative border border-stone-500/20 bg-black/40 p-8 shadow-2xl shadow-black/60 backdrop-blur-md transition duration-300 hover:border-amber-200/20 hover:bg-stone-950/60"
            >
              <div className="absolute -top-3 -right-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-red-300/20 bg-red-950/60 backdrop-blur-md">
                  <Eye className="h-4 w-4 text-red-200/80" />
                </div>
              </div>
              <Quote className="mb-6 h-8 w-8 text-stone-600/50" />
              <p className="mb-8 text-sm leading-7 text-stone-300 italic">
                "{testimonial.content}"
              </p>
              <div className="border-t border-stone-800/60 pt-6">
                <p className="font-serif text-lg text-stone-100">{testimonial.author}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-emerald-100/60">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}