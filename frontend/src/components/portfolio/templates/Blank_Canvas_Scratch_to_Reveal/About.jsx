import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from './PortfolioContext';
import { MapPin, Briefcase, Award, Users } from 'lucide-react';

export default function About() {
  const { personal, stats } = usePortfolio();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] },
    },
  };

  return (
    <section
      id="about"
      className="relative py-28 md:py-36 px-6 border-b border-slate-900/60 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column: Avatar & Guide Marks */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              variants={itemVariants}
              className="relative p-6"
            >
              {/* Technical Drawing Guide Borders */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20" />
              <div className="absolute inset-0 border border-slate-900/50" />

              {/* Glowing Background Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-[40px] z-0" />

              {/* Profile Image Frame */}
              <div className="relative z-10 overflow-hidden w-64 h-64 md:w-80 md:h-80 bg-slate-950 border border-slate-800 rounded-lg group">
                <img
                  src={personal.avatar}
                  alt={personal.name || "Profile Avatar"}
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              </div>

              {/* Location Overlay */}
              <div className="absolute bottom-10 left-10 right-10 flex items-center gap-2 px-3 py-1.5 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg w-fit z-20">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-300 font-light">{personal.location}</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Bio & Stats */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <motion.div variants={itemVariants} className="mb-4">
              <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">[[ 01 // The Story ]]</span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold font-outfit text-white mb-6 tracking-tight"
            >
              Revealing the Creator
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-8"
            >
              {personal.bio}
            </motion.p>

            {/* Premium Stats Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 md:gap-6 pt-6 border-t border-slate-900/80"
            >
              {[
                {
                  value: `${stats.yearsExperience}+`,
                  label: 'Years Active',
                  icon: Briefcase
                },
                {
                  value: `${stats.projectsCompleted}+`,
                  label: 'Works Shipped',
                  icon: Award
                },
                {
                  value: `${stats.happyClients}+`,
                  label: 'Collaborators',
                  icon: Users
                }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Icon className="w-4 h-4 text-white/60" />
                      <span className="text-xs font-mono font-light tracking-wide uppercase hidden sm:inline">{stat.label}</span>
                    </div>
                    <span className="text-2xl md:text-4xl font-extrabold font-outfit text-white leading-none mb-1">
                      {stat.value}
                    </span>
                    <span className="text-[10px] sm:hidden text-slate-400 uppercase tracking-widest">{stat.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
