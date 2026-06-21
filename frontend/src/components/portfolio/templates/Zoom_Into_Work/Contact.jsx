import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Zap, Code2 } from 'lucide-react';
import { SectionHeading } from './Shared';
import data from '../../../../data/dummy_data.json';

export default function Contact() {
  return (
    <footer className="bg-zinc-950 pt-24 pb-12 px-4 border-t border-zinc-900 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        
        <SectionHeading icon={Mail}>Contact</SectionHeading>

        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-12 rounded-[3rem] border border-zinc-800 shadow-2xl mb-16 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 relative z-10">Let's Build Together</h2>
          <p className="text-zinc-400 mb-10 max-w-xl mx-auto text-lg relative z-10">
            Currently available for freelance projects and open to new opportunities. Let's create something out of this world.
          </p>
          <motion.a 
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -5, 5, -5, 0],
              transition: { rotate: { repeat: Infinity, duration: 0.4 } }
            }}
            href={`mailto:${data.socials.email}`}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-zinc-950 font-bold text-lg rounded-full hover:bg-cyan-400 transition-colors duration-300 relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)]"
          >
            <Zap size={20} className="fill-current" />
            Get In Touch
          </motion.a>
        </motion.div>
        
        <p className="text-zinc-600 flex items-center justify-center gap-2 font-medium">
          Designed with <Code2 size={16} className="text-cyan-500" /> & framer-motion by {data.personal.name}
        </p>
      </div>
    </footer>
  );
}
