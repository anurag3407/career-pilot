import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Social({ data }) {
  return (
    <motion.div 
      initial="initial" 
      animate="animate" 
      variants={fadeInUp} 
      className="bg-stone-800 border-2 border-yellow-600 p-4 md:p-6"
    >
      <h4 className="text-lg font-black text-yellow-600 mb-4 tracking-widest uppercase border-b-2 border-yellow-600 pb-2" style={{ fontFamily: 'Georgia, serif' }}>
        FOLLOW
      </h4>
      <div className="grid grid-cols-4 gap-2">
        {data.socials.github && (
          <a href={data.socials.github} aria-label="GitHub" className="bg-yellow-600 hover:bg-yellow-700 text-black p-3 rounded flex items-center justify-center transition" title="GitHub">
            <Github size={20} />
          </a>
        )}
        {data.socials.linkedin && (
          <a href={data.socials.linkedin} aria-label="LinkedIn" className="bg-yellow-600 hover:bg-yellow-700 text-black p-3 rounded flex items-center justify-center transition" title="LinkedIn">
            <Linkedin size={20} />
          </a>
        )}
        {data.socials.twitter && (
          <a href={data.socials.twitter} aria-label="Twitter" className="bg-yellow-600 hover:bg-yellow-700 text-black p-3 rounded flex items-center justify-center transition" title="Twitter">
            <Twitter size={20} />
          </a>
        )}
        {data.socials.email && (
          <a href={`mailto:${data.socials.email}`} aria-label="Email" className="bg-yellow-600 hover:bg-yellow-700 text-black p-3 rounded flex items-center justify-center transition" title="Email">
            <Mail size={20} />
          </a>
        )}
      </div>
    </motion.div>
  );
}
