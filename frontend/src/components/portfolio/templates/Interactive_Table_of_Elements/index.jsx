import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  User,
  Database,
  Layout,
  Terminal,
  Settings,
  Monitor,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  X
} from 'lucide-react';

/* ─────────────────────────────────────────────
   DESIGN TOKENS & CONFIG MATRICES
───────────────────────────────────────────── */
const CATEGORY_COLORS = {
  personal: '#fb7185',    // Rose
  skills: '#34d399',      // Emerald
  projects: '#818cf8',    // Indigo
  experience: '#fbbf24',  // Amber
  socials: '#38bdf8',     // Sky
};

const SKILL_ICONS = [
  <Layout size={24} key="layout" />, 
  <Terminal size={24} key="terminal" />, 
  <Database size={24} key="database" />, 
  <Settings size={24} key="settings" />
];

/* ─────────────────────────────────────────────
   UTILITY TO DYNAMICALLY GENERATE ELEMENTS
───────────────────────────────────────────── */
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
  const topSkills = Array.isArray(data.skills) ? data.skills.slice(0, 10) : [];
  topSkills.forEach((skill, idx) => {
    if (!skill?.name) return;
    elements.push({
      id: `S${idx}`, 
      number: atomicNumber++, 
      symbol: skill.name.substring(0, 2).toUpperCase(), 
      name: skill.name, 
      category: 'skills',
      description: `Proficiency Level: ${skill.level || 0}%`,
      icon: SKILL_ICONS[idx % SKILL_ICONS.length]
    });
  });

  // 3. Projects
  const projects = Array.isArray(data.projects) ? data.projects.slice(0, 6) : [];
  projects.forEach((proj, idx) => {
    if (!proj?.title) return;
    const computedSymbol = proj.title.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const symbol = computedSymbol || `P${idx + 1}`;
    elements.push({
      id: `Pr${idx}`, number: atomicNumber++, symbol, name: proj.title, category: 'projects',
      description: proj.description || 'No description provided.',
      link: proj.link,
      github: proj.github,
      tech: proj.tech || [],
      icon: <Monitor size={24} />
    });
  });

  // 4. Experience
  const exp = Array.isArray(data.experience) ? data.experience.slice(0, 4) : [];
  exp.forEach((job, idx) => {
    if (!job?.company) return;
    elements.push({
      id: `E${idx}`, number: atomicNumber++, 
      symbol: job.company.substring(0, 2).toUpperCase(), 
      name: job.company, 
      category: 'experience',
      description: `${job.role || 'Contributor'} (${job.period || ''})`,
      details: job.description || '',
      icon: <Briefcase size={24} />
    });
  });

  // 5. Socials & Contact
  if (data.socials) {
    if (data.socials.github) elements.push({ id: 'C1', number: atomicNumber++, symbol: 'Gh', name: 'GitHub', category: 'socials', link: data.socials.github, icon: <Github size={24}/> });
    if (data.socials.linkedin) elements.push({ id: 'C2', number: atomicNumber++, symbol: 'In', name: 'LinkedIn', category: 'socials', link: data.socials.linkedin, icon: <Linkedin size={24}/> });
    if (data.socials.email) elements.push({ id: 'C3', number: atomicNumber++, symbol: 'Em', name: 'Email', category: 'socials', link: `mailto:${data.socials.email}`, icon: <Mail size={24}/> });
  }

  return elements;
};

/* ─────────────────────────────────────────────
   ELEMENT CARD COMPONENT
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
      className="relative cursor-pointer overflow-hidden rounded-xl border select-none p-3 aspect-square flex flex-col justify-between transition-all duration-200"
      style={{
        backgroundColor: isSelected ? color : `${color}12`,
        borderColor: isSelected ? '#ffffff' : `${color}40`,
        boxShadow: isSelected ? `0 0 24px ${color}60` : 'none',
        color: isSelected ? '#090d16' : color,
      }}
    >
      <div className="flex justify-between items-start w-full">
        <span className="text-[10px] font-mono font-bold opacity-75">{element.number}</span>
        <span className="opacity-60 transform scale-90">
          {React.cloneElement(element.icon, { size: 14, strokeWidth: 2.5 })}
        </span>
      </div>
      
      <div className="text-center w-full my-auto">
        <h2 className="text-xl md:text-2xl font-black font-mono tracking-tighter">
          {element.symbol}
        </h2>
      </div>
      
      <div className="text-center w-full overflow-hidden">
        <p className="text-[9px] md:text-[10px] font-black truncate uppercase tracking-widest">
          {element.name}
        </p>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   DETAILS VIEW PANEL
───────────────────────────────────────────── */
const DetailsPanel = ({ element, onClose }) => {
  const { portfolioData: dummyData } = usePortfolio();

  if (!element) return null;
  const color = CATEGORY_COLORS[element.category] || '#38bdf8';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="h-full rounded-2xl p-6 md:p-8 flex flex-col relative bg-zinc-900/40 backdrop-blur-md border shadow-2xl"
      style={{
        borderColor: `${color}30`,
        boxShadow: `0 20px 50px -12px ${color}15`,
      }}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
        aria-label="Close panel"
      >
        <X size={18} />
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-black font-mono flex-shrink-0 select-none shadow-md"
          style={{ backgroundColor: color, color: '#090d16' }}
        >
          {element.symbol}
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-zinc-100 tracking-tight break-words">{element.name}</h2>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black mt-0.5" style={{ color }}>
            {element.category} // Element {element.number}
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar">
        <p className="text-base text-zinc-300 leading-relaxed mb-6 font-medium">
          {element.description}
        </p>

        {element.details && (
          <div className="mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Detailed Context</h3>
            <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/60">{element.details}</p>
          </div>
        )}

        {Array.isArray(element.tech) && element.tech.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Technologies Used</h3>
            <div className="flex flex-wrap gap-1.5">
              {element.tech.map((t, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md text-[11px] font-bold border" style={{ backgroundColor: `${color}08`, color, borderColor: `${color}25` }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {element.link && (
          <div className="mt-auto pt-4 flex flex-wrap gap-3">
            <a 
              href={element.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black tracking-wider uppercase transition-transform hover:scale-[1.03] active:scale-[0.98] shadow-md inline-flex"
              style={{ backgroundColor: color, color: '#090d16' }}
            >
              <ExternalLink size={14} /> View Live
            </a>
            {element.github && (
              <a 
                href={element.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-black tracking-wider uppercase bg-zinc-800 text-zinc-200 border border-zinc-700/60 transition-colors hover:bg-zinc-750 inline-flex"
              >
                <Github size={14} /> Source Code
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

  
  const data = useMemo(() => ({
    personal: { ...dummyData?.personal, ...portfolioData?.personal },
    socials: { ...dummyData?.socials, ...portfolioData?.socials },
    skills: portfolioData?.skills?.length > 0 ? portfolioData.skills : dummyData?.skills || [],
    projects: portfolioData?.projects?.length > 0 ? portfolioData.projects : dummyData?.projects || [],
    experience: portfolioData?.experience?.length > 0 ? portfolioData.experience : dummyData?.experience || [],
  }), [portfolioData]);

  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const generated = generateElements(data);
    setElements(generated);
    if (generated.length > 0) {
      setSelectedElement(generated[0]);
    }
  }, [data]);

  const categories = useMemo(() => ['all', ...Object.keys(CATEGORY_COLORS)], []);

  const filteredElements = useMemo(() => {
    return elements.filter(el => activeCategory === 'all' || el.category === activeCategory);
  }, [elements, activeCategory]);

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-200 font-sans selection:bg-sky-500/20 antialiased">
      
      {/* Header section */}
      <header className="pt-16 pb-10 px-6 md:px-12 max-w-7xl mx-auto border-b border-zinc-900/80 mb-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">Creative Interactive Matrix</span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-100 mt-1">
              {data.personal?.name || "User Portfolio"}
            </h1>
            <p className="text-sm font-semibold text-sky-400 font-mono mt-1">
              Interactive Table of Portfolio Elements
            </p>
          </div>

          {/* Filtering Legend Grid */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => {
              const catColor = CATEGORY_COLORS[cat] || '#ffffff';
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-3.5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none cursor-pointer border"
                  style={{
                    backgroundColor: isActive ? catColor : 'transparent',
                    color: isActive ? '#090d16' : catColor,
                    borderColor: isActive ? catColor : `${catColor}30`,
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.div>
      </header>

      {/* Grid Core Operations Layout */}
      <main className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[720px]">
          
          {/* Elements Periodic Table Grid Layout block */}
          <div className="lg:col-span-7 xl:col-span-8 h-[480px] lg:h-full overflow-y-auto pr-3 custom-scrollbar">
            <motion.div layout className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3">
              <AnimatePresence mode="popLayout">
                {filteredElements.map((el) => (
                  <motion.div
                    key={el.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
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

          {/* Details Metadata Floating Info panel */}
          <div className="lg:col-span-5 xl:col-span-4 h-[480px] lg:h-full lg:sticky lg:top-8">
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
                  className="h-full rounded-2xl border border-dashed border-zinc-800 flex items-center justify-center p-8 text-center bg-zinc-900/10 text-zinc-500"
                >
                  <p className="text-sm font-medium font-mono">Select a portfolio block element from the dynamic table grid matrix to view its metadata properties.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Local custom scrollbar parameters embedding */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}} />
    </div>
  );
}