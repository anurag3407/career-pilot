import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import LavaAnimate from '../LavaAnimate';

export default function About({ personal, stats, skills }) {
  const topSkills = skills.slice(0, 3);
  return (
    <section id="about" className="py-24 w-full relative z-10 flex justify-center">
      <LavaAnimate className="flex! w-full justify-center" particleCount={120} formedDelay={1800} meltAmount={10} duration={3.5} particleSize={[15, 38]}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px' }} transition={{ duration: 0.8 }} className="max-w-5xl mx-auto bg-gradient-to-br from-stone-900/70 via-stone-900/45 to-stone-950/70 border border-orange-500/15 rounded-2xl p-6 md:p-10 w-full">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white">About Me</h2>
            <p className="mt-3 text-stone-400 text-base md:text-lg">A concise summary of background, location, and measurable outcomes.</p>
          </div>
          <div className="mt-8 flex flex-col md:flex-row md:items-start gap-6">
            <img src={personal.avatar} alt="profile" className="h-24 w-24 md:h-28 md:w-28 rounded-xl object-cover border border-orange-500/35 shadow-[0_0_16px_rgba(249,115,22,0.2)]" />
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-orange-300 text-sm mb-3">
                <MapPin size={14} /><span>{personal.location}</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-lg">{personal.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {topSkills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-md bg-stone-950 border border-orange-500/25 text-orange-300 text-xs md:text-sm font-medium">{skill.name}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-orange-500/20 bg-stone-950/70 rounded-xl p-4">
              <p className="text-4xl font-black text-orange-400">{stats.yearsExperience}+</p>
              <p className="text-stone-400 text-sm">Years Experience</p>
            </div>
            <div className="border border-orange-500/20 bg-stone-950/70 rounded-xl p-4">
              <p className="text-4xl font-black text-orange-400">{stats.projectsCompleted}</p>
              <p className="text-stone-400 text-sm">Projects Completed</p>
            </div>
            <div className="border border-orange-500/20 bg-stone-950/70 rounded-xl p-4">
              <p className="text-4xl font-black text-orange-400">{stats.happyClients}</p>
              <p className="text-stone-400 text-sm">Happy Clients</p>
            </div>
          </div>
        </motion.div>
      </LavaAnimate>
    </section>
  );
}