import React from 'react';
import { motion } from 'framer-motion';

export default function Hero({ data, socials, stats }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const floatVariants = {
    initial: { y: 0 },
    animate: { y: [-8, 8, -8], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background with ceramic gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f5] via-[#f5f1ed] to-[#ece6e0]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#f0ebe6] to-transparent rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-tr from-[#e8ddd6] to-transparent rounded-full blur-3xl opacity-30" />
      </div>

      <motion.div
        className="max-w-4xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Avatar with floating animation and ceramic frame */}
        <motion.div
          variants={itemVariants}
          className="mb-12 flex justify-center"
        >
          <motion.div
            variants={floatVariants}
            initial="initial"
            animate="animate"
            className="relative"
          >
            {/* Ceramic frame glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4a574] to-[#c7a77f] rounded-full blur-2xl opacity-20" />

            {/* Avatar with sculpted border */}
            <div className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-8 border-white shadow-2xl" style={{
              boxShadow: '0 20px 60px rgba(199, 167, 127, 0.2), inset 0 2px 4px rgba(255,255,255,0.5)'
            }}>
              <img
                src={data.avatar}
                alt={data.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Name */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-br from-[#3e3a37] via-[#5a4f47] to-[#3e3a37] bg-clip-text text-transparent mb-2 leading-tight">
            {data.name}
          </h1>
        </motion.div>

        {/* Title with elegant color */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <p className="text-xl sm:text-2xl md:text-3xl text-[#8b6f47] font-light tracking-wide">
            {data.title}
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.div variants={itemVariants} className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-lg sm:text-xl text-[#7a6f66] leading-relaxed font-light">
            {data.tagline}
          </p>
        </motion.div>

        {/* Stats with ceramic card styling */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-4 sm:gap-8 mb-16 py-8 sm:py-12 px-6 sm:px-8 rounded-3xl backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(240,235,230,0.4) 100%)',
            boxShadow: '0 8px 32px rgba(199, 167, 127, 0.1), inset 0 1px 2px rgba(255,255,255,0.8)'
          }}
        >
          {[
            { value: stats.yearsExperience, label: 'Years Experience' },
            { value: stats.projectsCompleted, label: 'Projects Completed' },
            { value: stats.happyClients, label: 'Happy Clients' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-bold text-[#c7a77f] mb-2">
                {stat.value}+
              </p>
              <p className="text-xs sm:text-sm text-[#8b6f47] font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 sm:px-10 py-4 rounded-full font-semibold text-lg text-white transition-all duration-300 text-center"
            style={{
              background: 'linear-gradient(135deg, #c7a77f 0%, #b8956a 100%)',
              boxShadow: '0 10px 30px rgba(199, 167, 127, 0.3)'
            }}
          >
            View My Work
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 sm:px-10 py-4 rounded-full font-semibold text-lg text-[#c7a77f] transition-all duration-300 text-center border-2 border-[#c7a77f] hover:bg-[#faf8f5]"
          >
            Get in Touch
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div variants={itemVariants} className="flex gap-8 justify-center flex-wrap">
          {[
            { url: socials.github, label: 'GitHub' },
            { url: socials.linkedin, label: 'LinkedIn' },
            { url: socials.twitter, label: 'Twitter' },
            { url: socials.email, label: 'Email', email: true }
          ].map((social, idx) => (
            social.url && (
              <motion.a
                key={idx}
                href={social.email ? `mailto:${social.url}` : social.url}
                target={social.email ? undefined : '_blank'}
                rel={social.email ? undefined : 'noopener noreferrer'}
                aria-label={social.label}
                whileHover={{ y: -3, color: '#c7a77f' }}
                className="text-[#8b6f47] hover:text-[#c7a77f] text-sm sm:text-base font-medium transition-colors duration-300"
              >
                {social.label}
              </motion.a>
            )
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-[#c7a77f]"
      >
        <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}

