import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { SectionWrapper, staggerContainer, textReveal, fadeUp } from './shared';

export default function Contact() {
  return (
    <SectionWrapper title="Contact">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="group flex w-full flex-col items-center gap-4 text-center lg:gap-8"
      >
        <div className="overflow-hidden">
          <motion.h2 variants={textReveal} className="text-4xl font-black leading-none tracking-tighter text-zinc-100 md:text-[8rem]">
            Let's Talk.
          </motion.h2>
        </div>
        <motion.p variants={fadeUp} className="max-w-lg text-xs text-zinc-400 lg:text-lg">
          Currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </motion.p>

        <motion.a
          variants={fadeUp}
          href={`mailto:${data.socials.email}`}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 flex w-max cursor-pointer items-center gap-2 bg-zinc-100 px-5 py-3 text-xs font-bold text-zinc-950 transition-all duration-300 hover:bg-zinc-300 hover:shadow-lg hover:shadow-zinc-950/30 lg:mt-8 lg:gap-3 lg:px-8 lg:py-4 lg:text-xl"
        >
          <Mail size={16} className="lg:h-6 lg:w-6" /> Drop an Email
        </motion.a>

        <motion.div variants={fadeUp} className="mt-6 flex w-full justify-center gap-5 border-t border-zinc-900 pt-6 lg:mt-16 lg:gap-8 lg:pt-16">
          <a href={data.socials.github} className="cursor-pointer text-zinc-500 transition-all duration-300 hover:-translate-y-1 hover:text-zinc-100"><Github size={20} className="lg:h-8 lg:w-8" /></a>
          <a href={data.socials.linkedin} className="cursor-pointer text-zinc-500 transition-all duration-300 hover:-translate-y-1 hover:text-zinc-100"><Linkedin size={20} className="lg:h-8 lg:w-8" /></a>
          <a href={data.socials.twitter} className="cursor-pointer text-zinc-500 transition-all duration-300 hover:-translate-y-1 hover:text-zinc-100"><Twitter size={20} className="lg:h-8 lg:w-8" /></a>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
