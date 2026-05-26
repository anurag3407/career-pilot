import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Briefcase, Code, FolderGit2, Mail, ExternalLink, Github, ChevronRight, CornerDownLeft, Command } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [activeView, setActiveView] = useState('menu'); // 'menu', 'about', 'projects', 'skills', 'experience', 'contact'
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const { personal, socials, skills, projects, experience, stats } = data;

  const menuItems = [
    { id: 'about', title: 'About Me', icon: User, shortcut: 'A' },
    { id: 'projects', title: 'Projects', icon: FolderGit2, shortcut: 'P' },
    { id: 'skills', title: 'Skills', icon: Code, shortcut: 'S' },
    { id: 'experience', title: 'Experience', icon: Briefcase, shortcut: 'E' },
    { id: 'contact', title: 'Contact', icon: Mail, shortcut: 'C' },
  ];

  // Filter items based on search
  const filteredItems = menuItems.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle palette with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        if (!isOpen) {
          setTimeout(() => inputRef.current?.focus(), 10);
        }
      }

      // Escape to close or go back
      if (e.key === 'Escape') {
        e.preventDefault();
        if (activeView !== 'menu') {
          setActiveView('menu');
          setQuery('');
          setSelectedIndex(0);
          inputRef.current?.focus();
        } else if (isOpen) {
          setIsOpen(false);
        }
      }

      // Arrow navigation
      if (isOpen && activeView === 'menu') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredItems.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
        }
        if (e.key === 'Enter' && filteredItems[selectedIndex]) {
          e.preventDefault();
          handleSelect(filteredItems[selectedIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeView, filteredItems, selectedIndex]);

  // Keep selected item in view
  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      listRef.current.children[selectedIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Reset index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (id) => {
    if (id === 'contact') {
      window.location.href = `mailto:${socials.email}`;
    } else {
      setActiveView(id);
      setQuery('');
    }
  };

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-500 font-sans selection:bg-zinc-800">
        <div className="flex items-center gap-4 bg-zinc-900 px-6 py-4 rounded-2xl border border-zinc-800 shadow-xl cursor-pointer hover:bg-zinc-800/80 transition-colors" onClick={() => setIsOpen(true)}>
          <Search className="w-5 h-5" />
          <span className="font-medium text-zinc-400">Press <kbd className="font-mono text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded ml-1 mr-0.5 border border-zinc-700">⌘</kbd> <kbd className="font-mono text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">K</kbd> to open command palette</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950/80 backdrop-blur-sm p-4 md:p-12 font-sans flex items-start justify-center pt-24 md:pt-32 selection:bg-zinc-700">
      <div className="w-full max-w-2xl bg-[#1c1c1c] rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Header */}
        <div className="flex items-center px-4 py-4 border-b border-zinc-800/80">
          <Search className="w-5 h-5 text-zinc-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={activeView === 'menu' ? "Type a command or search..." : "Press Escape to go back..."}
            readOnly={activeView !== 'menu'}
            className="flex-1 bg-transparent border-none outline-none text-zinc-200 placeholder-zinc-500 text-lg"
            autoFocus
          />
          {activeView !== 'menu' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 rounded-md text-xs font-medium text-zinc-400">
              ESC <span className="text-zinc-500">to clear</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto hide-scrollbar p-2">
          
          {/* MENU VIEW */}
          {activeView === 'menu' && (
            <div ref={listRef} className="py-2">
              <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Navigation
              </div>
              {filteredItems.length === 0 ? (
                <div className="px-4 py-8 text-center text-zinc-500">
                  No commands found for "{query}"
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center px-4 py-3 mx-2 my-1 rounded-xl cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-600 text-white' : 'text-zinc-300 hover:bg-zinc-800/50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${isSelected ? 'text-blue-200' : 'text-zinc-500'}`} />
                      <span className="flex-1 font-medium">{item.title}</span>
                      <div className={`flex items-center gap-1 text-xs font-medium ${isSelected ? 'text-blue-300' : 'text-zinc-600'}`}>
                        {isSelected ? 'Enter ↵' : ''}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ABOUT VIEW */}
          {activeView === 'about' && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                <img src={personal.avatar} alt={personal.name} className="w-24 h-24 rounded-2xl border border-zinc-700 object-cover shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-zinc-100 mb-1">{personal.name}</h2>
                  <p className="text-blue-400 font-medium mb-4">{personal.title}</p>
                  <p className="text-zinc-400 leading-relaxed">{personal.bio}</p>
                  <div className="flex gap-4 mt-6">
                    {socials.github && (
                      <a href={socials.github} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">
                        <Github className="w-4 h-4" /> GitHub
                      </a>
                    )}
                    {socials.linkedin && (
                      <a href={socials.linkedin} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 border-t border-zinc-800/80 pt-6">
                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                  <div className="text-3xl font-bold text-zinc-100 mb-1">{stats.yearsExperience}</div>
                  <div className="text-xs font-semibold text-zinc-500 uppercase">Years Exp.</div>
                </div>
                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                  <div className="text-3xl font-bold text-zinc-100 mb-1">{stats.projectsCompleted}</div>
                  <div className="text-xs font-semibold text-zinc-500 uppercase">Projects</div>
                </div>
                <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                  <div className="text-3xl font-bold text-zinc-100 mb-1">{stats.happyClients}</div>
                  <div className="text-xs font-semibold text-zinc-500 uppercase">Clients</div>
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS VIEW */}
          {activeView === 'projects' && (
            <div className="p-4 flex flex-col gap-3">
              {projects.map((project, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <img src={project.image} alt={project.title} className="w-24 h-24 rounded-lg object-cover border border-zinc-800 shrink-0 hidden sm:block" />
                  <div className="flex-1">
                    <h3 className="font-bold text-zinc-200 mb-1">{project.title}</h3>
                    <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex gap-3">
                      {project.liveUrl && (
                        <a href={project.liveUrl} className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> Live
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} className="text-xs font-medium text-zinc-400 hover:text-zinc-300 flex items-center gap-1">
                          <Github className="w-3 h-3" /> Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SKILLS VIEW */}
          {activeView === 'skills' && (
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {skills.map((skill, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex items-center justify-between">
                    <span className="font-medium text-zinc-300 text-sm">{skill.name}</span>
                    <span className="text-xs font-mono text-zinc-500">{skill.level}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXPERIENCE VIEW */}
          {activeView === 'experience' && (
            <div className="p-6 flex flex-col gap-6 relative before:absolute before:inset-0 before:ml-[35px] before:w-px before:bg-zinc-800">
              {experience.map((exp, i) => (
                <div key={i} className="relative flex gap-6">
                  <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-[#1c1c1c] mt-1.5 shrink-0 z-10 ml-[5px]" />
                  <div>
                    <h4 className="font-bold text-zinc-200">{exp.role}</h4>
                    <div className="text-sm text-blue-400 font-medium mb-2">{exp.company} • {exp.period}</div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800/80 bg-zinc-900/50">
          <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium">
            <span className="flex items-center gap-1"><CornerDownLeft className="w-3 h-3" /> Select</span>
            <span className="flex items-center gap-1"><Command className="w-3 h-3" /> K Toggle</span>
          </div>
          {activeView !== 'menu' && (
            <button 
              onClick={() => setActiveView('menu')}
              className="text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Back to Menu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
