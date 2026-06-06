import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

const Contact = ({ data }) => (
  <section id="contact" className="scroll-mt-32 relative z-10 mt-28 md:mt-40 pb-20 md:pb-32">
    <div className="max-w-4xl mx-auto bg-[#ff5e57] p-8 sm:p-12 md:p-20 rounded-[3rem] md:rounded-[4rem] border-4 border-[#2b1318] shadow-[12px_12px_0px_0px_#2b1318] md:shadow-[20px_20px_0px_0px_#2b1318] text-center relative overflow-hidden" style={{ filter: 'url(#lava-goo)' }}>
      <motion.div animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute -top-10 -left-10 md:-top-20 md:-left-20 w-48 h-48 md:w-64 md:h-64 bg-[#f28e2b] rounded-full mix-blend-screen will-change-transform" />
      <motion.div animate={{ x: [0, -50, 0], y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity }} className="absolute -bottom-10 -right-10 md:-bottom-20 md:-right-20 w-64 h-64 md:w-80 md:h-80 bg-[#e15f41] rounded-full mix-blend-screen will-change-transform" />

      <div className="relative z-10">
        <h2 className="text-5xl sm:text-6xl md:text-8xl font-black uppercase text-[#fdf3e7] mb-6 md:mb-8 drop-shadow-[4px_4px_0px_#2b1318]">
          Let's Talk
        </h2>
        <p className="text-xl md:text-2xl font-bold font-sans text-[#2b1318] mb-10 md:mb-12 px-4">
          Ready to melt some minds? Drop me a line.
        </p>

        <motion.a 
          href={`mailto:${data.socials.email}`} 
          whileHover={{ scale: 1.05, rotate: -2 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 md:gap-4 bg-[#fdf3e7] text-[#2b1318] px-8 md:px-12 py-4 md:py-6 rounded-full font-black text-2xl md:text-3xl border-4 border-[#2b1318] shadow-[6px_6px_0px_0px_#2b1318] md:shadow-[8px_8px_0px_0px_#2b1318] transition-all uppercase tracking-widest break-words max-w-full will-change-transform"
        >
          <Mail className="w-8 h-8 md:w-10 md:h-10 shrink-0" /> <span className="truncate">Email Me</span>
        </motion.a>

        <div className="flex justify-center gap-6 md:gap-8 mt-12 md:mt-16 flex-wrap px-2">
          {[
            { icon: <Github size={28} className="md:w-8 md:h-8" />, url: data.socials.github },
            { icon: <Linkedin size={28} className="md:w-8 md:h-8" />, url: data.socials.linkedin },
            { icon: <Twitter size={28} className="md:w-8 md:h-8" />, url: data.socials.twitter }
          ].map((social, idx) => (
            social.url && (
              <motion.a 
                key={idx} 
                href={social.url} 
                target="_blank" 
                rel="noreferrer"
                whileHover={{ y: -5, scale: 1.1 }}
                className="bg-[#2b1318] text-[#fdf3e7] p-4 md:p-6 rounded-full border-4 border-[#2b1318] hover:bg-[#f28e2b] hover:text-[#2b1318] shadow-[4px_4px_0px_0px_#2b1318] md:shadow-[6px_6px_0px_0px_#2b1318] will-change-transform"
              >
                {social.icon}
              </motion.a>
            )
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Contact;