import React from 'react';
import { motion } from 'framer-motion';
import data from '../../../../data/dummy_data.json';

const Testimonials = () => {
  return (
    <section className="p-6 md:p-16 border-b-4 border-black bg-[#FFD700]">
      <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase mb-10 md:mb-16 border-b-4 md:border-b-8 border-black pb-2 md:pb-4 inline-block">Word on the Street</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-4 md:mt-8">
        {data.testimonials.map((test, i) => (
          <motion.div key={i} whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? 1 : -1 }} className="bg-white border-4 border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative mt-4 md:mt-0">
            <div className="absolute -top-6 -left-4 md:-top-10 md:-left-6 bg-[#00509E] w-12 h-12 md:w-20 md:h-20 rounded-full border-2 md:border-4 border-black flex items-center justify-center text-white font-black text-4xl md:text-7xl pt-2 md:pt-6 transform -rotate-12">"</div>
            <p className="text-lg md:text-2xl font-bold mb-6 md:mb-8 mt-4 md:mt-6 leading-snug">{test.text}</p>
            <div className="flex items-center gap-4 md:gap-6 border-t-2 md:border-t-4 border-black pt-4 md:pt-6">
              <img src={test.avatar} alt={test.name || "Profile Avatar"} className="w-12 h-12 md:w-20 md:h-20 rounded-none border-2 md:border-4 border-black grayscale object-cover shrink-0" />
              <div>
                <p className="font-black text-lg md:text-2xl uppercase line-clamp-1">{test.name}</p>
                <p className="font-bold text-[#E3000F] text-sm md:text-xl uppercase tracking-wide line-clamp-1">{test.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
