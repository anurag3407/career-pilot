import React from 'react';
import { motion } from 'framer-motion';

const Crystal = ({ className, delay = 0, duration = 5, size = 'w-32 h-32', color = 'from-indigo-500/20 via-purple-500/10 to-emerald-500/20' }) => (
  <motion.div
    className={`absolute opacity-40 backdrop-blur-md bg-gradient-to-br ${color} ${size} ${className}`}
    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.1)' }}
    animate={{ y: [0, -30, 0], rotate: [0, 15, -15, 0], scale: [1, 1.05, 1] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

const AnimatedHeading = ({ title, gradientClass, lineClass }) => (
  <div className="mb-12 flex items-center gap-4">
    <motion.span className={`h-[2px] ${lineClass}`} animate={{ width: [30, 60, 30], opacity: [0.4, 1, 0.4] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
    <motion.h2 className={`text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${gradientClass}`} style={{ backgroundSize: '200% auto' }} animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
      {title}
    </motion.h2>
  </div>
);

export default function About({ personal }) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="relative overflow-hidden py-24 px-6">
      <Crystal className="-top-10 left-10" size="w-56 h-56" duration={7} delay={1} color="from-emerald-500/10 via-slate-500/10 to-indigo-500/10" />
      <Crystal className="bottom-10 right-10" size="w-40 h-40" duration={9} delay={3} color="from-purple-500/10 via-slate-500/10 to-indigo-500/10" />
      
      <motion.div className="max-w-6xl mx-auto relative z-10" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        <AnimatedHeading title="About Me" gradientClass="from-emerald-300 to-emerald-500" lineClass="bg-emerald-400" />
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-48 h-48 md:w-64 md:h-64 relative flex-shrink-0">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl opacity-50 blur-lg"
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <img src={personal.avatar} alt={personal.name} className="w-full h-full object-cover rounded-2xl relative z-10 border border-slate-700/50 shadow-xl" />
          </div>
          <div className="flex-1">
            <p className="text-lg text-slate-300 leading-relaxed bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
              {personal.bio}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}