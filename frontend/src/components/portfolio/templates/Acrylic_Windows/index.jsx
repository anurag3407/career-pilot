import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import Taskbar from './Taskbar';
import WindowFrame from './WindowFrame';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

const SECTION_MAP = {
  hero: Hero,
  about: About,
  skills: Skills,
  projects: Projects,
  experience: Experience,
  testimonials: Testimonials,
  contact: Contact,
};

export default function AcrylicWindows() {
  const [isMobile, setIsMobile] = useState(false);
  const [topZ, setTopZ] = useState(20);
  
  const [windows, setWindows] = useState(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    const heroW = Math.min(1024, vw - 60); 
    const heroX = Math.max(20, (vw - heroW) / 2);
    const heroY = Math.max(40, vh * 0.08);

    return [
      { id: 'hero', title: 'Welcome.exe', x: heroX, y: heroY, w: heroW, minimized: false, maximized: false, closed: false, zIndex: 10 },
      { id: 'about', title: 'About.md', x: 120, y: 40, w: 860, minimized: false, maximized: false, closed: true, zIndex: 9 },
      { id: 'skills', title: 'skills.json', x: 120, y: 40, w: 860, minimized: false, maximized: false, closed: true, zIndex: 8 },
      { id: 'projects', title: 'projects/', x: 120, y: 40, w: 860, minimized: false, maximized: false, closed: true, zIndex: 7 },
      { id: 'experience', title: 'career.log', x: 120, y: 40, w: 860, minimized: false, maximized: false, closed: true, zIndex: 6 },
      { id: 'testimonials', title: 'reviews.txt', x: 120, y: 40, w: 860, minimized: false, maximized: false, closed: true, zIndex: 5 },
      { id: 'contact', title: 'contact.lnk', x: 120, y: 40, w: 860, minimized: false, maximized: false, closed: true, zIndex: 4 },
    ];
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleFocus = (id) => {
    const newZ = topZ + 1;
    setTopZ(newZ);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: newZ } : w));
  };

  const handleMinimize = (id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: !w.minimized, maximized: false } : w));
  };

  const handleMaximize = (id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, maximized: !w.maximized, minimized: false } : w));
  };

  const handleClose = (id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, closed: true } : w));
  };

  const handleOpen = (id) => {
    const newZ = topZ + 1;
    setTopZ(newZ);
    
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const centeredX = Math.max(40, (vw - 860) / 2);
    const centeredY = Math.max(40, (vh * 0.08));

    setWindows(prev => prev.map(w =>
      w.id === id
        ? { ...w, closed: false, minimized: false, zIndex: newZ, x: centeredX, y: centeredY }
        : w
    ));
  };

  const handleDragEnd = (id, event, info) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x: w.x + info.offset.x, y: w.y + info.offset.y } : w));
  };

  if (isMobile) {
    return (
      <div className="min-h-screen overflow-x-hidden pb-24 px-3 pt-8" style={{ background: 'linear-gradient(135deg,#050510,#0a0f1e,#060c1a)' }}>
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-40" style={{ background: 'radial-gradient(circle,rgba(0,120,212,0.3) 0%,transparent 70%)' }} />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle,rgba(0,180,255,0.2) 0%,transparent 70%)' }} />
        </div>
        <div className="fixed inset-0 pointer-events-none z-[1]" style={{ opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />
        
        <div className="relative z-10 flex flex-col gap-4">
          {windows.filter(w => !w.closed).map(win => {
            const Section = SECTION_MAP[win.id];
            return (
              <div key={win.id} className="relative backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10" style={{ background:'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm bg-[#0078D4]/70" />
                    <span className="text-xs text-white/50">{win.title}</span>
                  </div>
                  <button onClick={() => handleClose(win.id)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/70 text-white/40 hover:text-white transition-all">
                    <X size={10} />
                  </button>
                </div>
                <div className="relative z-10">
                  <Section data={data} />
                </div>
              </div>
            );
          })}
        </div>
        <Taskbar windows={windows} onOpen={handleOpen} onFocus={handleFocus} />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ background: 'linear-gradient(135deg,#050510 0%,#0a0f1e 40%,#0d1635 70%,#060c1a 100%)' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-40" style={{ background: 'radial-gradient(circle,rgba(0,120,212,0.3) 0%,transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle,rgba(0,180,255,0.2) 0%,transparent 70%)' }} />
      </div>

      <div className="fixed inset-0 pointer-events-none z-[1]" style={{ opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="text-center select-none">
          <p className="text-white/10 text-sm font-light tracking-[0.3em] uppercase">
            Click taskbar icons to open windows
          </p>
        </div>
      </div>

      <div className="absolute inset-0 bottom-[56px] z-10">
        <AnimatePresence>
          {windows.filter(w => !w.closed).map(win => (
            <WindowFrame
              key={win.id}
              win={win}
              isMobile={isMobile}
              onFocus={handleFocus}
              onMinimize={handleMinimize}
              onMaximize={handleMaximize}
              onClose={handleClose}
              onDragEnd={handleDragEnd}
              data={data}
              topZ={topZ}
            />
          ))}
        </AnimatePresence>
      </div>

      <Taskbar windows={windows} onOpen={handleOpen} onFocus={handleFocus} topZ={topZ} />
    </div>
  );
}
