import React from 'react';
import { Github, Linkedin, Twitter, Mail, Youtube, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ data }) => {
  const { personal, socials } = data;

  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-full w-full bg-[#1B995E] text-white p-8 md:p-12 flex flex-col items-center md:items-start justify-center md:justify-start relative overflow-hidden"
    >
      <div className="relative z-10 flex flex-col items-center md:items-start w-full mt-4 md:mt-12">
        {/* Avatar */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-40 h-40 md:w-48 md:h-48 rounded-full border-[5px] border-[#FFF000] overflow-hidden mb-6 shadow-lg"
        >
          <img 
            src={personal?.avatar || 'https://via.placeholder.com/150'} 
            alt={personal?.name || 'Profile'} 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Profile Info */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight text-center md:text-left">
          {personal?.name || 'Clyde D\'Souza'}
        </h1>
        <p className="text-lg md:text-xl font-medium mb-3 text-white/95 text-center md:text-left">
          {personal?.title || 'Software Engineer. Digital Content Creator.'}
        </p>
        <p className="text-sm md:text-base text-white/90 mb-8 text-center md:text-left">
          {personal?.location || 'Auckland, New Zealand'}
        </p>

        {/* Social Links */}
        <div className="flex gap-4 mb-12">
          {socials?.linkedin && (
            <motion.a whileHover={{ y: -3 }} href={socials.linkedin} target="_blank" rel="noreferrer" className="text-white hover:text-white/80 transition-colors">
              <Linkedin className="w-6 h-6" fill="currentColor" />
            </motion.a>
          )}
          {socials?.twitter && (
            <motion.a whileHover={{ y: -3 }} href={socials.twitter} target="_blank" rel="noreferrer" className="text-white hover:text-white/80 transition-colors">
              {/* Using standard Twitter icon as fallback for X */}
              <Twitter className="w-6 h-6" fill="currentColor" />
            </motion.a>
          )}
          {socials?.youtube && (
            <motion.a whileHover={{ y: -3 }} href={socials.youtube} target="_blank" rel="noreferrer" className="text-white hover:text-white/80 transition-colors">
              <Youtube className="w-6 h-6" fill="currentColor" />
            </motion.a>
          )}
          {socials?.github && (
            <motion.a whileHover={{ y: -3 }} href={socials.github} target="_blank" rel="noreferrer" className="text-white hover:text-white/80 transition-colors">
              <Github className="w-6 h-6" fill="currentColor" />
            </motion.a>
          )}
          {socials?.email && (
            <motion.a whileHover={{ y: -3 }} href={`mailto:${socials.email}`} className="text-white hover:text-white/80 transition-colors">
              <Mail className="w-6 h-6" fill="currentColor" />
            </motion.a>
          )}
        </div>

        {/* Callout Box */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#2EAD70] rounded-md p-5 w-full shadow-sm cursor-pointer"
        >
          <p className="text-sm font-semibold text-white/95 leading-relaxed">
            Learn about a healthy alternative to binge watching on Netflix.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
