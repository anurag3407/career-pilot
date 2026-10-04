import React from 'react';
import { motion } from 'framer-motion';
import data from '../../../../data/dummy_data.json';

export default function Skills() {
  return (
    <section className="py-24 px-6 md:px-16 bg-stone-200/40">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-light mb-14 text-center">
          Skills
        </h2>

        <div className="space-y-8">
          {data.skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-between mb-2">
                <span>{skill.name}</span>
                <span className="text-stone-500">
                  {skill.level}%
                </span>
              </div>

              <div className="w-full bg-stone-300 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-stone-700 h-2 rounded-full"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}