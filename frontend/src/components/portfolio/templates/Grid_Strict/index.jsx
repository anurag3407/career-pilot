import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, ExternalLink, Code } from 'lucide-react';

// Minimal animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function GridStrict() {
  const { portfolioData: data } = usePortfolio();

  const { personal, socials, skills, projects, experience, testimonials, stats } = data;

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans">
      {/* Structural Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
        <div className="w-full h-full max-w-7xl mx-auto grid grid-cols-4 md:grid-cols-12 gap-0">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-full border-r border-black hidden md:block"></div>
          ))}
          {[...Array(4)].map((_, i) => (
            <div key={`m-${i}`} className="h-full border-r border-black md:hidden"></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HERO SECTION */}
        <motion.section 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="min-h-[80vh] pt-32 pb-16 border-b-2 border-black grid grid-cols-4 md:grid-cols-12 gap-6 items-end"
        >
          <motion.div variants={fadeInUp} className="col-span-4 md:col-span-12">
            <h1 className="text-6xl sm:text-8xl md:text-[9rem] font-bold tracking-tighter leading-none uppercase mb-4">
              {personal.name}
            </h1>
          </motion.div>
          <motion.div variants={fadeInUp} className="col-span-4 md:col-span-6 border-t-2 border-black pt-4 mt-8 md:mt-0">
            <h2 className="text-2xl md:text-3xl font-medium">{personal.title}</h2>
          </motion.div>
          <motion.div variants={fadeInUp} className="col-span-4 md:col-span-6 border-t-2 border-black pt-4">
            <p className="text-lg md:text-xl text-gray-600">{personal.location}</p>
          </motion.div>
        </motion.section>

        {/* ABOUT & STATS */}
        <section className="py-16 md:py-24 border-b-2 border-black grid grid-cols-4 md:grid-cols-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="col-span-4 md:col-span-5 h-[400px] border-2 border-black overflow-hidden relative group"
          >
            <img src={personal.avatar} alt={personal.name || "Profile Avatar"} className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0" />
          </motion.div>
          
          <div className="col-span-4 md:col-span-7 flex flex-col justify-between space-y-8 md:space-y-0">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-black pb-2">About Me</h3>
              <p className="text-2xl md:text-4xl leading-tight font-medium text-gray-800">
                {personal.bio}
              </p>
            </motion.div>
            
            <div className="grid grid-cols-3 gap-4 border-t-2 border-black pt-6">
              <div>
                <p className="text-4xl md:text-6xl font-bold tracking-tighter">{stats.yearsExperience}</p>
                <p className="text-sm font-bold uppercase text-gray-500 mt-2">Years Exp</p>
              </div>
              <div>
                <p className="text-4xl md:text-6xl font-bold tracking-tighter">{stats.projectsCompleted}</p>
                <p className="text-sm font-bold uppercase text-gray-500 mt-2">Projects</p>
              </div>
              <div>
                <p className="text-4xl md:text-6xl font-bold tracking-tighter">{stats.happyClients}</p>
                <p className="text-sm font-bold uppercase text-gray-500 mt-2">Clients</p>
              </div>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section className="py-16 md:py-24 border-b-2 border-black">
          <h3 className="text-xl font-bold uppercase tracking-widest mb-12 border-b border-black pb-2 inline-block">Technical Arsenal</h3>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8"
          >
            {skills.map((skill, index) => (
              <motion.div key={index} variants={fadeInUp} className="group">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-lg font-bold uppercase">{skill.name}</span>
                  <span className="text-sm font-bold text-gray-400 group-hover:text-black transition-colors">{skill.level}%</span>
                </div>
                <div className="h-3 w-full bg-gray-200 border border-black overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="h-full bg-black relative"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* PROJECTS */}
        <section className="py-16 md:py-24 border-b-2 border-black">
          <h3 className="text-xl font-bold uppercase tracking-widest mb-12 border-b border-black pb-2 inline-block">Selected Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {projects.map((project, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`col-span-1 border-2 border-black group overflow-hidden ${index % 3 === 0 ? 'md:col-span-12' : 'md:col-span-6'}`}
              >
                <div className={`relative ${index % 3 === 0 ? 'h-[400px] md:h-[600px]' : 'h-[300px] md:h-[400px]'} border-b-2 border-black overflow-hidden bg-gray-100`}>
                  <img src={project.image} alt={project.title || "Project Screenshot"} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {project.githubUrl && (
                      <a href={project.githubUrl} className="p-3 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors">
                        <Github size={20} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} className="p-3 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-6 md:p-8 bg-white transition-colors duration-300">
                  <h4 className="text-2xl md:text-4xl font-bold tracking-tight mb-4 uppercase">{project.title}</h4>
                  <p className="text-gray-600 md:text-lg mb-6 leading-relaxed max-w-3xl">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, i) => (
                      <span key={i} className="px-3 py-1 border border-black text-xs font-bold uppercase tracking-wider bg-gray-50">{tech}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="py-16 md:py-24 border-b-2 border-black">
          <div className="grid grid-cols-4 md:grid-cols-12 gap-6">
            <div className="col-span-4 md:col-span-4">
              <h3 className="text-xl font-bold uppercase tracking-widest border-b border-black pb-2 inline-block">Experience</h3>
            </div>
            <div className="col-span-4 md:col-span-8 space-y-12">
              {experience.map((exp, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="border-l-4 border-black pl-6 md:pl-10 py-2 relative"
                >
                  <div className="absolute -left-3 top-2 w-5 h-5 bg-black"></div>
                  <p className="text-sm font-bold text-gray-500 mb-2 font-mono">{exp.period}</p>
                  <h4 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">{exp.role}</h4>
                  <p className="text-xl text-gray-800 font-medium mb-4">{exp.company}</p>
                  <p className="text-gray-600 text-lg leading-relaxed">{exp.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 md:py-24 border-b-2 border-black">
          <h3 className="text-xl font-bold uppercase tracking-widest mb-12 border-b border-black pb-2 inline-block">Testimonials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 md:p-12 border-2 border-black bg-gray-50 flex flex-col justify-between h-full hover:bg-black hover:text-white transition-colors duration-500 group"
              >
                <div className="mb-8">
                  <Code className="w-10 h-10 mb-6 text-black group-hover:text-white" />
                  <p className="text-xl md:text-2xl font-medium leading-relaxed">"{test.text}"</p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t-2 border-black group-hover:border-gray-700">
                  <img src={test.avatar} alt={test.name || "Profile Avatar"} className="w-14 h-14 object-cover border-2 border-black group-hover:border-white" />
                  <div>
                    <h5 className="font-bold uppercase tracking-wider">{test.name}</h5>
                    <p className="text-sm font-bold text-gray-500 group-hover:text-gray-400">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FOOTER / CONTACT */}
        <footer className="py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="col-span-1 md:col-span-8">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-6 leading-none">Let's build<br />something.</h2>
              <a href={`mailto:${socials.email}`} className="inline-flex items-center gap-4 text-2xl md:text-4xl font-bold hover:underline decoration-4 underline-offset-8">
                {socials.email}
              </a>
            </div>
            <div className="col-span-1 md:col-span-4 flex flex-col md:items-end gap-6 border-t-2 md:border-t-0 border-black pt-8 md:pt-0">
              <div className="flex gap-4">
                {socials.github && (
                  <a href={socials.github} className="p-4 border-2 border-black hover:bg-black hover:text-white transition-colors group">
                    <Github size={24} className="group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {socials.linkedin && (
                  <a href={socials.linkedin} className="p-4 border-2 border-black hover:bg-black hover:text-white transition-colors group">
                    <Linkedin size={24} className="group-hover:scale-110 transition-transform" />
                  </a>
                )}
                {socials.twitter && (
                  <a href={socials.twitter} className="p-4 border-2 border-black hover:bg-black hover:text-white transition-colors group">
                    <Twitter size={24} className="group-hover:scale-110 transition-transform" />
                  </a>
                )}
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mt-4 md:mt-0">© {new Date().getFullYear()} {personal.name}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
