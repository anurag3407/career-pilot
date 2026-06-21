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

function Rule({ className = '' }) {
  return <div className={`h-px bg-black w-full ${className}`} />;
}

function Label({ children }) {
  return (
    <span className="text-[10px] md:text-xs font-black tracking-[0.22em] uppercase" style={{ color: ACCENT }}>
      {children}
    </span>
  );
}

export default function Testimonials({ data }) {
  return (
    <section className="border-b border-black text-left">
      <div className="px-5 md:px-12 py-3 border-b border-black">
        <Label>06 — Testimonials</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black">
        {data.testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
            variants={fadeUp}
            className="px-5 md:px-10 py-8 md:py-10"
          >
            <div className="text-5xl font-black leading-none mb-4" style={{ color: ACCENT }}>
              "
            </div>
            <p className="text-sm text-gray-700 leading-relaxed italic mb-6">"{t.text}"</p>
            <Rule className="mb-4" />
            <div className="flex items-center gap-3">
              {t.avatar && (
                <img
                  src={t.avatar}
                  alt={t.name || "Profile Avatar"}
                  className="w-8 h-8 grayscale border border-black object-cover shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-black">{t.name}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
