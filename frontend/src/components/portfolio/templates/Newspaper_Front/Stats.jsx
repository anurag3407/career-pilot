import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Stats({ data }) {
  return (
    <motion.div 
      initial="initial" 
      animate="animate" 
      variants={fadeInUp} 
      className="bg-stone-800 border-2 border-yellow-600 p-4 md:p-6"
    >
      <h4 className="text-lg font-black text-yellow-600 mb-4 tracking-widest uppercase" style={{ fontFamily: 'Georgia, serif' }}>
        Stats
      </h4>
      <div className="space-y-4">
        <div className="border-b border-yellow-600/30 pb-3">
          <div className="text-2xl md:text-3xl font-black text-yellow-500">{data.stats.yearsExperience}+</div>
          <p className="text-gray-400 text-xs uppercase tracking-widest">Years Experience</p>
        </div>
        <div className="border-b border-yellow-600/30 pb-3">
          <div className="text-2xl md:text-3xl font-black text-yellow-500">{data.stats.projectsCompleted}</div>
          <p className="text-gray-400 text-xs uppercase tracking-widest">Projects Completed</p>
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-black text-yellow-500">{data.stats.happyClients}+</div>
          <p className="text-gray-400 text-xs uppercase tracking-widest">Happy Clients</p>
        </div>
      </div>
    </motion.div>
  );
}
