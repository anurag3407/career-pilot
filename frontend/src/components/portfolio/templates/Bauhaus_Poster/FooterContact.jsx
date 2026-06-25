import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const FooterContact = () => {
  return (
    <footer className="p-6 md:p-16 bg-black text-white flex flex-col md:flex-row justify-between items-center md:items-stretch gap-8 md:gap-12 relative overflow-hidden">
      <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -left-10 -bottom-10 w-32 h-32 md:-left-20 md:-bottom-20 md:w-64 md:h-64 bg-[#E3000F] rounded-full opacity-50 mix-blend-screen pointer-events-none" />
      <div className="flex-1 text-center md:text-left relative z-10 w-full">
        <h2 className="text-5xl md:text-8xl font-black uppercase mb-6 md:mb-8 text-[#FFD700] leading-none">Let's<br/>Build.</h2>
        <a href={`mailto:${data.socials.email}`} className="bg-[#E3000F] text-white px-6 py-4 md:px-10 md:py-5 border-2 md:border-4 border-white font-black uppercase text-xl md:text-3xl inline-flex items-center justify-center gap-2 md:gap-4 hover:bg-white hover:text-black hover:border-black transition-all transform hover:-translate-y-1 md:hover:-translate-y-2 whitespace-nowrap w-full md:w-auto">
          <Mail className="w-6 h-6 md:w-9 md:h-9" /> Get In Touch
        </a>
      </div>
      <div className="flex flex-row flex-wrap justify-center md:justify-end items-end gap-4 md:gap-6 w-full md:w-auto relative z-10 mt-4 md:mt-0">
        {[{ icon: Github, url: data.socials.github, bg: 'bg-white', text: 'text-black', hover: 'hover:bg-[#E3000F] hover:text-white hover:border-[#E3000F]' }, { icon: Linkedin, url: data.socials.linkedin, bg: 'bg-[#00509E]', text: 'text-white', hover: 'hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700]' }, { icon: Twitter, url: data.socials.twitter, bg: 'bg-[#FFD700]', text: 'text-black', hover: 'hover:bg-white hover:text-black hover:border-white' }].map((social, idx) => {
          const SocialIcon = social.icon;
          return (
            <motion.a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" whileHover={{ y: -5, rotate: 5 }} className={`w-14 h-14 md:w-20 md:h-20 ${social.bg} ${social.text} border-2 md:border-4 border-current flex items-center justify-center transition-colors ${social.hover} shrink-0`}>
              <SocialIcon className="w-6 h-6 md:w-10 md:h-10" />
            </motion.a>
          );
        })}
      </div>
    </footer>
  );
};

export default FooterContact;
