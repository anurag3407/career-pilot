import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { 
  Github, Linkedin, Twitter, Mail, 
  ExternalLink, Code, Briefcase, User, 
  MapPin, Calendar, ChevronDown, Monitor,
  Smartphone, Award
} from 'lucide-react';

export default function InspiredBhupendraSingh() {
  const { portfolioData: data } = usePortfolio();
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'experience', 'projects', 'contact'];
      let current = '';
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section;
          }
        }
      });
      
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-screen bg-[#050816] text-slate-300 font-sans selection:bg-[#915eff]/30 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;600;700;800&display=swap');
      `}</style>
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#915eff]/30 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#38ccf2]/10 rounded-full filter blur-3xl"></div>
        </div>
      
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#050816]/90 backdrop-blur-md py-4 shadow-lg shadow-[#915eff]/5' : 'bg-transparent py-6'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#915eff] to-[#38ccf2] cursor-pointer"
            onClick={() => scrollTo('home')}
          >
            {data.personal.name.split(' ')[0]}
            <span className="text-white">.</span>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, idx) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => scrollTo(item.id)}
                className={`text-sm font-medium tracking-wider uppercase transition-colors hover:text-[#915eff] ${activeSection === item.id ? 'text-[#915eff]' : 'text-slate-400'}`}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          <motion.a 
            href="#contact"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:flex border border-[#915eff] text-[#915eff] px-5 py-2 rounded-md font-medium hover:bg-[#915eff]/10 transition-colors"
          >
            Hire Me
          </motion.a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20 pb-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#915eff]/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.p variants={fadeInUp} className="text-[#915eff] font-mono tracking-widest uppercase">
              Hello, World! I am
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white leading-tight">
              {data.personal.name}.
            </motion.h1>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-slate-400">
              I build things for the web.
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-xl leading-relaxed">
              {data.personal.bio} I'm currently focused on building accessible, human-centered products as a {data.personal.title}.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
              <a href="#projects" className="bg-[#915eff] text-white px-8 py-3 rounded-md font-medium hover:bg-[#38ccf2] transition-colors shadow-lg shadow-[#915eff]/25">
                Check out my work!
              </a>
              <a href={data.socials.github} target="_blank" rel="noreferrer" className="flex items-center justify-center p-3 border border-slate-700 rounded-md text-slate-300 hover:text-white hover:border-[#915eff] transition-all">
                <Github size={20} />
              </a>
              <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-center p-3 border border-slate-700 rounded-md text-slate-300 hover:text-white hover:border-[#915eff] transition-all">
                <Linkedin size={20} />
              </a>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex justify-end relative"
          >
            <div className="relative w-80 h-80 rounded-2xl overflow-hidden border-2 border-slate-800 group">
              <div className="absolute inset-0 bg-[#915eff]/20 group-hover:bg-transparent transition-colors duration-500 z-10 mix-blend-multiply"></div>
              <img src={data.personal.avatar} alt={data.personal.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="absolute w-80 h-80 border-2 border-[#915eff] rounded-2xl top-4 -right-4 -z-10 group-hover:top-2 group-hover:-right-2 transition-all duration-500"></div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-[#080a1a]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="text-[#915eff] font-mono text-xl md:text-2xl mr-2">01.</span> About Me
              </h2>
              <div className="flex-1 h-[1px] bg-slate-800"></div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
              <motion.div variants={fadeInUp} className="md:col-span-3 space-y-4 text-slate-400 text-lg leading-relaxed">
                <p>
                  Hello! My name is {data.personal.name.split(' ')[0]} and I enjoy creating things that live on the internet. 
                  My interest in web development started back when I decided to try editing custom Tumblr themes — turns out 
                  hacking together HTML & CSS taught me a lot about HTML & CSS!
                </p>
                <p>
                  Fast-forward to today, and I've had the privilege of working at an advertising agency, a start-up, 
                  and a huge corporation. My main focus these days is building accessible, inclusive products and digital 
                  experiences for a variety of clients.
                </p>
                <p className="pt-4">Here are a few technologies I've been working with recently:</p>
                
                <ul className="grid grid-cols-2 gap-2 font-mono text-sm pt-2">
                  {data.skills.slice(0, 6).map((skill, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[#915eff]">
                      <ChevronDown size={14} className="-rotate-90" />
                      <span className="text-slate-300">{skill.name}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="md:col-span-2 hidden md:block">
                 <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                   <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                     <User size={18} className="text-[#915eff]" /> Quick Facts
                   </h3>
                   <ul className="space-y-4 text-sm text-slate-400">
                     <li className="flex items-start gap-3">
                       <MapPin size={16} className="mt-0.5 text-slate-500" />
                       <span>Based in {data.personal.location}</span>
                     </li>
                     <li className="flex items-start gap-3">
                       <Briefcase size={16} className="mt-0.5 text-slate-500" />
                       <span>{data.personal.title}</span>
                     </li>
                     <li className="flex items-start gap-3">
                       <Mail size={16} className="mt-0.5 text-slate-500" />
                       <a href={`mailto:${data.socials.email}`} className="hover:text-[#915eff] transition-colors">{data.socials.email}</a>
                     </li>
                   </ul>
                 </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="text-[#915eff] font-mono text-xl md:text-2xl mr-2">02.</span> Where I've Worked
              </h2>
              <div className="flex-1 h-[1px] bg-slate-800"></div>
            </motion.div>

            <div className="relative pl-4 md:pl-0">
              <div className="hidden md:block absolute left-[20px] top-2 bottom-2 w-[1px] bg-slate-800"></div>
              
              {data.experience.map((exp, idx) => (
                <motion.div variants={fadeInUp} key={idx} className="mb-12 relative md:pl-16">
                  <div className="hidden md:flex absolute left-[-4px] top-1.5 w-12 h-12 bg-[#050816] rounded-full border border-slate-800 items-center justify-center z-10">
                    <Briefcase size={18} className="text-[#915eff]" />
                  </div>
                  
                  <div className="bg-slate-900/30 p-6 md:p-8 rounded-xl border border-slate-800/50 hover:border-[#915eff]/30 transition-colors group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#915eff] transition-colors">
                        {exp.role} <span className="text-[#915eff]">@ {exp.company}</span>
                      </h3>
                      <span className="font-mono text-sm text-slate-500 flex items-center gap-2">
                        <Calendar size={14} /> {exp.period}
                      </span>
                    </div>
                    <p className="text-slate-400 text-base leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-[#080a1a]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="text-[#915eff] font-mono text-xl md:text-2xl mr-2">03.</span> Some Things I've Built
              </h2>
              <div className="flex-1 h-[1px] bg-slate-800"></div>
            </motion.div>

            <div className="space-y-24">
              {data.projects.map((project, idx) => (
                <motion.div 
                  variants={fadeInUp} 
                  key={idx} 
                  className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`}
                >
                  {/* Project Image */}
                  <div className="w-full md:w-3/5 relative group cursor-pointer">
                    <div className="absolute inset-0 bg-[#915eff]/20 group-hover:bg-transparent transition-colors duration-500 z-10 rounded-xl"></div>
                    <img 
                      src={project.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"} 
                      alt={project.title} 
                      className="w-full h-[300px] md:h-[400px] object-cover rounded-xl filter grayscale group-hover:grayscale-0 transition-all duration-500 border border-slate-800"
                    />
                  </div>
                  
                  {/* Project Content */}
                  <div className={`w-full md:w-2/5 flex flex-col ${idx % 2 === 0 ? 'md:items-end text-left md:text-right' : 'md:items-start text-left'}`}>
                    <p className="text-[#915eff] font-mono text-sm mb-2">Featured Project</p>
                    <h3 className="text-2xl font-bold text-white mb-6 hover:text-[#915eff] transition-colors">
                      <a href={project.liveUrl || project.githubUrl} target="_blank" rel="noreferrer">{project.title}</a>
                    </h3>
                    
                    <div className={`bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-400 text-base leading-relaxed mb-6 z-20 ${idx % 2 === 0 ? 'md:-ml-12' : 'md:-mr-12'} shadow-xl`}>
                      {project.description}
                    </div>
                    
                    <ul className={`flex flex-wrap gap-4 font-mono text-xs text-slate-500 mb-6 ${idx % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      {project.techStack?.map((tech, i) => (
                        <li key={i}>{tech}</li>
                      ))}
                    </ul>
                    
                    <div className="flex gap-4 items-center text-slate-300">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:text-[#915eff] transition-colors">
                          <Github size={22} />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:text-[#915eff] transition-colors">
                          <ExternalLink size={22} />
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

      {/* Contact Section */}
      <section id="contact" className="py-32">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.p variants={fadeInUp} className="text-[#915eff] font-mono tracking-widest text-sm uppercase">
              04. What's Next?
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white">
              Get In Touch
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed pt-4">
              Although I'm not currently looking for any new opportunities, my inbox is always open. 
              Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </motion.p>
            
            <motion.div variants={fadeInUp} className="pt-12">
              <a href={`mailto:${data.socials.email}`} className="inline-block border border-[#915eff] text-[#915eff] px-8 py-4 rounded-md font-medium text-lg hover:bg-[#915eff]/10 transition-colors">
                Say Hello
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 font-mono text-sm border-t border-slate-900">
        <div className="flex justify-center gap-6 mb-4 md:hidden">
          <a href={data.socials.github} className="hover:text-[#915eff]"><Github size={20} /></a>
          <a href={data.socials.linkedin} className="hover:text-[#915eff]"><Linkedin size={20} /></a>
          <a href={data.socials.twitter} className="hover:text-[#915eff]"><Twitter size={20} /></a>
        </div>
        <p className="hover:text-[#915eff] transition-colors cursor-pointer">
          Built with React & Tailwind. Inspired by Bhupendra Singh.
        </p>
      </footer>
    </div>
  );
}
