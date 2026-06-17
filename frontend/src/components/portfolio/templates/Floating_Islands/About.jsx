import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Users, FolderOpen } from 'lucide-react';

export default function About({ personal, stats }) {
  const statItems = [
    { icon: Briefcase, value: stats.yearsExperience, label: 'Years Experience' },
    { icon: FolderOpen, value: stats.projectsCompleted, label: 'Projects Completed' },
    { icon: Users, value: stats.happyClients, label: 'Happy Clients' },
  ];

  return (
    <section id="about" className="relative py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-4xl mx-auto"
      >
        {/* Island container */}
        <div className="relative bg-white/80 backdrop-blur-md rounded-3xl px-8 py-12 md:px-14 md:py-14 shadow-2xl shadow-sky-200/40 border border-white/60">
          {/* Island bottom */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-gradient-to-b from-amber-100 to-amber-300 rounded-b-[60%] opacity-50" />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/5 h-6 bg-gradient-to-b from-green-200 to-green-400 rounded-b-[50%] opacity-40" />

          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 text-center">
            About Me
          </h2>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed text-center max-w-2xl mx-auto mb-8">
            {personal.bio}
          </p>

          {/* Location Badge */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-100 text-sky-700 text-sm font-medium">
              <MapPin size={14} />
              {personal.location}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {statItems.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="text-center p-4 rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100"
              >
                <stat.icon className="mx-auto mb-2 text-sky-500" size={24} />
                <p className="text-3xl font-bold text-slate-800">{stat.value}+</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
