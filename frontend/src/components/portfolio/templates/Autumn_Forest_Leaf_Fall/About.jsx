import React from 'react';
import { motion } from 'framer-motion';

export default function About({ data }) {
  const { personal } = data;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-stone-800/40 backdrop-blur-md border border-amber-900/30 p-8 md:p-12 rounded-2xl shadow-xl">
        <h3 className="text-3xl font-bold mb-6 text-orange-200 border-b border-orange-900/50 pb-4 inline-block">
          About Me
        </h3>
        <div className="prose prose-invert prose-stone max-w-none">
          <p className="text-stone-300 text-lg leading-relaxed whitespace-pre-wrap">
            {personal.bio}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
