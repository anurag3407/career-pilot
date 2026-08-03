import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import CanvasCard from "./CanvasCard";

export default function Skills({ data }) {
  const skills = Array.isArray(data?.skills)
    ? data.skills
    : [];

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill?.category || "General";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push({
      name: skill?.name || "Unknown Skill",
      level: skill?.level ?? 75,
    });

    return acc;
  }, {});

  return (
    <CanvasCard delay={0.2}>
      <div className="flex items-center gap-3 mb-6">
        <BrainCircuit
          size={22}
          className="text-purple-400"
        />
        <h2 className="text-3xl font-bold">
          Skills
        </h2>
      </div>

      {skills.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
          <p className="text-gray-400">
            No skills available.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSkills).map(
            ([category, categorySkills]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm uppercase tracking-[0.25em] text-gray-400">
                    {category}
                  </h3>

                  <span className="text-xs text-gray-500">
                    {categorySkills.length} Skills
                  </span>
                </div>

                <div className="space-y-4">
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={`${category}-${skill.name}-${index}`}
                      initial={{
                        opacity: 0,
                        x: 25,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.5,
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          {skill.name}
                        </span>

                        <span className="text-sm text-gray-400">
                          {skill.level}%
                        </span>
                      </div>

                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          whileInView={{
                            width: `${Math.min(
                              Math.max(skill.level, 0),
                              100
                            )}%`,
                          }}
                          viewport={{
                            once: true,
                          }}
                          transition={{
                            duration: 1,
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-purple-500"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          )}

          <div className="pt-6 border-t border-white/10">
            <h4 className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-4">
              Quick Overview
            </h4>

            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 12).map((skill, index) => (
                <span
                  key={`${skill?.name || "skill"}-${index}`}
                  className="px-3 py-1.5 rounded-full text-sm bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                >
                  {skill?.name || "Skill"}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </CanvasCard>
  );
}