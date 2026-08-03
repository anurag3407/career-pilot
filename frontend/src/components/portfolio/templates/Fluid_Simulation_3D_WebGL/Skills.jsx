import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Server, Shield, Layers } from 'lucide-react';

export default function Skills({ data }) {
  const skills = data?.skills || [];
  const [activeCategory, setActiveCategory] = useState('All');

  // Categories colors mapping
  const categoryStyles = {
    Frontend: {
      color: '#06b6d4', // Cyan
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      hoverBorder: 'hover:border-cyan-400',
      text: 'text-cyan-400',
      icon: Cpu
    },
    Backend: {
      color: '#a855f7', // Purple
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      hoverBorder: 'hover:border-purple-400',
      text: 'text-purple-400',
      icon: Server
    },
    DevOps: {
      color: '#f97316', // Orange
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      hoverBorder: 'hover:border-orange-400',
      text: 'text-orange-400',
      icon: Shield
    },
    Design: {
      color: '#10b981', // Emerald
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      hoverBorder: 'hover:border-emerald-400',
      text: 'text-emerald-400',
      icon: Layers
    },
    Other: {
      color: '#3b82f6', // Blue
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      hoverBorder: 'hover:border-blue-400',
      text: 'text-blue-400',
      icon: Cpu
    }
  };

  // Helper to resolve category stylesheet
  const getStyle = (cat) => {
    const normalized = Object.keys(categoryStyles).find(
      key => key.toLowerCase() === (cat || '').toLowerCase()
    );
    return categoryStyles[normalized] || categoryStyles.Other;
  };

  // Collect unique categories
  const categories = ['All', ...new Set(skills.map(s => s.category || 'Other'))];

  // Filter skills
  const filteredSkills = activeCategory === 'All' 
    ? skills 
    : skills.filter(s => (s.category || 'Other') === activeCategory);

  // Trigger fluid effects
  const handleSkillHover = (e, cat) => {
    const style = getStyle(cat);
    window.dispatchEvent(new CustomEvent('fluid-burst', {
      detail: {
        x: e.clientX,
        y: e.clientY,
        count: 5,
        color: style.color
      }
    }));
  };

  const handleSkillClick = (e, cat) => {
    const style = getStyle(cat);
    // Large explosion
    window.dispatchEvent(new CustomEvent('fluid-burst', {
      detail: {
        x: e.clientX,
        y: e.clientY,
        count: 35,
        color: style.color
      }
    }));
    // Flow ripple current
    window.dispatchEvent(new CustomEvent('fluid-flow', {
      detail: {
        x: e.clientX,
        y: e.clientY,
        dx: (Math.random() - 0.5) * 8,
        dy: -6,
        radius: 300,
        strength: 5
      }
    }));
  };

  return (
    <section id="skills-section" className="relative py-28 px-6 md:px-12 bg-slate-950/20 backdrop-blur-[2px] border-t border-b border-slate-900 overflow-hidden text-white">
      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent uppercase tracking-wider"
          >
            Skills Density Field
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-sm md:text-base leading-relaxed"
          >
            Floating core competencies. Hover to accelerate surrounding vector currents, or click a node to trigger a particle wave.
          </motion.p>
        </div>

        {/* Filter categories bar */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat, idx) => {
            const isActive = activeCategory === cat;
            const style = cat === 'All' ? categoryStyles.Other : getStyle(cat);
            return (
              <button type="button"
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                  isActive
                    ? `${style.bg} ${style.border} ${style.text} shadow-md shadow-${style.color}/5 scale-105`
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Floating Skills Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => {
              const skillName = skill.name || '';
              const skillLevel = skill.level || 75;
              const skillCat = skill.category || 'Other';
              const style = getStyle(skillCat);
              const Icon = style.icon;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  key={`${skillName}-${index}`}
                  onMouseMove={(e) => handleSkillHover(e, skillCat)}
                  onClick={(e) => handleSkillClick(e, skillCat)}
                  className={`bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 ${style.hoverBorder} backdrop-blur-md p-5 rounded-2xl flex flex-col justify-between h-40 shadow-xl transition-all cursor-pointer group`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-2.5 rounded-xl ${style.bg} ${style.text}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      {skillCat}
                    </span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <span className="block font-bold text-slate-100 group-hover:text-white transition duration-200 text-sm sm:text-base">
                      {skillName}
                    </span>
                    
                    {/* Simulated visual liquid gauge bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>visc_limit</span>
                        <span>{skillLevel}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden relative">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out relative"
                          style={{ 
                            width: `${skillLevel}%`,
                            background: `linear-gradient(90deg, ${style.color}cc, ${style.color})`
                          }}
                        >
                          {/* Flowing liquid sheen simulation */}
                          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full animate-shimmer" 
                            style={{ animation: 'shimmer 2s infinite' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}
