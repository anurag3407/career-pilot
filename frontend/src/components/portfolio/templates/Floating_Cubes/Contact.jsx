import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ExternalLink } from 'lucide-react';
import { AnimatedHeading, GlassCard } from './Shared';
import data from '../../../../data/dummy_data.json';

const Contact = () => (
  <section className="py-24 relative z-10 px-6 max-w-3xl mx-auto text-center pb-32">
    <AnimatedHeading>Contact</AnimatedHeading>
    <GlassCard className="!p-12">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-purple-500/30"
      >
        <Mail size={32} className="text-white" />
      </motion.div>
      <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Let's build something.</h2>
      <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto">
        I'm currently available for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
      </p>
      <motion.a
        href={`mailto:${data.socials.email}`}
        className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg"
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 0 40px rgba(255,255,255,0.4)",
          paddingLeft: "2.5rem",
          paddingRight: "2.5rem"
        }}
        whileTap={{ scale: 0.95 }}
      >
        Say Hello <ExternalLink size={20} />
      </motion.a>
    </GlassCard>
  </section>
);

export default Contact;