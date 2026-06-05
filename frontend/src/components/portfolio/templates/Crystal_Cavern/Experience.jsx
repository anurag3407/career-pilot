import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

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

export default function Experience({ experience }) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="relative overflow-hidden py-24 px-6 bg-slate-900/20">
      <Crystal className="top-1/3 right-10" size="w-48 h-48" duration={8} delay={1} color="from-emerald-500/10 via-teal-500/10 to-slate-500/10" />
      <Crystal className="bottom-1/3 left-5" size="w-24 h-24" duration={5} delay={2} color="from-emerald-500/20 via-green-500/10 to-indigo-500/10" />

      <motion.div className="max-w-6xl mx-auto relative z-10" variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        <AnimatedHeading title="Experience" gradientClass="from-emerald-300 to-emerald-500" lineClass="bg-emerald-400" />
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-emerald-900 before:to-transparent">
          {experience.map((exp, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-950 text-emerald-400 group-hover:border-emerald-400 group-hover:bg-emerald-400/10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow transition-colors z-10">
                <ChevronRight size={20} className="md:hidden" />
                <motion.div 
                  className="hidden md:block w-3 h-3 bg-emerald-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 transition-colors backdrop-blur-sm">
                <div className="flex flex-col mb-2">
                  <span className="text-emerald-400 font-mono text-sm mb-1">{exp.period}</span>
                  <h3 className="text-xl font-bold text-slate-100">{exp.role}</h3>
                  <h4 className="text-lg text-slate-400">{exp.company}</h4>
                </div>
                <p className="text-slate-400 mt-4 leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}