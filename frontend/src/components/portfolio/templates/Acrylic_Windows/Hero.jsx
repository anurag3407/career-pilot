import { motion } from 'framer-motion';
import { MapPin, Github, Linkedin, Twitter, Mail } from 'lucide-react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };

const SOCIAL_ICONS = { github: Github, linkedin: Linkedin, twitter: Twitter, email: Mail };

export default function Hero({ data, isMaximized }) {
  const { personal, socials } = data;
  
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`flex flex-col items-center text-center min-h-[60vh] ${isMaximized ? 'gap-6 py-16' : 'gap-4 py-8 px-8'}`}
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#0078D4]/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div variants={item} className="relative">
        <img
          src={personal?.avatar}
          alt={personal?.name || 'Profile'}
          onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150'; }}
          className={`rounded-full mx-auto object-cover ring-4 ring-[#0078D4]/60 ${isMaximized ? 'w-40 h-40 ring-offset-4' : 'w-28 h-28 ring-offset-2'}`}
        />
      </motion.div>

      <motion.h1 variants={item} className={`font-bold text-white ${isMaximized ? 'text-5xl' : 'text-3xl md:text-4xl'}`}>
        {personal?.name}
      </motion.h1>
      
      <motion.h2 variants={item} className={`mt-2 text-[#0078D4] font-medium ${isMaximized ? 'text-xl md:text-2xl' : 'text-base md:text-xl'}`}>
        {personal?.title}
      </motion.h2>
      
      <motion.div variants={item} className="mt-3 flex items-center justify-center gap-1.5 text-white/50 text-sm md:text-base">
        <MapPin size={14} />{personal?.location}
      </motion.div>

      <motion.div variants={item} className="mt-6 flex gap-3 justify-center flex-wrap">
        <button className="px-6 py-2.5 bg-[#0078D4] hover:bg-[#1084D8] rounded-xl font-medium transition-colors text-sm">
          View Projects
        </button>
        <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-colors text-sm">
          Contact Me
        </button>
      </motion.div>

      <motion.div variants={item} className="mt-6 flex gap-4 justify-center">
        {Object.entries(socials ?? {}).map(([key, url]) => {
          const Icon = SOCIAL_ICONS[key];
          if (!Icon || !url) return null;
          return (
            <a
              key={key}
              href={key === 'email' ? `mailto:${url}` : url}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-white/10 hover:bg-[#0078D4]/40 border border-white/10 text-white/70 hover:text-white transition-all"
            >
              <Icon size={isMaximized ? 20 : 16} />
            </a>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
