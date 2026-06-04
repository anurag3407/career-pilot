import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Code2, Cpu, Briefcase, MessageSquare, Mail, TerminalSquare } from 'lucide-react';

const TABS = [
  { id: 'hero', icon: TerminalSquare, label: 'Welcome', file: 'Welcome.exe' },
  { id: 'about', icon: User, label: 'About', file: 'About.md' },
  { id: 'skills', icon: Cpu, label: 'Skills', file: 'skills.json' },
  { id: 'projects', icon: Code2, label: 'Projects', file: 'projects/' },
  { id: 'experience', icon: Briefcase, label: 'Experience', file: 'career.log' },
  { id: 'testimonials', icon: MessageSquare, label: 'Reviews', file: 'reviews.txt' },
  { id: 'contact', icon: Mail, label: 'Contact', file: 'contact.lnk' },
];

/**
 * Taskbar component displaying icons for all available windows.
 * Allows opening, restoring, and focusing windows.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.windows - Array of window state objects.
 * @param {Function} props.onOpen - Callback to open a closed window.
 * @param {Function} props.onRestore - Callback to restore a minimized window.
 * @param {Function} props.onFocus - Callback to focus an active window.
 * @param {number} props.topZ - The highest z-index currently in use.
 * @returns {JSX.Element} The rendered taskbar.
 */
export default function Taskbar({ windows, onOpen, onRestore, onFocus, topZ }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /**
   * Handles clicking an icon on the taskbar.
   * @param {string} id - The ID of the window clicked.
   */
  const handleClick = (id) => {
    const win = windows.find(w => w.id === id);
    if (!win) return;
    if (win.closed) onOpen(id);
    else if (win.minimized) onRestore(id);
    else onFocus(id);
  };

  const computedTopZ = typeof topZ === 'number'
    ? topZ
    : (windows?.length > 0 ? Math.max(0, ...windows.map(w => w.zIndex || 0)) : 0);

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[50] flex items-center gap-1 px-3 py-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl max-w-[calc(100vw-24px)]"
    >
      {TABS.map(({ id, icon: Icon, file, label }) => {
        const win = windows.find(w => w.id === id);
        const isOpen = win && !win.closed;
        const isMinimized = win && !win.closed && win.minimized;
        const isFocused = win && !win.closed && !win.minimized && win.zIndex === computedTopZ;

        return (
          <div key={id} className="relative group">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-white/10 z-[60]">
              {file}
            </div>

            <button
              onClick={() => handleClick(id)}
              aria-label={label}
              className={`
                relative p-2.5 rounded-xl transition-all duration-200
                ${isFocused
                  ? 'bg-[#0078D4]/80 text-white shadow-[0_0_10px_rgba(0,120,212,0.4)]'
                  : isMinimized
                    ? 'bg-white/10 text-white/50'
                    : isOpen
                      ? 'bg-white/[0.07] text-white/70 hover:bg-white/15 hover:text-white'
                      : 'text-white/25 hover:text-white/50'
                }
              `}
            >
              <Icon size={17} aria-hidden="true" />
              {isOpen && (
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isFocused ? 'bg-white' : 'bg-white/30'}`} />
              )}
            </button>
          </div>
        );
      })}

      <div className="hidden md:block w-px h-5 bg-white/15 mx-1" />
      <span className="hidden md:block text-xs text-white/40 font-mono min-w-[48px] text-center select-none">
        {time}
      </span>
    </motion.nav>
  );
}
