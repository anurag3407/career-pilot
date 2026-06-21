import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { AnimatedHeading } from './AnimatedHeading';

export const Testimonials = () => {
  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <AnimatedHeading text="Testimonials" />
        <div className="grid md:grid-cols-2 gap-8">
          {data.testimonials.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5, y: 80, rotateZ: (index % 2 === 0 ? -10 : 10) }}
              whileInView={{ opacity: 1, scale: 1, y: 0, rotateZ: 0 }}
              viewport={{ once: true, amount: 0.3 }} // Strict trigger
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -10, rotateZ: (index % 2 === 0 ? 2 : -2), boxShadow: "0px 20px 40px rgba(0,0,0,0.1)", transition: { type: "spring", stiffness: 400, damping: 15 } }}
              className="bg-zinc-50 p-8 md:p-10 rounded-3xl relative"
            >
              <Quote className="absolute top-8 right-8 text-zinc-200 w-16 h-16 -z-0" />
              <p className="text-zinc-700 text-lg relative z-10 italic mb-8">"{test.text}"</p>
              <div className="flex items-center gap-4 relative z-10">
                <img src={test.avatar} alt={test.name} className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100" />
                <div>
                  <h4 className="font-bold text-zinc-900">{test.name}</h4>
                  <p className="text-sm text-indigo-600 font-medium">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};