import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import Experience from './Experience';
import Skills from './Skills';
import Testimonials from './Testimonials';
import Contact from './Contact';
import FinderWindow from './FinderWindow';

export default function Template() {
  const { portfolioData: data } = usePortfolio();
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return null;

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 font-sans text-gray-800 dark:text-gray-100 selection:bg-blue-300 selection:text-blue-900">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center" />

      {/* Menu Bar */}
      <div className="absolute top-0 left-0 right-0 h-7 bg-white/40 dark:bg-black/50 backdrop-blur-md flex items-center justify-between px-4 text-xs sm:text-sm font-medium z-50 text-gray-900 dark:text-white shadow-sm border-b border-white/20 dark:border-white/10">
        <div className="flex items-center gap-3 sm:gap-4">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.7 90.4-82.5 102.3-119.3-65.2-30.7-61.7-90-61.4-91.3zM85.3 7l1.5 6.8a120.1 120.1 0 0 0 29 88.6 94.7 94.7 0 0 0 86.9 38.2 86.2 86.2 0 0 0 -28-87.5 95 95 0 0 0 -89.4-46z"/></svg>
          <span className="font-bold cursor-pointer">Finder</span>
          <span className="hidden sm:inline cursor-pointer hover:bg-white/20 px-1.5 rounded">File</span>
          <span className="hidden sm:inline cursor-pointer hover:bg-white/20 px-1.5 rounded">Edit</span>
          <span className="hidden sm:inline cursor-pointer hover:bg-white/20 px-1.5 rounded">View</span>
          <span className="hidden sm:inline cursor-pointer hover:bg-white/20 px-1.5 rounded">Go</span>
          <span className="hidden sm:inline cursor-pointer hover:bg-white/20 px-1.5 rounded">Window</span>
          <span className="hidden sm:inline cursor-pointer hover:bg-white/20 px-1.5 rounded">Help</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden md:inline">100%</span>
          <span className="hidden sm:inline">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 3C7.9 3 4.1 4.5 1.2 7l1.4 1.4C5 6.4 8.3 5 12 5s7 .4 9.4 3.4L22.8 7C19.9 4.5 16.1 3 12 3zm0 4.5c-2.9 0-5.6 1.1-7.7 3.2l1.4 1.4C7.4 10.4 9.6 9.5 12 9.5s4.6.9 6.3 2.6l1.4-1.4C17.6 8.6 14.9 7.5 12 7.5zm0 4.5c-1.7 0-3.3.7-4.5 1.9l1.4 1.4c.8-.8 1.9-1.3 3.1-1.3s2.3.5 3.1 1.3l1.4-1.4c-1.2-1.2-2.8-1.9-4.5-1.9zm0 4.5c-.6 0-1.1.2-1.5.6L12 18l1.5-1.5c-.4-.4-.9-.6-1.5-.6z"/></svg>
          </span>
          <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Desktop Area */}
      <div className="absolute top-7 bottom-20 left-0 right-0 p-4 sm:p-8 overflow-y-auto overflow-x-hidden flex justify-center custom-scrollbar">
        <div className="w-full max-w-5xl space-y-12 pb-20">
          <FinderWindow title="About Me" icon="👤">
            <Hero data={data} />
            <About data={data} />
          </FinderWindow>

          {data.skills?.length > 0 && (
            <FinderWindow title="Skills" icon="🛠️" defaultOpen={true}>
              <Skills skills={data.skills} />
            </FinderWindow>
          )}

          {data.experience?.length > 0 && (
            <FinderWindow title="Experience" icon="💼" defaultOpen={true}>
              <Experience experience={data.experience} />
            </FinderWindow>
          )}

          {data.projects?.length > 0 && (
            <FinderWindow title="Projects" icon="🚀" defaultOpen={true}>
              <Projects projects={data.projects} />
            </FinderWindow>
          )}

          {data.testimonials?.length > 0 && (
            <FinderWindow title="Testimonials" icon="🌟" defaultOpen={false}>
              <Testimonials testimonials={data.testimonials} />
            </FinderWindow>
          )}

          <FinderWindow title="Mail" icon="✉️" defaultOpen={false}>
            <Contact personal={data.personal} socials={data.socials} />
          </FinderWindow>
        </div>
      </div>

      {/* Dock */}
      <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
        <div className="bg-white/20 dark:bg-black/30 backdrop-blur-xl border border-white/30 dark:border-white/10 p-2 sm:p-3 rounded-2xl shadow-2xl flex gap-2 sm:gap-3 pointer-events-auto items-end">
          {/* Dock Icons */}
          <div className="group relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center hover:-translate-y-3 transition-all duration-300 cursor-pointer border border-white/20">
            <span className="text-white text-2xl sm:text-3xl drop-shadow-sm">👤</span>
            <span className="absolute -top-8 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">About Me</span>
          </div>
          <div className="group relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-lg flex items-center justify-center hover:-translate-y-3 transition-all duration-300 cursor-pointer border border-white/20">
            <span className="text-white text-2xl sm:text-3xl drop-shadow-sm">📁</span>
            <span className="absolute -top-8 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Projects</span>
          </div>
          <div className="group relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl shadow-lg flex items-center justify-center hover:-translate-y-3 transition-all duration-300 cursor-pointer border border-white/20">
            <span className="text-white text-2xl sm:text-3xl drop-shadow-sm">✉️</span>
            <span className="absolute -top-8 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Mail</span>
          </div>
          
          <div className="w-px h-10 sm:h-12 bg-white/30 mx-1 self-center"></div>
          
          <div className="group relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-2xl shadow-lg flex items-center justify-center hover:-translate-y-3 transition-all duration-300 cursor-pointer border border-white/20">
            <span className="text-white text-2xl sm:text-3xl drop-shadow-sm">🗑️</span>
            <span className="absolute -top-8 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Trash</span>
          </div>
        </div>
      </div>
    </div>
  );
}