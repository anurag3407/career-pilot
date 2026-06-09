import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Briefcase,
  MapPin,
} from "lucide-react";

import data from "../../../../data/dummy_data.json";

export default function AuroraSky() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-black">
      {/* Aurora Background */}
<div className="fixed inset-0 -z-50 overflow-hidden bg-black">

  {/* Animated Aurora Waves */}
  <motion.div
    animate={{
      x: ["-15%", "15%", "-15%"],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 18,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute top-[-20%] left-[-10%] w-[140%] h-[900px]
    bg-gradient-to-r from-cyan-500/40 via-emerald-400/20 to-purple-500/40
    blur-[60px]"
  />

  <motion.div
    animate={{
      x: ["15%", "-15%", "15%"],
      scale: [1.1, 1, 1.1],
    }}
    transition={{
      duration: 24,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute top-[10%] left-[-10%] w-[140%] h-[900px]
    bg-gradient-to-r from-purple-500/30 via-cyan-400/20 to-green-400/30
    blur-[70px]"
  />

  {/* Floating Aurora Orbs */}
  {[...Array(3)].map((_, i) => (
    <motion.div
      key={i}
      animate={{
        y: [-40, 40, -40],
        opacity: [0.3, 1, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 6 + Math.random() * 6,
        repeat: Infinity,
      }}
      className="absolute rounded-full blur-3xl"
      style={{
        width: 150,
        height: 150,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        background:
          i % 3 === 0
            ? "rgba(34,211,238,.12)"
            : i % 3 === 1
            ? "rgba(74,222,128,.12)"
            : "rgba(168,85,247,.12)",
      }}
    />
  ))}

  {/* Stars */}
  {[...Array(50)].map((_, i) => (
    <motion.div
      key={i}
      animate={{
        opacity: [0.2, 1, 0.2],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: 2 + Math.random() * 4,
        repeat: Infinity,
      }}
      className="absolute bg-white rounded-full"
      style={{
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
    />
  ))}

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/30" />
</div>

      {/* HERO */}
<section className="relative z-10 min-h-screen flex items-center justify-center px-6">
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className="max-w-6xl mx-auto text-center relative"
  >
    {/* Avatar with Aurora Glow */}
    <div className="relative inline-block">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500 rounded-full blur-[40px]"
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-[-20px] rounded-full border border-cyan-400/30"
      />

      <motion.img
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        src={data.personal.avatar}
        alt={data.personal.name}
        className="relative w-44 h-44 rounded-full border-4 border-cyan-300 object-cover shadow-2xl"
      />
    </div>

    {/* Name */}
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-10 text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tight"
    >
      <span className="bg-gradient-to-r from-cyan-200 via-emerald-300 to-purple-300 bg-clip-text text-transparent">
        {data.personal.name}
      </span>
    </motion.h1>

    {/* Title */}
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-6 text-xl md:text-3xl text-slate-100 font-medium tracking-wide"
    >
      {data.personal.title}
    </motion.p>

    {/* Location */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-5 flex justify-center"
    >
      <span className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 border border-cyan-400/20 backdrop-blur-lg">
        <MapPin size={16} />
        {data.personal.location}
      </span>
    </motion.div>

    {/* Status Badge */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.55 }}
      className="mt-4"
    >
      <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-500/20 via-emerald-500/20 to-purple-500/20 border border-cyan-400/20 backdrop-blur-xl">
         Available for Opportunities
      </span>
    </motion.div>

    {/* Bio */}
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="max-w-3xl mx-auto mt-8 text-lg md:text-xl text-slate-300 leading-relaxed"
    >
      {data.personal.bio}
    </motion.p>

    {/* CTA Buttons */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="flex flex-wrap justify-center gap-5 mt-12"
    >
      <a
        href="#projects"
        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500 text-black font-bold shadow-lg shadow-cyan-500/30 hover:scale-105 transition-all duration-300"
      >
        Explore Projects
      </a>

      <a
        href={`mailto:${data.socials.email}`}
        className="px-8 py-4 rounded-2xl border border-cyan-400/30 backdrop-blur-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
      >
        Contact Me
      </a>
    </motion.div>

    {/* Social Links */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="flex justify-center gap-5 mt-12"
    >
      <a
        href={data.socials.github}
        target="_blank"
        rel="noreferrer"
        className="p-4 rounded-full bg-white/5 backdrop-blur-xl border border-cyan-400/20 hover:border-cyan-300 hover:shadow-lg transition-all duration-300"
      >
        <Github size={24} />
      </a>

      <a
        href={data.socials.linkedin}
        target="_blank"
        rel="noreferrer"
        className="p-4 rounded-full bg-white/5 backdrop-blur-xl border border-cyan-400/20 hover:shadow-lg transition-all duration-300"
      >
        <Linkedin size={24} />
      </a>

      <a
        href={`mailto:${data.socials.email}`}
        className="p-4 rounded-full bg-white/5 backdrop-blur-xl border border-cyan-400/20 hover:shadow-lg transition-all duration-300"
      >
        <Mail size={24} />
      </a>
    </motion.div>
  </motion.div>
</section>

      {/* ABOUT */}
      <section className="relative z-40 max-w-6xl mx-auto px-6 py-32">
  <motion.div
    initial={{ opacity: 0, y: 80 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="relative overflow-hidden rounded-[40px] border border-cyan-400/20 backdrop-blur-2xl bg-gradient-to-br from-cyan-500/10 via-emerald-500/10 to-purple-500/10 p-10 md:p-14 shadow-xl"
  >
    {/* Aurora Glow */}
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />

    {/* Heading */}
    <h2 className="text-4xl md:text-6xl font-black text-center mb-12 bg-gradient-to-r from-cyan-300 via-emerald-300 to-purple-400 bg-clip-text text-transparent">
      About Me
    </h2>

    {/* Bio */}
    <p className="max-w-4xl mx-auto text-center text-lg md:text-xl text-slate-200 leading-relaxed">
      {data.personal.bio}
    </p>

    {/* Location */}
    <div className="flex justify-center mt-8">
      <span className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 border border-cyan-400/20 backdrop-blur-xl text-cyan-200">
        <MapPin size={18} />
        {data.personal.location}
      </span>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
      <motion.div
        whileHover={{ y: -8, scale: 1.03 }}
        className="bg-white/5 backdrop-blur-xl border border-cyan-400/20 rounded-3xl p-8 text-center"
      >
        <h3 className="text-5xl font-black text-cyan-300">
          {data.stats.yearsExperience}
        </h3>
        <p className="mt-2 text-slate-300 uppercase tracking-wider">
          Years Experience
        </p>
      </motion.div>

      <motion.div
        whileHover={{ y: -8, scale: 1.03 }}
        className="bg-white/5 backdrop-blur-xl border border-purple-400/20 rounded-3xl p-8 text-center"
      >
        <h3 className="text-5xl font-black text-purple-300">
          {data.stats.projectsCompleted}
        </h3>
        <p className="mt-2 text-slate-300 uppercase tracking-wider">
          Projects
        </p>
      </motion.div>

      <motion.div
        whileHover={{ y: -8, scale: 1.03 }}
        className="bg-white/5 backdrop-blur-xl border border-emerald-400/20 rounded-3xl p-8 text-center"
      >
        <h3 className="text-5xl font-black text-emerald-300">
          {data.stats.happyClients}
        </h3>
        <p className="mt-2 text-slate-300 uppercase tracking-wider">
          Happy Clients
        </p>
      </motion.div>
    </div>
  </motion.div>
</section>

      {/* SKILLS */}
<section className="relative z-40 max-w-7xl mx-auto px-6 py-28">
  {/* Section Heading */}
  <div className="text-center mb-20 relative">
    <div className="absolute inset-0 flex justify-center">
      <div className="w-72 h-20 bg-cyan-400/20 blur-3xl rounded-full" />
    </div>

    <h2 className="relative text-4xl md:text-6xl font-black bg-gradient-to-r from-cyan-300 via-emerald-300 to-purple-400 bg-clip-text text-transparent">
      Skills & Expertise
    </h2>

    <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
      Technologies and tools I use to craft modern digital experiences.
    </p>
  </div>

  {/* Skills Grid */}
  <div className="grid md:grid-cols-2 gap-8">
    {data.skills.map((skill, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{
          y: -8,
          scale: 1.02,
        }}
        className="group relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-cyan-500/10 via-green-500/10 to-purple-500/10
        border border-cyan-400/20 backdrop-blur-xl p-7"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-transparent to-purple-400/10" />
        </div>

        <div className="relative flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">
            {skill.name}
          </h3>

          <span
            className="px-3 py-1 rounded-full text-sm font-bold
            bg-cyan-500/20 text-cyan-300 border border-cyan-400/20"
          >
            {skill.level}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="h-full rounded-full bg-gradient-to-r
            from-cyan-400 via-emerald-400 to-purple-400"
          />

          <div
            className="absolute top-0 left-0 h-full w-full
            bg-white/10 animate-pulse"
          />
        </div>
      </motion.div>
    ))}
  </div>
</section>

      {/* PROJECTS */}
<section
  id="projects"
  className="relative z-40 max-w-7xl mx-auto px-6 py-28"
>
  {/* Heading */}
  <div className="text-center mb-20 relative">
    <div className="absolute inset-0 flex justify-center">
      <div className="w-80 h-24 bg-purple-500/20 blur-3xl rounded-full" />
    </div>

    <h2
      className="relative text-4xl md:text-6xl font-black
      bg-gradient-to-r from-cyan-300 via-emerald-300 to-purple-400
      bg-clip-text text-transparent"
    >
      Featured Projects
    </h2>

    <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
      A collection of projects showcasing creativity,
      problem-solving and modern development practices.
    </p>
  </div>

  {/* Projects Grid */}
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
    {data.projects.map((project, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
        }}
        viewport={{ once: true }}
        whileHover={{
          y: -10,
          scale: 1.02,
        }}
        className="group relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-cyan-500/10 via-green-500/10 to-purple-500/10
        border border-cyan-400/20
        backdrop-blur-xl
        shadow-xl shadow-cyan-500/10"
      >
        {/* Hover Glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100
          transition duration-500"
        >
          <div
            className="absolute inset-0
            bg-gradient-to-r from-cyan-400/10 via-transparent to-purple-400/10"
          />
        </div>

        {/* Project Image */}
        <div className="relative overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5 }}
            src={project.image}
            alt={project.title}
            className="w-full h-60 object-cover"
          />

          <div
            className="absolute inset-0
            bg-gradient-to-t from-black/70 via-transparent to-transparent"
          />
        </div>

        {/* Content */}
        <div className="relative p-6">
          <h3 className="text-2xl font-bold text-cyan-300 mb-4">
            {project.title}
          </h3>

          <p className="text-slate-300 mb-6 leading-relaxed">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech, i) => (
              <span
                key={i}
                className="
                px-3 py-1 rounded-full text-xs font-medium
                bg-white/5
                border border-cyan-400/20
                text-cyan-200
              "
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="
              flex items-center gap-2
              px-4 py-2 rounded-xl
              bg-gradient-to-r from-cyan-400 to-emerald-400
              text-black font-bold
              hover:scale-105 transition
            "
            >
              Live Demo
              <ExternalLink size={18} />
            </a>

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="
              flex items-center gap-2
              px-4 py-2 rounded-xl
              border border-cyan-400/30
              bg-white/5
              hover:bg-cyan-500/10
              transition
            "
            >
              Code
              <Github size={18} />
            </a>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</section>

      {/* EXPERIENCE */}
<section className="relative z-40 max-w-6xl mx-auto px-6 py-28">
  <motion.h2
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-5xl md:text-6xl font-black text-center mb-20 bg-gradient-to-r from-cyan-300 via-emerald-300 to-purple-400 bg-clip-text text-transparent"
  >
    Experience
  </motion.h2>

  <div className="relative">
    {/* Aurora Timeline Line */}
    <div className="absolute left-5 top-0 bottom-0 w-[3px] bg-gradient-to-b from-cyan-400 via-green-400 to-purple-400 hidden md:block" />

    <div className="space-y-10">
      {data.experience.map((exp, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{
            scale: 1.03,
            y: -5,
          }}
          className="relative md:ml-16"
        >
          {/* Timeline Orb */}
          <div className="hidden md:block absolute -left-[52px] top-10">
            <div className="w-8 h-8 rounded-full bg-cyan-400 shadow-lg" />
          </div>

          {/* Card */}
          <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 via-green-500/10 to-purple-500/10 p-8">

            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-green-400/5 to-purple-400/5 opacity-0 hover:opacity-100 transition duration-500" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="text-cyan-300" size={28} />
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {exp.role}
                </h3>
              </div>

              <p className="text-cyan-300 font-semibold mb-2 text-lg">
                {exp.company}
              </p>

              <span className="inline-block px-4 py-1 rounded-full text-sm bg-purple-500/20 text-purple-300 border border-purple-400/20 mb-5">
                {exp.period}
              </span>

              <p className="text-slate-200 leading-relaxed text-lg">
                {exp.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* TESTIMONIALS */}
<section className="relative z-40 max-w-7xl mx-auto px-6 py-28">
  <motion.h2
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-5xl md:text-6xl font-black text-center mb-20 bg-gradient-to-r from-cyan-300 via-emerald-300 to-purple-400 bg-clip-text text-transparent"
  >
    Testimonials
  </motion.h2>

  <div className="grid md:grid-cols-2 gap-10">
    {data.testimonials.map((testimonial, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: index * 0.15,
        }}
        viewport={{ once: true }}
        whileHover={{
          y: -8,
          scale: 1.03,
        }}
        className="group relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-cyan-500/10 via-green-500/10 to-purple-500/10
        border border-cyan-400/20
        backdrop-blur-xl p-8"
      >
        {/* Aurora Glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100
          transition duration-500"
        >
          <div
            className="absolute inset-0
            bg-gradient-to-r
            from-cyan-400/10 via-green-400/5 to-purple-400/10"
          />
        </div>

        {/* Quote Icon */}
        <div className="relative z-10 mb-4">
          <span className="text-6xl text-cyan-400/30 font-serif">
            "
          </span>
        </div>

        {/* Testimonial Text */}
        <p className="relative z-10 text-slate-200 leading-relaxed text-lg italic mb-8">
          {testimonial.text}
        </p>

        {/* User */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-cyan-400/40 blur-md" />

            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="relative w-16 h-16 rounded-full object-cover border-2 border-cyan-400"
            />
          </div>

          <div>
            <h4 className="text-lg font-bold text-white">
              {testimonial.name}
            </h4>

            <p className="text-cyan-300 text-sm">
              {testimonial.role}
            </p>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</section>

      {/* CONTACT */}
<footer className="relative z-40 py-28 overflow-hidden">
  {/* Aurora Glow Background */}
  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-green-500/10 blur-3xl" />

  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="relative max-w-4xl mx-auto px-8 py-16 rounded-[40px]
               bg-white/5 backdrop-blur-2xl
               border border-white/10 text-center"
  >
    {/* Heading */}
    <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-300 via-green-300 to-purple-400 bg-clip-text text-transparent">
      Let's Connect
    </h2>

    {/* Subtitle */}
    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
      Ready to build something amazing together? Reach out and let's create
      extraordinary digital experiences.
    </p>

    {/* Contact Button */}
    <motion.a
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      href={`mailto:${data.socials.email}`}
      className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl
                 bg-gradient-to-r from-cyan-400 via-green-400 to-purple-500
                 text-black font-bold shadow-xl shadow-cyan-500/30"
    >
      <Mail size={22} />
      Send Message
    </motion.a>

    {/* Social Icons */}
    <div className="flex justify-center gap-6 mt-12">
      <motion.a
        whileHover={{ y: -6, scale: 1.15 }}
        href={data.socials.github}
        target="_blank"
        rel="noreferrer"
        className="w-16 h-16 flex items-center justify-center
                   rounded-2xl bg-white/10 border border-cyan-400/20
                   hover:bg-cyan-500/20 transition-all"
      >
        <Github size={28} />
      </motion.a>

      <motion.a
        whileHover={{ y: -6, scale: 1.15 }}
        href={data.socials.linkedin}
        target="_blank"
        rel="noreferrer"
        className="w-16 h-16 flex items-center justify-center
                   rounded-2xl bg-white/10 border border-purple-400/20
                   hover:bg-purple-500/20 transition-all"
      >
        <Linkedin size={28} />
      </motion.a>

      <motion.a
        whileHover={{ y: -6, scale: 1.15 }}
        href={`mailto:${data.socials.email}`}
        className="w-16 h-16 flex items-center justify-center
                   rounded-2xl bg-white/10 border border-green-400/20
                   hover:bg-green-500/20 transition-all"
      >
        <Mail size={28} />
      </motion.a>
    </div>

    {/* Divider */}
    <div className="w-32 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto my-12" />

    {/* Copyright */}
    <p className="text-slate-500 text-sm tracking-wider">
      © 2026 {data.personal.name} • Aurora Sky Portfolio
    </p>
  </motion.div>
</footer>
    </div>
  );
}
