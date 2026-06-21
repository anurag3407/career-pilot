import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1];

export default function Testimonials({ data }) {
  return (
    <section className="bg-[#111118] px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-14 space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C9A96E]">05 / TESTIMONIALS</p>
          <h2
            className="font-serif text-4xl font-light text-[#F5F0E8] md:text-6xl"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            What Clients Say
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {(data.testimonials || []).map((testimonial, index) => (
            <motion.article
              key={`${testimonial?.name}-${testimonial?.role}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: index * 0.1, ease }}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden border border-[#C9A96E]/10 bg-[#0A0A0F] p-7 transition-all duration-300 hover:border-[#C9A96E]/30"
            >
              <div className="absolute right-6 top-6 h-28 w-28 rounded-full bg-[#C9A96E]/5 blur-3xl" />
              <span
                className="absolute left-5 top-1 font-serif text-8xl leading-none text-[#C9A96E]/20"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                &quot;
              </span>
              <p
                className="relative pt-12 font-serif text-xl font-light italic leading-relaxed text-[#F5F0E8]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {testimonial?.text}
              </p>
              <div className="relative mt-8 flex items-center gap-4">
                {testimonial?.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial?.name || 'Client portrait'}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-[#C9A96E]/50"
                  />
                ) : null}
                <div>
                  <p className="text-sm font-medium text-[#F5F0E8]">{testimonial?.name}</p>
                  <p className="text-xs text-[#A8A090]">{testimonial?.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
