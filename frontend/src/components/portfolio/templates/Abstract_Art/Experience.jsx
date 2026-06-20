import React from 'react';
import { motion } from 'framer-motion';

export default function Experience({ data }) {
  const experiences = data?.experience || [];

  return (
    <section className="relative w-full py-24 overflow-hidden bg-white/40 backdrop-blur-3xl">
      {/* Decorative abstract elements */}
      <div className="absolute top-0 left-[-10%] w-96 h-96 bg-purple-300/30 rounded-full blur-[100px] -z-10 mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-pink-300/30 rounded-full blur-[120px] -z-10 mix-blend-multiply" />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center md:text-left"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-4">
            Journey.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl">
            A timeline of my professional evolution, painted with code and creativity.
          </p>
        </motion.div>

        <div className="relative border-l border-pink-200 ml-4 md:ml-0 md:space-y-24 space-y-16">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="relative pl-8 md:pl-16 group"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[5px] top-2 w-3 h-3 rounded-full bg-pink-400 ring-4 ring-pink-100 group-hover:bg-purple-500 group-hover:scale-150 transition-all duration-300" />
              
              <div className="grid md:grid-cols-[1fr_2fr] gap-6 md:gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{exp.role}</h3>
                  <p className="text-lg text-purple-600 mt-1 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-500 mt-2 italic">{exp.duration}</p>
                </div>
                
                <div className="bg-white/60 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 backdrop-blur-sm group-hover:-translate-y-2 transition-transform duration-500">
                  <p className="text-gray-700 leading-relaxed font-light">
                    {exp.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
