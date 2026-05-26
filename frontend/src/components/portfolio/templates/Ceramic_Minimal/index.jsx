import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Briefcase, FolderGit2, MessageSquare, Mail, 
  MapPin, Award, CheckCircle2, ArrowUpRight, Github, 
  Linkedin, Twitter, Globe 
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function CeramicMinimal() {
  // Common organic transition config block
  const smoothTransition = { duration: 0.8, ease: [0.25, 1, 0.5, 1] };

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#4A3E3D] selection:bg-[#D9C3B0] selection:text-[#3A2E2D] font-sans antialiased pb-20 overflow-x-hidden">
      
      {/* Decorative Sculpted Floating Elements */}
      <div className="absolute top-20 -left-16 w-64 h-64 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] bg-[#EADCC9]/50 blur-xl pointer-events-none" />
      <div className="absolute top-[40%] -right-20 w-80 h-80 rounded-[60%_40%_30%_70%_/_50%_60%_40%_60%] bg-[#DFD0BC]/40 blur-2xl pointer-events-none" />

      {/* Global Navigation Wrapper Header Area */}
      <header className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={smoothTransition}
          className="text-sm tracking-[0.2em] uppercase font-bold text-[#6D5A58]"
        >
          {data.personal.name.split(' ')[0]}.Studio
        </motion.div>
        <motion.a 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={smoothTransition}
          href="#contact" 
          className="text-xs tracking-wider uppercase font-semibold border-b border-[#4A3E3D] pb-1 hover:text-[#A0785C] hover:border-[#A0785C] transition-colors"
        >
          Inquire
        </motion.a>
      </header>

      {/* Hero / Header Section Container View */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.1 }}
          >
            <span className="inline-block bg-[#E8DFD8] text-[#8C6D53] text-xs px-4 py-1.5 rounded-full uppercase tracking-widest font-bold border border-[#DFD5CC]">
              Sculpting Digital Experiences
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.2 }}
            className="text-4xl sm:text-6xl font-serif text-[#2B2120] leading-[1.15]"
          >
            Organic Form <br />
            Meets <span className="italic font-normal text-[#9E7A66]">Minimalist</span> Code.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.3 }}
            className="text-base sm:text-lg text-[#6E5E5D] max-w-xl font-normal leading-relaxed"
          >
            I am <span className="font-semibold text-[#2B2120]">{data.personal.name}</span>, a {data.personal.title}. I structure systems with smooth pottery-inspired undertones, balancing visual touch elements with modular utility performance layout grids.
          </motion.p>
          
          {/* Key Metric Snapshot Badges Layout */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...smoothTransition, delay: 0.4 }}
            className="pt-6 flex flex-wrap gap-4"
          >
            <div className="bg-[#FAF6F0] border border-[#EBE3DA] rounded-2xl px-6 py-4 min-w-[140px] shadow-sm shadow-[#2B2120]/5">
              <div className="text-2xl font-serif font-bold text-[#2B2120]">{data.stats.yearsExperience}+</div>
              <div className="text-xs text-[#8A7977] uppercase tracking-wider mt-0.5">Years Journey</div>
            </div>
            <div className="bg-[#FAF6F0] border border-[#EBE3DA] rounded-2xl px-6 py-4 min-w-[140px] shadow-sm shadow-[#2B2120]/5">
              <div className="text-2xl font-serif font-bold text-[#2B2120]">{data.stats.projectsCompleted}+</div>
              <div className="text-xs text-[#8A7977] uppercase tracking-wider mt-0.5">Crafted Repos</div>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Avatar Ceramic Holder Mask */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...smoothTransition, delay: 0.3 }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-[#EADCC9] rounded-[50%_50%_45%_55%_/_55%_45%_55%_45%] border-4 border-[#FFFDFB] shadow-xl overflow-hidden p-3 animate-[morph_8s_ease-in-out_infinite]">
            {data.personal.avatar ? (
              <img 
                src={data.personal.avatar} 
                alt={data.personal.name} 
                className="w-full h-full object-cover rounded-[50%_50%_45%_55%_/_55%_45%_55%_45%]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#8C7674]">
                <User size={64} strokeWidth={1} />
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* About Section Block */}
      <section className="bg-[#EBE3DA] py-20 border-y border-[#DFD7CE] relative z-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <h2 className="text-xs tracking-[0.25em] uppercase font-bold text-[#8A716E] flex items-center gap-2">
              <User size={14} /> 01 / The Ethos
            </h2>
            <h3 className="text-2xl font-serif text-[#2B2120] mt-2">Clay, Earth, Form.</h3>
          </div>
          <div className="md:col-span-8 space-y-4">
            <p className="text-base sm:text-lg text-[#5A4B4A] leading-relaxed font-serif italic">
              "{data.personal.bio}"
            </p>
            <div className="flex items-center gap-1 text-xs text-[#8C6D53] font-medium pt-2">
              <MapPin size={13} /> Local Base Connection Node: {data.personal.location || "Distributed Server Hub"}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Showcase Section Module */}
      <section className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center max-w-md mx-auto mb-16 space-y-2">
          <h2 className="text-xs tracking-[0.25em] uppercase font-bold text-[#8A716E] flex items-center justify-center gap-2">
            <Award size={14} /> 02 / Capabilities
          </h2>
          <h3 className="text-3xl font-serif text-[#2B2120]">Sculpted Matrix Layer</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.skills.map((skill, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ ...smoothTransition, delay: index * 0.05 }}
              className="bg-[#FAF6F0] p-6 rounded-[24px] border border-[#EBE3DA] flex items-start gap-4 hover:shadow-md transition-all duration-300 group"
            >
              <div className="p-2.5 rounded-xl bg-[#F0E6DC] text-[#9E7A66] group-hover:bg-[#9E7A66] group-hover:text-[#F4EFEA] transition-colors shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <div className="space-y-1 w-full">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-semibold text-[#3A2E2D] text-sm">{skill.name}</h4>
                  <span className="text-xs text-[#8A7370]">{skill.level || 85}%</span>
                </div>
                <div className="w-full bg-[#EBE3DA] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#9E7A66] h-full rounded-full" style={{ width: `${skill.level || 85}%` }} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#A6928F] block pt-1">
                  {skill.category || "Core Stack"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Showcase Repositories Card Grid Section Container */}
      <section className="bg-[#FAF6F0] py-24 border-t border-[#EBE3DA] relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4">
            <div className="space-y-2">
              <h2 className="text-xs tracking-[0.25em] uppercase font-bold text-[#8A716E] flex items-center gap-2">
                <FolderGit2 size={14} /> 03 / Portfolio Focus
              </h2>
              <h3 className="text-3xl font-serif text-[#2B2120]">Fired Ceramic Modules</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.projects.map((project, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ ...smoothTransition, delay: index * 0.05 }}
                className="bg-[#F4EFEA] border border-[#E5DAD0] rounded-[32px] overflow-hidden flex flex-col hover:shadow-lg hover:border-[#D6C4B5] transition-all duration-300 group"
              >
                {project.image && (
                  <div className="h-48 overflow-hidden relative bg-[#EBE3DA]">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#3A2E2D]/5 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                )}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-lg font-serif text-[#2B2120] tracking-wide group-hover:text-[#9E7A66] transition-colors flex items-center justify-between gap-2">
                      {project.title}
                      <ArrowUpRight size={16} className="text-[#A6928F] group-hover:text-[#9E7A66] transition-colors shrink-0" />
                    </h4>
                    <p className="text-xs text-[#6E5E5D] leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {project.techStack && (
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.map((tech, tIdx) => (
                          <span key={tIdx} className="text-[10px] text-[#8C6D53] bg-[#EADCC9]/50 border border-[#DFD1BF] px-2 py-0.5 rounded-md font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4 pt-3 border-t border-[#EBE3DA] text-xs font-semibold text-[#5A4B4A]">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:text-[#9E7A66] transition-colors">
                          Deployment Link
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:text-[#9E7A66] transition-colors">
                          Repository Space
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience History Chronological Stream Container */}
      <section className="max-w-4xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-xs tracking-[0.25em] uppercase font-bold text-[#8A716E] flex items-center justify-center gap-2">
            <Briefcase size={14} /> 04 / Timeline Progression
          </h2>
          <h3 className="text-3xl font-serif text-[#2B2120]">Fired Growth Kiln</h3>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-4 sm:before:left-1/2 before:w-px before:bg-[#DED2C6]">
          {data.experience.map((exp, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={smoothTransition}
              className={`flex flex-col sm:flex-row items-start relative pl-10 sm:pl-0 ${index % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}
            >
              {/* Timeline Center Point Indicator Button Dot */}
              <div className="absolute left-1.5 sm:left-1/2 top-2 w-5 h-5 rounded-full bg-[#FAF6F0] border-4 border-[#9E7A66] -translate-x-1/2 z-10" />

              <div className="w-full sm:w-1/2 sm:px-8">
                <div className="bg-[#FAF6F0] p-6 rounded-[24px] border border-[#EBE3DA] space-y-2 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EBE3DA] pb-2">
                    <span className="text-xs font-bold text-[#9E7A66] uppercase tracking-wider">{exp.period}</span>
                    <span className="text-[11px] bg-[#EBE3DA] text-[#6E5E5D] px-2 py-0.5 rounded-full font-medium">{exp.company}</span>
                  </div>
                  <h4 className="text-base font-serif font-bold text-[#2B2120] pt-1">{exp.role}</h4>
                  <p className="text-xs text-[#5A4B4A] leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Review Slider Section Block Container */}
      <section className="bg-[#EADCC9]/40 py-24 border-y border-[#DFD1BF] relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-md mx-auto mb-16 space-y-2">
            <h2 className="text-xs tracking-[0.25em] uppercase font-bold text-[#8A716E] flex items-center justify-center gap-2">
              <MessageSquare size={14} /> 05 / Peer Endorsements
            </h2>
            <h3 className="text-3xl font-serif text-[#2B2120]">Validation Metrics Logs</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.testimonials.map((test, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={smoothTransition}
                className="bg-[#FAF6F0] p-8 rounded-[32px] border border-[#EBE3DA] flex flex-col justify-between space-y-6 shadow-sm relative"
              >
                <p className="text-sm font-serif text-[#4A3E3D] italic leading-relaxed relative z-10">
                  "{test.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#EBE3DA]">
                  {test.avatar && (
                    <img 
                      src={test.avatar} 
                      alt={test.name} 
                      className="w-10 h-10 rounded-full object-cover border border-[#DCD3C9] bg-[#EBE3DA]" 
                    />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-[#2B2120] uppercase tracking-wider">{test.name}</h4>
                    <span className="text-[11px] text-[#8C6D53]">{test.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Social Routing Footer Canvas Area */}
      <section id="contact" className="max-w-4xl mx-auto px-6 pt-24 relative z-10">
        <div className="text-center max-w-md mx-auto mb-12 space-y-2">
          <h2 className="text-xs tracking-[0.25em] uppercase font-bold text-[#8A716E] flex items-center justify-center gap-2">
            <Mail size={14} /> 06 / Transmission Channel
          </h2>
          <h3 className="text-3xl font-serif text-[#2B2120]">Initiate Collaboration</h3>
        </div>

        <div className="bg-[#FAF6F0] border border-[#EBE3DA] p-6 sm:p-10 rounded-[32px] shadow-sm">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#8A7370] font-semibold">Inquirer Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full bg-[#F4EFEA] border border-[#E5DAD0] text-sm text-[#4A3E3D] px-4 py-3 rounded-xl focus:outline-none focus:border-[#9E7A66] transition-colors placeholder:text-[#A6928F]" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#8A7370] font-semibold">Return Target Node</label>
                <input 
                  type="email" 
                  placeholder="name@domain.com" 
                  className="w-full bg-[#F4EFEA] border border-[#E5DAD0] text-sm text-[#4A3E3D] px-4 py-3 rounded-xl focus:outline-none focus:border-[#9E7A66] transition-colors placeholder:text-[#A6928F]" 
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#8A7370] font-semibold">Payload Message Buffer</label>
              <textarea 
                rows={4}
                placeholder="Describe project pipeline scope records..." 
                className="w-full bg-[#F4EFEA] border border-[#E5DAD0] text-sm text-[#4A3E3D] px-4 py-3 rounded-xl focus:outline-none focus:border-[#9E7A66] transition-colors placeholder:text-[#A6928F] resize-none" 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#4A3E3D] hover:bg-[#3A2F2E] text-[#FAF6F0] font-semibold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors duration-200 shadow-md shadow-[#4A3E3D]/10"
            >
              transmit_inquiry.cmd
            </button>
          </form>

          {/* Social Links Network Footer Board Block */}
          <div className="mt-10 pt-8 border-t border-[#EBE3DA] flex flex-wrap justify-between items-center gap-4 text-xs">
            <span className="text-[#8A7977] font-medium uppercase tracking-wider">
              © {new Date().getFullYear()} Studio Network Stack.
            </span>
            <div className="flex gap-4 text-[#6D5A58]">
              {data.socials.email && (
                <a href={`mailto:${data.socials.email}`} className="hover:text-[#9E7A66] transition-colors" title="Email Hub">
                  <Mail size={16} />
                </a>
              )}
              {data.socials.github && (
                <a href={data.socials.github} target="_blank" rel="noreferrer" className="hover:text-[#9E7A66] transition-colors" title="GitHub Source">
                  <Github size={16} />
                </a>
              )}
              {data.socials.linkedin && (
                <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#9E7A66] transition-colors" title="LinkedIn Profile">
                  <Linkedin size={16} />
                </a>
              )}
              {data.socials.twitter && (
                <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="hover:text-[#9E7A66] transition-colors" title="Twitter Feed">
                  <Twitter size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Morph Animation Styling Core Configuration Tags */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes morph {
          0% { rounded-radius: 50% 50% 45% 55% / 55% 45% 55% 45%; border-radius: 50% 50% 45% 55% / 55% 45% 55% 45%; }
          50% { rounded-radius: 45% 55% 55% 45% / 50% 50% 45% 55%; border-radius: 45% 55% 55% 45% / 50% 50% 45% 55%; }
          100% { rounded-radius: 50% 50% 45% 55% / 55% 45% 55% 45%; border-radius: 50% 50% 45% 55% / 55% 45% 55% 45%; }
        }
      `}} />
    </div>
  );
}