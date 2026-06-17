import React from 'react';
import { Phone, Copy, Linkedin, Github, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ data, theme }) => {
  const { personalInfo, contactInfo } = data || {};
  const socials = data?.socials || data?.socialLinks || {};

  // Typewriter animation variants
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { delay: 0.2, staggerChildren: 0.015 }
    }
  };
  const letter = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  const bioText = personalInfo?.summary || 'A dedicated Developer specializing in crafting robust, high-performance applications. With proven experience in backend architectures and modern frameworks, I focus on transforming complex business requirements into clean, scalable solutions.';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-[32px] p-6 shadow-2xl flex flex-col items-center sm:items-start text-center sm:text-left font-sans" 
      style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}
    >
      
      {/* Profile Image Wrapper */}
      <div className="w-full h-64 md:h-72 lg:h-64 rounded-2xl overflow-hidden mb-8 relative group">
        <img 
          src={personalInfo?.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"} 
          alt={personalInfo?.name || "Dev Patel"} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight mb-4 flex items-center justify-center sm:justify-start gap-2 text-white">
        {personalInfo?.name || 'Dev Patel'}
      </h1>
      
      <motion.p 
        className="text-base leading-relaxed mb-8 font-medium" 
        style={{ color: theme.textMuted }}
        variants={sentence}
        initial="hidden"
        animate="visible"
      >
        {bioText.split("").map((char, index) => (
          <motion.span key={char + "-" + index} variants={letter}>
            {char}
          </motion.span>
        ))}
      </motion.p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row w-full gap-4 mb-10">
        <a 
          href={`tel:${contactInfo?.phone || ''}`}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: theme.accent, color: '#fff' }}
        >
          <Phone size={18} />
          Let's Talk
        </a>
        <a 
          href={`mailto:${contactInfo?.email || ''}`}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-colors hover:bg-white/5"
          style={{ border: `1px solid ${theme.border}`, color: theme.textMain }}
        >
          <Copy size={18} />
          Email Me
        </a>
      </div>

      {/* Social Links - Dark Mode Sleek Icons */}
      <div className="flex gap-3 justify-center sm:justify-start w-full">
        <a href={socials?.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl transition-all hover:bg-[#1E2330] hover:-translate-y-1" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
          <Linkedin size={22} className="text-slate-400 hover:text-blue-500 transition-colors" />
        </a>
        <a href={socials?.github || "#"} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl transition-all hover:bg-[#1E2330] hover:-translate-y-1" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
          <Github size={22} className="text-slate-400 hover:text-white transition-colors" />
        </a>
        <a href={socials?.leetcode || "#"} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl transition-all hover:bg-[#1E2330] hover:-translate-y-1" style={{ backgroundColor: '#0E1018', border: `1px solid ${theme.border}` }}>
          {/* Custom SVG for LeetCode since lucide-react doesn't have it */}
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" className="text-slate-400 hover:text-[#FFA116] transition-colors">
            <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.606-2.696c-1.087-1.087-2.553-1.631-4.04-1.631-1.488 0-2.954.544-4.041 1.631l-4.318 4.38c-1.087 1.087-1.631 2.553-1.631 4.04 0 1.487.544 2.953 1.631 4.04l4.332 4.363c1.087 1.087 2.553 1.631 4.041 1.631 1.487 0 2.953-.544 4.04-1.631l2.697-2.607c.514-.514.496-1.365-.039-1.9-.535-.535-1.386-.553-1.9-.039zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z"/>
          </svg>
        </a>
      </div>
    </motion.div>
  );
};

export default Sidebar;
