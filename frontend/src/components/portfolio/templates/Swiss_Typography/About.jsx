import React from 'react';
import { motion } from 'framer-motion';

const ACCENT = '#E63946';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Label({ children }) {
  return (
    <span className="text-[10px] md:text-xs font-black tracking-[0.22em] uppercase" style={{ color: ACCENT }}>
      {children}
    </span>
  );
}

export default function About({ data }) {
  const { bio, avatar, name } = data.personal;

  return (
    <section className="border-b border-black text-left">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-3 px-5 md:px-12 py-8 md:py-12 border-b md:border-b-0 md:border-r border-black flex flex-col gap-6">
          <Label>02 — About</Label>
          {avatar && (
            <img
              src={avatar}
              alt={name}
              className="w-20 h-20 md:w-24 md:h-24 grayscale border border-black object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="md:col-span-9 px-5 md:px-12 py-8 md:py-12 flex items-center"
        >
          <p className="text-lg md:text-2xl font-light leading-relaxed text-gray-700 max-w-3xl">
            {bio}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
