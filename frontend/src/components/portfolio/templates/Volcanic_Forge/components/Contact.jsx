import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ChevronRight } from 'lucide-react';
import LavaAnimate from '../LavaAnimate';

export default function Contact({ email, location }) {
  return (
    <section className="py-24 w-full relative z-10 border-t border-stone-800/50 mt-12 flex justify-center">
      <LavaAnimate className="flex! w-full justify-center" particleCount={70} formedDelay={1700} meltAmount={3}>
        <div className="max-w-3xl mx-auto text-center w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px' }} transition={{ duration: 0.6, delay: 0 }} className="mb-8 inline-block p-4 bg-stone-900/50 rounded-full text-orange-500">
            <Mail size={32} />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px' }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl md:text-6xl font-black text-white mb-6">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Ignite</span> a Project?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px' }} transition={{ duration: 0.6, delay: 0.2 }} className="text-xl text-stone-400 mb-10">
            Currently based in {location}. Always open to discussing new opportunities, collaborations, or tech architectures.
          </motion.p>
          <motion.a initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px' }} transition={{ duration: 0.6, delay: 0.3 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href={`mailto:${email}`} className="inline-flex items-center gap-3 px-8 py-4 bg-stone-100 text-stone-950 font-bold rounded-lg uppercase tracking-widest transition-all hover:bg-white">
            Send a Message <ChevronRight size={20} className="text-orange-600" />
          </motion.a>
        </div>
      </LavaAnimate>
    </section>
  );
}