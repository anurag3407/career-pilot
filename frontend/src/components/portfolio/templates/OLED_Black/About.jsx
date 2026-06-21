import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { fadeUp, staggerContainer, SectionHeading } from './shared';

const About = ({ personal }) => (
  <section className="relative py-24">
    <SectionHeading title="Identity" icon={User} />
    <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="group relative md:col-span-5"
      >
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
        <img
          src={personal.avatar}
          alt={personal.name || "Profile Avatar"}
          className="relative z-10 aspect-square w-full rounded-sm border border-gray-800 object-cover grayscale transition-all duration-700 hover:grayscale-0"
        />
        <div className="absolute -left-2 -top-2 z-20 h-6 w-6 border-l-2 border-t-2 border-cyan-400" />
        <div className="absolute -bottom-2 -right-2 z-20 h-6 w-6 border-b-2 border-r-2 border-cyan-400" />
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-6 text-lg leading-relaxed text-gray-300 font-light md:col-span-7"
      >
        <motion.p variants={fadeUp}>{personal.bio}</motion.p>
      </motion.div>
    </div>
  </section>
);

export default About;