import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import CanvasCard from "./CanvasCard";

export default function Skills({ data }) {
  const { skills } = data;

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <div className="absolute top-[650px] right-[5%] md:right-[8%] w-[90%] md:w-[550px]">
      <CanvasCard delay={0.3} rotate={2}>
        <div className="flex items-center gap-3 mb-6">
          <BrainCircuit className="text-purple-400" size={22} />
          <h2 className="text-2xl font-bold">Skills</h2>
        </div>

        <div className="space-y-8">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h3 className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-4">
                {category}
              </h3>

              <div className="space-y-4">
                {categorySkills.map((skill, index) => (
                  <motion.div
                    key={`${skill.name}-${index}`}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                    }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        {skill.name}
                      </span>

                      <span className="text-xs text-gray-400">
                        {skill.level}%
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {skills.slice(0, 10).map((skill) => (
            <span
              key={skill.name}
              className="px-3 py-1 rounded-full text-xs border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </CanvasCard>
    </div>
  );
}