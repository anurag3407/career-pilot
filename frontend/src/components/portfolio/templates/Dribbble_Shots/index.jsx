import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, ExternalLink, Github, Mail, MapPin, Briefcase, Award, Code, Palette, Terminal, Search } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

// --- Sub-components ---

const DribbbleShot = ({ image, title, description, techStack, liveUrl, githubUrl }) => {
  return (
    <div className="group relative flex flex-col w-full bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] rounded-t-2xl overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay (Appears on Hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          <h3 className="text-white font-bold text-lg mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{title}</h3>
          <p className="text-gray-200 text-sm line-clamp-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{description}</p>
          
          <div className="flex gap-2 mt-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
            {liveUrl && (
              <a href={liveUrl} className="flex-1 bg-white text-gray-900 hover:text-pink-500 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors" aria-label="Live Preview">
                <ExternalLink className="w-4 h-4" /> Live
              </a>
            )}
            {githubUrl && (
              <a href={githubUrl} className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors" aria-label="Source Code">
                <Github className="w-4 h-4" /> Code
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Shot Footer (Dribbble Style Meta) */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={data.personal.avatar} alt="Author" className="w-6 h-6 rounded-full" />
          <span className="text-sm font-semibold text-gray-900 truncate max-w-[100px]">{data.personal.name}</span>
          <span className="text-xs font-bold text-white bg-gray-300 px-1.5 py-0.5 rounded uppercase tracking-wider">Pro</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-xs font-semibold">
          <div className="flex items-center gap-1 hover:text-pink-500 cursor-pointer transition-colors">
            <Heart className="w-4 h-4" /> {Math.floor(Math.random() * 500) + 50}
          </div>
          <div className="flex items-center gap-1 hover:text-gray-600 cursor-pointer transition-colors">
            <MessageCircle className="w-4 h-4" /> {Math.floor(Math.random() * 50) + 5}
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillTag = ({ skill }) => {
  const Icon = skill.category === 'Frontend' ? Palette : (skill.category === 'Backend' ? Terminal : Code);
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:border-pink-300 hover:shadow-md transition-all cursor-default">
      <div className="bg-pink-50 text-pink-500 p-2 rounded-lg">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="text-gray-900 font-bold text-sm">{skill.name}</h4>
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            viewport={{ once: true }}
            className="bg-pink-500 h-1.5 rounded-full"
          />
        </div>
      </div>
      <span className="text-xs font-bold text-gray-400">{skill.level}%</span>
    </div>
  );
};

export default function DribbbleShots() {
  const { personal, socials, skills, projects, experience, testimonials, stats } = data;
  const [activeTab, setActiveTab] = useState('Shots');

  const tabs = ['Shots', 'Skills', 'Experience', 'About'];

  return (
    <div className="min-h-screen bg-[#fafafb] text-gray-800 font-sans selection:bg-pink-200">
      
      {/* NAVIGATION BAR */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src={personal.avatar} alt="Logo" className="w-8 h-8 rounded-full border border-gray-200" />
            <span className="font-black text-xl tracking-tight italic text-gray-900">{personal.name.split(' ')[0]}.</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-semibold text-gray-500">
            <a href="#" className="text-gray-900">Inspiration</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Find Work</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Learn Design</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Go Pro</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 text-gray-400 focus-within:ring-2 ring-pink-100 transition-all">
            <Search className="w-4 h-4 mr-2" />
            <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm font-medium w-32 placeholder-gray-400 text-gray-800" />
          </div>
          {socials.email && (
            <a href={`mailto:${socials.email}`} className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-colors">
              Hire Me
            </a>
          )}
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 py-12">
        
        {/* HERO / PROFILE HEADER */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16">
          <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 relative">
            <img src={personal.avatar} alt={personal.name} className="w-full h-full rounded-full object-cover shadow-lg border-4 border-white" />
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
              <div className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Pro</div>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{personal.name}</h1>
            <h2 className="text-lg md:text-xl font-bold text-pink-500 mb-4 flex justify-center md:justify-start items-center gap-2">
              <Briefcase className="w-5 h-5" /> {personal.title}
            </h2>
            <p className="text-gray-600 max-w-2xl leading-relaxed mb-6 font-medium">
              {personal.bio}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                <MapPin className="w-4 h-4" /> {personal.location}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                <Award className="w-4 h-4" /> {stats.yearsExperience}+ Years Exp.
              </span>
            </div>
            
            <div className="flex justify-center md:justify-start gap-3">
              {socials.github && (
                <a href={socials.github} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors" aria-label="GitHub">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors" aria-label="LinkedIn">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* TABS */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-gray-900 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="min-h-[500px]">
          {/* SHOTS TAB */}
          {activeTab === 'Shots' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projects.map((project, i) => (
                <DribbbleShot key={i} {...project} />
              ))}
            </motion.div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'Skills' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {skills.map((skill, i) => (
                <SkillTag key={i} skill={skill} />
              ))}
            </motion.div>
          )}

          {/* EXPERIENCE TAB */}
          {activeTab === 'Experience' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              {experience.map((exp, i) => (
                <div key={i} className="flex gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 flex-shrink-0 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center font-bold text-xl">
                    {exp.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                    <p className="text-gray-500 font-medium mb-3">{exp.company} • {exp.period}</p>
                    <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ABOUT TAB (Testimonials & Stats) */}
          {activeTab === 'About' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Feedback / Comments</h3>
              
              <div className="space-y-8">
                {testimonials.map((test, i) => (
                  <div key={i} className="flex gap-4">
                    <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full bg-gray-100" />
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{test.name}</h4>
                        <span className="text-xs font-semibold text-gray-400">{test.role}</span>
                      </div>
                      <div className="bg-gray-100 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl p-4 text-gray-700 leading-relaxed inline-block">
                        {test.text}
                      </div>
                      <div className="flex gap-4 mt-2 text-xs font-semibold text-gray-400">
                        <button className="hover:text-pink-500 transition-colors">Like</button>
                        <button className="hover:text-gray-900 transition-colors">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-gray-200 pt-12">
                 <div>
                   <div className="text-3xl font-black text-gray-900">{stats.projectsCompleted}</div>
                   <div className="text-sm font-semibold text-gray-500 mt-1">Shots</div>
                 </div>
                 <div>
                   <div className="text-3xl font-black text-gray-900">4.8k</div>
                   <div className="text-sm font-semibold text-gray-500 mt-1">Followers</div>
                 </div>
                 <div>
                   <div className="text-3xl font-black text-gray-900">{stats.happyClients}</div>
                   <div className="text-sm font-semibold text-gray-500 mt-1">Clients</div>
                 </div>
                 <div>
                   <div className="text-3xl font-black text-gray-900">12k</div>
                   <div className="text-sm font-semibold text-gray-500 mt-1">Appreciations</div>
                 </div>
              </div>
            </motion.div>
          )}
        </div>

      </main>

      {/* FOOTER / CTA */}
      <footer id="contact" className="bg-gray-900 py-20 px-6 mt-12 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Let's collaborate!</h2>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg">
          I'm available for freelance projects and full-time opportunities. Drop a message to say hello!
        </p>
        
        {socials.email && (
          <a href={`mailto:${socials.email}`} className="inline-flex items-center justify-center bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-4 rounded-full transition-colors text-lg shadow-[0_4px_14px_0_rgba(234,76,137,0.39)] hover:shadow-[0_6px_20px_rgba(234,76,137,0.23)] hover:-translate-y-1 transform duration-200">
            <Mail className="w-5 h-5 mr-3" /> Hire Me
          </a>
        )}
        
        <div className="border-t border-gray-800 mt-16 pt-8 max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <span className="font-black text-2xl italic text-white">{personal.name.split(' ')[0]}.</span>
          </div>
          <div className="text-gray-500 text-sm font-semibold">
            © 2024 {personal.name}. All rights reserved.
          </div>
          <div className="flex gap-4">
             {socials.twitter && <a href={socials.twitter} className="text-gray-500 hover:text-white transition-colors" aria-label="Twitter"><Share2 className="w-5 h-5" /></a>}
             {socials.github && <a href={socials.github} className="text-gray-500 hover:text-white transition-colors" aria-label="GitHub"><Github className="w-5 h-5" /></a>}
          </div>
        </div>
      </footer>

    </div>
  );
}
