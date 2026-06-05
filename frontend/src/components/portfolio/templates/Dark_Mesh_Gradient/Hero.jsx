import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ArrowRight } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Hero() {
  const { personal, socials } = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const socialLinks = [
    { icon: Github, url: socials.github, label: 'GitHub' },
    { icon: Linkedin, url: socials.linkedin, label: 'LinkedIn' },
    { icon: Twitter, url: socials.twitter, label: 'Twitter' },
    { icon: Mail, url: `mailto:${socials.email}`, label: 'Email' },
  ];

  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 py-20 text-center overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
      >
        {/* Subtitle / Tagline Pill */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md text-purple-300 text-sm font-medium mb-6 shadow-lg shadow-purple-500/5"
        >
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          {personal.tagline || "Available for Opportunities"}
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-none"
        >
          Hi, I'm{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent bg-size-200 animate-gradient-flow filter drop-shadow-[0_2px_10px_rgba(168,85,247,0.2)]">
            {personal.name}
          </span>
        </motion.h1>

        {/* Title */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-2xl md:text-3xl font-semibold text-gray-300 mb-6 max-w-3xl"
        >
          {personal.title}
        </motion.p>

        {/* Short Bio */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-gray-400 mb-10 max-w-2xl leading-relaxed"
        >
          {personal.bio}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto"
        >
          <a
            href="#projects"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-xl shadow-purple-500/25 transition-all duration-300 hover:scale-105"
          >
            Explore Projects
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-white/25 backdrop-blur-md transition-all duration-300 hover:scale-105"
          >
            Get In Touch
          </a>
        </motion.div>

        {/* Social Icons */}
        <motion.div variants={itemVariants} className="flex gap-4">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="p-3.5 rounded-xl bg-gray-900/40 border border-white/10 hover:border-purple-500/40 hover:bg-purple-950/20 text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1 backdrop-blur-md"
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
