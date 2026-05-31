import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const About = ({ data, stats }) => (
  <section className="relative max-w-6xl mx-auto py-8 sm:py-10 md:py-24 px-5 md:px-6 overflow-hidden">
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9 }}
      className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_60%)]"
    />

    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: 18 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="relative text-center mb-12"
      style={{ transformPerspective: 900 }}
    >
      <h2 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4">About Me</h2>
      <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
        A concise summary of background, location, and measurable outcomes.
      </p>
    </motion.div>

    <div className="relative grid grid-cols-1 gap-4 md:gap-10 items-center">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.82, delay: 0.06 }}
        className="max-w-4xl mx-auto w-full"
      >
        {data.location && (
          <div className="mb-5 text-slate-300 text-sm flex items-center gap-2 justify-center md:justify-start">
            <MapPin size={16} className="text-cyan-300" />
            <span>{data.location}</span>
          </div>
        )}
        <p className="text-sm md:text-lg text-slate-300 leading-relaxed mb-4 md:mb-8 text-center md:text-left">{data.bio}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3 md:p-4">
            <p className="text-cyan-300 text-2xl md:text-3xl font-black">{stats?.yearsExperience ?? 0}+</p>
            <p className="text-slate-400 text-xs md:text-sm mt-1">Years Experience</p>
          </div>
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3 md:p-4">
            <p className="text-indigo-300 text-2xl md:text-3xl font-black">{stats?.projectsCompleted ?? 0}</p>
            <p className="text-slate-400 text-xs md:text-sm mt-1">Projects Completed</p>
          </div>
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3 md:p-4">
            <p className="text-cyan-300 text-2xl md:text-3xl font-black">{stats?.happyClients ?? 0}</p>
            <p className="text-slate-400 text-xs md:text-sm mt-1">Happy Clients</p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default About;
