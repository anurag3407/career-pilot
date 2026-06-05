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

export default function Testimonials({ testimonials }) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="relative overflow-hidden py-24 px-6">
      <Crystal className="-top-20 left-1/3" size="w-72 h-72" duration={12} delay={0} color="from-indigo-500/10 via-purple-500/5 to-slate-500/10" />

      <motion.div className="max-w-6xl mx-auto relative z-10" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        <AnimatedHeading title="Testimonials" gradientClass="from-indigo-300 to-indigo-500" lineClass="bg-indigo-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((test, index) => (
            <motion.div 
              key={index} 
              whileHover={{ y: -5 }}
              className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl relative backdrop-blur-md"
            >
              <span className="text-6xl text-indigo-500/20 absolute top-4 right-6 font-serif">"</span>
              <p className="text-slate-300 italic mb-8 relative z-10 leading-relaxed">"{test.text}"</p>
              <div className="flex items-center gap-4">
                <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full object-cover border border-indigo-500/30" />
                <div>
                  <h4 className="font-bold text-slate-200">{test.name}</h4>
                  <p className="text-sm text-slate-500">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}