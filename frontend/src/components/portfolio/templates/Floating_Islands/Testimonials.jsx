import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  return (
    <section id="testimonials" className="relative py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-5xl mx-auto"
      >
        {/* Island container */}
        <div className="relative bg-white/80 backdrop-blur-md rounded-3xl px-6 py-12 md:px-12 md:py-14 shadow-2xl shadow-sky-200/40 border border-white/60">
          {/* Island bottom */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-gradient-to-b from-amber-100 to-amber-300 rounded-b-[60%] opacity-50" />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/5 h-6 bg-gradient-to-b from-green-200 to-green-400 rounded-b-[50%] opacity-40" />

          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-10 text-center">
            Testimonials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.5 }}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-sky-50/80 to-white border border-sky-100/60"
              >
                <Quote size={24} className="text-sky-200 mb-3" />
                <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-100"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{testimonial.name}</p>
                    <p className="text-xs text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
