import React from "react";
import { motion } from "framer-motion";

const Stats = ({ data }) => {
  const { stats } = data;

  const statItems = [
    {
      label: "Years Experience",
      value: stats.yearsExperience,
    },
    {
      label: "Projects Completed",
      value: stats.projectsCompleted,
    },
    {
      label: "Collaborations",
      value: stats.happyClients,
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="border border-stone-800 rounded-3xl p-10 bg-stone-900/40 backdrop-blur-sm"
            >
              <h3 className="text-5xl font-serif text-amber-200 mb-4">
                {item.value}+
              </h3>

              <p className="uppercase tracking-[0.2em] text-sm text-stone-400">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;