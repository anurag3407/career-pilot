import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import data from "../../../../data/dummy_data.json";
import SectionHeading from "./SectionHeading";

const SEC = "relative z-10 py-24 px-4";

export default function Skills() {
  const { skills } = data;
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className={SEC}>
      <div className="max-w-5xl mx-auto">
        <SectionHeading>Skills</SectionHeading>
        <div ref={ref} className="grid md:grid-cols-2 gap-5">
          {(skills || []).map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{
                scale: 1.02,
                borderColor: "rgba(99,102,241,0.35)",
                boxShadow: "0 10px 30px -15px rgba(99,102,241,0.3)",
              }}
              className="relative p-5 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden group cursor-default"
            >
              {/* Pulse ring on hover */}
              <div className="absolute -right-10 -bottom-10 w-24 h-24 rounded-full border border-indigo-500/0 group-hover:border-indigo-500/25 group-hover:scale-150 transition-all duration-500 pointer-events-none" />

              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 group-hover:scale-150 transition-transform duration-300" />
                  <span className="font-bold text-white tracking-wide">{skill.name}</span>
                </div>
                {skill.category && (
                  <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-400 border border-white/5 font-mono uppercase tracking-wider">
                    {skill.category}
                  </span>
                )}
              </div>

              <div className="w-full h-2 bg-slate-950/80 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level || 85}%` } : {}}
                  transition={{ duration: 1, delay: 0.2 + i * 0.04 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}