import React from 'react';
import { motion } from 'framer-motion';
import { Hash, ChevronDown, Mic, Headphones, Settings, Volume2, Users } from 'lucide-react';

const channels = [
  { id: 'welcome', label: 'welcome', category: 'INFORMATION' },
  { id: 'about', label: 'about-me', category: 'INFORMATION' },
  { id: 'skills', label: 'skills', category: 'PORTFOLIO' },
  { id: 'projects', label: 'projects', category: 'PORTFOLIO' },
  { id: 'experience', label: 'experience', category: 'PORTFOLIO' },
  { id: 'testimonials', label: 'testimonials', category: 'COMMUNITY' },
  { id: 'contact', label: 'contact', category: 'COMMUNITY' },
];

const categories = ['INFORMATION', 'PORTFOLIO', 'COMMUNITY'];

export default function ChannelSidebar({ activeChannel, setActiveChannel, name, title, avatar, forceShow = false }) {
  return (
    <div className={`${forceShow ? 'flex' : 'hidden md:flex'} flex-col w-60 min-w-[240px] bg-[#2B2D31] overflow-hidden select-none`}>
      {/* Server Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#1F2023] shadow-md cursor-pointer hover:bg-[#35373C] transition-colors">
        <h2 className="text-[15px] font-semibold text-white truncate">{name}'s Portfolio</h2>
        <ChevronDown className="w-4 h-4 text-[#B5BAC1]" />
      </div>

      {/* Channel List */}
      <div className="flex-1 overflow-y-auto px-2 pt-4 space-y-4 scrollbar-thin">
        {categories.map((cat) => (
          <div key={cat}>
            <div className="flex items-center gap-0.5 text-[11px] font-bold text-[#949BA4] tracking-wide uppercase hover:text-[#DBDEE1] px-1 mb-1 cursor-pointer">
              <ChevronDown className="w-3 h-3" />
              {cat}
            </div>
            {channels
              .filter((ch) => ch.category === cat)
              .map((ch) => (
                <motion.button
                  key={ch.id}
                  whileHover={{ x: 2 }}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-sm cursor-pointer transition-colors mb-[1px] ${
                    activeChannel === ch.id
                      ? 'bg-[#404249] text-white font-medium'
                      : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                  }`}
                >
                  <Hash className="w-4 h-4 shrink-0 opacity-70" />
                  <span className="truncate">{ch.label}</span>
                  {ch.id === 'welcome' && (
                    <span className="ml-auto bg-[#DA373C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">!</span>
                  )}
                </motion.button>
              ))}
          </div>
        ))}

        {/* Voice Channel */}
        <div>
          <div className="flex items-center gap-0.5 text-[11px] font-bold text-[#949BA4] tracking-wide uppercase hover:text-[#DBDEE1] px-1 mb-1 cursor-pointer">
            <ChevronDown className="w-3 h-3" />
            VOICE CHANNELS
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded text-sm text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1] cursor-pointer">
            <Volume2 className="w-4 h-4 shrink-0 opacity-70" />
            <span>Lounge</span>
            <Users className="w-3 h-3 ml-auto opacity-50" />
          </div>
        </div>
      </div>

      {/* User Panel */}
      <div className="h-[52px] bg-[#232428] px-2 flex items-center gap-2">
        <div className="relative">
          <img src={avatar} alt={name} className="w-8 h-8 rounded-full object-cover" />
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#23A559] rounded-full border-[3px] border-[#232428]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate leading-tight">{name.split(' ')[0]}</div>
          <div className="text-[11px] text-[#949BA4] truncate leading-tight">Online</div>
        </div>
        <div className="flex items-center gap-1">
          <Mic className="w-4 h-4 text-[#B5BAC1] hover:text-white cursor-pointer" />
          <Headphones className="w-4 h-4 text-[#B5BAC1] hover:text-white cursor-pointer" />
          <Settings className="w-4 h-4 text-[#B5BAC1] hover:text-white cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
