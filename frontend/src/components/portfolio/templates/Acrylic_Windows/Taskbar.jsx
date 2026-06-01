import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Code2, Layers, Briefcase, Star, Mail } from 'lucide-react';

const TABS = [
  { id: 'hero',         icon: Home,      label: 'Home',       file: 'welcome.exe'  },
  { id: 'about',        icon: User,      label: 'About',      file: 'about.md'     },
  { id: 'skills',       icon: Code2,     label: 'Skills',     file: 'skills.json'  },
  { id: 'projects',     icon: Layers,    label: 'Projects',   file: 'projects/'    },
  { id: 'experience',   icon: Briefcase, label: 'Experience', file: 'career.log'   },
  { id: 'testimonials', icon: Star,      label: 'Reviews',    file: 'reviews.txt'  },
  { id: 'contact',      icon: Mail,      label: 'Contact',    file: 'contact.lnk'  },
];

export default function Taskbar({ refs, onFocusWindow }) {
  const [active, setActive] = useState('hero');
  const [tooltip, setTooltip] = useState(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleClick = (id) => {
    setActive(id);
    onFocusWindow?.(id);
    refs[id]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl"
    >
      {TABS.map(({ id, icon: Icon, label, file }) => (
        <div
          key={id}
          className="relative"
          onMouseEnter={() => setTooltip(id)}
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Animated tooltip with filename */}
          <AnimatePresence>
            {tooltip === id && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none border border-white/10 z-60"
              >
                {file}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => handleClick(id)}
            aria-label={label}
            className={`relative p-2.5 rounded-xl transition-all duration-200 ${
              active === id
                ? 'bg-[#0078D4]/80 text-white'
                : 'text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {/* Active dot with layoutId animation */}
            {active === id && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0078D4]"
              />
            )}
          </button>
        </div>
      ))}

      {/* Divider */}
      <div className="w-px h-6 bg-white/15 mx-1" />

      {/* Live clock — Windows 11 system tray style */}
      <div className="px-2 text-xs text-white/40 font-mono select-none min-w-[44px] text-center">
        {time}
      </div>
    </motion.nav>
  );
}
