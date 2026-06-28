import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Briefcase,
  User,
  MessageSquare,
  Award,
  BookOpen,
  Monitor,
  Database,
  Layout,
  Terminal,
  Cpu,
  Globe,
  Settings,
  Star,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  X
} from 'lucide-react';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  bgDark: '#0b101e',
  bgPanel: '#131c31',
  textMain: '#e2e8f0',
  textMuted: '#94a3b8',
  border: '#1e293b',
  highlight: '#38bdf8',
  categories: {
    personal: '#fb7185',    // Rose
    skills: '#34d399',      // Emerald
    projects: '#818cf8',    // Indigo
    experience: '#fbbf24',  // Amber
    education: '#a78bfa',   // Violet
    socials: '#38bdf8',     // Sky
  }
};

/* ─────────────────────────────────────────────
   UTILITY TO GENERATE ELEMENTS
───────────────────────────────────────────── */
// We will convert portfolio data into an array of "elements" for our periodic table
const generateElements = (data) => {
  let atomicNumber = 1;
  const elements = [];

  // 1. Personal Elements
  elements.push({
    id: 'P1', number: atomicNumber++, symbol: 'Me', name: 'About', category: 'personal',
    description: data.personal?.bio || 'Passionate developer crafting digital experiences.',
    icon: <User size={24} />
  });
  elements.push({
    id: 'P2', number: atomicNumber++, symbol: 'Ro', name: 'Role', category: 'personal',
    description: data.personal?.role || 'Software Engineer',
    icon: <Briefcase size={24} />
  });

  // 2. Skills
  const skillCategories = ['Frontend', 'Backend', 'Database', 'Tools'];
  const skillIcons = [<Layout size={24}/>, <Terminal size={24}/>, <Database size={24}/>, <Settings size={24}/>];
  
  // Group skills or just list top 10
  const topSkills = (data.skills || []).slice(0, 10);
  topSkills.forEach((skill, idx) => {
    elements.push({
      id: `S${idx}`, number: atomicNumber++, 
      symbol: skill.name.substring(0, 2).toUpperCase(), 
      name: skill.name, 
      category: 'skills',
      description: `Proficiency: ${skill.level}%`,
      icon: skillIcons[idx % skillIcons.length]
    });
  });

  // 3. Projects
  const projects = (data.projects || []).slice(0, 6);
  projects.forEach((proj, idx) => {
    const symbol = proj.title.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase() || `P${idx}`;
    elements.push({
      id: `Pr${idx}`, number: atomicNumber++, symbol, name: proj.title, category: 'projects',
      description: proj.description,
      link: proj.link,
      github: proj.github,
      tech: proj.tech,
      icon: <Monitor size={24} />
    });
  });

  // 4. Experience
  const exp = (data.experience || []).slice(0, 4);
  exp.forEach((job, idx) => {
    elements.push({
      id: `E${idx}`, number: atomicNumber++, 
      symbol: job.company.substring(0, 2).toUpperCase(), 
      name: job.company, 
      category: 'experience',
      description: `${job.role} (${job.period})`,
      details: job.description,
      icon: <Briefcase size={24} />
    });
  });

  // 5. Socials & Contact
  if (data.socials) {
    if (data.socials.github) elements.push({ id: 'C1', number: atomicNumber++, symbol: 'Gh', name: 'GitHub', category: 'socials', link: data.socials.github, icon: <Github size={24}/> });
    if (data.socials.linkedin) elements.push({ id: 'C2', number: atomicNumber++, symbol: 'In', name: 'LinkedIn', category: 'socials', link: data.socials.linkedin, icon: <Linkedin size={24}/> });
    if (data.socials.email) elements.push({ id: 'C3', number: atomicNumber++, symbol: 'Em', name: 'Email', category: 'socials', link: `mailto:${data.socials.email}`, icon: <Mail size={24}/> });
  }

  // Fill remaining slots to make a nice grid (optional padding)
  // We'll arrange them in a dynamic grid using CSS Grid rather than a strict 18-column table to ensure responsiveness,
  // but styled exactly like periodic elements.
  
  return elements;
};

/* ─────────────────────────────────────────────
   ELEMENT CARD
───────────────────────────────────────────── */
const ElementCard = ({ element, onClick, isSelected }) => {
  const { portfolioData: dummyData } = usePortfolio();

  const color = C.categories[element.category] || C.highlight;
  
  return (
    <motion.div
      layoutId={`element-${element.id}`}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(element)}
      className="relative cursor-pointer overflow-hidden rounded-md transition-shadow"
      style={{
        backgroundColor: isSelected ? color : `${color}15`,
        border: `2px solid ${isSelected ? '#fff' : color}`,
        boxShadow: isSelected ? `0 0 20px ${color}80` : 'none',
        aspectRatio: '1/1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '8px',
        color: isSelected ? '#000' : color,
      }}
    >
      <div className="flex justify-between items-start w-full">
        <span className="text-xs font-mono font-bold opacity-70">{element.number}</span>
        <span className="opacity-50" style={{ transform: 'scale(0.8)' }}>
          {React.cloneElement(element.icon, { size: 16, strokeWidth: 2.5 })}
        </span>
      </div>
      
      <div className="text-center w-full my-auto">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: isSelected ? '#000' : color }}>
          {element.symbol}
        </h2>
      </div>
      
      <div className="text-center w-full overflow-hidden">
        <p className="text-[10px] md:text-xs font-semibold truncate uppercase tracking-wider" style={{ color: isSelected ? '#000' : color }}>
          {element.name}
        </p>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   DETAILS PANEL
───────────────────────────────────────────── */
const DetailsPanel = ({ element, onClose }) => {
  const { portfolioData: dummyData } = usePortfolio();

  if (!element) return null;
  const color = C.categories[element.category];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="h-full rounded-xl p-6 md:p-8 flex flex-col relative"
      style={{
        background: `linear-gradient(135deg, ${C.bgPanel} 0%, ${C.bgDark} 100%)`,
        border: `1px solid ${color}40`,
        boxShadow: `0 10px 40px -10px ${color}30`,
      }}
    >
      <button type="button" 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        style={{ color: C.textMuted }}
      >
        <X size={20} />
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div 
          className="w-20 h-20 rounded-lg flex items-center justify-center text-4xl font-black"
          style={{ backgroundColor: color, color: '#000' }}
        >
          {element.symbol}
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{element.name}</h2>
          <div className="flex items-center gap-2 text-sm uppercase tracking-wider font-semibold" style={{ color }}>
            {element.category} &bull; Element {element.number}
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
        <p className="text-lg leading-relaxed mb-6" style={{ color: C.textMain }}>
          {element.description}
        </p>

        {element.details && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: C.textMuted }}>Details</h3>
            <p className="text-base leading-relaxed" style={{ color: C.textMain }}>{element.details}</p>
          </div>
        )}

        {element.tech && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: C.textMuted }}>Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {element.tech.map((t, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {element.link && (
          <div className="mt-8 flex gap-4">
            <a 
              href={element.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-transform hover:scale-105"
              style={{ backgroundColor: color, color: '#000' }}
            >
              <ExternalLink size={18} /> View Live
            </a>
            {element.github && (
              <a 
                href={element.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
              >
                <Github size={18} /> Code
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function InteractiveTablePortfolio({ portfolioData }) {
  const { portfolioData: dummyData } = usePortfolio();

  
  const data = {
    personal: { ...dummyData.personal, ...portfolioData?.personal },
    socials: { ...dummyData.socials, ...portfolioData?.socials },
    skills: dummyData.skills,
    projects: portfolioData?.projects?.length > 0 ? portfolioData.projects : dummyData.projects,
    experience: portfolioData?.experience?.length > 0 ? portfolioData.experience : dummyData.experience,
  };

  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const generated = generateElements(data);
    setElements(generated);
    setSelectedElement(generated[0]);
  }, [portfolioData]);

  const categories = ['all', ...Object.keys(C.categories)];

  const filteredElements = elements.filter(el => activeCategory === 'all' || el.category === activeCategory);

  return (
    <div className="min-h-screen w-full font-sans selection:bg-sky-500/30" style={{ backgroundColor: C.bgDark, color: C.textMain }}>
      
      {/* Header */}
      <header className="pt-12 pb-8 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-2">
              {data.personal.name}
            </h1>
            <p className="text-xl font-medium" style={{ color: C.highlight }}>
              Interactive Table of Elements
            </p>
          </div>

          {/* Legend / Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                style={{
                  backgroundColor: activeCategory === cat ? (cat === 'all' ? '#fff' : C.categories[cat]) : 'transparent',
                  color: activeCategory === cat ? '#000' : (cat === 'all' ? '#fff' : C.categories[cat]),
                  border: `1px solid ${cat === 'all' ? '#ffffff40' : C.categories[cat]}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>
      </header>

      {/* Main Content Area */}
      <main className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 h-[800px]">
          
          {/* Periodic Table Grid */}
          <div className="lg:col-span-8 h-full overflow-y-auto pr-2 custom-scrollbar">
            <motion.div 
              layout
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4"
            >
              <AnimatePresence>
                {filteredElements.map((el) => (
                  <motion.div
                    key={el.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ElementCard 
                      element={el} 
                      isSelected={selectedElement?.id === el.id}
                      onClick={setSelectedElement}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Detail View Sidebar */}
          <div className="lg:col-span-4 h-[600px] lg:h-full sticky top-8">
            <AnimatePresence mode="wait">
              {selectedElement ? (
                <DetailsPanel 
                  key={selectedElement.id} 
                  element={selectedElement} 
                  onClose={() => setSelectedElement(null)}
                />
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="h-full rounded-xl border border-dashed flex items-center justify-center p-8 text-center"
                  style={{ borderColor: C.border, color: C.textMuted }}
                >
                  <p className="text-lg">Select an element from the table to view its properties.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
}
