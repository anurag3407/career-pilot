import React, { useState, useEffect } from 'react';
import { Home, User, Briefcase, LayoutGrid, FileText, Mail, Sun, Moon, ChevronDown, Layers } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, name, theme, isDarkMode, toggleTheme }) => {
  const [firstName, lastName] = (name || 'Dev Patel').split(' ');

  const navItems = [
    { id: 'Home', label: 'Home' },
    { id: 'Services', label: 'Services' },
    { id: 'Works', label: 'Works' },
    { id: 'Blogs', label: 'Blogs' },
    { id: 'Contact', label: "Let's Talk" }
  ];

  const handleNavClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveTab(id);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 rounded-[32px] sticky top-8 z-50 shadow-2xl transition-all font-sans" style={{ backgroundColor: theme.navBg, backdropFilter: 'blur(16px)', border: `1px solid ${theme.border}` }}>
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => handleNavClick(e, 'Home')}>
        <div className="flex gap-1">
          <div className="w-2 h-6 rounded-sm" style={{ backgroundColor: theme.textMain }}></div>
          <div className="w-2 h-6 rounded-sm" style={{ backgroundColor: theme.textMain, opacity: 0.5 }}></div>
          <div className="w-2 h-6 rounded-sm" style={{ backgroundColor: theme.textMain, opacity: 0.2 }}></div>
        </div>
        <span className="text-xl font-extrabold tracking-tight transition-colors duration-300" style={{ color: theme.textMain }}>
          {firstName || 'Dev'}<span style={{ color: theme.accent }}>{lastName || 'Patel'}</span>
        </span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-1 p-1 rounded-full transition-colors duration-300" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${isActive ? '' : 'hover:opacity-70'}`}
              style={{ 
                backgroundColor: isActive ? (isDarkMode ? '#1A1F2C' : '#E2E8F0') : 'transparent', 
                color: isActive ? theme.textMain : theme.textMuted,
                boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.1)' : 'none' 
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right side - Theme / Hire me */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-full transition-colors hover:opacity-70" 
          style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}
        >
          {isDarkMode ? <Sun size={18} style={{ color: theme.textMain }} /> : <Moon size={18} style={{ color: theme.textMain }} />}
        </button>
        <a 
          href="#contact"
          className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-transform hover:scale-[1.02]" 
          style={{ backgroundColor: theme.accent }}
        >
          Hire Me!
        </a>
        <button className="lg:hidden p-2.5 rounded-full transition-colors hover:bg-white/10 text-white" style={{ backgroundColor: '#0E1018', border: '1px solid rgba(255,255,255,0.05)' }}>
          <ChevronDown size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
