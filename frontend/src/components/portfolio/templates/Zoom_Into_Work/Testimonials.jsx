import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { SectionHeading } from './Shared';
import data from '../../../../data/dummy_data.json';

export default function Testimonials() {
  return (
    <section className="py-24 bg-zinc-950 px-4 relative z-10 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        <SectionHeading icon={Quote}>Testimonials</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.testimonials.map((test, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02, rotateZ: i % 2 === 0 ? 1 : -1 }}
              className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800/80 relative group hover:border-indigo-500/40 transition-all duration-300 shadow-lg cursor-default"
            >
              <Quote className="absolute top-6 right-6 text-zinc-800 group-hover:text-indigo-500/30 transition-colors duration-500" size={48} />
              <p className="text-zinc-300 text-lg italic mb-8 relative z-10">"{test.text}"</p>
              <div className="flex items-center gap-4 relative z-10">
                <img src={test.avatar} alt={test.name || "Profile Avatar"} className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700" />
                <div>
                  <h4 className="text-white font-bold">{test.name}</h4>
                  <p className="text-sm text-zinc-500">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
