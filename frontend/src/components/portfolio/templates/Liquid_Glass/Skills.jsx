import React from "react";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] ${className}`}
  >
    {children}
  </div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Skills({ data }) {
  const categories = [...new Set(data.skills.map((s) => s.category))];

  return (
    <section className="relative px-6 py-20 text-left">
      <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none" />
      <motion.div
        className="max-w-5xl mx-auto"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
          <Code2 size={20} className="text-cyan-400" />
          <h2 className="text-3xl font-black text-white">Skills</h2>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <GlassCard key={cat} className="p-5">
              <h3 className="text-white/50 text-xs uppercase tracking-widest mb-4">{cat}</h3>
              <div className="space-y-3">
                {data.skills
                  .filter((s) => s.category === cat)
                  .map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">{skill.name}</span>
                        <span className="text-cyan-400">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
