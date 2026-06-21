import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import {
  User,
  FolderGit,
  Briefcase,
  Cpu,
  MessageSquare,
  Terminal,
  X,
  Minus,
  Maximize2,
  Minimize2,
  Wifi,
  Battery,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Globe,
  MapPin,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  Code
} from 'lucide-react';
import { usePortfolio } from '../../../../context/PortfolioContext';

// Helper component for glassmorphic window containers
function OSWindow({
  _id,
  title,
  icon: Icon,
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  constraintsRef,
  isActive,
  children
}) {
  const dragControls = useDragControls();

  if (!isOpen || isMinimized) return null;

  return (
    <motion.div
      initial={isMaximized ? { scale: 1, opacity: 0 } : { scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      drag={!isMaximized}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={constraintsRef}
      dragElastic={0.05}
      dragMomentum={false}
      onPointerDown={onFocus}
      style={{
        zIndex,
        position: isMaximized ? 'absolute' : 'absolute',
        top: isMaximized ? 0 : undefined,
        left: isMaximized ? 0 : undefined,
        right: isMaximized ? 0 : undefined,
        bottom: isMaximized ? 0 : undefined,
        width: isMaximized ? '100%' : '640px',
        height: isMaximized ? '100%' : '480px',
        maxWidth: '100%',
        maxHeight: '100%',
      }}
      className={`flex flex-col rounded-xl overflow-hidden backdrop-blur-xl bg-slate-900/40 border transition-shadow duration-300 ${
        isMaximized ? 'rounded-none border-0' : 'shadow-2xl'
      } ${
        isActive
          ? 'border-indigo-500/45 shadow-indigo-500/10'
          : 'border-white/10 dark:border-white/5 shadow-black/40'
      }`}
    >
      {/* Title Bar / Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-slate-950/50 backdrop-blur-md select-none border-b border-white/5 cursor-move"
        onPointerDown={(e) => dragControls.start(e)}
        onDoubleClick={onMaximize}
      >
        {/* Left Windows Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-3.5 h-3.5 rounded-full bg-rose-500/90 hover:bg-rose-600 flex items-center justify-center group relative cursor-pointer"
            title="Close"
          >
            <X className="w-2.5 h-2.5 text-rose-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="w-3.5 h-3.5 rounded-full bg-amber-500/90 hover:bg-amber-600 flex items-center justify-center group relative cursor-pointer"
            title="Minimize"
          >
            <Minus className="w-2.5 h-2.5 text-amber-950 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            className="w-3.5 h-3.5 rounded-full bg-emerald-500/90 hover:bg-emerald-600 flex items-center justify-center group relative cursor-pointer"
            title={isMaximized ? 'Restore Down' : 'Maximize'}
          >
            {isMaximized ? (
              <Minimize2 className="w-2 h-2 text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
            ) : (
              <Maximize2 className="w-2 h-2 text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </div>

        {/* Center Title */}
        <div className="flex items-center justify-center space-x-2 text-xs font-medium text-slate-300">
          <Icon className="w-4.5 h-4.5 text-slate-400" />
          <span>{title}</span>
        </div>

        {/* Right Empty Spacer to balance left buttons */}
        <div className="w-14" />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 text-slate-200 bg-slate-950/20 scrollbar-thin scrollbar-thumb-white/10">
        {children}
      </div>
    </motion.div>
  );
}

export default function TransparentDesktopOverlayOS() {
  const { portfolioData } = usePortfolio();
  const { personal, socials, stats, skills, projects, experience, testimonials } = portfolioData;

  // Fallbacks
  const name = personal?.name || 'Alex Rivera';
  const roleTitle = personal?.title || 'Creative Technologist & Developer';
  const bio = personal?.bio || 'Crafting beautiful, performant web applications with care and precision.';
  const tagline = personal?.tagline || 'Building the future, one line of code at a time.';
  const location = personal?.location || 'Remote Sector';
  const avatar = personal?.avatar || '';

  const yearsExperience = stats?.yearsExperience || 0;
  const projectsCompleted = stats?.projectsCompleted || 0;
  const happyClients = stats?.happyClients || 0;
  const activeSkills = skills || [];
  const activeProjects = projects || [];
  const activeExperience = experience || [];
  const activeTestimonials = testimonials || [];

  // App list definition
  const apps = [
    { id: 'about', title: 'About Me', icon: User, color: 'text-indigo-400 border-indigo-400/20 bg-indigo-500/5' },
    { id: 'projects', title: 'Projects', icon: FolderGit, color: 'text-cyan-400 border-cyan-400/20 bg-cyan-500/5' },
    { id: 'experience', title: 'Experience', icon: Briefcase, color: 'text-emerald-400 border-emerald-400/20 bg-emerald-500/5' },
    { id: 'skills', title: 'Skills', icon: Cpu, color: 'text-amber-400 border-amber-400/20 bg-amber-500/5' },
    { id: 'testimonials', title: 'Testimonials', icon: MessageSquare, color: 'text-purple-400 border-purple-400/20 bg-purple-500/5' },
    { id: 'contact', title: 'System Console', icon: Terminal, color: 'text-rose-400 border-rose-400/20 bg-rose-500/5' },
  ];

  // Window states: isOpen, isMinimized, isMaximized, zIndex, x, y
  const [windowStates, setWindowStates] = useState({
    about: { isOpen: true, isMinimized: false, isMaximized: false, zIndex: 10 },
    projects: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 5 },
    experience: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 5 },
    skills: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 5 },
    testimonials: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 5 },
    contact: { isOpen: false, isMinimized: false, isMaximized: false, zIndex: 5 },
  });

  const [topWindowId, setTopWindowId] = useState('about');
  const [maxZIndex, setMaxZIndex] = useState(15);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('about'); // For mobile view tabs

  const constraintsRef = useRef(null);

  // Clock ticks
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Screen resize tracking (switch to mobile tab layout on small viewports)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Bring a window to front
  const focusWindow = (id) => {
    if (topWindowId === id) return;
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setTopWindowId(id);
    setWindowStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: false,
        zIndex: nextZ,
      },
    }));
  };

  // Open/toggle window
  const openWindow = (id) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setTopWindowId(id);
    setWindowStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false,
        zIndex: nextZ,
      },
    }));
  };

  // Close window
  const closeWindow = (id) => {
    setWindowStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
      },
    }));
  };

  // Minimize window
  const minimizeWindow = (id) => {
    setWindowStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: true,
      },
    }));
  };

  // Maximize toggle window
  const toggleMaximizeWindow = (id) => {
    setWindowStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized,
      },
    }));
  };

  // Date/Time Formatter
  const formatClock = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dName = days[date.getDay()];
    const mName = months[date.getMonth()];
    const day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${dName} ${mName} ${day}  ${hours}:${minutes} ${ampm}`;
  };

  // Terminal logic inside Contact Console
  const [terminalHistory, setTerminalHistory] = useState([
    { text: 'CareerPilotOS v1.0.0 initialized.', type: 'system' },
    { text: 'Type "help" to view all available commands.', type: 'info' },
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef(null);

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  const handleTerminalCommand = (e) => {
    if (e.key !== 'Enter') return;
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...terminalHistory, { text: `user@career-pilot-os:~$ ${terminalInput}`, type: 'input' }];

    switch (cmd) {
      case 'help':
        newHistory.push(
          { text: 'Available commands:', type: 'info' },
          { text: '  about        - Output bio and career statistics', type: 'info' },
          { text: '  projects     - List projects and links', type: 'info' },
          { text: '  experience   - Output history of experience logs', type: 'info' },
          { text: '  skills       - Print key technical skills', type: 'info' },
          { text: '  contact      - Print details on how to contact', type: 'info' },
          { text: '  clear        - Clear console screen log', type: 'info' }
        );
        break;
      case 'about':
        newHistory.push(
          { text: `Name: ${name}`, type: 'output' },
          { text: `Title: ${roleTitle}`, type: 'output' },
          { text: `Tagline: ${tagline}`, type: 'output' },
          { text: `Bio: ${bio}`, type: 'output' }
        );
        break;
      case 'projects':
        if (projects && projects.length > 0) {
          projects.forEach((proj) => {
            newHistory.push({ text: `• ${proj.title} - ${proj.description.substring(0, 80)}... [Tech: ${proj.techStack?.join(', ')}]`, type: 'output' });
          });
        } else {
          newHistory.push({ text: 'No projects found.', type: 'output' });
        }
        break;
      case 'experience':
        if (experience && experience.length > 0) {
          experience.forEach((exp) => {
            newHistory.push({ text: `• [${exp.period}] ${exp.role} at ${exp.company} - ${exp.description.substring(0, 70)}...`, type: 'output' });
          });
        } else {
          newHistory.push({ text: 'No experience records found.', type: 'output' });
        }
        break;
      case 'skills':
        if (skills && skills.length > 0) {
          const skillStr = skills.map((s) => `${s.name} (${s.level || 80}%)`).join(', ');
          newHistory.push({ text: `Skills: ${skillStr}`, type: 'output' });
        } else {
          newHistory.push({ text: 'No skills found.', type: 'output' });
        }
        break;
      case 'contact':
        newHistory.push(
          { text: 'How to contact me:', type: 'output' },
          { text: `  Email: ${socials?.email || 'N/A'}`, type: 'output' },
          { text: `  GitHub: ${socials?.github || 'N/A'}`, type: 'output' },
          { text: `  LinkedIn: ${socials?.linkedin || 'N/A'}`, type: 'output' },
          { text: `  Twitter: ${socials?.twitter || 'N/A'}`, type: 'output' }
        );
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      default:
        newHistory.push({ text: `Command not found: "${cmd}". Type "help" for a list of commands.`, type: 'error' });
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setTerminalHistory((prev) => [
      ...prev,
      { text: `[SYSTEM ALERT] Outgoing message package queued...`, type: 'system' },
      { text: `Sender: ${contactForm.name} <${contactForm.email}>`, type: 'output' },
      { text: `Message Payload: "${contactForm.message}"`, type: 'output' },
      { text: `Transmission status: SUCCESSFUL. Log stored.`, type: 'system' }
    ]);

    setFormSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' });
      setFormSubmitted(false);
    }, 4000);
  };

  // Social Links Filtered Helper
  const contactLinks = [
    { icon: Mail, href: socials?.email?.includes('@') ? `mailto:${socials.email}` : socials?.email, label: 'Email' },
    { icon: Github, href: socials?.github, label: 'GitHub' },
    { icon: Linkedin, href: socials?.linkedin, label: 'LinkedIn' },
    { icon: Twitter, href: socials?.twitter, label: 'Twitter' },
  ].filter((item) => item.href);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans select-none flex flex-col text-slate-100">
      {/* 1. Futuristic Animated Gradient Mesh Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Radial blobs */}
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/30 blur-[130px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-600/25 blur-[130px] animate-pulse pointer-events-none" style={{ animationDelay: '2.5s', animationDuration: '7s' }} />
        <div className="absolute top-[25%] right-[15%] w-[45%] h-[45%] rounded-full bg-fuchsia-600/15 blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '5s', animationDuration: '9s' }} />
        {/* Subtle grid backdrop */}
        <div
          className="absolute inset-0 opacity-15 mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* 2. Glassmorphic Top Menu Bar */}
      <header className="relative z-50 flex items-center justify-between w-full h-8 px-4 border-b bg-slate-900/35 backdrop-blur-md border-white/5 select-none text-xs font-semibold text-slate-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 cursor-pointer text-indigo-400 hover:text-indigo-300">
            <Globe className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '15s' }} />
            <span className="font-mono tracking-wider">CP_OS</span>
          </div>
          <button className="hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors">File</button>
          <button className="hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors">View</button>
          <button
            onClick={() => openWindow('contact')}
            className="hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer transition-colors text-rose-400 hover:text-rose-300"
          >
            Console
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[10px] text-slate-400">Connected</span>
          </div>
          <div className="flex items-center space-x-1 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-slate-400">98%</span>
          </div>
          <div className="font-mono text-slate-300 select-none tracking-wide">
            {formatClock(currentTime)}
          </div>
        </div>
      </header>

      {/* 3. Main Workspace Area */}
      <div className="flex-1 relative z-10 w-full h-full p-4 overflow-hidden" ref={constraintsRef}>
        {!isMobile ? (
          // ================= DESKTOP VIEW =================
          <>
            {/* Desktop Shortcuts (Grid of Folders on the left) */}
            <div className="absolute top-6 left-6 grid grid-cols-1 gap-6 w-24">
              {apps.map((app) => {
                const Icon = app.icon;
                const isOpen = windowStates[app.id].isOpen && !windowStates[app.id].isMinimized;
                return (
                  <button
                    key={app.id}
                    onClick={() => openWindow(app.id)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 group transition-all text-center select-none cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${app.color} ${
                      isOpen
                        ? 'shadow-[0_0_15px_rgba(99,102,241,0.2)] border-indigo-500/40 scale-95'
                        : 'group-hover:scale-105'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="mt-2 text-[11px] font-medium text-slate-300 drop-shadow group-hover:text-white transition-colors truncate w-full">
                      {app.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Draggable Windows Container */}
            <AnimatePresence>
              {/* About Window */}
              <OSWindow
                id="about"
                title="System Information - Profile.pkg"
                icon={User}
                isOpen={windowStates.about.isOpen}
                isMinimized={windowStates.about.isMinimized}
                isMaximized={windowStates.about.isMaximized}
                zIndex={windowStates.about.zIndex}
                onClose={() => closeWindow('about')}
                onMinimize={() => minimizeWindow('about')}
                onMaximize={() => toggleMaximizeWindow('about')}
                onFocus={() => focusWindow('about')}
                constraintsRef={constraintsRef}
                isActive={topWindowId === 'about'}
              >
                <div className="flex flex-col items-center md:items-start md:flex-row gap-6">
                  {/* Left Column Profile Pic / Basic Stats */}
                  <div className="w-full md:w-48 flex flex-col items-center shrink-0">
                    <div className="relative w-32 h-32 rounded-3xl overflow-hidden border border-white/20 bg-slate-900 shadow-xl group mb-4">
                      {avatar ? (
                        <img src={avatar} alt={name || "Profile Avatar"} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-950 text-indigo-200">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                    </div>
                    <h3 className="text-lg font-bold text-center text-white">{name}</h3>
                    <p className="text-xs text-indigo-400 text-center font-medium mt-1 leading-normal">{roleTitle}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] text-slate-400">{location}</span>
                    </div>

                    <div className="mt-6 w-full border-t border-white/5 pt-4 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Experience</span>
                        <span className="font-bold text-white font-mono">{yearsExperience} Years</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Projects Done</span>
                        <span className="font-bold text-white font-mono">{projectsCompleted}+</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Client Base</span>
                        <span className="font-bold text-white font-mono">{happyClients} Clients</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column Bio Detail */}
                  <div className="flex-1 space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center space-x-2 text-indigo-400 mb-2">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider">Tagline</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-100 leading-relaxed italic">
                        "{tagline}"
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Biography</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        {bio}
                      </p>
                    </div>

                    <div className="pt-4 flex items-center space-x-3">
                      {contactLinks.map(({ icon: Icon, href, label }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-indigo-500/20 hover:border-indigo-500/40 hover:text-white transition-all shadow-md"
                          title={label}
                        >
                          <Icon className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </OSWindow>

              {/* Projects Window */}
              <OSWindow
                id="projects"
                title="Git Repository - Projects.dir"
                icon={FolderGit}
                isOpen={windowStates.projects.isOpen}
                isMinimized={windowStates.projects.isMinimized}
                isMaximized={windowStates.projects.isMaximized}
                zIndex={windowStates.projects.zIndex}
                onClose={() => closeWindow('projects')}
                onMinimize={() => minimizeWindow('projects')}
                onMaximize={() => toggleMaximizeWindow('projects')}
                onFocus={() => focusWindow('projects')}
                constraintsRef={constraintsRef}
                isActive={topWindowId === 'projects'}
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Project Index</h3>
                    <p className="text-xs text-slate-400">Clicking external links redirects to project source/demo.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeProjects.map((project, index) => (
                      <div
                        key={project.title || index}
                        className="group flex flex-col rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-cyan-500/30 hover:bg-slate-900/40 transition-all duration-300 shadow-md"
                      >
                        {project.image && (
                          <div className="h-32 w-full overflow-hidden border-b border-white/5 relative">
                            <img
                              src={project.image}
                              alt={project.title || "Project Screenshot"}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-60" />
                          </div>
                        )}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center justify-between">
                              <span>{project.title}</span>
                              <div className="flex items-center space-x-1.5">
                                {project.githubUrl && (
                                  <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white"
                                    title="View Source"
                                  >
                                    <Github className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {project.liveUrl && (
                                  <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white"
                                    title="Live Preview"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed line-clamp-3">
                              {project.description}
                            </p>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
                            {(project.techStack || []).map((tech) => (
                              <span
                                key={tech}
                                className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </OSWindow>

              {/* Experience Window */}
              <OSWindow
                id="experience"
                title="Professional Chronology - Experience.log"
                icon={Briefcase}
                isOpen={windowStates.experience.isOpen}
                isMinimized={windowStates.experience.isMinimized}
                isMaximized={windowStates.experience.isMaximized}
                zIndex={windowStates.experience.zIndex}
                onClose={() => closeWindow('experience')}
                onMinimize={() => minimizeWindow('experience')}
                onMaximize={() => toggleMaximizeWindow('experience')}
                onFocus={() => focusWindow('experience')}
                constraintsRef={constraintsRef}
                isActive={topWindowId === 'experience'}
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Trajectory Log</h3>
                    <p className="text-xs text-slate-400">Timeline of professional stations and work records.</p>
                  </div>

                  <div className="relative border-l border-white/10 pl-5 ml-2.5 space-y-6">
                    {activeExperience.map((exp, index) => (
                      <div key={`${exp.company}-${index}`} className="relative group">
                        {/* Dot anchor */}
                        <div className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-emerald-500/20 border-2 border-emerald-400 group-hover:scale-125 transition-transform" />

                        <div className="p-4 rounded-xl border border-white/5 bg-white/5 hover:border-emerald-500/30 transition-all">
                          <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                            {exp.period}
                          </span>
                          <h4 className="text-sm font-bold text-white mt-2 leading-snug">{exp.role}</h4>
                          <h5 className="text-xs text-emerald-300 font-semibold mt-0.5">{exp.company}</h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed mt-2.5">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </OSWindow>

              {/* Skills Window */}
              <OSWindow
                id="skills"
                title="Hardware Diagnostics - Skills.cfg"
                icon={Cpu}
                isOpen={windowStates.skills.isOpen}
                isMinimized={windowStates.skills.isMinimized}
                isMaximized={windowStates.skills.isMaximized}
                zIndex={windowStates.skills.zIndex}
                onClose={() => closeWindow('skills')}
                onMinimize={() => minimizeWindow('skills')}
                onMaximize={() => toggleMaximizeWindow('skills')}
                onFocus={() => focusWindow('skills')}
                constraintsRef={constraintsRef}
                isActive={topWindowId === 'skills'}
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Resource Capacity</h3>
                    <p className="text-xs text-slate-400">Detailed metric indicators of technical capabilities.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeSkills.map((skill, index) => (
                      <div
                        key={skill.name || index}
                        className="p-4 rounded-xl border border-white/5 bg-white/5 hover:border-amber-500/30 hover:bg-slate-900/20 transition-all flex flex-col justify-between"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white flex items-center space-x-1.5">
                            <Code className="w-3.5 h-3.5 text-amber-400" />
                            <span>{skill.name}</span>
                          </span>
                          <span className="font-mono text-amber-400 text-[10px]">{skill.level || 80}%</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-3.5 w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level || 80}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                          />
                        </div>
                        {skill.category && (
                          <span className="text-[9px] text-slate-400 mt-2 font-mono uppercase tracking-wider text-right">
                            [{skill.category}]
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </OSWindow>

              {/* Testimonials Window */}
              <OSWindow
                id="testimonials"
                title="Feed downlink - Testimonials.net"
                icon={MessageSquare}
                isOpen={windowStates.testimonials.isOpen}
                isMinimized={windowStates.testimonials.isMinimized}
                isMaximized={windowStates.testimonials.isMaximized}
                zIndex={windowStates.testimonials.zIndex}
                onClose={() => closeWindow('testimonials')}
                onMinimize={() => minimizeWindow('testimonials')}
                onMaximize={() => toggleMaximizeWindow('testimonials')}
                onFocus={() => focusWindow('testimonials')}
                constraintsRef={constraintsRef}
                isActive={topWindowId === 'testimonials'}
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Feedback Nodes</h3>
                    <p className="text-xs text-slate-400">Encrypted signal reviews from verified professional contacts.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {activeTestimonials.map((testi, index) => (
                      <div
                        key={testi.name || index}
                        className="p-5 rounded-xl border border-white/5 bg-white/5 hover:border-purple-500/30 hover:bg-slate-900/35 transition-all shadow"
                      >
                        <p className="text-xs text-slate-300 leading-relaxed italic">
                          "{testi.text}"
                        </p>
                        <div className="mt-4 flex items-center space-x-3.5">
                          {testi.avatar && (
                            <img src={testi.avatar} alt={testi.name || "Profile Avatar"} className="w-9 h-9 rounded-xl object-cover border border-white/10" />
                          )}
                          <div>
                            <h4 className="text-xs font-bold text-white">{testi.name}</h4>
                            <p className="text-[10px] text-purple-400 font-medium">{testi.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </OSWindow>

              {/* Terminal / Contact Console Window */}
              <OSWindow
                id="contact"
                title="System Terminal - contact@os"
                icon={Terminal}
                isOpen={windowStates.contact.isOpen}
                isMinimized={windowStates.contact.isMinimized}
                isMaximized={windowStates.contact.isMaximized}
                zIndex={windowStates.contact.zIndex}
                onClose={() => closeWindow('contact')}
                onMinimize={() => minimizeWindow('contact')}
                onMaximize={() => toggleMaximizeWindow('contact')}
                onFocus={() => focusWindow('contact')}
                constraintsRef={constraintsRef}
                isActive={topWindowId === 'contact'}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  {/* Left Column: Command Terminal Mockup */}
                  <div className="flex flex-col h-[380px] rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs select-text">
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                      {terminalHistory.map((log, index) => (
                        <div key={index} className={
                          log.type === 'error' ? 'text-rose-500' :
                          log.type === 'system' ? 'text-indigo-400' :
                          log.type === 'info' ? 'text-slate-400' :
                          log.type === 'input' ? 'text-white font-bold' :
                          'text-emerald-400'
                        }>
                          {log.text}
                        </div>
                      ))}
                      <div ref={terminalBottomRef} />
                    </div>

                    <div className="flex items-center space-x-1.5 border-t border-slate-900 pt-2 shrink-0">
                      <span className="text-emerald-400 font-bold">user@career-pilot-os:~$</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        onKeyDown={handleTerminalCommand}
                        className="flex-1 bg-transparent border-0 outline-none p-0 text-white font-mono text-xs focus:ring-0 focus:outline-none"
                        placeholder="Type a command..."
                        autoFocus={topWindowId === 'contact'}
                      />
                    </div>
                  </div>

                  {/* Right Column: Traditional Form Styled as System Preferences */}
                  <div className="flex flex-col space-y-4 justify-between h-[380px]">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Transmission Dispatch</h4>
                      <p className="text-xs text-slate-400">Queue a direct message package through the OS link.</p>
                    </div>

                    <form onSubmit={handleContactSubmit} className="space-y-3.5">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Name</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:border-rose-500/50"
                          placeholder="Your Name"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Email</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:border-rose-500/50"
                          placeholder="your.email@domain.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Message</label>
                        <textarea
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:border-rose-500/50 resize-none"
                          placeholder="Type your message details here..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formSubmitted}
                        className="w-full py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95"
                      >
                        {formSubmitted ? (
                          <>
                            <Sparkles className="w-3.5 h-3.5 animate-spin" />
                            <span>Queued in buffer</span>
                          </>
                        ) : (
                          <span>Transmit Message</span>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </OSWindow>
            </AnimatePresence>

            {/* 4. Bottom macOS-style Dock */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-end px-4 py-2.5 rounded-2xl border border-white/10 bg-slate-900/35 backdrop-blur-md shadow-2xl space-x-4">
              {apps.map((app) => {
                const Icon = app.icon;
                const windowState = windowStates[app.id];
                const isOpen = windowState.isOpen;
                const isMinimized = windowState.isMinimized;
                const isFocused = topWindowId === app.id && isOpen && !isMinimized;

                return (
                  <div key={app.id} className="relative flex flex-col items-center group">
                    {/* Tooltip */}
                    <div className="absolute bottom-16 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 pointer-events-none transition-all duration-200 px-2.5 py-1 text-[10px] bg-slate-900/90 text-white rounded-md border border-white/5 shadow-md whitespace-nowrap">
                      {app.title}
                    </div>

                    <button
                      onClick={() => {
                        if (isOpen && !isMinimized && isFocused) {
                          minimizeWindow(app.id);
                        } else {
                          openWindow(app.id);
                        }
                      }}
                      className={`relative w-11 h-11 rounded-xl flex items-center justify-center border text-slate-300 hover:text-white hover:scale-115 hover:-translate-y-2 cursor-pointer transition-all duration-300 ${
                        isFocused
                          ? 'border-indigo-500/50 bg-indigo-500/10 text-white shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                          : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>

                    {/* macOS Active Dot */}
                    {isOpen && (
                      <span className={`absolute -bottom-1.5 w-1.5 h-1.5 rounded-full ${
                        isMinimized ? 'bg-slate-500' : 'bg-indigo-400 animate-pulse'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          // ================= MOBILE VIEW (Tabbed Layout) =================
          <div className="w-full h-full flex flex-col space-y-4 pb-20">
            {/* Header bio block */}
            <div className="p-4 rounded-xl border border-white/10 bg-slate-900/20 backdrop-blur-md flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                {avatar ? (
                  <img src={avatar} alt={name || "Profile Avatar"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-950 text-indigo-300">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold text-white truncate">{name}</h2>
                <p className="text-[10px] text-indigo-400 truncate">{roleTitle}</p>
                <div className="flex items-center space-x-1 mt-1 text-[9px] text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span>{location}</span>
                </div>
              </div>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="flex overflow-x-auto py-1 space-x-2 scrollbar-none shrink-0 select-none">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setActiveTab(app.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                    activeTab === app.id
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {app.title}
                </button>
              ))}
            </div>

            {/* Mobile Tab Content Card */}
            <div className="flex-1 overflow-y-auto p-4 rounded-xl border border-white/10 bg-slate-900/20 backdrop-blur-md scrollbar-thin">
              {activeTab === 'about' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Tagline</h3>
                    <p className="text-xs font-medium text-slate-200 italic leading-relaxed">
                      "{tagline}"
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">About</h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {bio}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4">
                    <div className="text-center p-2 rounded bg-white/5">
                      <div className="text-xs font-bold text-white font-mono">{yearsExperience} Yrs</div>
                      <div className="text-[9px] text-slate-400 mt-1">Exp</div>
                    </div>
                    <div className="text-center p-2 rounded bg-white/5">
                      <div className="text-xs font-bold text-white font-mono">{projectsCompleted}+</div>
                      <div className="text-[9px] text-slate-400 mt-1">Projects</div>
                    </div>
                    <div className="text-center p-2 rounded bg-white/5">
                      <div className="text-xs font-bold text-white font-mono">{happyClients}</div>
                      <div className="text-[9px] text-slate-400 mt-1">Clients</div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-3 pt-3 border-t border-white/5">
                    {contactLinks.map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/15 bg-white/5 text-slate-300 hover:text-white"
                        title={label}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured Projects</h3>
                  {activeProjects.map((project, index) => (
                    <div key={project.title || index} className="p-3.5 rounded-lg border border-white/5 bg-white/5">
                      <h4 className="text-xs font-bold text-white flex justify-between items-center">
                        <span>{project.title}</span>
                        <div className="flex space-x-1.5">
                          {project.githubUrl && (
                            <a href={project.githubUrl} className="p-1 rounded bg-white/5 text-slate-300"><Github className="w-3.5 h-3.5" /></a>
                          )}
                          {project.liveUrl && (
                            <a href={project.liveUrl} className="p-1 rounded bg-white/5 text-slate-300"><ExternalLink className="w-3.5 h-3.5" /></a>
                          )}
                        </div>
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {(project.techStack || []).map((tech) => (
                          <span key={tech} className="text-[8px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional trajectory</h3>
                  <div className="relative border-l border-white/10 pl-4 ml-1.5 space-y-4">
                    {activeExperience.map((exp, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-950 border border-emerald-400" />
                        <div className="p-3 rounded-lg border border-white/5 bg-white/5">
                          <span className="text-[8px] font-mono font-bold text-emerald-400">{exp.period}</span>
                          <h4 className="text-xs font-bold text-white mt-1">{exp.role}</h4>
                          <h5 className="text-[10px] text-emerald-300 mt-0.5">{exp.company}</h5>
                          <p className="text-[10px] text-slate-400 leading-relaxed mt-2">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Capabilities</h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {activeSkills.map((skill, index) => (
                      <div key={index} className="p-3 rounded-lg border border-white/5 bg-white/5">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-white">{skill.name}</span>
                          <span className="font-mono text-amber-400">{skill.level || 80}%</span>
                        </div>
                        <div className="mt-2 w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400" style={{ width: `${skill.level || 80}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'testimonials' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Testimonials</h3>
                  {activeTestimonials.map((testi, index) => (
                    <div key={index} className="p-3.5 rounded-lg border border-white/5 bg-white/5">
                      <p className="text-[10px] text-slate-300 italic leading-relaxed">"{testi.text}"</p>
                      <div className="mt-3 flex items-center space-x-2.5">
                        {testi.avatar && <img src={testi.avatar} className="w-7 h-7 rounded-lg object-cover" alt="" />}
                        <div>
                          <h4 className="text-[10px] font-bold text-white">{testi.name}</h4>
                          <p className="text-[8px] text-purple-400">{testi.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Transmission</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1">Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-1">Message</label>
                      <textarea
                        required
                        rows={3}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={formSubmitted}
                      className="w-full py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider transition-all"
                    >
                      {formSubmitted ? 'Transmitted' : 'Transmit Message'}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Mobile Dock shortcut selector */}
            <div className="fixed bottom-4 left-4 right-4 z-40 px-3 py-2 rounded-xl border border-white/10 bg-slate-950/80 backdrop-blur-md flex justify-around shadow-lg">
              {apps.map((app) => {
                const Icon = app.icon;
                const isActive = activeTab === app.id;
                return (
                  <button
                    key={app.id}
                    onClick={() => setActiveTab(app.id)}
                    className={`p-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      isActive ? 'bg-indigo-600/35 text-indigo-400' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
