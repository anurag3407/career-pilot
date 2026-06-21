import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const ease = [0.25, 0.1, 0.25, 1];

export default function About({ data }) {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease }}
          className="space-y-7"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[#C9A96E]">01 / ABOUT</p>
          <h2
            className="font-serif text-4xl font-light leading-tight text-[#F5F0E8] md:text-5xl"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            The Vision Behind the Work
          </h2>
          <p className="text-lg font-light leading-relaxed text-[#A8A090]">{data.personal?.bio}</p>
          <div className="h-px w-16 bg-[#C9A96E]" />
          <div className="flex items-center gap-3 text-[#A8A090]">
            <MapPin size={18} color="#C9A96E" strokeWidth={1.5} />
            <span>{data.personal?.location}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute -left-3 -top-3 h-full w-full bg-[#C9A96E]/10" />
          <div className="absolute -bottom-4 -right-4 h-full w-full border-b border-r border-[#C9A96E]/60" />
          <div className="relative overflow-hidden bg-[#111118] p-3">
            {data.personal?.avatar ? (
              <img
                src={data.personal.avatar}
                alt={data.personal?.name || 'Portfolio portrait'}
                className="aspect-[3/4] w-full object-cover grayscale-[20%]"
              />
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
