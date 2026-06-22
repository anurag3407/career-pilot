import React from 'react';
import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1];

export default function Experience({ data }) {
  return (
    <section className="bg-[#0A0A0F] px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease }}
        className="mx-auto max-w-5xl"
      >
        <div className="mb-16 space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C9A96E]">04 / JOURNEY</p>
          <h2
            className="font-serif text-4xl font-light text-[#F5F0E8] md:text-6xl"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Professional Timeline
          </h2>
        </div>

        <div className="relative pl-9 md:pl-14">
          <div className="absolute left-1 top-2 h-full w-px bg-[#C9A96E]/30 md:left-3" />
          {(data.experience || []).map((item, index) => (
            <motion.article
              key={`${item?.role}-${item?.company}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: index * 0.1, ease }}
              className="relative border-b border-white/5 pb-10 last:border-b-0"
            >
              <span className="absolute -left-[2.4rem] top-2 h-3 w-3 rotate-45 bg-[#C9A96E] md:-left-[3.35rem]" />
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#C9A96E]">
                {item?.period}
              </p>
              <h3
                className="font-serif text-2xl font-light text-[#F5F0E8] md:text-3xl"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {item?.role}
              </h3>
              <p className="mt-2 text-sm uppercase tracking-[0.25em] text-[#C9A96E]/70">
                {item?.company}
              </p>
              <p className="mt-5 max-w-3xl text-sm font-light leading-relaxed text-[#A8A090] md:text-base">
                {item?.description}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
