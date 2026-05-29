import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 md:px-16 text-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        <div className="mb-10 flex justify-center">
          <img
            src={data.personal.avatar}
            alt={data.personal.name}
            className="w-36 h-36 rounded-full object-cover border-4 border-stone-300 shadow-md"
          />
        </div>

        <p className="uppercase tracking-[0.3em] text-stone-500 text-sm mb-4">
          Japanese Zen Portfolio
        </p>

        <h1 className="text-5xl md:text-7xl font-light tracking-wide leading-tight mb-6">
          {data.personal.name}
        </h1>

        <p className="text-xl md:text-2xl text-stone-600 font-light mb-8">
          {data.personal.title}
        </p>

        <p className="max-w-2xl mx-auto text-stone-600 leading-relaxed text-lg mb-10">
          {data.personal.bio}
        </p>

        <div className="flex justify-center gap-5 flex-wrap">
          <a
            href={data.socials.github}
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-full border border-stone-400 hover:bg-stone-200 transition-all duration-300"
          >
            <Github size={20} />
          </a>

          <a
            href={data.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-full border border-stone-400 hover:bg-stone-200 transition-all duration-300"
          >
            <Linkedin size={20} />
          </a>

          <a
            href={`mailto:${data.socials.email}`}
            className="p-3 rounded-full border border-stone-400 hover:bg-stone-200 transition-all duration-300"
          >
            <Mail size={20} />
          </a>
        </div>
      </motion.div>
    </section>
  );
}