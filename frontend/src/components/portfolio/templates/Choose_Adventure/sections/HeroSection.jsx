import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';

export default function HeroSection({ data, onBegin }) {
  const { personal, stats } = data;

  return (
    <div className="min-h-screen bg-[#0f0e17] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden font-mono">
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-10 left-8 w-72 h-72 bg-violet-800/25 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-12 w-64 h-64 bg-amber-700/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-950/30 rounded-full blur-3xl" />
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-violet-300/40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 text-center max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.div
          className="w-24 h-24 rounded-full mx-auto mb-6 ring-2 ring-violet-500/50 ring-offset-4 ring-offset-[#0f0e17] overflow-hidden"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
        >
          <img
            src={personal.avatar}
            alt={personal.name || "Profile Avatar"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('bg-violet-800', 'flex', 'items-center', 'justify-center');
            }}
          />
        </motion.div>

        <motion.p
          className="text-xs text-amber-400 uppercase tracking-widest mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          ✦ An Interactive Portfolio Adventure ✦
        </motion.p>

        <motion.h1
          className="text-4xl sm:text-6xl font-bold text-white mb-3 leading-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {personal.name}
        </motion.h1>

        <motion.p
          className="text-violet-300 text-base sm:text-lg mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {personal.title}
        </motion.p>

        <motion.div
          className="flex items-center justify-center gap-1 text-slate-400 text-sm mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <MapPin size={13} />
          <span>{personal.location}</span>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-4 mb-10 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { value: `${stats.yearsExperience}+`, label: 'Years' },
            { value: `${stats.projectsCompleted}+`, label: 'Projects' },
            { value: `${stats.happyClients}+`, label: 'Clients' },
          ].map((s) => (
            <div key={s.label} className="bg-violet-950/50 border border-violet-800/40 rounded-xl py-3">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-violet-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.button
          onClick={onBegin}
          className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg shadow-violet-900/40 hover:shadow-violet-800/50"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <Sparkles size={16} />
          Begin Your Adventure
        </motion.button>

        <motion.p
          className="mt-5 text-xs text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Choose your own path through my story
        </motion.p>
      </motion.div>
    </div>
  );
}
