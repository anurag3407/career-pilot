import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function Testimonials({ data }) {
  // If testimonials aren't in data, provide some elegant artistic placeholders
  const testimonials = data?.testimonials || [
    {
      name: "Alex Rivera",
      role: "Creative Director",
      text: "A visionary who treats every line of code like a brushstroke. The attention to detail is truly unparalleled.",
    },
    {
      name: "Samantha Lee",
      role: "Lead Designer",
      text: "Bridging the gap between pure artistic expression and highly functional interfaces. A rare talent.",
    }
  ];

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="relative w-full py-24 overflow-hidden bg-gradient-to-br from-indigo-50/50 to-pink-50/50">
      {/* Decorative SVG shapes */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3">
        <svg width="800" height="800" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#8A2BE2" d="M42.7,-73.4C55.9,-65.8,67.5,-55,75.1,-41.8C82.7,-28.6,86.2,-13,84.6,2C82.9,16.9,76,31.2,66.1,43C56.2,54.8,43.3,64.1,28.7,71.2C14.1,78.3,-2.2,83.2,-17.7,79.9C-33.1,76.5,-47.8,65,-60.1,51.5C-72.3,38,-82.1,22.6,-85.7,5.6C-89.3,-11.4,-86.7,-30,-77.3,-45C-67.9,-60,-51.7,-71.4,-35.8,-77.8C-19.9,-84.2,-4.3,-85.6,9.8,-81.1C24,-76.6,38,-66.2,42.7,-73.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-serif italic text-indigo-900 mb-4">
            Echoes.
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-pink-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {testimonials.map((testi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative p-10 bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white shadow-lg"
              style={{
                borderRadius: index % 2 === 0 ? '40px 10px 40px 10px' : '10px 40px 10px 40px'
              }}
            >
              <Quote className="absolute top-6 right-8 text-indigo-200 w-16 h-16 -z-10" />
              <p className="text-xl text-gray-700 font-light leading-relaxed mb-8 italic">
                "{testi.text}"
              </p>
              <div>
                <h4 className="text-lg font-bold text-gray-900">{testi.name}</h4>
                <p className="text-sm text-indigo-500 uppercase tracking-widest mt-1">{testi.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
