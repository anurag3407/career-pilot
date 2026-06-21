import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Download, Sparkles } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Hero({ data }) {
  const nameParts = data.personal.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden text-left">
      {/* Background Animated Gradients (Mesh Theme) */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -100, 60, 0],
            scale: [1, 1.25, 0.9, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-cyan-600/15 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -60, 100, 0],
            y: [0, 80, -80, 0],
            scale: [1, 0.85, 1.15, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[130px]"
        />
        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, 50, -50, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[110px]"
        />
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Left Side: Content & Actions */}
        <motion.div variants={fadeUp} className="lg:col-span-7 flex flex-col items-start">
          {/* Status Badge */}
          {data.personal.availability && (
            <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-6 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                {data.personal.availability}
              </span>
            </div>
          )}

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight mb-4 leading-[1.1]">
            Hi, I'm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 drop-shadow-[0_2px_10px_rgba(6,182,212,0.15)]">
              {firstName} {lastName}
            </span>
          </h1>

          {/* Title */}
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={16} className="text-cyan-400 animate-pulse" />
            <p className="text-gray-300 text-xl font-medium tracking-wide">
              {data.personal.title}
            </p>
          </div>

          {/* Tagline */}
          <p className="text-gray-400 text-base md:text-lg max-w-xl leading-relaxed mb-8">
            {data.personal.tagline}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            {data.socials.email && (
              <a
                href={`mailto:${data.socials.email}`}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(6,182,212,0.25)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.4)] transition-all duration-300"
              >
                <Mail size={16} /> Hire Me
              </a>
            )}
            {data.personal.resumeUrl && (
              <a
                href={data.personal.resumeUrl}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gray-900/60 hover:bg-gray-800/80 border border-gray-700/60 hover:border-gray-500 text-gray-200 font-bold text-sm tracking-wide transition-all duration-300"
              >
                <Download size={16} /> Download CV
              </a>
            )}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {[
              { icon: <Github size={19} />, href: data.socials.github, label: "GitHub", hover: "hover:text-white hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.25)]" },
              { icon: <Linkedin size={19} />, href: data.socials.linkedin, label: "LinkedIn", hover: "hover:text-blue-400 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]" },
              { icon: <Twitter size={19} />, href: data.socials.twitter, label: "Twitter", hover: "hover:text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]" },
            ].filter(s => s.href).map(({ icon, href, label, hover }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`w-11 h-11 flex items-center justify-center rounded-xl bg-[#090b20]/80 border border-gray-800 text-gray-400 transition-all duration-300 ${hover}`}
              >
                {icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Glowing Avatar Frame & Stats */}
        <motion.div variants={fadeUp} className="lg:col-span-5 flex flex-col items-center">
          <div className="relative group mb-10">
            {/* Spinning/pulsing neon border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 animate-spin blur-md opacity-60 group-hover:opacity-80 transition-all duration-500" style={{ animationDuration: '9s' }} />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 blur-lg opacity-40 group-hover:opacity-60 transition-all duration-500" />
            <img
              src={data.personal.avatar}
              alt={data.personal.name || "Profile Avatar"}
              className="relative w-44 h-44 md:w-52 md:h-52 rounded-full object-cover border-[6px] border-gray-950/90 mx-auto transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Stats Bento Box Grid */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            {[
              { value: `${data.stats.yearsExperience}+`, label: "Years Exp", gradient: "from-cyan-400 to-blue-400" },
              { value: `${data.stats.projectsCompleted}+`, label: "Completed", gradient: "from-blue-400 to-indigo-400" },
              { value: `${data.stats.happyClients}+`, label: "Clients", gradient: "from-indigo-400 to-purple-400" },
            ].map(({ value, label, gradient }) => (
              <div
                key={label}
                className="p-3.5 rounded-2xl bg-[#0a0d24]/75 border border-indigo-500/10 text-center hover:border-cyan-500/30 transition-all duration-300 shadow-lg"
              >
                <div className={`text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
                  {value}
                </div>
                <div className="text-gray-400 text-xs mt-1 font-semibold tracking-wider uppercase">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
