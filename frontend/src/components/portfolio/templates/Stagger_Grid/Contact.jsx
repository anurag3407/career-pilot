import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export const Contact = () => {
  return (
    <section className="py-24 px-6 bg-indigo-600 text-white overflow-hidden relative">
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.5, 1], x: [0, -50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2 
          className="text-5xl md:text-7xl font-black mb-8"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }} // Strict trigger
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          Let's Build Something.
        </motion.h2>
        <motion.p 
          className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.3 }}
        >
          Currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </motion.p>
        <motion.a
          href={`mailto:${data.socials.email}`}
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.4 }}
          whileHover={{ scale: 1.15, backgroundColor: "#ffffff", color: "#4f46e5", transition: { type: "spring", stiffness: 500, damping: 10 } }}
          whileTap={{ scale: 0.85, transition: { type: "spring", stiffness: 600, damping: 15 } }}
          className="inline-flex items-center gap-3 px-10 py-5 bg-zinc-900 text-white font-bold text-lg rounded-full"
        >
          <Mail size={24} /> Say Hello
        </motion.a>
      </div>
    </section>
  );
};