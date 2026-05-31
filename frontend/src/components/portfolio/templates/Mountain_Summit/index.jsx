import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Mail, Github, Linkedin, Twitter, ExternalLink,
  Mountain, Wind, Star, ChevronDown, Award, Briefcase, User
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

// Mountain SVG Divider
const MountainDivider = ({ flip = false }) => (
  <div className={`w-full overflow-hidden leading-none ${flip ? 'rotate-180' : ''}`}>
    <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
      <path d="M0,80 L0,40 L180,10 L360,50 L540,5 L720,45 L900,8 L1080,48 L1260,12 L1440,40 L1440,80 Z" fill="currentColor" />
    </svg>
  </div>
);

// Elevation Progress Bar
const ElevationBar = ({ progress }) => (
  <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-stone-200">
    <motion.div
      className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-sky-400"
      style={{ width: `${progress}%` }}
      transition={{ duration: 0.1 }}
    />
    <div
      className="absolute top-0 text-lg transition-all duration-100"
      style={{ left: `calc(${progress}% - 10px)` }}
    >⛰️</div>
  </div>
);

// Hero Section
const Hero = ({ data }) => (
  <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    style={{ background: 'linear-gradient(180deg, #0c1a2e 0%, #1a3a5c 40%, #4a7c59 80%, #6b5a3e 100%)' }}>
    {/* Stars */}
    {[...Array(30)].map((_, i) => (
      <div key={i} className="absolute rounded-full bg-white opacity-70"
        style={{
          width: Math.random() * 3 + 1,
          height: Math.random() * 3 + 1,
          top: `${Math.random() * 50}%`,
          left: `${Math.random() * 100}%`,
          animation: `pulse ${2 + Math.random() * 3}s infinite`
        }} />
    ))}
    {/* Mountain silhouette */}
    <div className="absolute bottom-0 w-full">
      <svg viewBox="0 0 1440 300" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <path d="M0,300 L0,200 L200,80 L400,180 L600,40 L800,160 L1000,60 L1200,170 L1440,90 L1440,300 Z"
          fill="#2d1f0e" opacity="0.9" />
        <path d="M0,300 L0,240 L300,140 L500,220 L700,100 L900,200 L1100,120 L1300,210 L1440,150 L1440,300 Z"
          fill="#1a1208" opacity="0.8" />
        {/* Snow caps */}
        <path d="M600,40 L570,90 L630,90 Z" fill="white" opacity="0.9" />
        <path d="M1000,60 L975,105 L1025,105 Z" fill="white" opacity="0.9" />
        <path d="M200,80 L182,115 L218,115 Z" fill="white" opacity="0.8" />
      </svg>
    </div>

    <motion.div className="relative z-10 text-center px-6" initial="hidden" animate="visible" variants={stagger}>
      <motion.div variants={fadeUp} className="mb-4">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-700/40 border border-amber-500/50 rounded-full text-amber-300 text-sm font-medium">
          <Mountain size={14} /> Summit Seeker
        </span>
      </motion.div>
      <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold text-white mb-4" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
        {data.personal.name}
      </motion.h1>
      <motion.p variants={fadeUp} className="text-xl md:text-2xl text-sky-300 mb-3 font-medium">
        {data.personal.title}
      </motion.p>
      <motion.p variants={fadeUp} className="text-stone-300 flex items-center justify-center gap-2 mb-8">
        <MapPin size={16} /> {data.personal.location}
      </motion.p>
      <motion.div variants={fadeUp} className="flex justify-center gap-4 flex-wrap">
        <a href="#about" className="px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-full font-semibold transition-all shadow-lg hover:shadow-amber-700/30">
          Begin the Ascent
        </a>
        <a href="#contact" className="px-6 py-3 border border-sky-400/60 hover:border-sky-400 text-sky-300 rounded-full font-semibold transition-all">
          Make Contact
        </a>
      </motion.div>
    </motion.div>

    <motion.div className="absolute bottom-8 text-white/60 z-10" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
      <ChevronDown size={28} />
    </motion.div>
  </section>
);

// About Section
const About = ({ data }) => (
  <section id="about" className="py-24 bg-stone-50">
    <div className="max-w-5xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
        className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div variants={fadeUp}>
          <img src={data.personal.avatar} alt={data.personal.name}
            className="w-72 h-72 rounded-2xl object-cover mx-auto shadow-2xl border-4 border-amber-700/30" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <span className="text-amber-700 font-semibold text-sm uppercase tracking-widest flex items-center gap-2 mb-3">
            <User size={16} /> Base Camp
          </span>
          <h2 className="text-4xl font-bold text-stone-800 mb-4">About Me</h2>
          <p className="text-stone-600 leading-relaxed mb-6">{data.personal.bio}</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Years Experience', value: data.stats.yearsExperience + '+' },
              { label: 'Projects', value: data.stats.projectsCompleted + '+' },
              { label: 'Happy Clients', value: data.stats.happyClients + '+' }
            ].map((s, i) => (
              <div key={i} className="text-center p-3 bg-white rounded-xl shadow-sm border border-stone-100">
                <div className="text-2xl font-bold text-amber-700">{s.value}</div>
                <div className="text-xs text-stone-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// Skills Section
const Skills = ({ data }) => {
  const categories = [...new Set(data.skills.map(s => s.category))];
  return (
    <section id="skills" className="py-24 bg-amber-50 text-stone-800 relative">
      <div className="text-amber-100"><MountainDivider flip /></div>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="text-amber-700 font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
              <Wind size={16} /> Elevation Map
            </span>
            <h2 className="text-4xl font-bold text-stone-800">Skills & Expertise</h2>
          </motion.div>
          {categories.map(cat => (
            <motion.div key={cat} variants={fadeUp} className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-amber-700 mb-4">{cat}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {data.skills.filter(s => s.category === cat).map((skill, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-stone-700">{skill.name}</span>
                      <span className="text-amber-700 font-bold text-sm">{skill.level}%</span>
                    </div>
                    <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-700 to-sky-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        viewport={{ once: true }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Projects Section
const Projects = ({ data }) => (
  <section id="projects" className="py-24 bg-stone-800 text-white relative">
    <div className="text-stone-800"><MountainDivider /></div>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-12">
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            <Mountain size={16} /> Peak Achievements
          </span>
          <h2 className="text-4xl font-bold text-white">Projects</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.projects.map((project, i) => (
            <motion.div key={i} variants={fadeUp}
              className="bg-stone-700/60 border border-stone-600/40 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all group hover:-translate-y-1">
              {project.image && (
                <div className="h-44 overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                <p className="text-stone-400 text-sm mb-4 leading-relaxed line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech, j) => (
                    <span key={j} className="px-2 py-0.5 bg-amber-700/30 text-amber-300 rounded-full text-xs font-medium border border-amber-700/30">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors">
                      <ExternalLink size={14} /> Live
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-stone-400 hover:text-white text-sm font-medium transition-colors">
                      <Github size={14} /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Experience Section
const Experience = ({ data }) => (
  <section id="experience" className="py-24 bg-stone-50">
    <div className="max-w-4xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-12">
          <span className="text-amber-700 font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            <Briefcase size={16} /> The Trail
          </span>
          <h2 className="text-4xl font-bold text-stone-800">Experience</h2>
        </motion.div>
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-amber-200 transform md:-translate-x-0.5" />
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp}
              className={`relative flex flex-col md:flex-row gap-6 mb-10 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="absolute left-6 md:left-1/2 w-3 h-3 bg-amber-700 rounded-full border-2 border-white shadow transform -translate-x-1.5 md:-translate-x-1.5 mt-5 z-10" />
              <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-10' : 'md:pl-10'}`}>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 hover:border-amber-200 transition-colors">
                  <span className="text-xs text-amber-700 font-semibold uppercase tracking-widest">{exp.period}</span>
                  <h3 className="text-lg font-bold text-stone-800 mt-1">{exp.role}</h3>
                  <p className="text-amber-700 font-medium text-sm mb-2">{exp.company}</p>
                  <p className="text-stone-500 text-sm leading-relaxed">{exp.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Testimonials Section
const Testimonials = ({ data }) => (
  <section id="testimonials" className="py-24 bg-sky-900 text-white">
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-12">
          <span className="text-sky-300 font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            <Star size={16} /> Fellow Climbers
          </span>
          <h2 className="text-4xl font-bold text-white">Testimonials</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUp}
              className="bg-sky-800/50 border border-sky-700/40 rounded-2xl p-6 hover:border-sky-500/50 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-sky-100 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-sky-500/40" />
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-sky-400 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Contact Section
const Contact = ({ data }) => (
  <section id="contact" className="py-24 bg-stone-900 text-white">
    <div className="max-w-2xl mx-auto px-6 text-center">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
        <motion.div variants={fadeUp}>
          <span className="text-amber-400 font-semibold text-sm uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            <Award size={16} /> Summit Reached
          </span>
          <h2 className="text-4xl font-bold text-white mb-4">Let's Connect</h2>
          <p className="text-stone-400 mb-8">Ready to start a new adventure together? Reach out!</p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex justify-center gap-4 flex-wrap mb-10">
          {data.socials.email && (
            <a href={`mailto:${data.socials.email}`}
              className="flex items-center gap-2 px-5 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-full font-semibold transition-all shadow-lg">
              <Mail size={18} /> Email Me
            </a>
          )}
          {data.socials.github && (
            <a href={data.socials.github} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 border border-stone-600 hover:border-stone-400 text-stone-300 hover:text-white rounded-full font-semibold transition-all">
              <Github size={18} /> GitHub
            </a>
          )}
          {data.socials.linkedin && (
            <a href={data.socials.linkedin} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 border border-stone-600 hover:border-sky-400 text-stone-300 hover:text-sky-300 rounded-full font-semibold transition-all">
              <Linkedin size={18} /> LinkedIn
            </a>
          )}
          {data.socials.twitter && (
            <a href={data.socials.twitter} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 border border-stone-600 hover:border-sky-400 text-stone-300 hover:text-sky-300 rounded-full font-semibold transition-all">
              <Twitter size={18} /> Twitter
            </a>
          )}
        </motion.div>
        <motion.p variants={fadeUp} className="text-stone-600 text-sm">
          © {new Date().getFullYear()} {data.personal.name} · Mountain Summit Portfolio
        </motion.p>
      </motion.div>
    </div>
  </section>
);

// Main Component
export default function MountainSummit() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans antialiased">
      <ElevationBar progress={scrollProgress} />
      {/* Nav */}
      <nav className="fixed top-2 left-1/2 transform -translate-x-1/2 z-40 bg-stone-900/80 backdrop-blur-md border border-stone-700/50 rounded-full px-6 py-2.5 flex gap-6">
        {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`}
            className="text-stone-400 hover:text-amber-400 text-sm font-medium transition-colors">
            {item}
          </a>
        ))}
      </nav>
      <Hero data={data} />
      <About data={data} />
      <Skills data={data} />
      <Projects data={data} />
      <Experience data={data} />
      <Testimonials data={data} />
      <Contact data={data} />
    </div>
  );
} 