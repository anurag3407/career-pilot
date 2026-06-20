import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { AnimatedHeading, GlassCard } from './Shared';
import data from '../../../../data/dummy_data.json';

const About = () => (
  <section className="py-24 relative z-10 px-6 max-w-6xl mx-auto">
    <AnimatedHeading>About</AnimatedHeading>
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <GlassCard>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-cyan-400/20 rounded-xl text-cyan-300">
            <User size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white">Profile</h3>
        </div>
        <p className="text-slate-300 leading-loose text-lg mb-6">
          {data.personal.bio}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-200">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          Based in {data.personal.location}
        </div>
      </GlassCard>
      <div className="grid grid-cols-2 gap-6">
        {[
          { label: "Experience", value: `${data.stats.yearsExperience}+ Yrs` },
          { label: "Projects", value: data.stats.projectsCompleted },
          { label: "Clients", value: data.stats.happyClients },
          { label: "Location", value: data.personal.location }
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center backdrop-blur-md"
            whileHover={{ 
              scale: 1.05, 
              skewX: -5,
              borderColor: "rgba(34, 211, 238, 0.5)",
              boxShadow: "0 0 20px rgba(34, 211, 238, 0.2)"
            }}
          >
            <h4 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-2">
              {stat.value}
            </h4>
            <p className="text-sm text-cyan-400 uppercase tracking-widest font-semibold">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default About;