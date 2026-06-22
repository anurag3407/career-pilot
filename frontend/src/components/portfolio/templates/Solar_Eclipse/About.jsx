import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, FolderOpen, Users } from 'lucide-react';

export default function About({ personal, stats }) {
  const statItems = [
    { icon: Briefcase, value: stats.yearsExperience, label: 'Years Experience' },
    { icon: FolderOpen, value: stats.projectsCompleted, label: 'Projects' },
    { icon: Users, value: stats.happyClients, label: 'Happy Clients' },
  ];

  return (
    <section id="about" className="relative py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-16"
        >
          About <span className="text-orange-400">Me</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Avatar + Location */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: '0 0 40px 10px #ff6a0030, 0 0 80px 20px #ff6a0015',
                }}
              />
              <img
                src={personal.avatar}
                alt={personal.name}
                className="w-40 h-40 md:w-52 md:h-52 rounded-full object-cover border-2 border-orange-500/30 relative z-10"
              />
            </div>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-800/60 border border-gray-700 text-gray-300 text-sm">
              <MapPin size={14} className="text-orange-400" />
              {personal.location}
            </span>
          </motion.div>

          {/* Bio + Stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="text-gray-300 leading-relaxed text-base md:text-lg mb-8">
              {personal.bio}
            </p>

            <div className="grid grid-cols-3 gap-4">
              {statItems.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className="text-center p-3 rounded-xl bg-gray-800/40 border border-gray-700/50"
                >
                  <stat.icon size={18} className="mx-auto mb-1.5 text-orange-400" />
                  <p className="text-2xl font-bold text-white">{stat.value}+</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
