import React from 'react';
import { motion } from 'framer-motion';
import { User, ChevronRight } from 'lucide-react';

export default function AboutSection({ data, onChoice }) {
  const { personal } = data;

  const choices = [
    { label: 'Explore my technical skills', next: 'skills' },
    { label: 'See the projects I\'ve built', next: 'projects' },
    { label: 'Review my work history', next: 'experience' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0e17] flex flex-col items-center justify-center px-4 py-16 font-mono relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-violet-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.p
          className="text-xs text-amber-400 uppercase tracking-widest mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Chapter 1 — The Protagonist
        </motion.p>

        <motion.div
          className="border border-violet-800/50 rounded-2xl bg-[#1a1a2e]/80 backdrop-blur p-8 mb-8 shadow-xl shadow-violet-950/40"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start gap-5 mb-6">
            <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-violet-600/40 shrink-0">
              <img
                src={personal.avatar}
                alt={personal.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User size={13} className="text-violet-400" />
                <span className="text-xs text-violet-400 uppercase tracking-wider">About the hero</span>
              </div>
              <h2 className="text-2xl font-bold text-white">{personal.name}</h2>
              <p className="text-sm text-violet-300">{personal.title}</p>
            </div>
          </div>

          <p className="text-slate-300 leading-relaxed text-base">{personal.bio}</p>

          <div className="mt-6 pt-6 border-t border-violet-800/30 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-violet-400 block mb-0.5">Location</span>
              <span className="text-slate-200">{personal.location}</span>
            </div>
            <div>
              <span className="text-violet-400 block mb-0.5">Email</span>
              <a
                href={`mailto:${personal.email}`}
                className="text-slate-200 hover:text-amber-400 transition-colors"
              >
                {personal.email}
              </a>
            </div>
          </div>
        </motion.div>

        <div className="space-y-3">
          {choices.map((choice, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.2 + i * 0.08 } }}
              whileHover={{ x: 6 }}
              onClick={() => onChoice(choice.next)}
              className="w-full flex items-center gap-3 text-left px-5 py-4 rounded-xl border border-violet-700/40 hover:border-violet-400/70 bg-violet-950/30 hover:bg-violet-900/40 text-violet-200 hover:text-white transition-all duration-200 group"
            >
              <ChevronRight size={14} className="text-violet-400 group-hover:text-amber-400 transition-colors shrink-0" />
              <span className="text-sm">{choice.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
