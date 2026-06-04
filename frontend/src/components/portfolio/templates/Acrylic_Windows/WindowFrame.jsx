import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Square, X, Minimize2 } from 'lucide-react';
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

export default function WindowFrame({
  win, isMobile, data,
  onFocus, onMinimize, onMaximize, onClose, onDragEnd, topZ
}) {
  const Section = SECTION_MAP[win.id];

  // 68px = taskbar height (52px) + bottom offset (16px)
  const maximizedStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: 'calc(100vh - 68px)',
    bottom: 'auto',
    zIndex: win.zIndex,
    borderRadius: 0,
    margin: 0,
  };

  const normalStyle = {
    position: 'absolute',
    top: win.y,
    left: win.x,
    width: isMobile ? 'calc(100vw - 24px)' : (win.w || 860),
    zIndex: win.zIndex,
    borderRadius: 16,
  };

  const isFocused = win.zIndex === topZ;

  return (
    <motion.div
      drag={!isMobile && !win.maximized}
      dragMomentum={false} // prevents snap-back glitch
      dragElastic={0}
      dragConstraints={{
        left: -(win.x - 20),
        right: window.innerWidth - win.x - (win.w ?? 860) + 20,
        top: -(win.y - 10),
        bottom: window.innerHeight - win.y - 56 - 100,
      }}
      onDragEnd={(e, info) => onDragEnd(win.id, e, info)}
      onPointerDown={() => onFocus(win.id)}
      layout
      layoutId={`window-${win.id}`}
      transition={{ layout: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } }}
      style={{
        ...(win.maximized ? maximizedStyle : normalStyle),
        pointerEvents: win.minimized ? 'none' : 'auto',
      }}
      className={`
        overflow-hidden backdrop-blur-xl border shadow-2xl
        ${isFocused ? 'border-white/30' : 'border-white/15'}
        ${!isMobile && !win.maximized ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
      `}
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={win.minimized
        ? { opacity: 0, scale: 0.85, y: 60, transition: { duration: 0.20, ease: 'easeIn' } }
        : { opacity: 1, scale: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } }
      }
      exit={{ opacity: 0, scale: 0.94, y: 8, transition: { duration: 0.18, ease: 'easeIn' } }}
    >
      <div aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0 rounded-2xl"
        style={{
          opacity: 0.05,
          backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize:'150px 150px',
          mixBlendMode:'overlay',
        }}
      />

      <div
        onDoubleClick={() => !isMobile && onMaximize(win.id)}
        className="relative z-10 flex items-center justify-between px-4 h-11 border-b border-white/10 select-none"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm bg-[#0078D4]" />
          <span className="text-xs text-white/50 font-medium">{win.title}</span>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onMinimize(win.id); }}
            className="w-7 h-7 flex items-center justify-center rounded text-white/40 hover:bg-white/15 hover:text-white transition-all duration-150"
          >
            <Minus size={11} />
          </button>

          {!isMobile && (
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); onMaximize(win.id); }}
              title={win.maximized ? "Restore" : "Maximize"}
              className={`w-7 h-7 flex items-center justify-center rounded text-white/40 hover:text-white transition-all duration-150 ${win.maximized ? 'hover:bg-white/15 bg-white/10' : 'hover:bg-white/15'}`}
            >
              {win.maximized ? <Minimize2 size={10} /> : <Square size={10} />}
            </button>
          )}

          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onClose(win.id); }}
            className="w-7 h-7 flex items-center justify-center rounded text-white/40 hover:bg-red-500/90 hover:text-white transition-all duration-150"
          >
            <X size={11} />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!win.minimized && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.20, ease: 'easeInOut' }}
            style={{ 
              overflowY: 'auto',
              maxHeight: win.maximized ? 'calc(100vh - 68px - 44px)' : '82vh'
            }}
            className="relative z-10"
          >
            <div 
              className={win.maximized ? 'max-w-4xl mx-auto px-8 py-10' : 'p-6'}
              style={win.maximized ? {
                minHeight: 'calc(100vh - 68px - 44px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              } : {}}
            >
              <Section data={data} isMaximized={win.maximized} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
