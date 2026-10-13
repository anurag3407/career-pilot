import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MousePointer2, Frame, Square, Pen, Type, Hand, MessageSquare,
  ChevronDown, ChevronRight, Eye, EyeOff,
  ZoomIn, ZoomOut, Play, Share2, Search,
  MapPin, Mail, Github, Linkedin, Twitter,
  Briefcase, Star, Quote, Send, Layers, Code2,
  Sparkles, Globe, Calendar, Maximize
} from 'lucide-react';

const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:'];
const safeUrl = (url) => {
  if (!url) return '#';
  try {
    const { protocol } = new URL(url);
    return ALLOWED_PROTOCOLS.includes(protocol) ? url : '#';
  } catch {
    return '#';
  }
};

const FIGMA_BLUE = '#0d99ff';
const FIGMA_PURPLE = '#a259ff';
const FIGMA_GREEN = '#14ae5c';
const FIGMA_ORANGE = '#f24822';

const frameRegistry = [
  { id: 'hero', label: 'Hero', color: FIGMA_PURPLE, x: 200, y: 200, w: 860 },
  { id: 'about', label: 'About', color: FIGMA_BLUE, x: 1200, y: 200, w: 680 },
  { id: 'contact', label: 'Contact', color: FIGMA_GREEN, x: 2020, y: 200, w: 580 },
  { id: 'skills', label: 'Skills', color: FIGMA_GREEN, x: 200, y: 1000, w: 820 },
  { id: 'projects', label: 'Projects', color: FIGMA_ORANGE, x: 1160, y: 1000, w: 920 },
  { id: 'experience', label: 'Experience', color: FIGMA_BLUE, x: 200, y: 2000, w: 780 },
  { id: 'testimonials', label: 'Testimonials', color: FIGMA_PURPLE, x: 1120, y: 2000, w: 780 },
];

const tools = [
  { icon: MousePointer2, label: 'Move', shortcut: 'V' },
  { icon: Frame, label: 'Frame', shortcut: 'F' },
  { icon: Square, label: 'Rectangle', shortcut: 'R' },
  { icon: Pen, label: 'Pen', shortcut: 'P' },
  { icon: Type, label: 'Text', shortcut: 'T' },
  { icon: Hand, label: 'Hand', shortcut: 'H' },
  { icon: MessageSquare, label: 'Comment', shortcut: 'C' },
];

function FigmaLogo() {
  const { portfolioData: data } = usePortfolio();

  return (
    <svg width="20" height="30" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
    </svg>
  );
}

function ToolbarButton({ icon: Icon, label, isActive, onClick }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <button type="button"
      onClick={onClick}
      title={label}
      className={`p-1.5 rounded-md transition-colors ${
        isActive
          ? 'bg-[#0d99ff] text-white'
          : 'text-[#ababab] hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon size={16} />
    </button>
  );
}

function CanvasFrame({ id, label, color, children, isSelected, onClick, style }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div
      id={`frame-${id}`}
      className="absolute group"
      style={style}
      onClick={onClick}
    >
      <div
        className="absolute -top-7 left-0 text-xs font-medium flex items-center gap-1.5 whitespace-nowrap"
        style={{ color }}
      >
        <Frame size={12} />
        {label}
      </div>

      <div
        className={`relative rounded-sm transition-shadow duration-200 ${
          isSelected ? 'ring-1.5' : 'ring-0 group-hover:ring-1'
        }`}
        style={{
          boxShadow: isSelected ? `0 0 0 1.5px ${color}` : 'none',
        }}
      >
        {isSelected && (
          <>
            <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full border-2 bg-white" style={{ borderColor: color }} />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full border-2 bg-white" style={{ borderColor: color }} />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full border-2 bg-white" style={{ borderColor: color }} />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full border-2 bg-white" style={{ borderColor: color }} />
          </>
        )}
        {children}
      </div>
    </div>
  );
}

function LayerItem({ label, color, isSelected, isVisible, onClick, onToggleVisibility, hasChildren = false, isExpanded = true, onToggleExpanded, depth = 0 }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 text-xs cursor-pointer transition-colors rounded-sm ${
        isSelected ? 'bg-[#0d99ff]/15 text-white' : 'text-[#ababab] hover:bg-white/5'
      }`}
      style={{ paddingLeft: `${8 + depth * 16}px` }}
      onClick={onClick}
    >
      {hasChildren ? (
        <button type="button"
          onClick={(e) => { e.stopPropagation(); onToggleExpanded?.(); }}
          className="text-[#666] hover:text-[#ababab]"
        >
          {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
        </button>
      ) : (
        <span className="w-[10px] shrink-0" />
      )}
      <Frame size={10} style={{ color }} />
      <span className="flex-1 truncate text-[11px]">{label}</span>
      <button type="button"
        onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
        className="opacity-0 group-hover:opacity-100 text-[#666] hover:text-[#ababab] transition-opacity"
      >
        {isVisible ? <Eye size={10} /> : <EyeOff size={10} />}
      </button>
    </div>
  );
}

function SkillBar({ name, level, color }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#b3b3b3] w-24 truncate">{name}</span>
      <div className="flex-1 h-1.5 bg-[#2c2c2c] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-[#666] w-8 text-right">{level}%</span>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const { portfolioData: data } = usePortfolio();

  const colors = [FIGMA_BLUE, FIGMA_PURPLE, FIGMA_GREEN, FIGMA_ORANGE];
  const color = colors[index % colors.length];

  return (
    <div
      className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-[#2c2c2c] hover:border-[#3c3c3c] transition-all group"
    >
      <div className="relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] via-transparent to-transparent opacity-60" />
        <div className="absolute top-2 left-2">
          <div
            className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: `${color}cc` }}
          >
            Frame {index + 1}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-sm font-semibold text-white mb-1.5 group-hover:text-[#0d99ff] transition-colors">
          {project.title}
        </h4>
        <p className="text-xs text-[#888] mb-3 line-clamp-2 leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(Array.isArray(project.techStack) ? project.techStack : []).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[10px] rounded bg-[#2c2c2c] text-[#b3b3b3] border border-[#3c3c3c]"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <a
            href={safeUrl(project.liveUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-medium text-[#0d99ff] hover:text-white transition-colors"
          >
            <Globe size={10} /> Live
          </a>
          <a
            href={safeUrl(project.githubUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-medium text-[#b3b3b3] hover:text-white transition-colors"
          >
            <Github size={10} /> Source
          </a>
        </div>
      </div>
    </div>
  );
}

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 3;
const ZOOM_SENSITIVITY = 0.001;

export default function FigmaCanvas() {
  const { portfolioData: data } = usePortfolio();

  const [activeTool, setActiveTool] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState('hero');
  const [showLayers, setShowLayers] = useState(true);
  const [zoom, setZoom] = useState(0.55);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [visibleFrames, setVisibleFrames] = useState(
    Object.fromEntries(frameRegistry.map((f) => [f.id, true]))
  );
  const [expandedLayers, setExpandedLayers] = useState({ projects: true });

  const toggleLayerExpanded = useCallback((id) => {
    setExpandedLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const [isPanning, setIsPanning] = useState(false);
  const [spaceHeld, setSpaceHeld] = useState(false);

  const canvasRef = useRef(null);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });
  // isPanningRef mirrors isPanning state for use inside non-reactive callbacks
  const isPanningRef = useRef(false);

  const isHandTool = activeTool === 5;

  useEffect(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setPan({ x: rect.width * 0.08, y: rect.height * 0.08 });
  }, []);

  const zoomTo = useCallback((newZoom, centerX, centerY) => {
    setZoom((prevZoom) => {
      const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));
      const scale = clamped / prevZoom;
      setPan((prevPan) => ({
        x: centerX - (centerX - prevPan.x) * scale,
        y: centerY - (centerY - prevPan.y) * scale,
      }));
      return clamped;
    });
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (e.ctrlKey || e.metaKey) {
      const delta = -e.deltaY * ZOOM_SENSITIVITY;
      setZoom((prev) => {
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev * (1 + delta)));
        const scale = newZoom / prev;
        setPan((prevPan) => ({
          x: mouseX - (mouseX - prevPan.x) * scale,
          y: mouseY - (mouseY - prevPan.y) * scale,
        }));
        return newZoom;
      });
    } else {
      setPan((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  }, []);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleMouseDown = useCallback((e) => {
    if (e.button === 1 || isHandTool || spaceHeld) {
      e.preventDefault();
      isPanningRef.current = true;
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY };
      panOrigin.current = { ...pan };
    }
  }, [isHandTool, spaceHeld, pan]);

  const handleMouseMove = useCallback((e) => {
    if (!isPanningRef.current) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setPan({
      x: panOrigin.current.x + dx,
      y: panOrigin.current.y + dy,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanningRef.current = false;
    setIsPanning(false);
  }, []);

  useEffect(() => {
    const isEditable = (t) =>
      t instanceof HTMLElement &&
      (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(t.tagName));

    const onKeyDown = (e) => {
      if (isEditable(e.target)) return;
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setSpaceHeld(true);
      }
    };
    const onKeyUp = (e) => {
      if (isEditable(e.target)) return;
      if (e.code === 'Space') {
        setSpaceHeld(false);
        isPanningRef.current = false;
        setIsPanning(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const scrollToFrame = useCallback((id) => {
    setSelectedFrame(id);
    const frame = frameRegistry.find((f) => f.id === id);
    if (!frame || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const targetZoom = 0.65;
    const centerX = rect.width / 2 - frame.x * targetZoom - (frame.w * targetZoom) / 2;
    const centerY = rect.height / 2 - frame.y * targetZoom - 200 * targetZoom;
    setZoom(targetZoom);
    setPan({ x: centerX, y: centerY });
  }, []);

  const fitAll = useCallback(() => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    frameRegistry.forEach((f) => {
      minX = Math.min(minX, f.x);
      minY = Math.min(minY, f.y);
      maxX = Math.max(maxX, f.x + f.w);
      maxY = Math.max(maxY, f.y + 600);
    });
    const contentW = maxX - minX + 200;
    const contentH = maxY - minY + 200;
    if (rect.width === 0 || rect.height === 0) return;
    const scaleX = rect.width / contentW;
    const scaleY = rect.height / contentH;
    const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY, 1) * 0.85, MIN_ZOOM), MAX_ZOOM);
    const centerX = (rect.width - contentW * newZoom) / 2 - minX * newZoom + 100 * newZoom;
    const centerY = (rect.height - contentH * newZoom) / 2 - minY * newZoom + 100 * newZoom;
    setZoom(newZoom);
    setPan({ x: centerX, y: centerY });
  }, []);

  const toggleVisibility = (id) => {
    setVisibleFrames((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const adjustZoom = useCallback((delta) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    zoomTo(zoom + delta, cx, cy);
  }, [zoom, zoomTo]);

  const skillsByCategory = data.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categoryColors = {
    Frontend: FIGMA_BLUE,
    Backend: FIGMA_PURPLE,
    DevOps: FIGMA_ORANGE,
    Design: FIGMA_GREEN,
  };

  const gridSize = 24 * zoom;
  const gridOffsetX = pan.x % gridSize;
  const gridOffsetY = pan.y % gridSize;

  const cursorStyle = isPanning || spaceHeld || isHandTool
    ? 'grabbing' : 'default';

  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="h-screen w-full bg-[#1e1e1e] text-white flex flex-col overflow-hidden font-['Inter',system-ui,sans-serif]">

      {/* ======= TOOLBAR ======= */}
      <div className="h-12 bg-[#2c2c2c] border-b border-[#3c3c3c] flex items-center justify-between px-3 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-3 border-r border-[#3c3c3c]">
            <FigmaLogo />
            <ChevronDown size={12} className="text-[#ababab]" />
          </div>

          <div className="flex items-center gap-0.5 bg-[#1e1e1e] rounded-md p-0.5">
            {tools.map((tool, i) => (
              <ToolbarButton
                key={tool.label}
                icon={tool.icon}
                label={`${tool.label} (${tool.shortcut})`}
                isActive={activeTool === i}
                onClick={() => setActiveTool(i)}
              />
            ))}
          </div>

          <span className="hidden lg:inline text-xs text-[#ababab] ml-2">
            {data.personal.name}&apos;s Portfolio
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#1e1e1e] rounded-md px-2 py-1">
            <button type="button"
              onClick={() => adjustZoom(-0.1)}
              className="text-[#ababab] hover:text-white transition-colors"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-xs text-[#ababab] w-8 sm:w-10 text-center">{zoomPercent}%</span>
            <button type="button"
              onClick={() => adjustZoom(0.1)}
              className="text-[#ababab] hover:text-white transition-colors"
            >
              <ZoomIn size={14} />
            </button>
            <button type="button"
              onClick={fitAll}
              className="text-[#ababab] hover:text-white transition-colors ml-1"
              title="Zoom to fit"
            >
              <Maximize size={14} />
            </button>
          </div>

          <button type="button" className="hidden sm:flex items-center gap-1.5 bg-[#0d99ff] hover:bg-[#0b87e0] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            <Play size={12} fill="white" />
            Present
          </button>
          <button type="button" className="flex items-center gap-1.5 bg-[#0d99ff] hover:bg-[#0b87e0] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            <Share2 size={12} />
            Share
          </button>
          <img
            src={data.personal.avatar}
            alt="Avatar"
            className="w-7 h-7 rounded-full border-2 border-[#0d99ff] object-cover"
          />
        </div>
      </div>

      {/* ======= MAIN AREA ======= */}
      <div className="flex flex-1 overflow-hidden">

        {/* ======= LAYERS PANEL ======= */}
        <AnimatePresence>
          {showLayers && (
            <motion.aside
              initial={{ x: -240, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -240, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col w-[240px] bg-[#252526] border-r border-[#3c3c3c] shrink-0 overflow-hidden fixed md:relative top-12 md:top-0 left-0 bottom-7 md:bottom-0 z-40 md:z-auto"
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#3c3c3c]">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#cccccc]">
                  <Layers size={12} />
                  Layers
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" className="text-[#ababab] hover:text-white p-0.5">
                    <Search size={12} />
                  </button>
                  <button type="button"
                    onClick={() => setShowLayers(false)}
                    className="md:hidden text-[#ababab] hover:text-white p-0.5 ml-1"
                  >
                    <EyeOff size={12} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-1 scrollbar-thin">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#666] mb-1">
                  Page 1
                </div>
                {frameRegistry.map((frame) => (
                  <div key={frame.id} className="group">
                    <LayerItem
                      label={frame.label}
                      color={frame.color}
                      isSelected={selectedFrame === frame.id}
                      isVisible={visibleFrames[frame.id]}
                      hasChildren={frame.id === 'projects'}
                      isExpanded={!!expandedLayers[frame.id]}
                      onToggleExpanded={() => toggleLayerExpanded(frame.id)}
                      onClick={() => scrollToFrame(frame.id)}
                      onToggleVisibility={() => toggleVisibility(frame.id)}
                    />
                    {frame.id === 'projects' && expandedLayers.projects && (
                      <div className="ml-1">
                        {data.projects.map((p, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] text-[#888] hover:bg-white/5 cursor-default rounded-sm"
                            style={{ paddingLeft: '32px' }}
                          >
                            <Square size={8} className="text-[#666]" />
                            <span className="truncate">{p.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-[#3c3c3c] px-3 py-2">
                <div className="flex items-center gap-1.5 text-[10px] text-[#888]">
                  <div className="w-2 h-2 rounded-full bg-[#14ae5c]" />
                  {frameRegistry.length} frames
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ======= INFINITE CANVAS ======= */}
        <div
          ref={canvasRef}
          className="flex-1 overflow-hidden relative select-none"
          style={{
            cursor: cursorStyle,
            backgroundImage: 'radial-gradient(circle, #333 0.5px, transparent 0.5px)',
            backgroundSize: `${gridSize}px ${gridSize}px`,
            backgroundPosition: `${gridOffsetX}px ${gridOffsetY}px`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Layers toggle (mobile) */}
          {!showLayers && (
            <button type="button"
              onClick={() => setShowLayers(true)}
              className="md:hidden fixed top-14 left-2 z-30 bg-[#2c2c2c] border border-[#3c3c3c] rounded-md p-1.5 text-[#ababab]"
            >
              <Layers size={16} />
            </button>
          )}

          {/* Canvas transform layer */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >

            {/* ======= HERO FRAME ======= */}
            {visibleFrames.hero && (
              <CanvasFrame
                id="hero"
                label="Hero — 860×600"
                color={FIGMA_PURPLE}
                isSelected={selectedFrame === 'hero'}
                onClick={() => setSelectedFrame('hero')}
                style={{ left: 200, top: 200, width: 860 }}
              >
                <div className="bg-[#1a1a2e] rounded-lg p-8 md:p-16 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(${FIGMA_PURPLE}22 1px, transparent 1px),
                        linear-gradient(90deg, ${FIGMA_PURPLE}22 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px',
                    }} />
                  </div>

                  <div className="absolute top-4 right-4 flex gap-2 opacity-50">
                    <div className="w-3 h-3 rounded-full bg-[#f24822]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffc700]" />
                    <div className="w-3 h-3 rounded-full bg-[#14ae5c]" />
                  </div>

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div
                      className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden mb-6 shadow-lg"
                      style={{ borderColor: FIGMA_PURPLE, borderWidth: '3px', borderStyle: 'solid' }}
                    >
                      <img
                        src={data.personal.avatar}
                        alt={data.personal.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h1
                      className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-[#a259ff] via-[#0d99ff] to-[#14ae5c] bg-clip-text text-transparent"
                    >
                      {data.personal.name}
                    </h1>

                    <p className="text-base md:text-xl text-[#b3b3b3] mb-4 max-w-lg">
                      {data.personal.title}
                    </p>

                    <p className="text-sm text-[#666] flex items-center gap-2">
                      <MapPin size={14} />
                      {data.personal.location}
                    </p>

                    <div className="flex gap-3 mt-6">
                      {[
                        { icon: Github, href: data.socials.github },
                        { icon: Linkedin, href: data.socials.linkedin },
                        { icon: Twitter, href: data.socials.twitter },
                        { icon: Mail, href: `mailto:${data.socials.email}` },
                      ].map(({ icon: Icon, href }, i) => (
                        <a
                          key={i}
                          href={safeUrl(href)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#a259ff]/20 flex items-center justify-center text-[#ababab] hover:text-[#a259ff] transition-all"
                        >
                          <Icon size={16} />
                        </a>
                      ))}
                    </div>

                    <div className="flex gap-8 mt-8 pt-6 border-t border-white/5">
                      {[
                        { value: data.stats.yearsExperience, label: 'Years Exp' },
                        { value: data.stats.projectsCompleted, label: 'Projects' },
                        { value: data.stats.happyClients, label: 'Clients' },
                      ].map((stat) => (
                        <div key={stat.label} className="text-center">
                          <div className="text-xl md:text-2xl font-bold text-white">{stat.value}+</div>
                          <div className="text-[10px] uppercase tracking-wider text-[#666] mt-0.5">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CanvasFrame>
            )}

            {/* ======= ABOUT FRAME ======= */}
            {visibleFrames.about && (
              <CanvasFrame
                id="about"
                label="About — 680×400"
                color={FIGMA_BLUE}
                isSelected={selectedFrame === 'about'}
                onClick={() => setSelectedFrame('about')}
                style={{ left: 1200, top: 200, width: 680 }}
              >
                <div className="bg-[#1e1e2e] rounded-lg p-6 md:p-10 relative">
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] text-[#666]">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: FIGMA_BLUE }} />
                    Auto Layout
                  </div>

                  <div className="flex flex-col md:flex-row gap-8 items-start mt-4">
                    <div className="w-full md:w-48 shrink-0">
                      <div className="relative">
                        <img
                          src={data.personal.avatar}
                          alt={data.personal.name}
                          className="w-full aspect-square object-cover rounded-xl"
                        />
                        <div
                          className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: FIGMA_BLUE }}
                        >
                          <Sparkles size={14} />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-[#0d99ff] font-semibold mb-2">
                          // About Me
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{data.personal.name}</h2>
                        <p className="text-sm text-[#b3b3b3] leading-relaxed">{data.personal.bio}</p>
                      </div>

                      <div className="flex flex-wrap gap-4 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-2 text-xs text-[#888]">
                          <MapPin size={12} className="text-[#0d99ff]" />
                          {data.personal.location}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#888]">
                          <Mail size={12} className="text-[#0d99ff]" />
                          {data.socials.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#888]">
                          <Briefcase size={12} className="text-[#0d99ff]" />
                          {data.personal.title}
                        </div>
                      </div>

                      {data.personal.tagline && (
                        <div className="bg-[#0d99ff]/5 border border-[#0d99ff]/20 rounded-lg px-4 py-3 text-xs text-[#0d99ff] italic">
                          &ldquo;{data.personal.tagline}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CanvasFrame>
            )}

            {/* ======= SKILLS FRAME ======= */}
            {visibleFrames.skills && (
              <CanvasFrame
                id="skills"
                label="Skills — 820×500"
                color={FIGMA_GREEN}
                isSelected={selectedFrame === 'skills'}
                onClick={() => setSelectedFrame('skills')}
                style={{ left: 200, top: 1000, width: 820 }}
              >
                <div className="bg-[#1a2e1a] rounded-lg p-6 md:p-10 relative">
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] text-[#666]">
                    <Code2 size={10} />
                    Component
                  </div>

                  <div className="text-[10px] uppercase tracking-wider text-[#14ae5c] font-semibold mb-2">
                    // Skills &amp; Expertise
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-8">Design System</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {Object.entries(skillsByCategory).map(([category, skills]) => (
                      <div key={category}>
                        <div className="flex items-center gap-2 mb-4">
                          <div
                            className="w-2.5 h-2.5 rounded-sm"
                            style={{ backgroundColor: categoryColors[category] || FIGMA_GREEN }}
                          />
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#999]">
                            {category}
                          </span>
                        </div>
                        <div className="space-y-3">
                          {skills.map((skill) => (
                            <SkillBar
                              key={skill.name}
                              name={skill.name}
                              level={skill.level}
                              color={categoryColors[category] || FIGMA_GREEN}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CanvasFrame>
            )}

            {/* ======= PROJECTS FRAME ======= */}
            {visibleFrames.projects && (
              <CanvasFrame
                id="projects"
                label="Projects — 920×700"
                color={FIGMA_ORANGE}
                isSelected={selectedFrame === 'projects'}
                onClick={() => setSelectedFrame('projects')}
                style={{ left: 1160, top: 1000, width: 920 }}
              >
                <div className="bg-[#2e1a1a] rounded-lg p-6 md:p-10 relative">
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] text-[#666]">
                    <Frame size={10} />
                    {data.projects.length} items
                  </div>

                  <div className="text-[10px] uppercase tracking-wider text-[#f24822] font-semibold mb-2">
                    // Featured Work
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-8">Projects</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.projects.map((project, i) => (
                      <ProjectCard key={project.title} project={project} index={i} />
                    ))}
                  </div>
                </div>
              </CanvasFrame>
            )}

            {/* ======= EXPERIENCE FRAME ======= */}
            {visibleFrames.experience && (
              <CanvasFrame
                id="experience"
                label="Experience — 780×600"
                color={FIGMA_BLUE}
                isSelected={selectedFrame === 'experience'}
                onClick={() => setSelectedFrame('experience')}
                style={{ left: 200, top: 2000, width: 780 }}
              >
                <div className="bg-[#1e1e2e] rounded-lg p-6 md:p-10 relative">
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] text-[#666]">
                    <Calendar size={10} />
                    Timeline
                  </div>

                  <div className="text-[10px] uppercase tracking-wider text-[#0d99ff] font-semibold mb-2">
                    // Experience
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-8">Career Path</h2>

                  <div className="relative">
                    <div className="absolute left-[7px] top-3 bottom-3 w-px bg-gradient-to-b from-[#0d99ff] via-[#a259ff] to-[#14ae5c]" />

                    <div className="space-y-8">
                      {data.experience.map((exp, i) => (
                        <div
                          key={i}
                          className="flex gap-4 ml-0"
                        >
                          <div className="relative shrink-0 mt-1">
                            <div
                              className="w-[15px] h-[15px] rounded-full border-2 bg-[#1e1e2e]"
                              style={{
                                borderColor: [FIGMA_BLUE, FIGMA_PURPLE, FIGMA_GREEN, FIGMA_ORANGE][i % 4],
                              }}
                            />
                          </div>

                          <div className="flex-1 bg-[#252530] rounded-lg p-4 border border-[#2c2c3c] hover:border-[#3c3c4c] transition-colors">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                              <div>
                                <h3 className="text-sm font-semibold text-white">{exp.role}</h3>
                                <div className="text-xs text-[#0d99ff]">{exp.company}</div>
                              </div>
                              <span className="text-[10px] text-[#666] bg-[#1e1e2e] px-2 py-0.5 rounded shrink-0">
                                {exp.period}
                              </span>
                            </div>
                            <p className="text-xs text-[#888] leading-relaxed">{exp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CanvasFrame>
            )}

            {/* ======= TESTIMONIALS FRAME ======= */}
            {visibleFrames.testimonials && (
              <CanvasFrame
                id="testimonials"
                label="Testimonials — 780×400"
                color={FIGMA_PURPLE}
                isSelected={selectedFrame === 'testimonials'}
                onClick={() => setSelectedFrame('testimonials')}
                style={{ left: 1120, top: 2000, width: 780 }}
              >
                <div className="bg-[#2e1a2e] rounded-lg p-6 md:p-10 relative">
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] text-[#666]">
                    <Star size={10} />
                    Feedback
                  </div>

                  <div className="text-[10px] uppercase tracking-wider text-[#a259ff] font-semibold mb-2">
                    // Testimonials
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-8">What People Say</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.testimonials.map((testimonial, i) => (
                      <div
                        key={i}
                        className="bg-[#1e1e2e] rounded-lg p-5 border border-[#3c2c3c] hover:border-[#a259ff]/30 transition-colors relative"
                      >
                        <Quote
                          size={20}
                          className="absolute top-3 right-3 text-[#a259ff]/20"
                        />
                        <p className="text-xs text-[#b3b3b3] leading-relaxed mb-4 relative z-10">
                          &ldquo;{testimonial.text}&rdquo;
                        </p>
                        <div className="flex items-center gap-3">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-xs font-semibold text-white">{testimonial.name}</div>
                            <div className="text-[10px] text-[#a259ff]">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CanvasFrame>
            )}

            {/* ======= CONTACT FRAME ======= */}
            {visibleFrames.contact && (
              <CanvasFrame
                id="contact"
                label="Contact — 580×500"
                color={FIGMA_GREEN}
                isSelected={selectedFrame === 'contact'}
                onClick={() => setSelectedFrame('contact')}
                style={{ left: 2020, top: 200, width: 580 }}
              >
                <div className="bg-[#1a2e2a] rounded-lg p-6 md:p-10 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `
                        linear-gradient(${FIGMA_GREEN}44 1px, transparent 1px),
                        linear-gradient(90deg, ${FIGMA_GREEN}44 1px, transparent 1px)
                      `,
                      backgroundSize: '30px 30px',
                    }} />
                  </div>

                  <div className="relative z-10">
                    <div className="text-[10px] uppercase tracking-wider text-[#14ae5c] font-semibold mb-2">
                      // Get in Touch
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-6">Contact</h2>

                    <div className="space-y-6">
                      <p className="text-sm text-[#b3b3b3] leading-relaxed">
                        Interested in working together? Let&apos;s connect and create something amazing.
                      </p>

                      <div className="space-y-3">
                        <a
                          href={safeUrl(`mailto:${data.socials.email}`)}
                          className="flex items-center gap-3 text-sm text-[#b3b3b3] hover:text-[#14ae5c] transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#14ae5c]/10 flex items-center justify-center group-hover:bg-[#14ae5c]/20 transition-colors">
                            <Mail size={14} className="text-[#14ae5c]" />
                          </div>
                          {data.socials.email}
                        </a>
                        <a
                          href={safeUrl(data.socials.github)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-[#b3b3b3] hover:text-[#14ae5c] transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#14ae5c]/10 flex items-center justify-center group-hover:bg-[#14ae5c]/20 transition-colors">
                            <Github size={14} className="text-[#14ae5c]" />
                          </div>
                          GitHub
                        </a>
                        <a
                          href={safeUrl(data.socials.linkedin)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-[#b3b3b3] hover:text-[#14ae5c] transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#14ae5c]/10 flex items-center justify-center group-hover:bg-[#14ae5c]/20 transition-colors">
                            <Linkedin size={14} className="text-[#14ae5c]" />
                          </div>
                          LinkedIn
                        </a>
                        <a
                          href={safeUrl(data.socials.twitter)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-[#b3b3b3] hover:text-[#14ae5c] transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#14ae5c]/10 flex items-center justify-center group-hover:bg-[#14ae5c]/20 transition-colors">
                            <Twitter size={14} className="text-[#14ae5c]" />
                          </div>
                          Twitter
                        </a>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <input
                          type="text"
                          placeholder="Your Name"
                          className="w-full bg-[#1e1e2e] border border-[#3c3c3c] rounded-lg px-4 py-2.5 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#14ae5c] transition-colors"
                        />
                        <input
                          type="email"
                          placeholder="Your Email"
                          className="w-full bg-[#1e1e2e] border border-[#3c3c3c] rounded-lg px-4 py-2.5 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#14ae5c] transition-colors"
                        />
                        <textarea
                          placeholder="Your Message"
                          rows={3}
                          className="w-full bg-[#1e1e2e] border border-[#3c3c3c] rounded-lg px-4 py-2.5 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#14ae5c] transition-colors resize-none"
                        />
                        <button type="button" className="flex items-center gap-2 bg-[#14ae5c] hover:bg-[#12994f] text-white text-xs font-medium px-5 py-2.5 rounded-lg transition-colors w-full justify-center">
                          <Send size={12} />
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CanvasFrame>
            )}

            {/* ======= FOOTER ======= */}
            <div className="absolute" style={{ left: 200, top: 2900, width: 860 }}>
              <div className="text-center pb-8 pt-4">
                <p className="text-[10px] text-[#444] flex items-center justify-center gap-1.5">
                  Designed in
                  <span className="inline-flex items-center gap-1">
                    <FigmaLogo />
                  </span>
                  by {data.personal.name}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ======= BOTTOM BAR ======= */}
      <div className="h-7 bg-[#2c2c2c] border-t border-[#3c3c3c] flex items-center justify-between px-3 shrink-0 text-[10px] text-[#666] z-50">
        <div className="flex items-center gap-3">
          <button type="button"
            onClick={() => setShowLayers(!showLayers)}
            className="hidden md:flex items-center gap-1 hover:text-[#ababab] transition-colors"
          >
            <Layers size={10} />
            {showLayers ? 'Hide' : 'Show'} Layers
          </button>
          <span>{zoomPercent}%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">{data.personal.name}&apos;s Portfolio</span>
          <span>{frameRegistry.length} frames</span>
        </div>
      </div>
    </div>
  );
}
