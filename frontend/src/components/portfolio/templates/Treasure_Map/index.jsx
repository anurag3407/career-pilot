import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ExternalLink, MapPin, Compass, Skull, Zap } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

/**
 * Treasure Map Portfolio Template
 * Category: Unique / Creative
 * Description: Pirate treasure map with aged parchment background, dotted path connecting portfolio sections, X marks the spot for featured projects.
 */

// SVG Map Decorations
const MapDecoration = ({ className = '' }) => (
  <svg className={`absolute ${className}`} viewBox="0 0 100 100" width="100" height="100">
    {/* Compass Rose */}
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <polygon points="50,15 45,35 50,30 55,35" fill="currentColor" opacity="0.3" />
  </svg>
);

// Dotted Path Component
const DottedPath = ({ from, to }) => {
  const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  
  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        left: `${Math.min(from.x, to.x)}%`,
        top: `${Math.min(from.y, to.y)}%`,
        width: `${Math.abs(to.x - from.x)}%`,
        height: `${Math.abs(to.y - from.y)}%`,
        transform: `rotate(${angle}rad)`,
      }}
    >
      <line
        x1="0"
        y1="0"
        x2="100%"
        y2="0"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="5,5"
        opacity="0.3"
        className="text-yellow-600"
      />
    </svg>
  );
};

// Hero Section
const Hero = () => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
  >
    {/* Aged Parchment Background */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px),
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px),
          radial-gradient(ellipse at 20% 50%, rgba(255, 200, 100, 0.1), transparent 50%),
          linear-gradient(135deg, #F4E8D0 0%, #E8D7C3 50%, #D4C4B0 100%)
        `,
      }}
    />

    {/* Decorative Elements */}
    <MapDecoration className="top-20 left-10 w-24 h-24 text-yellow-700 opacity-20" />
    <MapDecoration className="bottom-20 right-10 w-32 h-32 text-yellow-600 opacity-10" />

    {/* Skull Icon */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      className="absolute top-10 right-10 text-yellow-700 opacity-20"
    >
      <Skull size={48} />
    </motion.div>

    <div className="relative z-10 text-center max-w-3xl mx-auto">
      {/* Treasure Chest Icon */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="mb-8"
      >
        <Compass className="mx-auto w-16 h-16 text-yellow-700" />
      </motion.div>

      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-800 to-yellow-600"
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}
      >
        {data.personal.name}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-2xl md:text-3xl text-yellow-900 mb-6 font-serif italic"
      >
        {data.personal.title}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-lg text-yellow-800 mb-8 max-w-2xl mx-auto flex items-center justify-center gap-2"
      >
        <MapPin size={20} />
        {data.personal.location}
      </motion.p>

      {/* Tagline with parchment border */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="border-2 border-yellow-700 border-dashed p-6 rounded-lg bg-yellow-50 bg-opacity-50 backdrop-blur-sm"
      >
        <p className="text-yellow-900 text-lg italic">"{data.personal.tagline}"</p>
      </motion.div>
    </div>

    {/* Scroll Indicator */}
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-yellow-700"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </motion.div>
  </motion.section>
);

// About Section
const About = () => (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="relative py-20 px-4"
  >
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="grid md:grid-cols-2 gap-12 items-center"
      >
        {/* Avatar */}
        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative"
          >
            <div className="w-64 h-64 rounded-full overflow-hidden border-8 border-yellow-700 shadow-2xl">
              <img
                src={data.personal.avatar}
                alt={data.personal.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* X Mark */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-700 text-yellow-50 rounded-full flex items-center justify-center text-4xl font-bold shadow-lg">
              X
            </div>
          </motion.div>
        </div>

        {/* Bio */}
        <div>
          <h2 className="text-4xl font-bold text-yellow-900 mb-6 font-serif">The Treasure Hunter</h2>
          <p className="text-yellow-800 text-lg leading-relaxed mb-6 italic">
            {data.personal.bio}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Years', value: data.stats.yearsExperience },
              { label: 'Projects', value: data.stats.projectsCompleted },
              { label: 'Clients', value: data.stats.happyClients },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="text-center p-4 border-2 border-yellow-700 rounded-lg bg-yellow-50 bg-opacity-50"
              >
                <div className="text-3xl font-bold text-yellow-900">{stat.value}</div>
                <div className="text-sm text-yellow-800">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </motion.section>
);

// Skills Section
const Skills = () => {
  const categories = [...new Set(data.skills.map((s) => s.category))];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative py-20 px-4 bg-yellow-50 bg-opacity-30"
    >
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-yellow-900 mb-12 text-center font-serif"
        >
          Treasures in My Chest
        </motion.h2>

        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-yellow-800 mb-6 flex items-center gap-2">
              <Zap size={24} className="text-yellow-700" />
              {category}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {data.skills
                .filter((s) => s.category === category)
                .map((skill, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border-2 border-yellow-700 rounded-lg bg-white bg-opacity-50 backdrop-blur-sm hover:bg-opacity-70 transition-all"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-yellow-900">{skill.name}</span>
                      <span className="text-yellow-700 font-bold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-yellow-200 h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-yellow-600 to-yellow-700"
                      />
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

// Projects Section
const Projects = () => (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="relative py-20 px-4"
  >
    <div className="max-w-6xl mx-auto">
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-yellow-900 mb-12 text-center font-serif"
      >
        X Marks the Spot
      </motion.h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.projects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ y: -5 }}
            className="relative group rounded-lg overflow-hidden border-2 border-yellow-700 bg-white bg-opacity-50 backdrop-blur-sm shadow-lg"
          >
            {/* X Mark */}
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-yellow-700 text-yellow-50 rounded-full flex items-center justify-center text-2xl font-bold z-10 shadow-lg">
              X
            </div>

            {/* Project Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all" />
            </div>

            {/* Project Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-yellow-900 mb-2">{project.title}</h3>
              <p className="text-yellow-800 text-sm mb-4 leading-relaxed">{project.description}</p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.slice(0, 3).map((tech, j) => (
                  <span key={j} className="px-3 py-1 text-xs font-semibold bg-yellow-200 text-yellow-900 rounded-full">
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="px-3 py-1 text-xs font-semibold bg-yellow-200 text-yellow-900 rounded-full">
                    +{project.techStack.length - 3}
                  </span>
                )}
              </div>

              {/* Links */}
              <div className="flex gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-700 text-yellow-50 rounded-lg hover:bg-yellow-800 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Live
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border-2 border-yellow-700 text-yellow-700 rounded-lg hover:bg-yellow-700 hover:text-yellow-50 transition-colors"
                  >
                    <Github size={16} />
                    Code
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

// Experience Section
const Experience = () => (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="relative py-20 px-4 bg-yellow-50 bg-opacity-30"
  >
    <div className="max-w-3xl mx-auto">
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-yellow-900 mb-12 text-center font-serif"
      >
        The Journey
      </motion.h2>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-yellow-700 to-yellow-400 hidden md:block" />

        {data.experience.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ x: i % 2 === 0 ? -50 : 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className={`mb-8 md:mb-12 md:flex ${i % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}
          >
            <div className="md:w-5/12">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 border-2 border-yellow-700 rounded-lg bg-white bg-opacity-70 backdrop-blur-sm shadow-lg"
              >
                <h3 className="text-xl font-bold text-yellow-900 mb-2">{exp.role}</h3>
                <p className="text-yellow-800 font-semibold mb-1">{exp.company}</p>
                <p className="text-sm text-yellow-700 mb-4 italic">{exp.period}</p>
                <p className="text-yellow-800 leading-relaxed">{exp.description}</p>
              </motion.div>
            </div>

            {/* Timeline Dot */}
            <motion.div
              whileHover={{ scale: 1.3 }}
              className="flex justify-center md:justify-center"
            >
              <div className="w-6 h-6 bg-yellow-700 rounded-full border-4 border-yellow-100 shadow-lg" />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

// Testimonials Section
const Testimonials = () => (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="relative py-20 px-4"
  >
    <div className="max-w-5xl mx-auto">
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-yellow-900 mb-12 text-center font-serif"
      >
        Tales from Fellow Adventurers
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-6">
        {data.testimonials.map((testimonial, i) => (
          <motion.div
            key={i}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
            className="p-6 border-2 border-yellow-700 rounded-lg bg-white bg-opacity-60 backdrop-blur-sm shadow-lg"
          >
            <p className="text-yellow-800 italic mb-6 leading-relaxed">"{testimonial.text}"</p>

            <div className="flex items-center gap-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full border-2 border-yellow-700 object-cover"
              />
              <div>
                <p className="font-bold text-yellow-900">{testimonial.name}</p>
                <p className="text-sm text-yellow-700">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

// Contact Section
const Contact = () => (
  <motion.section
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="relative py-20 px-4 bg-yellow-50 bg-opacity-30"
  >
    <div className="max-w-3xl mx-auto text-center">
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-yellow-900 mb-8 font-serif"
      >
        Send a Message in a Bottle
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-yellow-800 mb-12 text-lg"
      >
        Have a project in mind or just want to chat? Reach out!
      </motion.p>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex justify-center gap-6 mb-12 flex-wrap"
      >
        {[
          { icon: Github, url: data.socials.github, label: 'GitHub' },
          { icon: Linkedin, url: data.socials.linkedin, label: 'LinkedIn' },
          { icon: Twitter, url: data.socials.twitter, label: 'Twitter' },
          { icon: Mail, url: `mailto:${data.socials.email}`, label: 'Email' },
        ].map((social, i) => {
          const Icon = social.icon;
          return (
            <motion.a
              key={i}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 border-2 border-yellow-700 rounded-full bg-white bg-opacity-50 hover:bg-yellow-700 hover:text-yellow-50 text-yellow-700 transition-all shadow-lg"
              title={social.label}
            >
              <Icon size={24} />
            </motion.a>
          );
        })}
      </motion.div>

      {/* Email CTA */}
      <motion.a
        href={`mailto:${data.socials.email}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-700 to-yellow-600 text-yellow-50 rounded-lg font-bold text-lg hover:shadow-2xl transition-all"
      >
        Start a Conversation
      </motion.a>
    </div>
  </motion.section>
);

// Main Component
export default function TreasureMap() {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-yellow-100 via-yellow-50 to-yellow-100 text-yellow-900 overflow-x-hidden"
      style={{
        backgroundImage: `
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 0, 0, 0.02) 2px, rgba(0, 0, 0, 0.02) 4px),
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.02) 2px, rgba(0, 0, 0, 0.02) 4px)
        `,
      }}
    >
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-8 px-4 text-center text-yellow-700 border-t-2 border-yellow-700 border-dashed"
      >
        <p className="text-sm">
          © 2024 {data.personal.name}. Made with ⚓️ and creativity. | Treasure Map Template
        </p>
      </motion.footer>
    </div>
  );
}
