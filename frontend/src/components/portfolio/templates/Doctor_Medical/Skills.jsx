import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

function SkillBar({ name, level, delay, inView }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-slate-700">{name}</span>
        <span className="text-xs font-bold text-blue-600">{level}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-400"
        />
      </div>
    </div>
  );
}

export default function Skills({ data }) {
  const { skills } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const grouped = skills?.reduce((acc, skill) => {
    const cat = skill.category ?? "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const categories = Object.entries(grouped ?? {});

  return (
    <section id="skills" ref={ref} className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase block mb-3">Expertise</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Clinical Skills & Competencies
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto text-base">A comprehensive overview of medical proficiencies developed through years of dedicated practice and continuous education.</p>
        </motion.div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {categories.map(([category, catSkills], ci) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: ci * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-2 h-8 rounded-full bg-gradient-to-b from-blue-500 to-teal-400" />
                  <h3 className="text-lg font-bold text-slate-800">{category}</h3>
                </div>
                <div className="space-y-5">
                  {catSkills.map((skill, si) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level ?? skill.proficiency ?? 80}
                      delay={ci * 0.1 + si * 0.08}
                      inView={inView}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {(skills ?? []).map((skill, si) => (
              <motion.div
                key={skill.name ?? si}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: si * 0.06 }}
              >
                <SkillBar
                  name={skill.name}
                  level={skill.level ?? skill.proficiency ?? 80}
                  delay={si * 0.06}
                  inView={inView}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}