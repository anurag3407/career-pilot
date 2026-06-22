import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  return (
    <section id="testimonials" className="relative py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-16"
        >
          What People <span className="text-orange-400">Say</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-sm hover:border-orange-500/20 transition-colors"
            >
              {/* Subtle glow */}
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, #ff6a00, transparent 70%)',
                }}
              />

              <Quote size={22} className="text-orange-500/40 mb-3" />
              <p className="text-sm text-gray-300 leading-relaxed mb-5 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover border border-orange-500/30"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
