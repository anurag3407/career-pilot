import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Bamboo Stalk Component for Parallax Background
const BambooStalk = ({ left, width, delay, duration }) => {
  return (
    <motion.div
      className="absolute top-0 bottom-0 bg-gradient-to-b from-[#A3B899]/10 via-[#8FBC8F]/20 to-[#A3B899]/10"
      style={{ left: `${left}%`, width: `${width}px` }}
      initial={{ y: "100%" }}
      animate={{ y: "-100%" }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration: duration,
        delay: delay,
        ease: "linear"
      }}
    >
      {/* Bamboo Nodes */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="w-full h-1 bg-[#2C3E35]/10 mt-24 shadow-sm" />
      ))}
    </motion.div>
  );
};

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#8FBC8F] pointer-events-none z-[100] mix-blend-difference"
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
      }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
    >
      <div className="w-1 h-1 bg-[#8FBC8F] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </motion.div>
  );
};

const ZenBambooForestWind = () => {
  const { portfolioData } = usePortfolio();
  const { personal, socials, projects, skills, experience } = portfolioData;
  const { scrollYProgress } = useScroll();
  const yBackground = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2C3E35] font-serif overflow-hidden relative selection:bg-[#A3B899] selection:text-white">
      <CustomCursor />
      
      {/* Interactive Background */}
      <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ y: yBackground }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/rice-paper.png')" }}></div>
        <BambooStalk left={10} width={40} delay={0} duration={25} />
        <BambooStalk left={85} width={60} delay={5} duration={35} />
        <BambooStalk left={50} width={20} delay={10} duration={20} />
      </motion.div>

      {/* Floating Leaves Animation */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-2 bg-[#8FBC8F]/30 rounded-full"
            style={{ borderRadius: '100% 0% 100% 0%' }}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -20, 
              rotate: 0 
            }}
            animate={{ 
              x: [null, Math.random() * window.innerWidth + 200],
              y: window.innerHeight + 20,
              rotate: 360
            }}
            transition={{
              duration: 10 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed w-full top-0 z-50 bg-[#F9F6F0]/70 backdrop-blur-md border-b border-[#2C3E35]/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-xl font-semibold tracking-[0.2em] text-[#4A5D4E] uppercase cursor-pointer"
          >
            {personal?.name?.split(' ')[0] || 'Zen'}
          </motion.div>
          <div className="flex gap-10 text-xs uppercase tracking-[0.3em] text-[#6B8068]">
            {['About', 'Work', 'Path'].map((item) => (
              <motion.a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                whileHover={{ y: -2, color: '#2C3E35' }}
                className="hover:text-[#2C3E35] transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-[#8FBC8F] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section id="about" className="min-h-screen flex items-center justify-center px-6 pt-20 relative">
          <motion.div 
            style={{ opacity: opacityHero, y: yHero }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <span className="text-[#8FBC8F] text-sm tracking-[0.4em] uppercase font-sans border border-[#8FBC8F]/30 px-6 py-2 rounded-full inline-block backdrop-blur-sm">
                Mindful Creation
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-medium mb-6 leading-tight text-[#2C3E35]"
            >
              {personal?.name || 'Your Name'}
            </motion.h1>
            
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-2xl md:text-4xl text-[#6B8068] mb-10 font-light italic"
            >
              {personal?.title || 'Your Title'}
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-[#4A5D4E]/80 leading-relaxed font-sans font-light"
            >
              {personal?.bio || 'Your bio goes here.'}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-16 flex justify-center gap-6"
            >
              {socials && Object.entries(socials).map(([platform, url], index) => url && (
                <motion.a 
                  key={platform} 
                  href={url} 
                  target="_blank" 
                  rel="noreferrer"
                  whileHover={{ y: -5, scale: 1.1, backgroundColor: '#A3B899', color: '#fff' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + (index * 0.1) }}
                  className="w-14 h-14 rounded-full border border-[#A3B899] flex items-center justify-center text-[#6B8068] transition-all duration-300"
                >
                  <span className="sr-only">{platform}</span>
                  <i className={`fab fa-${platform === 'email' ? 'envelope fas' : platform} text-lg`}></i>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs tracking-[0.2em] text-[#8FBC8F] uppercase font-sans">Breathe</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-px h-12 bg-gradient-to-b from-[#8FBC8F] to-transparent"
            />
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="work" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-4xl md:text-5xl font-light mb-20 tracking-[0.2em] text-[#2C3E35] uppercase flex items-center gap-6"
            >
              <span className="w-12 h-px bg-[#8FBC8F]"></span>
              Selected Works
            </motion.h2>
            
            <div className="space-y-32">
              {projects && projects.slice(0, 4).map((project, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 group cursor-pointer`}
                >
                  {/* Image Container */}
                  <div className="w-full md:w-3/5 overflow-hidden rounded-lg bg-[#E8ECD7] relative shadow-xl">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="aspect-[4/3] w-full"
                    >
                      <div className="absolute inset-0 bg-[#2C3E35]/20 group-hover:bg-transparent transition-colors duration-700 z-10 mix-blend-overlay"></div>
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover filter sepia-[0.2] group-hover:sepia-0 transition-all duration-700" />
                    </motion.div>
                  </div>
                  
                  {/* Text Container */}
                  <div className={`w-full md:w-2/5 ${idx % 2 !== 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <motion.div 
                      initial={{ opacity: 0, x: idx % 2 !== 0 ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <h3 className="text-3xl font-medium mb-4 text-[#2C3E35]">{project.title}</h3>
                      <p className="text-[#6B8068] font-sans font-light text-lg mb-8 leading-relaxed">
                        {project.description}
                      </p>
                      <div className={`flex flex-wrap gap-3 ${idx % 2 !== 0 ? 'justify-end' : ''}`}>
                        {project.techStack && project.techStack.map((tech, i) => (
                          <span key={i} className="text-xs tracking-[0.1em] uppercase text-[#4A5D4E] font-sans px-3 py-1 bg-[#8FBC8F]/10 rounded-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <motion.div 
                        whileHover={{ x: idx % 2 !== 0 ? -10 : 10 }}
                        className={`mt-10 flex ${idx % 2 !== 0 ? 'justify-end' : ''}`}
                      >
                        <span className="text-sm uppercase tracking-widest text-[#8FBC8F] font-semibold flex items-center gap-2">
                          View Project 
                          <span className="w-8 h-px bg-[#8FBC8F] inline-block"></span>
                        </span>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="path" className="py-32 px-6 bg-[#E8ECD7]/30 border-y border-[#2C3E35]/5 relative">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-light mb-24 text-center tracking-[0.2em] text-[#2C3E35] uppercase"
            >
              Journey
            </motion.h2>
            
            <div className="space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#8FBC8F]/50 before:to-transparent">
              {experience && experience.map((exp, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#F9F6F0] bg-[#8FBC8F] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-125">
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white/40 backdrop-blur-sm rounded-lg shadow-sm border border-white/50 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <h3 className="text-xl font-medium text-[#2C3E35]">{exp.role}</h3>
                      <span className="text-[#8FBC8F] font-sans text-xs tracking-widest uppercase font-semibold">
                        {exp.period}
                      </span>
                    </div>
                    <div className="text-[#6B8068] mb-4 font-sans italic text-sm">{exp.company}</div>
                    <p className="text-[#4A5D4E]/80 font-light font-sans leading-relaxed text-sm">{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-32 px-6 text-center relative overflow-hidden">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-light mb-20 tracking-[0.2em] text-[#2C3E35] uppercase"
          >
            Elements of Mastery
          </motion.h2>
          
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {skills && skills.map((skill, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: '#A3B899', 
                  color: '#fff',
                  borderColor: '#A3B899'
                }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: idx * 0.05,
                  hover: { duration: 0.2 }
                }}
                className="px-8 py-4 bg-white/60 backdrop-blur-sm border border-[#A3B899]/40 rounded-full text-[#4A5D4E] font-sans tracking-wider cursor-default shadow-sm relative overflow-hidden group"
              >
                <span className="relative z-10">{skill.name || skill}</span>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Footer */}
        <footer className="pt-32 pb-12 text-center text-[#6B8068] font-sans font-light text-xs tracking-widest uppercase border-t border-[#2C3E35]/10 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="mb-4">Cultivated with Zen Bamboo Forest Wind</p>
            <p>© {new Date().getFullYear()} {personal?.name || 'Your Name'}</p>
          </motion.div>
        </footer>
      </main>
    </div>
  );
};

export default ZenBambooForestWind;
