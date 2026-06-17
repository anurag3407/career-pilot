import React from 'react';
import { motion } from 'framer-motion';
import { WavyText } from './Shared';

const Hero = ({ data }) => (
  <motion.section 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="min-h-screen flex flex-col items-center justify-center text-center relative z-10 pt-20 pb-10"
  >
    <div className="max-w-5xl mx-auto w-full px-4 relative">
      <WavyText text={data.personal.name} />
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-8 md:mt-12 will-change-transform"
      >
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-[#ff5e57] uppercase border-y-4 border-[#ff5e57] py-3 md:py-4 inline-block bg-[#2b1318]/40 backdrop-blur-sm px-6 md:px-8 rounded-[3rem]">
          {data.personal.title}
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-10 md:mb-12 font-sans text-[#fdf3e7] leading-relaxed drop-shadow-md px-4">
          {data.personal.bio}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-md mx-auto sm:max-w-none">
          <motion.a 
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto bg-[#f28e2b] text-[#2b1318] px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-lg md:text-xl hover:bg-[#ff5e57] hover:text-[#fdf3e7] transition-colors uppercase tracking-widest relative text-center"
          >
            Explore Work
          </motion.a>
          <motion.a 
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto bg-[#fdf3e7] text-[#ff5e57] px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-lg md:text-xl hover:bg-[#e15f41] hover:text-[#fdf3e7] transition-colors uppercase tracking-widest text-center"
          >
            Say Hello
          </motion.a>
        </div>
      </motion.div>
    </div>
  </motion.section>
);

export default Hero;