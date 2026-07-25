import React from 'react';
import { Hash, Users, Pin, Search, Inbox, HelpCircle, Menu } from 'lucide-react';

export default function ChatHeader({ channelName, onToggleMobile }) {
  return (
    <div className="h-12 min-h-[48px] px-2 sm:px-4 flex items-center border-b border-[#1F2023] shadow-sm bg-[#313338] select-none">
      {/* Mobile hamburger */}
      <button type="button" onClick={onToggleMobile} aria-label="Toggle mobile menu" className="md:hidden mr-2 text-[#B5BAC1] hover:text-white cursor-pointer">
        <Menu className="w-5 h-5" />
      </button>

      <Hash className="w-5 h-5 text-[#80848E] mr-1.5 shrink-0" />
      <h3 className="text-[15px] font-semibold text-white mr-2">{channelName}</h3>
      <div className="hidden sm:block w-[1px] h-6 bg-[#3F4147] mx-2" />
      <span className="hidden sm:block text-sm text-[#949BA4] truncate">
        {channelName === 'welcome' && 'Welcome to the server! 🎉'}
        {channelName === 'about-me' && 'Get to know me better'}
        {channelName === 'skills' && 'Technologies & tools I work with'}
        {channelName === 'projects' && 'Showcase of my work'}
        {channelName === 'experience' && 'My professional journey'}
        {channelName === 'testimonials' && 'What people say about me'}
        {channelName === 'contact' && 'Get in touch!'}
      </span>

      <div className="ml-auto flex items-center gap-3 text-[#B5BAC1]">
        <Pin className="w-5 h-5 hidden sm:block cursor-pointer hover:text-white" />
        <Users className="w-5 h-5 hidden sm:block cursor-pointer hover:text-white" />
        <div className="hidden lg:flex items-center bg-[#1E1F22] rounded px-1.5 py-1 text-xs text-[#949BA4] w-36">
          Search
          <Search className="w-3.5 h-3.5 ml-auto" />
        </div>
        <Inbox className="w-5 h-5 hidden sm:block cursor-pointer hover:text-white" />
        <HelpCircle className="w-5 h-5 hidden sm:block cursor-pointer hover:text-white" />
      </div>
    </div>
  );
}
