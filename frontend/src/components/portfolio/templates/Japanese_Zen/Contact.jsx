import React from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  Twitter,
} from 'lucide-react';

import data from '../../../../data/dummy_data.json';

export default function Contact() {
  return (
    <section className="py-24 px-6 md:px-16 bg-stone-900 text-stone-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <p className="uppercase tracking-[0.3em] text-stone-400 text-sm mb-4">
          Contact
        </p>

        <h2 className="text-4xl md:text-5xl font-light mb-6">
          Let’s Connect
        </h2>

        <p className="text-stone-300 leading-relaxed max-w-2xl mx-auto mb-10">
          Feel free to reach out for collaborations, creative
          projects, or meaningful conversations.
        </p>

        <a
          href={`mailto:${data.socials.email}`}
          className="inline-flex items-center gap-3 px-8 py-4 border border-stone-500 rounded-full hover:bg-stone-800 transition-all duration-300 mb-12"
        >
          <Mail size={20} />
          {data.socials.email}
        </a>

        <div className="flex justify-center gap-5 flex-wrap">
          <a
            href={data.socials.github}
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-full border border-stone-500 hover:bg-stone-800 transition-all duration-300"
          >
            <Github size={20} />
          </a>

          <a
            href={data.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-full border border-stone-500 hover:bg-stone-800 transition-all duration-300"
          >
            <Linkedin size={20} />
          </a>

          <a
            href={data.socials.twitter}
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-full border border-stone-500 hover:bg-stone-800 transition-all duration-300"
          >
            <Twitter size={20} />
          </a>
        </div>

        <div className="mt-16 text-stone-500 text-sm">
          © {new Date().getFullYear()} {data.personal.name}
        </div>
      </motion.div>
    </section>
  );
}