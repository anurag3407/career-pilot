import React from 'react';
import { motion } from 'framer-motion';
import data from '../../../../data/dummy_data.json';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20, rotate: -10 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const AnimatedText = ({ text, className = '' }) => {
  return (
    <motion.div
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={letterVariants}
          className="inline-block"
          whileHover={{ scale: 1.2, rotate: char === ' ' ? 0 : Math.random() * 30 - 15 }}
          transition={{ duration: 0.2 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* Background gradient orbs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main Name */}
        <div className="mb-8">
          <AnimatedText
            text={data.personal.name}
            className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent block"
          />
        </div>

        {/* Title with typewriter effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mb-6"
        >
          <p className="text-2xl md:text-4xl font-light text-gray-300 tracking-wide">
            <span className="inline-block mr-2">✦</span>
            {data.personal.title}
            <span className="inline-block ml-2">✦</span>
          </p>
        </motion.div>

        {/* Animated tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mb-12"
        >
          <p className="text-lg text-gray-400 italic max-w-2xl mx-auto">
            "{data.personal.tagline}"
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 mt-16"
        >
          <span className="text-sm text-gray-500 tracking-widest uppercase">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center p-2">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-gradient-to-b from-cyan-400 to-transparent rounded-full"
            ></motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
