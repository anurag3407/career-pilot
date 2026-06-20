import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircleHeart } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

export default function Testimonials({ data }) {
  return (
    <section className="bg-[#FFFDF8] px-5 py-24 md:px-8 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease }}
        className="mx-auto max-w-7xl"
      >
        <div className="mb-12">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#C58A63]">
            <MessageCircleHeart size={16} />
            Testimonials
          </p>
          <h2 className="scandi-serif mt-4 text-4xl font-semibold text-[#283028] md:text-5xl">
            Kind words, softly framed.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {(data.testimonials || []).map((testimonial, index) => (
            <motion.article
              key={`${testimonial?.name || 'testimonial'}-${
                testimonial?.role || 'role'
              }-${index}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: index * 0.06, ease }}
              whileHover={{ y: -6 }}
              className="rounded-[1.5rem] border border-[#E7DED1] bg-[#F7F3EA] p-5 shadow-[0_18px_55px_rgba(70,56,39,0.07)]"
            >
              <p className="scandi-serif text-xl leading-8 text-[#283028]">&quot;{testimonial?.text}&quot;</p>
              <div className="mt-6 flex items-center gap-3">
                {testimonial?.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial?.name || 'Testimonial avatar'}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-[#D9C3A8]"
                  />
                ) : null}
                <div>
                  <p className="text-sm font-bold text-[#283028]">{testimonial?.name}</p>
                  <p className="text-xs leading-5 text-[#8B7D6B]">{testimonial?.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
