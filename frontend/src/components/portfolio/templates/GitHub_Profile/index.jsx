import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, MapPin, Link as LinkIcon, Mail, Star, 
  Book, GitFork, Circle, Twitter, Linkedin, Github, 
  Briefcase, MessageSquare, Smile, Code, BookOpen
} from 'lucide-react';

export default function GitHubProfile() {
  const { portfolioData: data } = usePortfolio();

  const [activeTab, setActiveTab] = useState('overview');
  
  // Helper to get random language colors
  const getLangColor = (lang) => {
    const colors = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#3178c6',
      'React': '#61dafb',
      'Node.js': '#339933',
      'Python': '#3572A5',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
    };
    return colors[lang] || '#8b949e';
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#58a6ff]/30 pb-12">
      {/* Top Navbar (GitHub style) */}
      <nav className="bg-[#161b22] px-4 py-3 flex items-center justify-between border-b border-[#30363d]">
        <div className="flex items-center gap-4">
          <Github className="w-8 h-8 text-white" />
          <div className="hidden md:flex items-center rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-1 w-64">
            <span className="text-sm text-[#8b949e]">Search or jump to...</span>
          </div>
          <div className="hidden md:flex gap-4 text-sm font-semibold text-white ml-2">
            <span className="cursor-pointer hover:text-gray-300">Pull requests</span>
            <span className="cursor-pointer hover:text-gray-300">Issues</span>
            <span className="cursor-pointer hover:text-gray-300">Codespaces</span>
            <span className="cursor-pointer hover:text-gray-300">Marketplace</span>
            <span className="cursor-pointer hover:text-gray-300">Explore</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <img src={data.personal.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-[#30363d]" />
        </div>
      </nav>

      {/* Main Layout */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 pt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Sidebar - Profile */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/4 flex flex-col"
          >
            <div className="relative">
              <img 
                src={data.personal.avatar} 
                alt={data.personal.name} 
                className="w-64 h-64 md:w-full md:h-auto rounded-full border border-[#30363d] mb-4 shadow-xl z-10 relative"
              />
              <div className="absolute bottom-12 right-12 md:bottom-8 md:right-8 bg-[#161b22] rounded-full p-2 border border-[#30363d] z-20 cursor-pointer hover:bg-[#30363d] transition-colors">
                <Smile className="w-5 h-5 text-[#8b949e]" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-[#c9d1d9] leading-tight mt-2">{data.personal.name}</h1>
            <h2 className="text-xl text-[#8b949e] font-light mb-4">{data.personal.title}</h2>
            
            <button className="w-full bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] text-[#c9d1d9] font-medium py-1.5 px-3 rounded-md transition-colors mb-4 cursor-pointer">
              Follow
            </button>
            
            <p className="text-[#c9d1d9] text-base mb-4">{data.personal.bio}</p>
            
            <div className="flex items-center gap-1 text-[#8b949e] text-sm mb-4 cursor-pointer hover:text-[#58a6ff] transition-colors">
              <Users className="w-4 h-4" />
              <span className="font-bold text-[#c9d1d9]">2.4k</span> followers · 
              <span className="font-bold text-[#c9d1d9]">14</span> following
            </div>
            
            <ul className="text-sm text-[#c9d1d9] space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8b949e]" />
                {data.personal.location}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8b949e]" />
                <a href={`mailto:${data.socials.email}`} className="hover:text-[#58a6ff] hover:underline">{data.socials.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#8b949e]" />
                <a href={data.socials.github} className="hover:text-[#58a6ff] hover:underline">{data.personal.name.replace(/\s+/g, '').toLowerCase()}.com</a>
              </li>
              {data.socials.twitter && (
                <li className="flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-[#8b949e]" />
                  <a href={data.socials.twitter} className="hover:text-[#58a6ff] hover:underline">@{data.socials.twitter.split('/').pop()}</a>
                </li>
              )}
            </ul>

            <hr className="border-[#30363d] mb-4" />
            
            <h3 className="text-sm font-semibold text-[#c9d1d9] mb-2">Achievements</h3>
            <div className="flex gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <Code className="w-4 h-4 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Right Content Area */}
          <div className="w-full md:w-3/4">
            
            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-[#30363d] mb-6 text-sm font-medium hide-scrollbar">
              {['Overview', 'Repositories', 'Projects', 'Packages', 'Stars'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === tab.toLowerCase() 
                      ? 'border-[#f78166] text-[#c9d1d9]' 
                      : 'border-transparent text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]'
                  }`}
                >
                  {tab === 'Overview' && <BookOpen className="w-4 h-4" />}
                  {tab === 'Repositories' && <Book className="w-4 h-4" />}
                  {tab}
                  {tab === 'Repositories' && <span className="bg-[#30363d] text-xs px-2 py-0.5 rounded-full ml-1">{data.projects.length}</span>}
                </button>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              
              {/* README section */}
              <div className="border border-[#30363d] rounded-md mb-6">
                <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] rounded-t-md text-xs text-[#8b949e] font-semibold flex items-center gap-2">
                  <span>{data.personal.name.replace(/\s+/g, '').toLowerCase()}</span>
                  <span className="text-[#30363d]">/</span>
                  <span className="font-bold">README.md</span>
                </div>
                <div className="p-6 bg-[#0d1117] rounded-b-md">
                  <h1 className="text-3xl font-bold border-b border-[#30363d] pb-2 mb-4 text-[#c9d1d9]">
                    Hi there 👋, I'm {data.personal.name}
                  </h1>
                  <p className="text-[#8b949e] mb-4 text-base">
                    {data.personal.bio} I'm currently working as a <strong>{data.personal.title}</strong>.
                  </p>
                  
                  <h2 className="text-xl font-semibold border-b border-[#30363d] pb-2 mb-4 mt-8 text-[#c9d1d9]">
                    🛠 Skills & Technologies
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {data.skills.map((skill, idx) => (
                      <span key={idx} className="bg-[#161b22] border border-[#30363d] text-[#58a6ff] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#30363d] transition-colors cursor-pointer">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pinned Projects */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base text-[#c9d1d9] font-normal">Pinned</h2>
                  <span className="text-xs text-[#8b949e] hover:text-[#58a6ff] cursor-pointer">Customize your pins</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.projects.map((project, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="border border-[#30363d] rounded-md p-4 bg-[#0d1117] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Book className="w-4 h-4 text-[#8b949e]" />
                          <a href={project.githubUrl || project.liveUrl} className="text-[#58a6ff] font-semibold text-sm hover:underline font-mono">
                            {project.title.toLowerCase().replace(/\s+/g, '-')}
                          </a>
                          <span className="border border-[#30363d] rounded-full px-2 py-0.5 text-xs text-[#8b949e] ml-auto">
                            Public
                          </span>
                        </div>
                        <p className="text-xs text-[#8b949e] mb-4 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                        {project.techStack && project.techStack[0] && (
                          <div className="flex items-center gap-1">
                            <span 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: getLangColor(project.techStack[0]) }}
                            ></span>
                            <span>{project.techStack[0]}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 hover:text-[#58a6ff] cursor-pointer">
                          <Star className="w-3 h-3" />
                          <span>{Math.floor(Math.random() * 100) + 10}</span>
                        </div>
                        <div className="flex items-center gap-1 hover:text-[#58a6ff] cursor-pointer">
                          <GitFork className="w-3 h-3" />
                          <span>{Math.floor(Math.random() * 50) + 5}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Experience Timeline */}
              <div className="mb-6 mt-10">
                <h2 className="text-base text-[#c9d1d9] font-normal mb-4">Experience</h2>
                <div className="border border-[#30363d] rounded-md bg-[#0d1117] overflow-hidden">
                  {data.experience.map((exp, idx) => (
                    <div key={idx} className="flex gap-4 p-4 border-b border-[#30363d] last:border-0 hover:bg-[#161b22] transition-colors">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#21262d] flex items-center justify-center border border-[#30363d]">
                          <Briefcase className="w-4 h-4 text-[#8b949e]" />
                        </div>
                        {idx !== data.experience.length - 1 && (
                          <div className="w-0.5 h-full bg-[#30363d] mt-2"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <h3 className="text-[#c9d1d9] font-semibold text-sm">{exp.role}</h3>
                        <div className="text-xs text-[#8b949e] mb-2">{exp.company} • {exp.period}</div>
                        <p className="text-sm text-[#8b949e]">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials / Comments */}
              <div className="mb-6 mt-10">
                <h2 className="text-base text-[#c9d1d9] font-normal mb-4">Testimonials</h2>
                <div className="space-y-4">
                  {data.testimonials.map((test, idx) => (
                    <div key={idx} className="flex gap-3">
                      <img src={test.avatar} alt={test.name} className="w-10 h-10 rounded-full border border-[#30363d]" />
                      <div className="border border-[#30363d] rounded-md flex-1 bg-[#0d1117]">
                        <div className="bg-[#161b22] px-3 py-2 border-b border-[#30363d] rounded-t-md text-xs text-[#8b949e]">
                          <span className="font-semibold text-[#c9d1d9]">{test.name}</span> 
                          <span className="ml-1">({test.role})</span> commented
                        </div>
                        <div className="p-3 text-sm text-[#c9d1d9]">
                          {test.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Contribution Graph (Mock) */}
              <div className="mb-12 mt-10">
                <h2 className="text-base text-[#c9d1d9] font-normal mb-2">
                  {Math.floor(Math.random() * 500) + 1000} contributions in the last year
                </h2>
                <div className="border border-[#30363d] rounded-md p-4 bg-[#0d1117] overflow-x-auto hide-scrollbar">
                  <div className="flex gap-1 min-w-[700px]">
                    {Array.from({ length: 52 }).map((_, weekIdx) => (
                      <div key={weekIdx} className="flex flex-col gap-1">
                        {Array.from({ length: 7 }).map((_, dayIdx) => {
                          const levels = [
                            'bg-[#161b22]', 
                            'bg-[#0e4429]',
                            'bg-[#006d32]',
                            'bg-[#26a641]',
                            'bg-[#39d353]'
                          ];
                          const randomLevel = Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0;
                          return (
                            <div key={dayIdx} className={`w-[10px] h-[10px] rounded-[2px] ${levels[randomLevel]}`}></div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-[#8b949e]">
                    <span>Learn how we count contributions</span>
                    <div className="flex items-center gap-1">
                      <span>Less</span>
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#161b22]"></div>
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#0e4429]"></div>
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#006d32]"></div>
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#26a641]"></div>
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#39d353]"></div>
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-[#30363d] mt-12 py-8 mb-[-3rem]">
        <div className="max-w-[1280px] mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-xs text-[#8b949e]">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-[#8b949e]" />
            <span>© 2026 GitHub, Inc. Profile Theme by {data.personal.name}</span>
          </div>
          <div className="flex gap-4 flex-wrap justify-center mt-2 md:mt-0">
            <span className="hover:text-[#58a6ff] cursor-pointer">Terms</span>
            <span className="hover:text-[#58a6ff] cursor-pointer">Privacy</span>
            <span className="hover:text-[#58a6ff] cursor-pointer">Security</span>
            <span className="hover:text-[#58a6ff] cursor-pointer">Status</span>
            <span className="hover:text-[#58a6ff] cursor-pointer">Docs</span>
            <span className="hover:text-[#58a6ff] cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
