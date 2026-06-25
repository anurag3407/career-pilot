// frontend/src/components/portfolio/templates/Elevator_Pitch/Contact.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ShieldAlert } from 'lucide-react';

export const Contact = ({ email }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 max-w-2xl mx-auto px-4">
      
      <motion.div 
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="text-emerald-500 mb-4 opacity-80"
      >
        <ShieldAlert size={48} strokeWidth={1.5} />
      </motion.div>

      <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Contact Me</h2>
      <p className="text-lg md:text-xl text-zinc-400 font-mono">
        System reached terminal floor. Initiate manual contact sequence below.
      </p>
      
      <motion.a 
        href={`mailto:${email}`}
        whileHover={{ scale: 0.95 }}
        whileTap={{ scale: 0.9 }}
        className="mt-8 md:mt-12 relative group flex items-center justify-center"
      >
        {/* Glowing aura behind button */}
        <div className="absolute -inset-4 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Actual Mechanical Button */}
        <div className="relative z-10 flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-zinc-900 border-2 border-zinc-700 text-zinc-300 font-bold font-mono tracking-widest rounded-full transition-all duration-300 group-hover:bg-emerald-500 group-hover:border-emerald-400 group-hover:text-black group-hover:shadow-[inset_0_5px_15px_rgba(255,255,255,0.4)]">
          <Mail size={20} className="group-hover:animate-bounce" />
          INITIATE CONTACT
        </div>
      </motion.a>
    </div>
  );
};