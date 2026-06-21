import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { AnimatedHeading } from './Shared';
import data from '../../../../data/dummy_data.json';

const Testimonials = () => (
  <section className="py-24 relative z-10 px-6 max-w-6xl mx-auto">
    <AnimatedHeading>Testimonials</AnimatedHeading>
    <div className="grid md:grid-cols-2 gap-8">
      {data.testimonials.map((test, i) => (
        <motion.div
          key={i}
          className="bg-white/5 backdrop-blur-lg border-l-4 border-l-cyan-400 border-y border-y-white/10 border-r border-r-white/10 rounded-r-3xl p-8 relative"
          whileHover={{ 
            scale: 1.03,
            borderLeftWidth: "12px",
            backgroundColor: "rgba(255,255,255,0.1)"
          }}
        >
          <Quote size={40} className="text-white/10 absolute top-4 right-4" />
          <p className="text-slate-200 text-lg italic mb-6 relative z-10">"{test.text}"</p>
          <div className="flex items-center gap-4">
            <img src={test.avatar} alt={test.name || "Profile Avatar"} className="w-14 h-14 rounded-full border-2 border-cyan-400/50 object-cover" />
            <div>
              <h4 className="text-white font-bold">{test.name}</h4>
              <p className="text-cyan-400 text-sm">{test.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Testimonials;