import React from 'react';
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';
import { AnimatedHeading, GlassCard } from './Shared';
import data from '../../../../data/dummy_data.json';

const Skills = () => (
  <section className="py-24 relative z-10 px-6 max-w-6xl mx-auto">
    <AnimatedHeading>Skills</AnimatedHeading>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {['Frontend', 'Backend', 'Tools'].map((category, idx) => (
        <GlassCard key={idx} className="flex flex-col gap-6">
          <div className="flex items-center gap-3 text-white">
            <Wrench size={24} className="text-purple-400" />
            <h3 className="text-xl font-bold">{category}</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {data.skills
              .filter(s => s.category === category || (category === 'Tools' && !['Frontend', 'Backend'].includes(s.category)))
              .map((skill, i) => (
              <motion.div
                key={i}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-200 text-sm font-medium cursor-pointer"
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: "rgba(192, 132, 252, 0.2)",
                  borderColor: "rgba(192, 132, 252, 0.5)",
                  color: "#fff"
                }}
              >
                {skill.name}
              </motion.div>
            ))}
          </div>
        </GlassCard>
      ))}
    </div>
  </section>
);

export default Skills;