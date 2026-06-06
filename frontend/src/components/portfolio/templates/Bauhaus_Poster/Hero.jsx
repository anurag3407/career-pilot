import React from 'react';
import { motion } from 'framer-motion';
import data from '../../../../data/dummy_data.json';

const Hero = ({ colors }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } }
  };

  const nameLetters = data.personal.name.split('');

  return (
    <section className="h-screen min-h-screen flex flex-col justify-center items-center p-6 md:p-16 border-b-4 border-black text-center relative overflow-hidden w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="w-32 h-32 md:w-64 md:h-64 rounded-full border-4 md:border-8 border-black overflow-hidden mb-8 md:mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-[#00509E] flex items-center justify-center relative group shrink-0"
      >
        <img src={data.personal.avatar} alt={data.personal.name} className="w-full h-full object-cover grayscale mix-blend-luminosity group-hover:grayscale-0 transition-all duration-700 z-10" />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 bg-[#E3000F] mix-blend-multiply opacity-50 z-0" />
      </motion.div>

      <motion.h1 className="flex flex-row flex-nowrap justify-center items-center mb-6 w-full max-w-[100vw] overflow-visible px-2" variants={containerVariants} initial="hidden" animate="visible">
        {nameLetters.map((letter, index) => (
          <motion.span key={index} variants={letterVariants} whileHover={{ scale: 1.2, color: colors ? colors[index % 3] : '#E3000F', textShadow: '4px 4px 0px rgba(0,0,0,1)', y: -10, transition: { type: 'spring', stiffness: 300, damping: 10 } }} className="text-[8vw] sm:text-[6vw] md:text-8xl lg:text-9xl font-black uppercase tracking-tighter cursor-crosshair inline-block mx-[2px] md:mx-1 leading-none">
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.h1>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, type: 'spring' }} className="bg-[#FFD700] px-4 py-2 md:px-8 md:py-4 border-2 md:border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-[#FFD700] transition-colors cursor-default max-w-full">
        <p className="text-xs sm:text-sm md:text-4xl font-black uppercase tracking-widest whitespace-normal leading-tight">{data.personal.title}</p>
      </motion.div>
    </section>
  );
};

export default Hero;
