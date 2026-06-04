import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase } from 'lucide-react';

export default function Experience({ data, isMaximized }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <h2 className={`font-bold text-white text-center ${isMaximized ? 'text-4xl mb-12' : 'text-2xl md:text-3xl mb-8'}`}>
        Work <span className="text-[#0078D4]">Experience</span>
      </h2>
      <div className="relative">
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10" />
        <div className={`flex flex-col ${isMaximized ? 'gap-10' : 'gap-6'}`}>
          {(data.experience ?? []).map((exp, i) => (
            <div
              key={i}
              className={`relative flex md:items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col gap-4`}
            >
              <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0078D4] ring-4 ring-[#0078D4]/20 z-10" />
              <div className="hidden md:block flex-1" />
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`flex-1 backdrop-blur-xl bg-white/[0.07] border border-white/15 rounded-xl ${isMaximized ? 'p-6' : 'p-4'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#0078D4]/20 rounded-lg mt-0.5 shrink-0">
                    <Briefcase size={14} className="text-[#0078D4]" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-white ${isMaximized ? 'text-base md:text-lg' : 'text-sm'}`}>{exp?.role}</h3>
                    <p className={`text-[#0078D4] ${isMaximized ? 'text-sm' : 'text-xs'}`}>{exp?.company}</p>
                    <p className={`text-white/40 mt-0.5 ${isMaximized ? 'text-sm' : 'text-xs'}`}>{exp?.period}</p>
                    <p className={`text-white/60 mt-2 leading-relaxed ${isMaximized ? 'text-base' : 'text-sm'}`}>{exp?.description}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
