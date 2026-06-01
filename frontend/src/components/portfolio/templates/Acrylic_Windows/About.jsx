import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function About({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { personal, stats } = data;
  const statItems = [
    { label: 'Years Exp.', value: stats.yearsExperience },
    { label: 'Projects',   value: stats.projectsCompleted },
    { label: 'Clients',    value: stats.happyClients },
  ];
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className="grid md:grid-cols-2 gap-8 p-8 md:p-12"
    >
      {/* Left */}
      <div className="flex flex-col items-center gap-6">
        <img
          src={personal.avatar}
          alt={personal.name}
          className="w-40 h-40 rounded-2xl object-cover ring-2 ring-[#0078D4]/40"
        />
        <div className="grid grid-cols-3 gap-3 w-full">
          {statItems.map(s => (
            <div
              key={s.label}
              className="backdrop-blur-md bg-white/[0.07] border border-white/15 rounded-xl p-3 text-center"
            >
              <div className="text-2xl font-bold text-[#0078D4]">{s.value}+</div>
              <div className="text-xs text-white/50 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Right */}
      <div className="flex flex-col justify-center gap-4">
        <h2 className="text-3xl font-bold text-white">About <span className="text-[#0078D4]">Me</span></h2>
        <p className="text-white/70 leading-relaxed text-sm md:text-base">{personal.bio}</p>
      </div>
    </motion.div>
  );
}
