import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const CloudNineAerialSkyscape = () => {
  const { personal, socials, skills, projects, experience } = data;

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const cloudVariants = {
    animate: {
      x: [0, -20, 0, 20, 0],
      y: [0, 10, 0, -10, 0],
      transition: { repeat: Infinity, duration: 15, ease: 'easeInOut' }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-sky-100 to-white text-slate-800 font-sans relative overflow-hidden">
      {/* Decorative Clouds */}
      <motion.div variants={cloudVariants} animate="animate" className="absolute top-20 left-10 opacity-40 mix-blend-multiply w-64 h-32 bg-white rounded-full filter blur-2xl" />
      <motion.div variants={cloudVariants} animate="animate" style={{ animationDelay: '2s' }} className="absolute top-60 right-20 opacity-30 mix-blend-multiply w-96 h-48 bg-blue-100 rounded-full filter blur-3xl" />
      <motion.div variants={cloudVariants} animate="animate" style={{ animationDelay: '4s' }} className="absolute bottom-40 left-1/3 opacity-40 mix-blend-multiply w-80 h-40 bg-white rounded-full filter blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        
        {/* Header / Hero */}
        <motion.header 
          initial="hidden" 
          animate="visible" 
          variants={fadeIn}
          className="text-center space-y-6 mb-32"
        >
          <div className="mx-auto w-40 h-40 rounded-full bg-white p-2 shadow-xl shadow-sky-200/50 relative">
            <div className="absolute inset-0 rounded-full border-4 border-sky-300 border-dashed animate-[spin_10s_linear_infinite] opacity-50"></div>
            <img 
              src={personal.avatar || "https://github.com/identicons/default.png"} 
              alt={personal.name} 
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-500">
            {personal.name}
          </h1>
          <p className="text-2xl text-sky-700 font-medium">
            {personal.title}
          </p>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
            {personal.bio}
          </p>
          <div className="flex items-center justify-center gap-2 text-sky-600 font-medium">
            <MapPin size={20} />
            <span>{personal.location}</span>
          </div>

          <div className="flex justify-center gap-6 pt-6">
            <a href={socials.github} className="text-slate-400 hover:text-sky-600 transition-colors transform hover:-translate-y-1"><Github size={28} /></a>
            <a href={socials.linkedin} className="text-slate-400 hover:text-sky-600 transition-colors transform hover:-translate-y-1"><Linkedin size={28} /></a>
            <a href={socials.twitter} className="text-slate-400 hover:text-sky-600 transition-colors transform hover:-translate-y-1"><Twitter size={28} /></a>
            <a href={`mailto:${socials.email}`} className="text-slate-400 hover:text-sky-600 transition-colors transform hover:-translate-y-1"><Mail size={28} /></a>
          </div>
        </motion.header>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          
          {/* Left Column: Experience & Skills */}
          <div className="md:col-span-5 space-y-16">
            
            {/* Experience */}
            <motion.section 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-4">
                <span className="w-8 h-1 bg-sky-400 rounded-full"></span>
                Journey
              </h2>
              <div className="space-y-10 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-sky-200 before:to-transparent">
                {experience.map((exp, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-sky-100 group-[.is-active]:bg-sky-500 text-sky-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/40 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-800 text-lg">{exp.role}</h3>
                        <time className="text-sm font-medium text-sky-500 bg-sky-50 px-3 py-1 rounded-full">{exp.duration}</time>
                      </div>
                      <h4 className="font-medium text-sky-600 mb-2">{exp.company}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Skills */}
            <motion.section 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-4">
                <span className="w-8 h-1 bg-sky-400 rounded-full"></span>
                Expertise
              </h2>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, idx) => (
                  <div key={idx} className="bg-white/70 backdrop-blur-md px-5 py-3 rounded-xl border border-white/50 shadow-sm hover:bg-sky-50 transition-colors flex flex-col gap-2">
                    <span className="font-medium text-slate-700">{skill.name}</span>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-sky-400 to-blue-500 h-1.5 rounded-full" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

          </div>

          {/* Right Column: Projects */}
          <div className="md:col-span-7">
            <motion.section 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeIn}
            >
              <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-4">
                <span className="w-8 h-1 bg-sky-400 rounded-full"></span>
                Projects
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.map((project, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="group bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden border border-white/50 shadow-sm hover:shadow-xl hover:shadow-sky-100/50 transition-all duration-300"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-sky-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-xl text-slate-800 group-hover:text-sky-600 transition-colors">{project.title}</h3>
                        <a href={project.link} className="text-slate-400 hover:text-sky-500 bg-sky-50 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                          <ExternalLink size={16} />
                        </a>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies && project.technologies.map((tech, i) => (
                          <span key={i} className="text-xs font-medium text-sky-600 bg-sky-50/80 px-2 py-1 rounded-md border border-sky-100">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CloudNineAerialSkyscape;
