import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function About({ data }) {
  return (
    <motion.section 
      initial="initial" 
      animate="animate" 
      variants={fadeInUp} 
      className="border-l-4 border-yellow-600 pl-6"
    >
      <h3 className="text-2xl md:text-3xl font-black text-yellow-600 mb-4 tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
        ABOUT
      </h3>
      <div className="bg-stone-800 p-6 border border-yellow-600/30">
        <p className="text-gray-300 leading-relaxed text-sm md:text-base">
          {data.personal.bio}
        </p>
      </div>
    </motion.section>
  );
}
