import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Award, Layers, Users, Sparkles } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function About() {
  const { personal, stats } = data;

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const statItems = [
    {
      label: 'Years Experience',
      value: stats.yearsExperience,
      icon: Award,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      label: 'Projects Completed',
      value: stats.projectsCompleted,
      icon: Layers,
      color: 'from-pink-500 to-rose-500',
    },
    {
      label: 'Happy Clients',
      value: stats.happyClients,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  return (
    <section id="about" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          About{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Me
          </span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Avatar and Info Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={cardVariants}
          className="lg:col-span-5 flex flex-col items-center"
        >
          <div className="relative group p-4 rounded-3xl bg-gray-900/40 border border-white/10 backdrop-blur-md shadow-2xl">
            {/* Ambient Background Glow for Avatar */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-pink-600/30 rounded-3xl blur-2xl group-hover:scale-105 transition-transform duration-500 -z-10" />

            <div className="relative overflow-hidden rounded-2xl w-64 h-64 sm:w-80 sm:h-80 mb-6">
              <img
                src={personal.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'}
                alt={personal.name || "Profile Avatar"}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60" />
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-300">
              <MapPin className="w-5 h-5 text-pink-500 shrink-0" />
              <span className="text-sm font-medium">{personal.location}</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Bio and Stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={cardVariants}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-purple-400 text-sm font-semibold mb-6 w-fit backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            My Journey
          </div>

          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white leading-snug">
            Crafting elegant code to solve real-world problems.
          </h3>

          <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
            {personal.bio}
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {statItems.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-gray-900/30 border border-white/5 hover:border-white/10 backdrop-blur-md flex flex-col items-center sm:items-start text-center sm:text-left transition-all duration-300 hover:bg-gray-900/50 hover:-translate-y-1 group"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4 shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-extrabold text-white mb-1 group-hover:scale-105 transition-transform duration-300">
                    {stat.value}+
                  </span>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
