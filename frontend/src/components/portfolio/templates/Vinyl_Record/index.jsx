import React, { useState } from 'react';
import data from '../../../../data/dummy_data.json';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, ExternalLink, Github, Terminal, Briefcase, MessageSquare, Mail, Linkedin, Twitter } from 'lucide-react';
export default function VinylRecord() {
  const [isPlaying, setIsPlaying] = useState(true);
  const { personal, projects } = data;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-pink-500 pb-24">
      {/* Navigation */}
      <nav className="fixed bottom-0 w-full bg-gray-950 border-t border-gray-800 p-4 z-50 flex justify-center items-center gap-6">
        <button className="hover:text-pink-400 transition-colors"><SkipBack size={24} /></button>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-pink-600 hover:bg-pink-500 text-white p-4 rounded-full transition-transform hover:scale-105"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>
        <button className="hover:text-pink-400 transition-colors"><SkipForward size={24} /></button>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-center p-8 gap-12">
        <div className="flex-1 space-y-4 z-10 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
            {personal.name}
          </h1>
          <h2 className="text-2xl text-gray-400">{personal.title}</h2>
          <p className="text-gray-300 max-w-md">{personal.bio}</p>
        </div>

        {/* Spinning Record */}
        <div className="flex-1 flex justify-center relative">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-black border-[12px] border-gray-800 shadow-2xl flex items-center justify-center relative"
          >
            <div className="absolute inset-2 rounded-full border border-gray-800/50"></div>
            <div className="absolute inset-6 rounded-full border border-gray-800/50"></div>
            
            <div className="w-1/3 h-1/3 rounded-full overflow-hidden border-4 border-pink-500 z-10">
              <img src={personal.avatar} alt={personal.name} className="w-full h-full object-cover" />
            </div>
            <div className="w-4 h-4 bg-gray-900 rounded-full absolute z-20"></div>
          </motion.div>
        </div>
      </section>
      
      {/* Projects / Tracklist Section */}
      <section className="p-8 max-w-4xl mx-auto py-20">
        <h3 className="text-3xl font-bold mb-8 flex items-center gap-3 border-b border-gray-800 pb-4">
          <Play className="text-pink-500" /> Tracklist: Featured Projects
        </h3>
        <div className="space-y-2">
          {data.projects.map((project, index) => (
            <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 p-4 hover:bg-gray-800/50 rounded-lg transition-colors group">
              <span className="text-gray-600 font-mono text-xl w-8 group-hover:text-pink-500 transition-colors">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-200">{project.title}</h4>
                <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.techStack.map(tech => (
                    <span key={tech} className="text-xs bg-gray-900 border border-gray-700 px-2 py-1 rounded-full text-gray-400">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 mt-4 md:mt-0">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors">
                    <Github size={20} />
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-pink-400 transition-colors">
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Skills Section */}
      <section className="p-8 max-w-4xl mx-auto py-20 bg-gray-900/50 rounded-3xl border border-gray-800">
        <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Terminal className="text-pink-500" /> Audio Setup (Skills)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-300">{skill.name}</span>
                <span className="text-gray-500">{skill.category}</span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-violet-500 rounded-full"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Experience Section */}
      <section className="p-8 max-w-4xl mx-auto py-20">
        <h3 className="text-3xl font-bold mb-8 flex items-center gap-3 border-b border-gray-800 pb-4">
          <Briefcase className="text-violet-500" /> Tour History (Experience)
        </h3>
        <div className="space-y-8 pl-4 border-l-2 border-gray-800 relative">
          {data.experience.map((job, index) => (
            <div key={index} className="relative pl-6">
              {/* Timeline dot */}
              <div className="absolute -left-[33px] top-1 w-4 h-4 bg-gray-900 border-2 border-violet-500 rounded-full"></div>
              
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                <h4 className="text-xl font-bold text-gray-200">{job.role}</h4>
                <span className="text-sm font-mono text-pink-500">{job.period}</span>
              </div>
              <div className="text-lg text-gray-400 mb-3">{job.company}</div>
              <p className="text-gray-400 leading-relaxed">{job.description}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="p-8 max-w-4xl mx-auto py-20">
        <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <MessageSquare className="text-pink-500" /> Fan Reviews
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.testimonials.map((review, index) => (
            <div key={index} className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/50 relative">
              <p className="text-gray-300 italic mb-6">"{review.text}"</p>
              <div className="flex items-center gap-4">
                <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover border border-gray-600" />
                <div>
                  <div className="font-bold text-gray-200">{review.name}</div>
                  <div className="text-xs text-gray-500">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / Contact Section */}
      <footer className="border-t border-gray-800 bg-gray-950/50 mt-20 pb-32 pt-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-6">
          <h3 className="text-2xl font-bold text-gray-200">Bookings & Inquiries</h3>
          <div className="flex gap-6">
            {data.socials.email && (
              <a href={`mailto:${data.socials.email}`} className="text-gray-400 hover:text-pink-500 transition-colors"><Mail size={28} /></a>
            )}
            {data.socials.github && (
              <a href={data.socials.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors"><Github size={28} /></a>
            )}
            {data.socials.linkedin && (
              <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors"><Linkedin size={28} /></a>
            )}
            {data.socials.twitter && (
              <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors"><Twitter size={28} /></a>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-4">© {new Date().getFullYear()} {data.personal.name}. All rights reserved.</p>
        </div>
      </footer>
      
    </div>
  );
}