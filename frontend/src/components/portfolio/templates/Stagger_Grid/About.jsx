import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { AnimatedHeading } from './AnimatedHeading';

export const About = () => {
  return (
    <section className="py-24 px-6 bg-zinc-50 overflow-hidden relative">
      <div className="max-w-5xl mx-auto">
        <AnimatedHeading text="About" />
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: 45 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, amount: 0.3 }} // Strict scroll trigger
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="text-lg text-zinc-600 leading-relaxed space-y-6"
          >
            <p>{data.personal.bio}</p>
            <div className="flex items-center gap-2 text-zinc-800 font-semibold mt-4">
              <MapPin className="text-indigo-600" /> 
              <span>{data.personal.location}</span>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(data.stats || {}).map(([key, value], i) => (
              <motion.div
                key={key}
                className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100"
                initial={{ opacity: 0, scale: 0.5, y: 100 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }} // Strict scroll trigger
                transition={{ type: "spring", stiffness: 150, damping: 12, delay: i * 0.15 }}
                whileHover={{ y: -15, scale: 1.05, rotateZ: (i % 2 === 0 ? 3 : -3), borderColor: "#4f46e5", boxShadow: "0 20px 40px -10px rgba(79, 70, 229, 0.15)", transition: { type: "spring", stiffness: 300, damping: 10 } }}
              >
                <h4 className="text-4xl font-black text-indigo-600 mb-2">{value}</h4>
                <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};