import React from "react";
import { motion } from "framer-motion";

export default function Skills({ data }) {
  const { skills } = data;
  const skillCategories = [...new Set(skills.map((skill) => skill.category))];

  return (
    <section className="relative z-10 px-6 py-20 text-left">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-rose-800 mb-14">
          Skills
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {skillCategories.map((category) => (
            <motion.div
              key={category}
              whileHover={{ y: -5 }}
              className="bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl"
            >
              <h3 className="text-2xl font-semibold mb-6 text-pink-600">
                {category}
              </h3>

              <div className="space-y-5">
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill) => (
                    <div key={`${skill.category}-${skill.name}`}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-medium">{skill.name}</span>
                        <span className="text-gray-500">{skill.level}%</span>
                      </div>

                      <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
