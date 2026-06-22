import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Hero({ personal }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Star field background */}
      <div className="absolute inset-0 z-0">
        <StarField />
      </div>

      {/* Eclipse glow */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute z-[1] w-64 h-64 md:w-96 md:h-96 rounded-full"
        style={{
          background: `radial-gradient(circle, #000 28%, #1a0a00 38%, #ff6a00 42%, #ff6a0033 55%, transparent 70%)`,
          boxShadow: '0 0 80px 40px #ff6a0044, 0 0 160px 80px #ff3d0022',
        }}
      />

      {/* Outer corona ring */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 2.5, delay: 0.3, ease: 'easeOut' }}
        className="absolute z-[1] w-72 h-72 md:w-[28rem] md:h-[28rem] rounded-full border border-orange-500/20"
        style={{
          boxShadow: '0 0 60px 20px #ff6a0015, inset 0 0 60px 20px #ff6a0010',
        }}
      />

      {/* Second corona ring */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 3, delay: 0.6, ease: 'easeOut' }}
        className="absolute z-[1] w-80 h-80 md:w-[34rem] md:h-[34rem] rounded-full border border-orange-400/10"
        style={{
          boxShadow: '0 0 40px 10px #ff6a0008',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-4xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg"
        >
          {personal.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="text-lg md:text-2xl text-orange-200/80 font-light mb-3"
        >
          {personal.title}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="text-sm md:text-base text-gray-400 italic"
        >
          {personal.tagline}
        </motion.p>
      </div>

      {/* Scroll CTA */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-orange-300/60 hover:text-orange-300 transition-colors cursor-pointer"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown size={20} />
        </motion.div>
      </motion.a>
    </section>
  );
}

/* ─── Star Field (CSS dots) ─── */
function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.7 + 0.3,
    delay: Math.random() * 3,
  }));

  return (
    <>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [star.opacity, star.opacity * 0.3, star.opacity] }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}
