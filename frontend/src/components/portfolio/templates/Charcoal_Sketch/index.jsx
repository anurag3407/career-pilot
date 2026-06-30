import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import "./styles.css";
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ExternalLink, Briefcase, Award } from 'lucide-react';

export default function CharcoalSketch() {
  const { portfolioData: data } = usePortfolio();

const { personal, socials, skills, projects, experience, stats, testimonials } = data;
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-300 font-mono overflow-x-hidden selection:bg-zinc-700 selection:text-white">
      

      <div className="charcoal-bg min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-20 space-y-32">
          
          {/* ================= HERO & ABOUT ================= */}
          <section className="flex flex-col-reverse md:flex-row items-center gap-12 pt-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-2/3 space-y-6"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 tracking-tighter sketch-text">
                {personal.name}
              </h1>
              <h2 className="text-2xl text-zinc-400 italic">
                -- {personal.title}
              </h2>
              <div className="sketch-box p-6 md:p-8 mt-6">
                <p className="text-lg leading-relaxed text-zinc-300">
                  {personal.bio}
                </p>
                <div className="flex gap-4 mt-8">
                  {socials.github && <a href={socials.github} className="p-2 border border-zinc-600 rounded-full hover:bg-zinc-800 transition-colors"><Github size={20} /></a>}
                  {socials.linkedin && <a href={socials.linkedin} className="p-2 border border-zinc-600 rounded-full hover:bg-zinc-800 transition-colors"><Linkedin size={20} /></a>}
                  {socials.twitter && <a href={socials.twitter} className="p-2 border border-zinc-600 rounded-full hover:bg-zinc-800 transition-colors"><Twitter size={20} /></a>}
                  {socials.email && <a href={`mailto:${socials.email}`} className="p-2 border border-zinc-600 rounded-full hover:bg-zinc-800 transition-colors"><Mail size={20} /></a>}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full md:w-1/3 flex justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-zinc-600/30 blur-2xl rounded-full"></div>
                  <img 
                  src={personal.avatar} 
                  alt={personal.name} 
                  onError={(e) => { 
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(personal.name)}&background=27272a&color=a1a1aa`; 
                  }}
                  className="relative w-64 h-64 md:w-72 md:h-72 object-cover sketch-box grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </motion.div>
          </section>

          {/* ================= STATS ================= */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="sketch-box p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform">
              <span className="text-4xl font-bold text-zinc-100">{stats.yearsExperience}+</span>
              <span className="text-sm text-zinc-400 mt-2 uppercase tracking-widest">Years Exp</span>
            </div>
            <div className="sketch-box p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform">
              <span className="text-4xl font-bold text-zinc-100">{stats.projectsCompleted}</span>
              <span className="text-sm text-zinc-400 mt-2 uppercase tracking-widest">Projects</span>
            </div>
            <div className="sketch-box p-6 flex flex-col items-center justify-center text-center hover:-translate-y-2 transition-transform">
              <span className="text-4xl font-bold text-zinc-100">{stats.happyClients}</span>
              <span className="text-sm text-zinc-400 mt-2 uppercase tracking-widest">Clients</span>
            </div>
          </section>

          {/* ================= SKILLS ================= */}
          <section>
            <h3 className="text-3xl font-bold text-zinc-100 mb-10 flex items-center gap-4">
              <Award className="text-zinc-500" /> Technical Arsenal
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skills.map((skill, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="sketch-box p-4 flex flex-col justify-between"
                >
                  <span className="font-bold text-zinc-200">{skill.name}</span>
                  <div className="w-full h-1 bg-zinc-800 mt-4 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-zinc-400" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ================= EXPERIENCE ================= */}
          <section>
            <h3 className="text-3xl font-bold text-zinc-100 mb-10 flex items-center gap-4">
              <Briefcase className="text-zinc-500" /> Journey
            </h3>
            <div className="space-y-8 border-l-2 border-dashed border-zinc-700 pl-8 ml-4 relative">
              {experience.map((exp, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[41px] top-2 w-4 h-4 bg-zinc-900 border-2 border-zinc-500 rounded-full"></div>
                  <div className="sketch-box p-6">
                    <span className="text-zinc-500 text-sm font-bold">{exp.period}</span>
                    <h4 className="text-xl font-bold text-zinc-100 mt-1">{exp.role}</h4>
                    <span className="text-zinc-400 italic block mb-4">{exp.company}</span>
                    <p className="text-zinc-300 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ================= PROJECTS ================= */}
          <section>
            <h3 className="text-3xl font-bold text-zinc-100 mb-10">Charcoal Masterpieces</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="sketch-box group overflow-hidden flex flex-col"
                >
                  <div className="h-48 overflow-hidden border-b-2 border-zinc-700 relative">
                    <div className="absolute inset-0 bg-zinc-900/50 group-hover:bg-transparent transition-colors z-10"></div>
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h4 className="text-2xl font-bold text-zinc-100">{project.title}</h4>
                    <p className="text-zinc-400 mt-3 text-sm flex-grow">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.techStack.map((tech, i) => (
                        <span key={i} className="text-xs px-2 py-1 border border-zinc-700 rounded text-zinc-500">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-6 pt-4 border-t border-zinc-800 border-dashed">
                      {project.liveUrl && (
                        <a href={project.liveUrl} className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors">
                          <ExternalLink size={16} /> Live View
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors">
                          <Github size={16} /> Source
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ================= TESTIMONIALS ================= */}
          <section>
            <h3 className="text-3xl font-bold text-zinc-100 mb-10 text-center">Word on the Street</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="sketch-box p-8 relative"
                >
                  {/* Huge sketched quote mark */}
                  <div className="text-zinc-500 text-6xl absolute -top-4 -left-2 opacity-50 font-serif">"</div>
                  
                  <p className="text-zinc-300 italic mb-6 relative z-10 leading-relaxed">
                    {testimonial.text}
                  </p>
                  
                  <div className="flex items-center gap-4">
                      <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      onError={(e) => { 
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=27272a&color=a1a1aa`; 
                      }}
                      className="w-12 h-12 rounded-full sketch-box grayscale"
                    />
                    <div>
                      <h4 className="font-bold text-zinc-100">{testimonial.name}</h4>
                      <span className="text-sm text-zinc-500">{testimonial.role}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ================= FOOTER / CONTACT ================= */}
          <footer className="border-t-2 border-zinc-800 border-dashed pt-12 pb-24 text-center">
            <h3 className="text-3xl font-bold text-zinc-100 mb-6">Let's create something.</h3>
            <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
              My inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>
            <a 
              href={`mailto:${socials.email}`} 
              className="inline-block sketch-box px-8 py-4 text-zinc-100 font-bold hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Say Hello
            </a>
          </footer>

        </div>
      </div>
    </div>
  );
}