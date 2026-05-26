import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ChevronRight } from 'lucide-react';

const CATEGORY_COLORS = {
  Frontend: 'bg-violet-500',
  Backend: 'bg-amber-500',
  DevOps: 'bg-emerald-500',
};

const CATEGORY_TEXT = {
  Frontend: 'text-violet-300',
  Backend: 'text-amber-300',
  DevOps: 'text-emerald-300',
};

export default function SkillsSection({ data, onChoice }) {
  const { skills } = data;

  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const choices = [
    { label: 'See the projects I\'ve shipped', next: 'projects' },
    { label: 'Read my work history', next: 'experience' },
    { label: 'Hear what colleagues say', next: 'testimonials' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0e17] flex flex-col items-center justify-center px-4 py-16 font-mono relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-900/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.p
          className="text-xs text-amber-400 uppercase tracking-widest mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Chapter 2 — The Armoury
        </motion.p>

        <motion.div
          className="border border-violet-800/50 rounded-2xl bg-[#1a1a2e]/80 backdrop-blur p-8 mb-8 shadow-xl shadow-violet-950/40"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Zap size={16} className="text-amber-400" />
            <h2 className="text-xl font-bold text-white">Technical Arsenal</h2>
          </div>

          <div className="space-y-8">
            {Object.entries(grouped).map(([category, categorySkills]) => (
              <div key={category}>
                <p className={`text-xs uppercase tracking-widest mb-4 font-semibold ${CATEGORY_TEXT[category] || 'text-slate-400'}`}>
                  {category}
                </p>
                <div className="space-y-3">
                  {categorySkills.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
                    >
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm text-slate-200">{skill.name}</span>
                        <span className="text-xs text-slate-500">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${CATEGORY_COLORS[category] || 'bg-slate-500'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.05, ease: 'easeOut' }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="space-y-3">
          {choices.map((choice, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.3 + i * 0.08 } }}
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
