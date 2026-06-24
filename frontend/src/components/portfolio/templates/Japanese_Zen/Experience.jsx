import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Experience() {
  return (
    <section className="py-24 px-6 md:px-16 bg-stone-200/40">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-light mb-14 text-center">
          Experience
        </h2>

        <div className="space-y-10">
          {data.experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="border-l-2 border-stone-400 pl-8 relative"
            >
              <div className="absolute -left-[10px] top-2 w-4 h-4 bg-stone-700 rounded-full" />

              <div className="flex items-center gap-3 mb-2">
                <Briefcase size={18} />

                <h3 className="text-2xl font-medium">
                  {exp.role}
                </h3>
              </div>

              <p className="text-stone-500 mb-3">
                {exp.company} • {exp.period}
              </p>

              <p className="text-stone-600 leading-relaxed">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}