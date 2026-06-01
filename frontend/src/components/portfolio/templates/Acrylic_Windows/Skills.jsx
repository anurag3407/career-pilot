import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function Skills({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const grouped = data.skills.reduce((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <div ref={ref} className="p-6 md:p-8">
      <h2 className="text-3xl font-bold text-white text-center mb-10">
        My <span className="text-[#0078D4]">Skills</span>
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(grouped).map(([category, skills], i) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="backdrop-blur-xl bg-white/[0.07] border border-white/15 rounded-xl p-5"
          >
            <h3 className="text-sm font-semibold text-[#0078D4] uppercase tracking-wider mb-4">
              {category}
            </h3>
            <div className="flex flex-col gap-4">
              {skills.map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm text-white/80 mb-1.5">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#0078D4] to-[#60B8FF] rounded-full"
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
