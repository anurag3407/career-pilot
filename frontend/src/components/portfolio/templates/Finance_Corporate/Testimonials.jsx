import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Quote } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="relative w-full bg-gray-950 text-white py-24 px-6 md:px-16 overflow-hidden border-t border-white/5">
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-emerald-400 mb-3">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs tracking-widest uppercase">Endorsements</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
            Professional <span className="text-emerald-400">References</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-md flex flex-col h-full"
            >
              <Quote className="w-8 h-8 text-emerald-500/20 absolute top-6 right-6" />
              <div className="flex-1">
                <p className="text-slate-300 italic leading-relaxed mb-8 relative z-10">
                  "{t.content}"
                </p>
              </div>
              <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-white/90">{t.author}</h4>
                  <p className="text-xs text-emerald-400/80 mt-0.5">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}