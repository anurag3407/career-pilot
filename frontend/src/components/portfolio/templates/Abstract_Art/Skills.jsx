import React from 'react';
import { motion } from 'framer-motion';

export default function Skills({ data }) {
  const skills = data?.skills || [];

  return (
    <section className="relative w-full py-24 overflow-hidden bg-[#faf8f5]">
      {/* Abstract blobs */}
      <div className="absolute top-1/4 right-0 w-[40rem] h-[40rem] bg-amber-200/40 rounded-full blur-[150px] -z-10 mix-blend-multiply" />
      <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-blue-200/40 rounded-[40%_60%_70%_30%] blur-[120px] -z-10 mix-blend-multiply" />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-800 mb-6">
            My <span className="italic font-serif text-amber-600">Palette</span>.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Tools, technologies, and concepts that shape my digital canvas.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {skills.map((skill, index) => {
            // Give them slightly different sizes/rotations for an artistic asymmetrical look
            const rotation = index % 2 === 0 ? "rotate-[-2deg]" : "rotate-[2deg]";
            const translateY = index % 3 === 0 ? "translate-y-2" : "translate-y-0";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.1, rotate: 0 }}
                className={`px-6 py-4 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 cursor-pointer ${rotation} ${translateY} hover:shadow-xl transition-all duration-300 hover:z-10`}
              >
                <span className="text-lg md:text-xl font-medium text-gray-700 tracking-wide">
                  {skill}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
