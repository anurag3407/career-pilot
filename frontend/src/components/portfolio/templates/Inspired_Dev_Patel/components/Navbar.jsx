import React from 'react';
import { Home, User, Briefcase, LayoutGrid, FileText, Mail, Sun, ChevronDown, Layers } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, name }) => {
  const [firstName, lastName] = (name || 'Dev Patel').split(' ');

  const navItems = [
    { id: 'Home', icon: Home, label: 'Home' },
    { id: 'About', icon: User, label: 'About' },
    { id: 'Services', icon: Layers, label: 'Services' },
    { id: 'Works', icon: LayoutGrid, label: 'Works' },
    { id: 'Blog', icon: FileText, label: 'Blog' },
    { id: 'Contact', icon: Mail, label: 'Contact' }
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-4 rounded-[32px] sticky top-8 z-50 transition-all shadow-xl" style={{ backgroundColor: '#13161F', border: '1px solid rgba(255,255,255,0.03)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <div className="w-2 h-6 bg-white rounded-sm"></div>
          <div className="w-2 h-6 bg-white/50 rounded-sm"></div>
          <div className="w-2 h-6 bg-white/20 rounded-sm"></div>
        </div>
        <span className="text-xl font-bold tracking-tight">
          {firstName || 'Dev'}<span style={{ color: '#4770FF' }}>{lastName || 'Patel'}</span>
        </span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-1 p-1 rounded-full" style={{ backgroundColor: '#0E1018' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
              style={{ backgroundColor: isActive ? '#1A1F2C' : 'transparent' }}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button className="text-orange-500 hover:text-orange-400 transition-colors">
          <Sun size={20} />
        </button>
        <button className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-transform hover:scale-105" style={{ backgroundColor: '#1A1F2C', border: '1px solid rgba(255,255,255,0.05)' }}>
          Let's Talk
          <ChevronDown size={16} className="text-slate-400" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
