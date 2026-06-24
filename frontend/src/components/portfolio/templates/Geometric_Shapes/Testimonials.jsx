import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Quote } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="relative w-full overflow-hidden bg-[#050816] py-24 px-6 sm:px-8 lg:px-12 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:84px_84px] opacity-30 pointer-events-none" />
      
      {/* Floating geometric decorative elements */}
      <motion.div
        animate={{ rotate: -180 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/4 left-10 w-32 h-32 border border-violet-400/20 rounded-lg pointer-events-none"
      />
      <motion.div
        animate={{ rotate: 180 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-1/4 right-10 w-40 h-40 border border-amber-300/20 rounded-full pointer-events-none"
      />

      <div className="relative mx-auto max-w-7xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.34em] text-violet-100/90 backdrop-blur-md mb-6">
            <MessageSquare size={14} className="text-violet-300" />
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-300">Feedback</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-8 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-md group hover:border-violet-400/30 transition-all"
            >
              <Quote className="absolute top-6 right-6 text-violet-400/20 w-12 h-12 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
              
              <p className="text-slate-300 text-sm leading-relaxed mb-8 relative z-10">
                "{testimonial.text || testimonial.review}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                {testimonial.image && (
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-violet-400/30 object-cover"
                  />
                )}
                {!testimonial.image && (
                  <div className="w-12 h-12 rounded-full bg-violet-400/20 border-2 border-violet-400/30 flex items-center justify-center text-violet-300 font-bold">
                    {testimonial.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <h4 className="text-white font-bold text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-violet-300 uppercase tracking-wider mt-1">{testimonial.position || testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}