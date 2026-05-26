import React from 'react';
import { Mail, Github, Linkedin, Twitter, Globe, Dribbble } from 'lucide-react';

export default function ContactFrame({ data }) {
  const { socials } = data;
  
  return (
    <div className="h-full p-10 bg-[#1A1A1A] flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-bold mb-4 text-white">Let's Connect</h2>
        <p className="text-gray-400 mb-8">
          I'm always open to discussing product design work or partnership opportunities. 
          Feel free to reach out through any of these platforms.
        </p>
        
        <a href={`mailto:${socials.email}`} className="flex items-center gap-4 p-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white mb-8 group">
          <Mail size={24} />
          <div className="flex-1">
            <div className="text-sm text-blue-200">Email Me</div>
            <div className="font-medium">{socials.email}</div>
          </div>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {socials.github && (
          <a href={socials.github} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 rounded-lg border border-[#333] hover:border-gray-400 hover:bg-[#252525] text-gray-400 hover:text-white transition-all">
            <Github size={20} />
            <span className="font-medium">GitHub</span>
          </a>
        )}
        {socials.linkedin && (
          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 rounded-lg border border-[#333] hover:border-blue-500 hover:bg-[#252525] text-gray-400 hover:text-blue-500 transition-all">
            <Linkedin size={20} />
            <span className="font-medium">LinkedIn</span>
          </a>
        )}
        {socials.twitter && (
          <a href={socials.twitter} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 rounded-lg border border-[#333] hover:border-sky-500 hover:bg-[#252525] text-gray-400 hover:text-sky-500 transition-all">
            <Twitter size={20} />
            <span className="font-medium">Twitter</span>
          </a>
        )}
        {socials.dribbble && (
          <a href={socials.dribbble} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 rounded-lg border border-[#333] hover:border-pink-500 hover:bg-[#252525] text-gray-400 hover:text-pink-500 transition-all">
            <Dribbble size={20} />
            <span className="font-medium">Dribbble</span>
          </a>
        )}
        {socials.website && (
          <a href={socials.website} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 rounded-lg border border-[#333] hover:border-emerald-500 hover:bg-[#252525] text-gray-400 hover:text-emerald-500 transition-all col-span-2">
            <Globe size={20} />
            <span className="font-medium">Personal Website</span>
          </a>
        )}
      </div>
    </div>
  );
}
