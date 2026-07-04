import React from 'react';
import { motion } from 'framer-motion';

export default function Contact({ personal, socials }) {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="max-w-4xl mx-auto text-center border-t border-amber-900/30 pt-16 pb-8"
    >
      <h3 className="text-3xl font-bold mb-6 text-orange-200">
        Let's Connect
      </h3>
      <p className="text-stone-400 mb-8 max-w-lg mx-auto">
        Feel free to reach out for collaborations or just a friendly hello.
      </p>

      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {socials?.email && (
          <a 
            href={`mailto:${socials.email}`}
            className="text-stone-300 hover:text-orange-400 transition-colors flex items-center gap-2"
          >
            Email
          </a>
        )}
        {socials?.github && (
          <a 
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-300 hover:text-orange-400 transition-colors flex items-center gap-2"
          >
            GitHub
          </a>
        )}
        {socials?.linkedin && (
          <a 
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-300 hover:text-orange-400 transition-colors flex items-center gap-2"
          >
            LinkedIn
          </a>
        )}
        {socials?.twitter && (
          <a 
            href={socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-300 hover:text-orange-400 transition-colors flex items-center gap-2"
          >
            Twitter
          </a>
        )}
      </div>

      <p className="text-stone-500 text-sm">
        &copy; {new Date().getFullYear()} {personal?.name}. Designed with Autumn Vibes.
      </p>
    </motion.section>
  );
}
