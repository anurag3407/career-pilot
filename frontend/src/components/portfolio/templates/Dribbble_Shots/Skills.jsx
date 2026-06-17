import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap } from "lucide-react";
import SectionLabel from "./SectionLabel";
import data from "../../../../data/dummy_data.json";

export default function Skills() {
  const { skills } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const categories = [...new Set(skills?.map(s => s.category) || [])];

  return (
    <section id="skills" ref={ref} className="py-28 px-6 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Skills</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-4"
        >
          What I bring <span className="text-[#ea4c89]">to the table</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-[#aaa] text-sm mb-14"
        >
          Tools and technologies I work with daily
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, ci) => {
            const catSkills = skills?.filter(s => s.category === cat) || [];
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: ci * 0.1 }}
                whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(234,76,137,0.08)" }}
                className="bg-white border border-[#f0f0f0] rounded-3xl p-6 transition-all"
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-lg bg-[#ea4c89]/10 flex items-center justify-center">
                    <Zap size={13} className="text-[#ea4c89]" />
                  </div>
                  <span className="text-[#aaa] text-[10px] uppercase tracking-widest font-semibold">{cat}</span>
                </div>

                <div className="space-y-4">
                  {catSkills.map((skill, si) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[#444] text-sm font-medium">{skill.name}</span>
                        <span className="text-[#ea4c89] text-xs font-semibold">{skill.level}%</span>
                      </div>
                      <div className="h-1 bg-[#f5f5f5] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#ea4c89] to-[#ff80b5]"
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{ duration: 1.2, delay: ci * 0.1 + si * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Floating tag cloud */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-2.5 mt-12"
        >
          {skills?.map((skill, i) => (
            <motion.span
              key={skill.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.6 + i * 0.025, type: "spring", stiffness: 250 }}
              whileHover={{ scale: 1.08, color: "#ea4c89", borderColor: "rgba(234,76,137,0.4)" }}
              className="px-3.5 py-1.5 rounded-full border border-[#ebebeb] bg-white text-[#999] text-xs tracking-wide cursor-default transition-all shadow-sm"
            >
              {skill.name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}