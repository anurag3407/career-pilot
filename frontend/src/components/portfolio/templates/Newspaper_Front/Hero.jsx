import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Hero({ data }) {
  return (
    <motion.section 
      initial="initial" 
      animate="animate" 
      variants={fadeInUp} 
      className="bg-stone-800 border-2 border-yellow-600 p-6 md:p-8 shadow-xl"
    >
      <div className="flex gap-4 md:gap-6 mb-6">
        <img 
          src={data.personal.avatar} 
          alt={data.personal.name}
          className="w-20 h-20 md:w-32 md:h-32 rounded-lg border-2 border-yellow-600 object-cover"
        />
        <div className="flex-1">
          <span className="inline-block bg-yellow-600 text-black text-xs font-black px-3 py-1 mb-3 tracking-widest">
            TOP STORY
          </span>
          <h2 className="text-2xl md:text-4xl font-black mb-2 text-yellow-500" style={{ fontFamily: 'Georgia, serif' }}>
            {data.personal.name}
          </h2>
          <p className="text-sm md:text-base text-yellow-600 font-bold mb-2 tracking-wide">
            {data.personal.title}
          </p>
          <p className="text-gray-300 text-sm mb-3 leading-relaxed">
            {data.personal.bio}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <MapPin size={16} />
            {data.personal.location}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
