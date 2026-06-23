import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

export default function About({ data }) {
  const categories = [...new Set((data.skills || []).map((skill) => skill?.category).filter(Boolean))].slice(0, 3);

  return (
    <section id="about" className="bg-[#FFFDF8] px-5 py-24 md:px-8 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease }}
        className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C58A63]">About</p>
          <h2 className="scandi-serif mt-4 text-4xl font-semibold leading-tight text-[#283028] md:text-5xl">
            Calm interfaces, clear systems, and products that feel easy to use.
          </h2>
        </div>

        <div className="rounded-[2rem] border border-[#E7DED1] bg-[#F7F3EA] p-6 shadow-[0_24px_80px_rgba(70,56,39,0.08)] md:p-8">
          <p className="text-lg leading-9 text-[#526053]">{data.personal?.bio}</p>
          <div className="mt-7 flex items-center gap-3 text-[#6F746B]">
            <MapPin size={18} className="text-[#8FA58A]" />
            {data.personal?.location}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {categories.map((category) => (
              <div key={category} className="rounded-2xl border border-[#E7DED1] bg-[#FFFDF8] p-4">
                <CheckCircle2 size={18} className="mb-3 text-[#8FA58A]" />
                <p className="text-sm font-semibold text-[#283028]">{category}</p>
                <p className="mt-1 text-xs leading-5 text-[#8B7D6B]">Measured, durable, and thoughtfully shipped.</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
