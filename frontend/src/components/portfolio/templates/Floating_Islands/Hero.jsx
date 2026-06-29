import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin } from 'lucide-react';

export default function Hero({ personal, socials }) {
  const socialLinks = [
    { icon: Github, href: socials.github, label: 'GitHub' },
    { icon: Linkedin, href: socials.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: socials.twitter, label: 'Twitter' },
    { icon: Mail, href: `mailto:${socials.email}`, label: 'Email' },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-4 pt-20"
    >
      {/* Floating Island Base */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 text-center"
      >
        {/* Island platform */}
        <div className="relative bg-white/80 backdrop-blur-md rounded-3xl px-8 py-12 md:px-16 md:py-16 shadow-2xl shadow-sky-200/50 border border-white/60">
          {/* Island bottom edge decoration */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-b from-amber-100 to-amber-200 rounded-b-[50%] opacity-60" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-gradient-to-b from-green-200 to-green-300 rounded-b-[40%] opacity-50" />

          {/* Avatar */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto mb-6 w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-4 ring-sky-300/50 shadow-lg shadow-sky-300/30"
          >
            <img
              src={personal.avatar}
              alt={personal.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Name */}
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-3">
            {personal.name}
          </h1>

          {/* Title */}
          <p className="text-lg md:text-xl text-sky-600 font-medium mb-4">
            {personal.title}
          </p>

          {/* Animated Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-slate-500 text-base md:text-lg italic mb-6"
          >
            {personal.tagline}
          </motion.p>

          {/* Location */}
          <div className="flex items-center justify-center gap-1 text-slate-400 text-sm mb-8">
            <MapPin size={14} />
            <span>{personal.location}</span>
          </div>

          {/* Social CTA Buttons */}
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 rounded-full bg-sky-100 hover:bg-sky-200 flex items-center justify-center text-sky-600 transition-colors shadow-md"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
