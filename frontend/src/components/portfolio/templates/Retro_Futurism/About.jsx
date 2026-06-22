import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import SectionHeading from './SectionHeading';
import data from '../../../../data/dummy_data.json';

export default function About() {
  const bio = data?.personal?.bio ?? 'Retro-futuristic portfolio content coming soon.';

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl border border-pink-500/30 p-8 bg-slate-950/80 backdrop-blur-md shadow-[0_0_30px_rgba(236,72,153,0.15)]">
      <SectionHeading><Terminal size={36} className="text-pink-500" /> Initialize</SectionHeading>
      <p className="text-sm sm:text-base md:text-lg leading-relaxed text-cyan-100/90">{bio}</p>
    </motion.div>
  );
}
