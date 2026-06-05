import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const Crystal = ({ className, delay = 0, duration = 5, size = 'w-32 h-32', color = 'from-indigo-500/20 via-purple-500/10 to-emerald-500/20' }) => (
  <motion.div
    className={`absolute opacity-40 backdrop-blur-md bg-gradient-to-br ${color} ${size} ${className}`}
    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.1)' }}
    animate={{ y: [0, -30, 0], rotate: [0, 15, -15, 0], scale: [1, 1.05, 1] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

export default function Contact({ socials }) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="relative overflow-hidden py-32 px-6">
      <Crystal className="bottom-0 left-10" size="w-48 h-48" duration={7} delay={1} color="from-purple-500/20 via-pink-500/10 to-indigo-500/10" />
      <Crystal className="top-10 right-20" size="w-32 h-32" duration={5} delay={2} color="from-emerald-500/10 via-indigo-500/10 to-purple-500/10" />

      <motion.div 
        variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
        className="text-center relative z-10"
      >
        <div className="inline-block relative w-full max-w-2xl mx-auto">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-emerald-500 blur-3xl opacity-20 rounded-full"
            animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative bg-slate-900/80 border border-slate-700 backdrop-blur-xl px-8 py-16 md:px-16 md:py-20 rounded-3xl shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Get In Touch</h2>
            <p className="text-slate-400 mb-10 text-lg">
              I'm currently open to new opportunities. Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you!
            </p>
            <a 
              href={`mailto:${socials.email}`} 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
            >
              <Mail size={20} />
              Say Hello
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}