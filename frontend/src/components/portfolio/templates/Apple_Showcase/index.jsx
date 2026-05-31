import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Cpu, 
  Database, 
  Terminal, 
  Layers, 
  Menu, 
  X, 
  Star, 
  ArrowUpRight,
  Sparkles,
  Smartphone,
  Laptop,
  Check
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function AppleShowcase() {
  const { personal, socials, skills, projects, experience, testimonials, stats } = data;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const scaleUp = {
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Nav links
  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  // Group skills by category if available, otherwise define default categories
  const categories = ['All', 'Frontend', 'Backend', 'DevOps'];
  const filteredSkills = activeTab === 'All' 
    ? skills 
    : skills.filter(s => s.category?.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neutral-800 selection:text-white overflow-x-hidden scroll-smooth">
      {/* Apple-style sticky top nav */}
      <nav className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-neutral-900 transition-colors">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
          <a href="#overview" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              {personal.name.split(' ')[0]}.
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                className="text-xs text-neutral-400 hover:text-white transition-colors tracking-tight font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="#contact" 
              className="bg-blue-600 text-white hover:bg-blue-500 text-xs px-3.5 py-1.5 rounded-full font-medium transition-colors tracking-tight shadow-sm"
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile hamburger trigger */}
          <button 
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden text-neutral-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-x-0 top-12 z-40 bg-black border-b border-neutral-900 overflow-hidden md:hidden"
          >
            <div className="flex flex-col px-8 py-6 gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg text-neutral-300 hover:text-white transition-colors tracking-tight font-medium"
                >
                  {link.label}
                </a>
              ))}
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="bg-blue-600 text-white hover:bg-blue-500 text-center py-3 rounded-xl font-medium transition-colors tracking-tight mt-2"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section: Overview (Hero) */}
      <section id="overview" className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-neutral-950 to-black">
        <div className="max-w-4xl mx-auto text-center z-10 flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4"
          >
            New Generation
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-8xl font-bold tracking-tighter leading-none mb-6 bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent"
          >
            {personal.name}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-3xl text-neutral-400 max-w-2xl font-light tracking-tight mb-8"
          >
            {personal.title}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-3 text-neutral-500 text-sm font-medium mb-12"
          >
            <MapPin size={16} className="text-blue-500" />
            <span>{personal.location}</span>
          </motion.div>

          {/* Scroll-triggered reveal device mimicking premium hardware */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.85, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl p-1.5 bg-neutral-900 border border-neutral-800 shadow-[0_0_80px_rgba(255,255,255,0.03)] group"
          >
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20 flex items-center justify-center border border-neutral-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 mr-1.5"></span>
              <span className="w-1 h-1 rounded-full bg-neutral-800"></span>
            </div>
            
            <div className="w-full h-full rounded-[20px] overflow-hidden bg-black relative flex items-center justify-center border border-neutral-950">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10 pointer-events-none" />
              <img 
                src={personal.avatar} 
                alt={personal.name} 
                className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100"
              />
            </div>

            {/* Glowing borders */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none -z-10" />
          </motion.div>

          {/* Technical Specs Indicators (Quick Stats) */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-6 md:gap-16 mt-20 max-w-xl w-full border-t border-neutral-900 pt-10"
          >
            {[
              { label: 'Experience', value: `${stats.yearsExperience} yrs` },
              { label: 'Completed', value: `${stats.projectsCompleted}+` },
              { label: 'Happy Clients', value: `${stats.happyClients}+` },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center">
                <div className="text-2xl md:text-4xl font-semibold tracking-tight text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xxs md:text-xs text-neutral-500 uppercase tracking-widest font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Ambient background accent */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      </section>

      {/* Section: About */}
      <section id="about" className="py-24 px-6 border-t border-neutral-900 bg-black">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest block mb-3">Designed by Alex</span>
            <h2 className="text-3xl md:text-6xl font-bold tracking-tight text-white leading-tight max-w-3xl">
              Uncompromising code.<br />Elegant engineering solutions.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* Bio Section */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="md:col-span-7"
            >
              <p className="text-lg md:text-xl text-neutral-400 font-light leading-relaxed mb-6">
                {personal.bio}
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                {socials.github && (
                  <a 
                    href={socials.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-white border border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900 hover:border-neutral-700 px-4 py-2.5 rounded-full transition-all"
                  >
                    <Github size={14} />
                    <span>GitHub</span>
                    <ArrowUpRight size={12} className="text-neutral-500" />
                  </a>
                )}
                {socials.linkedin && (
                  <a 
                    href={socials.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-white border border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900 hover:border-neutral-700 px-4 py-2.5 rounded-full transition-all"
                  >
                    <Linkedin size={14} />
                    <span>LinkedIn</span>
                    <ArrowUpRight size={12} className="text-neutral-500" />
                  </a>
                )}
                {socials.twitter && (
                  <a 
                    href={socials.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-xs font-medium text-neutral-300 hover:text-white border border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900 hover:border-neutral-700 px-4 py-2.5 rounded-full transition-all"
                  >
                    <Twitter size={14} />
                    <span>Twitter</span>
                    <ArrowUpRight size={12} className="text-neutral-500" />
                  </a>
                )}
              </div>
            </motion.div>

            {/* Spec Sheet Grid */}
            <motion.div 
              variants={scaleUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="md:col-span-5 bg-neutral-950 border border-neutral-900 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
              <h3 className="text-lg font-semibold tracking-tight text-white mb-6 flex items-center gap-2 border-b border-neutral-900 pb-4">
                <Cpu size={18} className="text-blue-500" />
                Technical Overview
              </h3>

              <div className="space-y-4">
                {[
                  { label: 'Role', value: 'Creative Engineer' },
                  { label: 'Base Location', value: personal.location },
                  { label: 'Specialty', value: 'Full Stack Web Dev' },
                  { label: 'Primary Stack', value: 'React / TS / Node' },
                  { label: 'Availability', value: 'Immediate / Remote' },
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between items-center text-xs py-1">
                    <span className="text-neutral-500 font-medium">{spec.label}</span>
                    <span className="text-neutral-300 font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section: Skills (Engine room comparison specs) */}
      <section id="skills" className="py-24 px-6 border-t border-neutral-900 bg-neutral-950/40">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest block mb-3">Power & Efficiency</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Compare our most advanced skills yet.
            </h2>
            <p className="text-neutral-400 text-sm md:text-base font-light max-w-xl mx-auto">
              Optimized for clean architecture, fast iterations, and responsive UX layouts.
            </p>

            {/* Category tabs */}
            <div className="flex justify-center gap-2 mt-8 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`text-xs px-4 py-2 rounded-full font-medium transition-all ${
                    activeTab === cat 
                      ? 'bg-white text-black shadow-md' 
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Skill Specification Comparison Sheet */}
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredSkills.map((skill, index) => {
              // Determine icon based on category or default
              let IconComponent = Cpu;
              if (skill.category?.toLowerCase() === 'backend') IconComponent = Database;
              if (skill.category?.toLowerCase() === 'devops') IconComponent = Terminal;
              if (skill.category?.toLowerCase() === 'frontend') IconComponent = Layers;

              return (
                <motion.div 
                  key={index}
                  variants={scaleUp}
                  whileHover={{ y: -4, borderColor: '#3b82f6/40' }}
                  className="bg-black/40 border border-neutral-900 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.03)]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-neutral-900 text-neutral-400 border border-neutral-800/80">
                        <IconComponent size={18} />
                      </div>
                      <span className="font-bold text-sm text-neutral-200">{skill.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-neutral-500">{skill.category}</span>
                  </div>

                  {/* Sleek progress line inspired by hardware capacity bars */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-neutral-600 uppercase font-bold tracking-wider">Performance</span>
                      <span className="text-neutral-400 font-semibold">{skill.level}% Capable</span>
                    </div>
                    <div className="h-1 bg-neutral-900 rounded-full overflow-hidden border border-neutral-950">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: index * 0.05 }}
                        className="h-full bg-gradient-to-r from-blue-600 to-neutral-200 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Section: Projects (Scale Reveal Showcase) */}
      <section id="projects" className="py-24 px-6 border-t border-neutral-900 bg-black">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="mb-16 text-center md:text-left"
          >
            <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest block mb-3">Portfolio Showcase</span>
            <h2 className="text-3xl md:text-6xl font-bold tracking-tight text-white mb-4">
              Pro. Beyond.
            </h2>
            <p className="text-neutral-400 text-sm md:text-base font-light max-w-xl">
              Explore featured projects demonstrating software architectural design and visual mastery.
            </p>
          </motion.div>

          {/* Staggered project list with scale reveals */}
          <div className="space-y-20">
            {projects.map((project, index) => (
              <motion.div 
                key={index}
                variants={scaleUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
              >
                {/* Visual screen/viewport container mimicking laptop/tablet display */}
                <div className={`lg:col-span-7 relative order-1 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <motion.div 
                    whileHover={{ scale: 1.015 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] aspect-[16/10] p-1 flex flex-col"
                  >
                    {/* Header bar of browser window */}
                    <div className="h-5 flex items-center px-3 gap-1.5 bg-neutral-950 border-b border-neutral-900 rounded-t-xl shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-800"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-800"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-800"></span>
                      <div className="mx-auto w-32 h-2.5 rounded-md bg-neutral-900 border border-neutral-850"></div>
                    </div>
                    
                    {/* Browser page contents */}
                    <div className="w-full flex-1 overflow-hidden relative bg-black rounded-b-xl flex items-center justify-center">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Project information layout */}
                <div className={`lg:col-span-5 flex flex-col justify-center order-2 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xxs font-bold px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-blue-400">
                      0{index + 1}
                    </span>
                    {project.featured && (
                      <span className="text-xxs font-bold px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-400 border border-blue-600/20 flex items-center gap-1">
                        <Sparkles size={8} /> Featured
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-4">
                    {project.title}
                  </h3>
                  
                  <p className="text-neutral-400 text-sm md:text-base font-light leading-relaxed mb-6">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tech, techIndex) => (
                      <span 
                        key={techIndex} 
                        className="text-xxs px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-900 font-semibold text-neutral-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 border-t border-neutral-900 pt-6">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full transition-all shadow-sm"
                      >
                        <span>Visit Site</span>
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-semibold text-neutral-300 hover:text-white border border-neutral-850 bg-neutral-950 px-4 py-2 rounded-full transition-all hover:bg-neutral-900"
                      >
                        <Github size={14} />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Experience (Processor epochs timeline) */}
      <section id="experience" className="py-24 px-6 border-t border-neutral-900 bg-neutral-950/40">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest block mb-3">Epoch Generations</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              A history of breakthrough iterations.
            </h2>
            <p className="text-neutral-400 text-sm md:text-base font-light">
              Advancing core capabilities year after year.
            </p>
          </motion.div>

          <div className="relative border-l border-neutral-900 pl-6 md:pl-10 space-y-12 max-w-2xl mx-auto">
            {experience.map((exp, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="relative"
              >
                {/* Timeline node chip icon */}
                <span className="absolute -left-12 md:-left-16 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black border border-neutral-800 text-blue-500 shadow-xl">
                  <Cpu size={12} />
                </span>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                      {exp.role}
                    </h3>
                    <span className="text-sm font-semibold text-blue-500">
                      {exp.company}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-neutral-500 mt-1 md:mt-0 flex items-center gap-1.5">
                    <Calendar size={12} />
                    {exp.period}
                  </span>
                </div>
                
                <p className="text-sm text-neutral-400 leading-relaxed font-light mt-3">
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Testimonials */}
      <section id="testimonials" className="py-24 px-6 border-t border-neutral-900 bg-black">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest block mb-3">Client Reviews</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              What the industry says.
            </h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((test, index) => (
              <motion.div 
                key={index}
                variants={scaleUp}
                className="bg-neutral-950 border border-neutral-900 rounded-3xl p-8 relative flex flex-col justify-between shadow-lg"
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                
                <div className="mb-6">
                  {/* Stars indicators */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-neutral-400 text-sm font-light italic leading-relaxed">
                    "{test.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-neutral-900 pt-6 mt-auto">
                  <img 
                    src={test.avatar} 
                    alt={test.name} 
                    className="w-10 h-10 rounded-full object-cover border border-neutral-800 bg-neutral-900"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{test.name}</h4>
                    <p className="text-[10px] text-neutral-500 font-semibold">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section: Contact */}
      <section id="contact" className="py-24 px-6 border-t border-neutral-900 bg-gradient-to-b from-black to-neutral-950">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            
            {/* Left side: Order CTA styling */}
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="md:col-span-5 text-center md:text-left"
            >
              <span className="text-blue-500 text-xs font-semibold uppercase tracking-widest block mb-3">Instant Checkout</span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                Ready to collaborate?
              </h2>
              <p className="text-neutral-400 text-sm font-light leading-relaxed mb-6">
                Upgrade your engineering pipeline by checking out today. Fill out your requirements to initialize connection.
              </p>
              {socials.email && (
                <div className="text-xs text-neutral-500 font-medium">
                  Direct Line: <a href={`mailto:${socials.email}`} className="text-blue-400 hover:underline">{socials.email}</a>
                </div>
              )}
            </motion.div>

            {/* Right side: Apple styled Checkout Order Form */}
            <motion.div 
              variants={scaleUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="md:col-span-7 bg-neutral-950 border border-neutral-900 rounded-3xl p-8 shadow-2xl relative"
            >
              <h3 className="text-lg font-semibold tracking-tight text-white mb-6 border-b border-neutral-900 pb-4">
                Configure Connection Proposal
              </h3>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">First Name</label>
                    <input 
                      type="text" 
                      placeholder="Jane" 
                      className="w-full bg-black border border-neutral-900 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-700 outline-none transition-colors"
                      required 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="jane.doe@company.com" 
                      className="w-full bg-black border border-neutral-900 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-700 outline-none transition-colors"
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Message Details</label>
                  <textarea 
                    rows={4} 
                    placeholder="Describe your project, timeline, or engineering goals..." 
                    className="w-full bg-black border border-neutral-900 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-700 outline-none transition-colors resize-none"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  <span>Submit Connection Request</span>
                  <ChevronRight size={14} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black border-t border-neutral-900 text-neutral-500">
        <div className="max-w-5xl mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-neutral-700"></span>
            <p className="text-xs">
              Copyright © {new Date().getFullYear()} {personal.name}. Designed in California.
            </p>
          </div>
          
          <div className="flex gap-6">
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Github size={16} />
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Linkedin size={16} />
              </a>
            )}
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Twitter size={16} />
              </a>
            )}
            {socials.email && (
              <a href={`mailto:${socials.email}`} className="hover:text-white transition-colors">
                <Mail size={16} />
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
