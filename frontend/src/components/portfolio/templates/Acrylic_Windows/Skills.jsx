import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function Skills({ data, isMaximized }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const grouped = (data.skills ?? []).reduce((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <div ref={ref}>
      <h2 className={`font-bold text-white text-center ${isMaximized ? 'text-4xl mb-12' : 'text-2xl md:text-3xl mb-8'}`}>
        My <span className="text-[#0078D4]">Skills</span>
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(grouped).map(([category, skills], i) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`backdrop-blur-xl bg-white/[0.07] border border-white/15 rounded-xl ${isMaximized ? 'p-8' : 'p-5'}`}
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
                  <div className={`bg-white/10 rounded-full overflow-hidden ${isMaximized ? 'h-2.5' : 'h-1.5'}`}>
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
