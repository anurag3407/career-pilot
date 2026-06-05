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

export default function Experience({ data }) {
  return (
    <section className="border-b border-black text-left">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-3 px-5 md:px-12 py-8 md:py-12 border-b md:border-b-0 md:border-r border-black">
          <Label>05 — Experience</Label>
        </div>

        <div className="md:col-span-9 divide-y divide-black">
          {data.experience.map((job, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="px-5 md:px-12 py-6 md:py-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8"
            >
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                  {job.period}
                </p>
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: ACCENT }}>
                  {job.company}
                </p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-black mb-2">
                  {job.role}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
