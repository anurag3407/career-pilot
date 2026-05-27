import { motion } from "framer-motion";

const CATEGORY_COLORS = {
  Frontend: { bg: "bg-[#E50914]/15", border: "border-[#E50914]/40", text: "text-[#E50914]" },
  Backend: { bg: "bg-blue-500/10", border: "border-blue-500/40", text: "text-blue-400" },
  DevOps: { bg: "bg-emerald-500/10", border: "border-emerald-500/40", text: "text-emerald-400" },
  Design: { bg: "bg-purple-500/10", border: "border-purple-500/40", text: "text-purple-400" },
};

export default function Skills({ skills }) {
  // Group by category
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-10 px-4 md:px-12">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-white text-xl md:text-2xl font-bold tracking-wide mb-8"
      >
        ⚡ Skills & Expertise
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(grouped).map(([category, items], ci) => {
          const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.Frontend;
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#1f1f1f] rounded-xl p-5 border border-white/5"
            >
              {/* Category label */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded border ${color.bg} ${color.border} ${color.text}`}
                >
                  {category}
                </span>
              </div>

              {/* Skill bars */}
              <div className="space-y-3">
                {items.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: ci * 0.1 + i * 0.06, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[#e5e5e5] text-sm font-medium">{skill.name}</span>
                      <span className={`text-xs font-bold ${color.text}`}>{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-[#333] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ delay: ci * 0.1 + i * 0.06 + 0.2, duration: 0.7, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="h-full rounded-full"
                        style={{
                          background:
                            category === "Frontend"
                              ? "linear-gradient(90deg, #E50914, #ff6b6b)"
                              : category === "Backend"
                              ? "linear-gradient(90deg, #3b82f6, #60a5fa)"
                              : category === "DevOps"
                              ? "linear-gradient(90deg, #10b981, #34d399)"
                              : "linear-gradient(90deg, #8b5cf6, #a78bfa)",
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
