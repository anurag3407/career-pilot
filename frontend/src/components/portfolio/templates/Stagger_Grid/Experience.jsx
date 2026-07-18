import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { AnimatedHeading } from './AnimatedHeading';

export const Experience = () => {
  return (
    <section className="py-24 px-6 bg-zinc-50 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <AnimatedHeading text="Experience" />
        <div className="space-y-8">
          {data.experience.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: -30 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }} // Strict trigger
              transition={{ type: "spring", stiffness: 120, damping: 15, delay: index * 0.2 }}
              whileHover={{ x: 15, scale: 1.02, backgroundColor: "#ffffff", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)", borderColor: "#e5e7eb", transition: { type: "spring", stiffness: 300, damping: 15 } }}
              className="p-8 md:p-10 rounded-3xl border border-transparent transition-colors duration-300 relative group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900">{job.role}</h3>
                  <div className="flex items-center gap-2 text-indigo-600 font-medium mt-1">
                    <Briefcase size={18} />
                    <span>{job.company}</span>
                  </div>
                </div>
                <div className="inline-block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold whitespace-nowrap">
                  {job.period}
                </div>
              </div>
              <p className="text-zinc-600 leading-relaxed mt-4">{job.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};