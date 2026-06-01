import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import data from '../../../../data/dummy_data.json';
import Taskbar from './Taskbar';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

const PANEL_NOISE_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'repeat',
  backgroundSize: '96px 96px',
};

const GLOBAL_NOISE_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'repeat',
  backgroundSize: '128px 128px',
};

const WINDOWS = [
  { id: 'hero',         title: 'Welcome.exe',  Component: Hero         },
  { id: 'about',        title: 'About.md',     Component: About        },
  { id: 'skills',       title: 'skills.json',  Component: Skills       },
  { id: 'projects',     title: 'projects/',    Component: Projects     },
  { id: 'experience',   title: 'career.log',   Component: Experience   },
  { id: 'testimonials', title: 'reviews.txt',  Component: Testimonials },
  { id: 'contact',      title: 'contact.lnk',  Component: Contact      },
];

function WindowTitleBar({ title }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 select-none cursor-grab active:cursor-grabbing">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm bg-[#0078D4]/60" />
        <span className="text-xs text-white/50 font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-3 h-3 rounded-full bg-white/20 hover:bg-yellow-400/80 transition-colors"
        />
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-3 h-3 rounded-full bg-white/20 hover:bg-green-400/80 transition-colors"
        />
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-3 h-3 rounded-full bg-white/20 hover:bg-red-400/80 transition-colors"
        />
      </div>
    </div>
  );
}

function DraggableWindow({ id, title, sectionRef, isActive, onFocus, isDraggable, children }) {
  return (
    <motion.div
      ref={sectionRef}
      drag={isDraggable}
      dragMomentum={false}
      dragElastic={0.05}
      whileDrag={{ scale: 1.02, zIndex: 50 }}
      onClick={() => onFocus(id)}
      style={{ zIndex: isActive ? 30 : 10, position: 'relative' }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
    >
      {/* Layer 2 — per-panel noise */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={PANEL_NOISE_STYLE}
      />
      {/* Reveal — top-edge light highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

      <WindowTitleBar title={title} />

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export default function AcrylicWindows() {
  const [activeWindow, setActiveWindow] = useState('hero');
  const [isDraggable, setIsDraggable] = useState(false);

  const refs = {
    hero:         useRef(null),
    about:        useRef(null),
    skills:       useRef(null),
    projects:     useRef(null),
    experience:   useRef(null),
    testimonials: useRef(null),
    contact:      useRef(null),
  };

  useEffect(() => {
    const check = () => setIsDraggable(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleFocusWindow = (id) => setActiveWindow(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0d1b2a] to-[#0a0a1a] relative overflow-x-hidden font-sans text-white">

      {/* Layer 1 — global noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.035]"
        style={GLOBAL_NOISE_STYLE}
      />

      <main className="relative z-10 pb-24">
        {WINDOWS.map(({ id, title, Component }) => (
          <div key={id} className="py-10 px-4 max-w-5xl mx-auto">
            <DraggableWindow
              id={id}
              title={title}
              sectionRef={refs[id]}
              isActive={activeWindow === id}
              onFocus={handleFocusWindow}
              isDraggable={isDraggable}
            >
              <Component data={data} />
            </DraggableWindow>
          </div>
        ))}
      </main>

      <Taskbar refs={refs} onFocusWindow={handleFocusWindow} />
    </div>
  );
}
