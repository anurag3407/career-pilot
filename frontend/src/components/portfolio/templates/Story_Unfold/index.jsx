import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowDown, ExternalLink, Github, Star, Mail, Phone, MapPin, Briefcase, Linkedin, Twitter } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

/**
 * Story Unfold Portfolio Template
 * Category: Scroll-Triggered
 * Description: Narrative scroll portfolio where a personal story unfolds chapter by chapter.
 * Text and images reveal with fade-in/slide-up animations as user scrolls.
 */

// ==================== HERO SECTION ====================
function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
      <motion.div
        className="max-w-4xl mx-auto text-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Tagline */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
            <p className="text-blue-300 text-sm font-semibold tracking-widest uppercase">
              {data.personal.tagline}
            </p>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {data.personal.name}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-2xl md:text-3xl text-slate-300 mb-8 font-light"
        >
          {data.personal.title}
        </motion.p>

        {/* Bio */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          {data.personal.bio}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex gap-4 justify-center flex-wrap mb-16"
        >
          <a
            href="#contact"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Get in Touch
          </a>
          <a
            href="#projects"
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg font-semibold border border-slate-600 transition-all duration-300 transform hover:scale-105"
          >
            View My Work
          </a>
        </motion.div>

        {/* Location and Stats */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm"
        >
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{data.personal.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💼</span>
            <span>{data.stats.yearsExperience}+ Years Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🎯</span>
            <span>{data.stats.projectsCompleted} Projects</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ArrowDown className="w-6 h-6 text-blue-400" />
      </motion.div>
    </section>
  );
}

// ==================== ABOUT SECTION ====================
function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      ref={ref}
      id="about"
      className="min-h-screen flex items-center justify-center px-6 py-20"
    >
      <motion.div
        className="max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Section Title */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              My Story
            </span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mt-4 rounded-full" />
        </motion.div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Avatar */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center"
          >
            <div className="relative w-72 h-72 rounded-2xl overflow-hidden">
              {/* Animated background border */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  padding: '2px',
                }}
              />
              {/* Image container */}
              <div className="absolute inset-0.5 rounded-2xl bg-slate-900 overflow-hidden">
                <img
                  src={data.personal.avatar}
                  alt={data.personal.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div variants={itemVariants} className="space-y-6">
            <p className="text-lg text-slate-300 leading-relaxed">
              {data.personal.bio}
            </p>

            {/* Key Stats */}
            <div className="space-y-4 pt-6 border-t border-slate-700">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-blue-400">
                  {data.stats.yearsExperience}+
                </span>
                <span className="text-slate-300">Years of Experience</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-purple-400">
                  {data.stats.projectsCompleted}
                </span>
                <span className="text-slate-300">Projects Completed</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-pink-400">
                  {data.stats.happyClients}
                </span>
                <span className="text-slate-300">Happy Clients</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-6">
              {data.socials.github && (
                <a
                  href={data.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-800 hover:bg-blue-600 rounded-lg transition-all duration-300 transform hover:scale-110"
                  title="GitHub"
                >
                  <span className="text-xl">🔗</span>
                </a>
              )}
              {data.socials.linkedin && (
                <a
                  href={data.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-800 hover:bg-blue-600 rounded-lg transition-all duration-300 transform hover:scale-110"
                  title="LinkedIn"
                >
                  <span className="text-xl">💼</span>
                </a>
              )}
              {data.socials.twitter && (
                <a
                  href={data.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-800 hover:bg-blue-600 rounded-lg transition-all duration-300 transform hover:scale-110"
                  title="Twitter"
                >
                  <span className="text-xl">🐦</span>
                </a>
              )}
              {data.socials.email && (
                <a
                  href={`mailto:${data.socials.email}`}
                  className="p-3 bg-slate-800 hover:bg-blue-600 rounded-lg transition-all duration-300 transform hover:scale-110"
                  title="Email"
                >
                  <span className="text-xl">✉️</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ==================== SKILLS SECTION ====================
function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Group skills by category
  const skillsByCategory = data.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const barVariants = {
    hidden: { width: 0 },
    visible: {
      width: '100%',
      transition: {
        duration: 1,
        ease: 'easeOut',
        delay: 0.2,
      },
    },
  };

  return (
    <section
      ref={ref}
      id="skills"
      className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-slate-900 to-slate-950"
    >
      <motion.div
        className="max-w-5xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Section Title */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Skills & Expertise
            </span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mt-4 rounded-full" />
        </motion.div>

        {/* Skills by Category */}
        <div className="grid md:grid-cols-2 gap-12">
          {Object.entries(skillsByCategory).map(([category, skills], categoryIndex) => (
            <motion.div
              key={category}
              variants={itemVariants}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-slate-200 mb-8">
                <span className="inline-block px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
                  {category}
                </span>
              </h3>

              {/* Skills in this category */}
              <div className="space-y-5">
                {skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    className="space-y-2"
                    variants={itemVariants}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-medium">{skill.name}</span>
                      <span className="text-sm text-slate-400">{skill.level}%</span>
                    </div>
                    {/* Skill Bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                        variants={barVariants}
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skill Tags Cloud */}
        <motion.div
          variants={itemVariants}
          className="mt-16 pt-16 border-t border-slate-700"
        >
          <h3 className="text-xl font-semibold text-slate-300 mb-8">
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill) => (
              <motion.span
                key={skill.name}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-700/50 text-blue-300 text-sm font-medium hover:border-blue-500 transition-all duration-300"
                whileHover={{
                  scale: 1.1,
                  borderColor: 'rgb(59, 130, 246)',
                }}
                variants={itemVariants}
              >
                {skill.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ==================== PROJECTS SECTION ====================
function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      ref={ref}
      id="projects"
      className="min-h-screen flex items-center justify-center px-6 py-20"
    >
      <motion.div
        className="max-w-6xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Section Title */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-rose-400 mt-4 rounded-full" />
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {data.projects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-2xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-pink-500/50 transition-all duration-300"
              whileHover={{
                y: -8,
                boxShadow: '0 20px 50px rgba(236, 72, 153, 0.2)',
              }}
            >
              {/* Project Image */}
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  whileHover={{
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
              </div>

              {/* Project Content */}
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-slate-100 group-hover:text-pink-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-slate-400 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs rounded-full bg-pink-900/30 text-pink-300 border border-pink-700/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3 pt-6 border-t border-slate-700">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600/20 hover:bg-pink-600/40 text-pink-300 transition-all duration-300 text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-all duration-300 text-sm font-medium"
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  )}
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute top-4 right-4 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold border border-pink-500/50"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              >
                ✨ Project {index + 1}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* View All Projects CTA */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <a
            href="#contact"
            className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
          >
            View All Projects
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ==================== EXPERIENCE SECTION ====================
function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      ref={ref}
      id="experience"
      className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-slate-950 to-slate-900"
    >
      <motion.div
        className="max-w-4xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Section Title */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Work Experience
            </span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mt-4 rounded-full" />
        </motion.div>

        {/* Timeline */}
        <div className="space-y-8">
          {data.experience.map((exp, index) => (
            <motion.div
              key={exp.role}
              variants={itemVariants}
              className="relative"
            >
              {/* Timeline Node */}
              <div className="flex gap-6">
                {/* Left side - Timeline indicator */}
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 border-4 border-slate-900 shadow-lg"
                    whileHover={{
                      scale: 1.2,
                    }}
                  >
                    <Briefcase className="w-6 h-6 text-white" />
                  </motion.div>
                  {index < data.experience.length - 1 && (
                    <motion.div
                      className="w-1 h-32 bg-gradient-to-b from-amber-500/50 to-transparent mt-4"
                      initial={{ height: 0 }}
                      animate={isInView ? { height: '8rem' } : { height: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  )}
                </div>

                {/* Right side - Content */}
                <motion.div
                  className="flex-1 pb-8 pt-2"
                  whileHover={{
                    x: 10,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6 rounded-xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-amber-500/50 transition-colors duration-300">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-amber-300">
                          {exp.role}
                        </h3>
                        <p className="text-lg text-orange-300 font-semibold">
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-sm text-slate-400 font-medium bg-slate-700/50 px-3 py-1 rounded-full w-fit">
                        {exp.period}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Card */}
        {/* Removed hardcoded summary - can be added to dummy_data.json if needed */}
      </motion.div>
    </section>
  );
}

// ==================== TESTIMONIALS SECTION ====================
function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      ref={ref}
      id="testimonials"
      className="min-h-screen flex items-center justify-center px-6 py-20"
    >
      <motion.div
        className="max-w-6xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Section Title */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              What People Say
            </span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-400 mt-4 rounded-full" />
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={itemVariants}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 hover:border-green-500/50 transition-all duration-300"
              whileHover={{
                y: -8,
                boxShadow: '0 20px 40px rgba(34, 197, 94, 0.15)',
              }}
            >
              {/* Decorative quote mark */}
              <div className="text-6xl text-green-500/20 font-serif leading-none mb-4">
                "
              </div>

              {/* Stars - Consistent 5-star rating from data or default to 5 */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  >
                    <Star className="w-5 h-5 fill-green-400 text-green-400" />
                  </motion.div>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-slate-300 leading-relaxed mb-6 italic min-h-24">
                {testimonial.text}
              </p>

              {/* Separator */}
              <div className="w-8 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-green-500/30"
                />
                <div>
                  <p className="font-semibold text-slate-100">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </div>

              {/* Background accent */}
              <motion.div
                className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Trust Section */}
        {/* Removed hardcoded text - can be added to dummy_data.json testimonials section */}
      </motion.div>
    </section>
  );
}

// ==================== CONTACT SECTION ====================
function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Open email client with pre-filled data
    const subject = `Message from ${formData.name}`;
    const body = `From: ${formData.email}\n\n${formData.message}`;
    window.location.href = `mailto:${data.socials.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitted(false);
    }, 2000);
  };

  const socialLinks = [
    { icon: Github, url: data.socials.github, label: 'GitHub' },
    { icon: Linkedin, url: data.socials.linkedin, label: 'LinkedIn' },
    { icon: Twitter, url: data.socials.twitter, label: 'Twitter' },
    { icon: Mail, url: `mailto:${data.socials.email}`, label: 'Email' },
  ];

  return (
    <section
      ref={ref}
      id="contact"
      className="min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden"
    >
      {/* Background accent */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        className="max-w-4xl mx-auto w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* Section Title */}
        <motion.div variants={itemVariants} className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              Let's Connect
            </span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-red-400 to-pink-400 mt-4 rounded-full mx-auto" />
          <p className="text-slate-400 text-lg mt-6">
            Have a project in mind? Let's talk about it!
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-8">
            <h3 className="text-2xl font-bold text-slate-100 mb-6">
              Get in Touch
            </h3>

            {/* Contact Cards */}
            <div className="space-y-4">
              {/* Email */}
              <motion.a
                href={`mailto:${data.socials.email}`}
                className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 hover:border-red-500/50 transition-all duration-300 group"
                whileHover={{
                  x: 8,
                }}
              >
                <div className="p-3 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                  <Mail className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="text-slate-100 font-semibold">{data.socials.email}</p>
                </div>
              </motion.a>

              {/* Location */}
              <motion.div
                className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/40 border border-slate-700/50"
                whileHover={{
                  x: 8,
                }}
              >
                <div className="p-3 rounded-lg bg-red-500/20">
                  <MapPin className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Location</p>
                  <p className="text-slate-100 font-semibold">{data.personal.location}</p>
                </div>
              </motion.div>
            </div>

            {/* Social Links */}
            <div className="pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-4">Connect on Social</p>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, url, label }) => (
                  url && (
                    <motion.a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-slate-800/50 hover:bg-red-600/30 border border-slate-700/50 hover:border-red-500/50 text-slate-300 hover:text-red-400 transition-all duration-300"
                      whileHover={{
                        scale: 1.15,
                        rotate: 5,
                      }}
                      title={label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  )
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="space-y-4 p-8 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50"
          >
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-red-500 focus:outline-none text-slate-100 placeholder-slate-500 transition-colors duration-300"
                placeholder="John Doe"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-red-500 focus:outline-none text-slate-100 placeholder-slate-500 transition-colors duration-300"
                placeholder="john@example.com"
              />
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Your Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-red-500 focus:outline-none text-slate-100 placeholder-slate-500 transition-colors duration-300 resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold transition-all duration-300"
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              {isSubmitted ? '✓ Message Sent!' : 'Send Message'}
            </motion.button>

            {/* Form Note */}
            <p className="text-xs text-slate-400 text-center">
              This will open your email client with the message pre-filled.
            </p>
          </motion.form>
        </div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="mt-20 pt-12 border-t border-slate-700 text-center"
        >
          <p className="text-slate-400 mb-4">
            © 2024 {data.personal.name}. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Built with React, Tailwind CSS, and Framer Motion ✨
          </p>

          {/* Scroll to top button */}
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-300 text-sm transition-colors duration-300"
            whileHover={{
              y: -4,
            }}
          >
            ↑ Back to Top
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ==================== MAIN EXPORT ====================
export default function StoryUnfold() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            y: [50, 0, 50],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Testimonials />
        <Contact />
      </div>
    </div>
  );
}
