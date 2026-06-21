import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Facebook, Twitter, Linkedin, Github, 
  Calendar, Globe, Mail, Phone, Coffee,
  MapPin, Code, Cpu, User, BookOpen, Terminal, Layers
} from 'lucide-react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import fallbackPortfolioData from '../../../../data/dummy_data.json';

const InspiredDebasishDutta = () => {
  const hookInstance = usePortfolio?.();
  const data = hookInstance?.portfolioData || fallbackPortfolioData;

  const [activeTab, setActiveTab] = useState('HOME');

  const tabs = ['HOME', 'ABOUT', 'SKILLS', 'MILESTONES', 'PROJECTS', 'CONTACT'];

  const personal = data.personal || {};
  const skills = data.skills || [];
  const experience = data.experience || [];
  const education = data.education || [];
  const projects = data.projects || [];
  const certifications = data.certifications || [];
  const testimonials = data.testimonials || [];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'HOME':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-[#333333] p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-colors flex flex-col items-center justify-center text-center group">
              <MapPin className="w-12 h-12 text-pink-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-gray-400 text-sm">Based in</h3>
              <p className="text-white font-semibold text-lg">{personal.location || 'Location Not Set'}</p>
            </div>
            <div className="bg-[#333333] p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-colors flex flex-col items-center justify-center text-center group">
              <Coffee className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-gray-400 text-sm">Fueled by</h3>
              <p className="text-white font-semibold text-lg">Coffee & Code</p>
            </div>
            <div className="bg-[#333333] p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-colors flex flex-col items-center justify-center text-center group">
              <Cpu className="w-12 h-12 text-teal-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-gray-400 text-sm">Focused on</h3>
              <p className="text-white font-semibold text-lg">{personal.title || 'Software Engineering'}</p>
            </div>
            <div className="bg-[#333333] p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-colors flex flex-col items-center justify-center text-center group">
              <Terminal className="w-12 h-12 text-blue-300 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-gray-400 text-sm">Passionate</h3>
              <p className="text-white font-semibold text-lg">Programmer</p>
            </div>
          </motion.div>
        );
      case 'ABOUT':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
            <section>
              <h2 className="text-3xl font-extrabold text-white mb-6 uppercase tracking-wider border-b border-gray-700/50 pb-4">Who Am I?</h2>
              <p className="text-gray-300 leading-loose text-base md:text-lg font-medium">
                {personal.bio || `Hello! I'm ${personal.name}, a passionate developer who loves building things for the web. I have a keen interest in core CS concepts and modern web technologies. I enjoy experimenting with different languages and libraries, and I've built many applications and contributed to various projects over the years.`}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-white mb-6 uppercase tracking-wider">My Coding Profiles</h2>
              <div className="flex flex-wrap items-center gap-8 bg-[#333333] p-6 rounded-2xl border border-gray-700/50 shadow-inner">
                 <span className="text-blue-400 font-bold text-xl cursor-pointer hover:scale-110 transition-transform">kaggle</span>
                 <span className="text-yellow-500 font-bold text-xl cursor-pointer hover:scale-110 transition-transform flex items-center gap-1"><Code className="w-5 h-5"/> LeetCode</span>
                 <span className="text-green-500 font-bold text-xl cursor-pointer hover:scale-110 transition-transform bg-[#2b2b2b] px-3 py-1 rounded">HackerRank</span>
                 <span className="text-amber-700 font-bold text-xl cursor-pointer hover:scale-110 transition-transform">CodeChef</span>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-white mb-6 uppercase tracking-wider">My Coding Activity</h2>
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-purple-500/10 transition-shadow">
                <h3 className="text-center text-indigo-700 font-semibold mb-6">Languages over Last Year</h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                   <div className="space-y-2 text-sm font-bold text-gray-700">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500"></div> Python (35.70%)</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500"></div> C++ (25.11%)</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500"></div> JavaScript (20.90%)</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500"></div> TypeScript (10.78%)</div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-400"></div> HTML/CSS (7.51%)</div>
                   </div>
                   <div className="relative w-48 h-48 rounded-full border-[16px] border-blue-500 shadow-xl" style={{ borderTopColor: '#eab308', borderRightColor: '#a855f7', borderBottomColor: '#22c55e' }}>
                      <div className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full"></div>
                   </div>
                </div>
              </div>
            </section>
          </motion.div>
        );
      case 'SKILLS':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
            
            <section>
              <h2 className="text-2xl font-extrabold text-white mb-6 uppercase tracking-wider">Top Skills</h2>
              <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                <div className="w-32 h-32 rounded-full border-2 border-yellow-500/50 bg-[#1e293b] flex items-center justify-center text-center shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:scale-110 transition-transform">
                  <span className="text-yellow-400 font-bold text-lg">Python</span>
                </div>
                <div className="w-32 h-32 rounded-full border-2 border-blue-500/50 bg-[#1e293b] flex items-center justify-center text-center shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:scale-110 transition-transform">
                  <span className="text-blue-400 font-bold text-lg">C++</span>
                </div>
                <div className="w-32 h-32 rounded-full border-2 border-purple-500/50 bg-[#1e293b] flex items-center justify-center text-center shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:scale-110 transition-transform">
                  <span className="text-purple-400 font-bold text-lg">CS Research</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-extrabold text-white mb-6 uppercase tracking-wider">My Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                
                {/* Languages Group */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700/50 pb-2">Programming Languages</h3>
                  {skills.slice(0, 5).map((skill, index) => (
                    <div key={index} className="flex flex-col gap-1.5 group">
                      <span className="text-white text-sm font-semibold group-hover:text-yellow-400 transition-colors">{skill.name || skill}</span>
                      <div className="w-full bg-[#1e293b] rounded-full h-3">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(50, 100 - index * 10)}%` }} transition={{ duration: 1, delay: index * 0.1 }} className="bg-yellow-500 h-3 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Technologies Group */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700/50 pb-2">Technologies</h3>
                  {skills.slice(5, 10).map((skill, index) => (
                    <div key={index} className="flex flex-col gap-1.5 group">
                      <span className="text-white text-sm font-semibold group-hover:text-teal-400 transition-colors">{skill.name || skill}</span>
                      <div className="w-full bg-[#1e293b] rounded-full h-3">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(40, 90 - index * 12)}%` }} transition={{ duration: 1, delay: index * 0.1 }} className="bg-teal-500 h-3 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Libraries Group */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700/50 pb-2">Libraries and Frameworks</h3>
                  {skills.slice(10, 15).map((skill, index) => (
                    <div key={index} className="flex flex-col gap-1.5 group">
                      <span className="text-white text-sm font-semibold group-hover:text-pink-500 transition-colors">{skill.name || skill}</span>
                      <div className="w-full bg-[#1e293b] rounded-full h-3">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(45, 95 - index * 8)}%` }} transition={{ duration: 1, delay: index * 0.1 }} className="bg-pink-600 h-3 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>
            
          </motion.div>
        );
      case 'MILESTONES':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
            
            {/* Education Section */}
            {education.length > 0 && (
              <section>
                <h2 className="text-2xl font-extrabold text-white mb-6 uppercase tracking-wider">Education</h2>
                <div className="space-y-4">
                  {education.map((edu, idx) => (
                    <div key={idx} className="bg-[#e2e8f0] p-4 rounded-md flex justify-between items-center group cursor-pointer hover:bg-white transition-colors">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                        <span className="text-gray-800 font-bold uppercase tracking-wide text-sm">{edu.degree || edu.institution}</span>
                      </div>
                      <span className="text-indigo-400 font-bold text-xl leading-none">+</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Trainings / Certifications Section */}
            {(certifications.length > 0 || projects.length > 0) && (
              <section>
                <h2 className="text-2xl font-extrabold text-white mb-6 uppercase tracking-wider">Trainings & Achievements</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...certifications, ...projects.slice(0, 4)].slice(0, 4).map((item, idx) => (
                    <motion.div key={idx} whileHover={{ y: -10 }} className="relative h-40 rounded-2xl overflow-hidden shadow-lg border border-gray-700 group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-purple-900/80 group-hover:opacity-75 transition-opacity z-10" />
                      <div className="absolute inset-0 flex items-center justify-center z-20 p-4 text-center">
                        <h3 className="text-white font-extrabold text-lg leading-tight drop-shadow-md">{item.name || item.title}</h3>
                      </div>
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-30 group-hover:scale-110 transition-transform duration-700" />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Experience Timeline */}
            <section>
              <h2 className="text-2xl font-extrabold text-white mb-8 uppercase tracking-wider">Experience</h2>
              <div className="relative border-l-4 border-purple-500/30 ml-4 md:ml-6 space-y-12 py-2">
                {experience.map((exp, index) => (
                  <div key={index} className="relative pl-8 md:pl-10">
                    <div className="absolute w-10 h-10 bg-[#2b2b2b] rounded-full flex items-center justify-center -left-[22px] top-0 border-4 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    </div>
                    <div className="bg-[#b3b9ff] text-gray-900 p-6 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative transform transition-all hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(99,102,241,0.4)] border border-indigo-200">
                      <div className="absolute top-6 -left-4 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[16px] border-r-[#b3b9ff]" />
                      <h3 className="text-xl font-extrabold text-indigo-900 mb-1">{exp.role}</h3>
                      <p className="text-indigo-700 font-bold text-sm uppercase tracking-wide mb-2">{exp.company}</p>
                      <p className="text-indigo-900/60 text-xs font-black bg-white/40 inline-block px-3 py-1 rounded-full mb-4">{exp.duration}</p>
                      <p className="text-base font-semibold leading-relaxed text-indigo-950/80">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </motion.div>
        );
      case 'PROJECTS':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
             <h2 className="text-xl font-bold text-white mb-6">Featured Projects</h2>
             <div className="grid grid-cols-1 gap-6">
                {projects.map((proj, idx) => (
                  <div key={idx} className="bg-[#333333] border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all flex flex-col md:flex-row group">
                    <div className="md:w-1/3 bg-gray-800 h-48 md:h-auto overflow-hidden relative">
                       {proj.image ? (
                         <img src={proj.image} alt={proj.title || "Project Screenshot"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
                           <Layers className="w-12 h-12" />
                         </div>
                       )}
                    </div>
                    <div className="p-6 md:w-2/3 flex flex-col justify-center">
                       <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{proj.title}</h3>
                       <p className="text-gray-400 text-sm mb-4 line-clamp-3">{proj.description}</p>
                       <div className="flex flex-wrap gap-2 mb-4">
                         {proj.technologies && proj.technologies.map((tech, i) => (
                           <span key={i} className="text-xs bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-md font-medium">{tech}</span>
                         ))}
                       </div>
                       <div className="mt-auto">
                          {proj.link && (
                            <a href={proj.link} target="_blank" rel="noreferrer" className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1">
                              View Project &rarr;
                            </a>
                          )}
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>
        );
      case 'CONTACT':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <h2 className="text-xl font-bold text-white mb-6">Get in Touch</h2>
            <div className="bg-[#333333] p-8 rounded-2xl border border-gray-700/50 text-center">
               <h3 className="text-2xl font-bold text-white mb-4">Let's build something together!</h3>
               <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                 I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
               </p>
               {personal.email && (
                 <a href={`mailto:${personal.email}`} className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-full transition-transform hover:scale-105">
                   Say Hello
                 </a>
               )}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] p-4 md:p-8 lg:p-12 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Main Container */}
      <div className="max-w-6xl mx-auto bg-[#2b2b2b] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-gray-800 flex flex-col lg:flex-row min-h-[85vh]">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-80 bg-[#2b2b2b] flex-shrink-0 p-8 flex flex-col">
          
          <div className="relative mb-6 mx-auto w-48 h-48 md:w-56 md:h-56">
            <img 
              src={personal.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80"} 
              alt={personal.name || 'Developer'} 
              className="w-full h-full object-cover rounded-3xl shadow-lg border-2 border-[#3a3a3a]"
            />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-3">{personal.name || 'Debasish Dutta'}</h1>
            <span className="inline-block bg-[#6366f1] text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-indigo-500/20">
              {personal.title || 'CS Researcher'}
            </span>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <a href={personal.facebook || '#'} className="w-10 h-10 rounded-full bg-[#3a3a3a] flex items-center justify-center text-[#8b8b8b] hover:bg-[#6366f1] hover:text-white transition-all"><Facebook className="w-4 h-4" /></a>
            <a href={personal.twitter || '#'} className="w-10 h-10 rounded-full bg-[#3a3a3a] flex items-center justify-center text-[#8b8b8b] hover:bg-[#6366f1] hover:text-white transition-all"><Twitter className="w-4 h-4" /></a>
            <a href={personal.linkedin || '#'} className="w-10 h-10 rounded-full bg-[#3a3a3a] flex items-center justify-center text-[#8b8b8b] hover:bg-[#6366f1] hover:text-white transition-all"><Linkedin className="w-4 h-4" /></a>
            <a href={personal.github || '#'} className="w-10 h-10 rounded-full bg-[#3a3a3a] flex items-center justify-center text-[#8b8b8b] hover:bg-[#6366f1] hover:text-white transition-all"><Github className="w-4 h-4" /></a>
          </div>

          <div className="space-y-4 mb-10 flex-1">
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Aug 20</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="truncate">{personal.website || 'www.example.com'}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="truncate">{personal.email || 'hello@example.com'}</span>
            </div>
            {personal.phone && (
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{personal.phone}</span>
              </div>
            )}
          </div>

          <button className="w-full bg-[#ffdd00] text-gray-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#ffe533] transition-colors shadow-lg shadow-yellow-500/10">
            <Coffee className="w-5 h-5" />
            Buy me a coffee
          </button>

        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-[#2b2b2b] flex flex-col relative rounded-r-3xl overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.1)]">
          
          {/* Top Navbar */}
          <div className="bg-[#333333] lg:bg-transparent lg:absolute top-0 right-0 w-full lg:w-auto p-4 lg:p-8 z-10">
            <div className="flex overflow-x-auto lg:overflow-visible gap-2 lg:bg-[#333333] lg:rounded-bl-3xl lg:px-6 lg:py-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-2 text-xs md:text-sm font-bold tracking-wider rounded-full transition-colors whitespace-nowrap ${
                    activeTab === tab 
                    ? 'bg-[#6366f1] text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="flex-1 p-6 md:p-10 lg:p-12 lg:pt-32 overflow-y-auto custom-scrollbar">
             <AnimatePresence mode="wait">
               {renderContent()}
             </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
};

export default InspiredDebasishDutta;
