import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { fadeUp } from './shared';

const Contact = ({ socials }) => (
  <section className="relative mt-20 overflow-hidden border-t border-gray-900 py-32">
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative z-10 text-center">
      <h2 className="mb-6 text-5xl font-black tracking-tighter text-white md:text-7xl">
        INITIATE <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">HANDSHAKE</span>
      </h2>
      <p className="mx-auto mb-12 max-w-xl text-lg font-light text-gray-400 md:text-xl">
        Currently open for new opportunities. Whether you have a question or just want to say hi, my inbox is always open.
      </p>

      <motion.a
        href={`mailto:${socials.email}`}
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-3 border border-cyan-400 bg-black px-8 py-4 font-mono text-sm uppercase tracking-widest text-cyan-400 transition-all duration-300 hover:bg-cyan-400 hover:text-black"
      >
        <Mail size={18} />
        Ping User
      </motion.a>
    </motion.div>
  </section>
);

export default Contact;