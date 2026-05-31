import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.075, 0.82, 0.165, 1] } }
};

export default function SectionHeader({ title, subtitle }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px' }}
      variants={fadeInUp}
      className="mb-12"
    >
      <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 uppercase tracking-wider">
        {title}
      </h2>
      {subtitle && <p className="text-stone-400 mt-2 text-lg">{subtitle}</p>}
      <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-red-600 mt-4 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
    </motion.div>
  );
}