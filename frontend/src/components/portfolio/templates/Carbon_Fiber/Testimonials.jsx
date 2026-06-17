import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

export default function Testimonials({ data }) {
  const testimonials = Array.isArray(data?.testimonials) ? data.testimonials : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="relative mt-16 rounded-xl border border-slate-600/50 bg-[#0b0b0b]/98 p-8 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.016),rgba(255,255,255,0.016)_1px,transparent_1px,transparent_8px),repeating-linear-gradient(135deg,rgba(255,255,255,0.016),rgba(255,255,255,0.016)_1px,transparent_1px,transparent_8px)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.36em] text-slate-500">Testimonials</p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Feedback from the pit crew.</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-sm border border-slate-600/50 bg-[#0d0d0d] px-4 py-2.5 text-[10px] uppercase tracking-[0.28em] text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <Star className="h-3.5 w-3.5" />
          Trusted by top collaborators
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {testimonials.map((item) => (
          <div
            key={`${item.name}-${item.role}`}
            className="relative overflow-hidden rounded-sm border border-slate-700/50 bg-[#0a0a0a] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-slate-300/60 via-slate-500/20 to-transparent" />
            <div className="flex items-center gap-4">
              <img
                src={item.avatar}
                alt={item.name}
                className="h-14 w-14 rounded-sm border border-slate-700/60 object-cover brightness-90 contrast-105"
              />
              <div>
                <p className="text-sm font-bold text-white tracking-tight">{item.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.role}</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-none border border-slate-700/50 bg-[#111] px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-slate-500">
                <Quote className="h-3 w-3" />
                Quote
              </div>
              <p className="text-sm leading-7 text-slate-400">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}