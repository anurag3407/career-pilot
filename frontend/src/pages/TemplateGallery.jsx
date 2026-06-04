import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import DeployModal from "../components/portfolio/DeployModal";
import ThemeSelector from "../components/portfolio/ThemeSelector";
import HolographicAbout from "../components/portfolio/templates/Holographic/About";
import CulinaryAbout from "../components/portfolio/templates/Culinary_Restaurant/About";
import TechStartupHero from "../components/portfolio/templates/Tech_Startup/Hero";
import GeometricShapesAbout from "../components/portfolio/templates/Geometric_Shapes/About";
import ChooseAdventurePortfolio from "../components/portfolio/templates/Choose_Adventure/index";
import WeatherMood from "../components/portfolio/templates/Weather_Mood/index";
import SwissTypography from "../components/portfolio/templates/Swiss_Typography/index";
import DesertDunes from "../components/portfolio/templates/Desert_Dunes/index";

/* TemplatePreviewFrame — contains each full portfolio template in a
   sandboxed scrollable box. The key trick: CSS `transform` on the outer
   wrapper makes it the "containing block" for any position:fixed children,
   so a template's fixed navbar stays inside the frame instead of
   escaping to the top of the viewport and overlapping the page navbar. */
function TemplatePreviewFrame({ label, badgeColor, children }) {
  return (
    <div className="mt-12">
      <div className="mb-4 flex items-center gap-3 px-1">
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest border ${badgeColor}`}>
          Preview
        </span>
        <h2 className="text-lg font-semibold text-foreground/70">{label}</h2>
      </div>
      {/* transform:translate(0) is the critical line — it creates a new
          containing block so position:fixed elements inside are anchored
          to this div, not to the viewport. */}
      <div
        className="rounded-2xl border border-border"
        style={{
          height: 600,
          overflowY: "auto",
          overflowX: "hidden",
          transform: "translate(0)",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}
import React, { useState, useRef, useEffect, Suspense, useMemo } from "react";
import { templates } from '../data/templates';
import DeployModal from "../components/portfolio/DeployModal";
import ThemeSelector from "../components/portfolio/ThemeSelector";
import { useTheme } from "../hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, ChevronDown, Check, Eye, Star, Sparkles } from "lucide-react";
import SwissTypography from "../components/portfolio/templates/Swiss_Typography/index";
import LiquidGlass from "../components/portfolio/templates/Liquid_Glass/index";
import MidnightGradient from "../components/portfolio/templates/Midnight_Gradient/index";
import PlayingCardsPortfolio from "../components/portfolio/templates/Playing_Cards";
import CherryBlossom from "../components/portfolio/templates/Cherry_Blossom/index";
import PsychedelicSwirl from "../components/portfolio/templates/Psychedelic_Swirl/index";
import DesertDunes from "../components/portfolio/templates/Desert_Dunes/index";
import MemphisPop from "../components/portfolio/templates/Memphis_Pop/index";
import CassetteMixtape from "../components/portfolio/templates/Cassette_Mixtape/index";
import TypewriterEffect from "../components/portfolio/templates/Typewriter_Effect/index";
import ChromaticGlitch from "../components/portfolio/templates/Chromatic_Glitch/index";
import MagneticDock from "../components/portfolio/templates/Magnetic_Dock/index";
import Navbar from '../components/Navbar'
import { X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
// import Hero from "../components/portfolio/templates/Holographic/Hero";
// import ChooseAdventurePortfolio from "../components/portfolio/templates/Choose_Adventure/index";
// import RetroProjects from "../components/portfolio/templates/2D_Retro_8bit/Projects";
// import FantasyRPGProjects from "../components/portfolio/templates/Fantasy_RPG/Projects";
import MorphingBlobs from "../components/portfolio/templates/Morphing_Blobs/index";


function FilterSelect({ value, onChange, options, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`
          flex items-center justify-between gap-3 min-w-[160px] px-4 py-2.5
          rounded-xl border text-sm font-medium text-foreground
          bg-card backdrop-blur-sm
          transition-all duration-300 cursor-pointer select-none
          ${open
            ? "border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.45)] ring-1 ring-cyan-400/30"
            : "border-border hover:border-cyan-500/60 hover:shadow-[0_0_8px_rgba(34,211,238,0.25)]"
          }
        `}
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-cyan-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="
              absolute z-50 left-0 top-[calc(100%+6px)] min-w-full
              bg-card border border-border
              shadow-[0_0_20px_rgba(34,211,238,0.2)]
              rounded-xl overflow-hidden py-1
            "
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`
                    flex items-center justify-between gap-3
                    px-4 py-2.5 text-sm cursor-pointer select-none
                    transition-all duration-200
                    ${isSelected
                      ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                      : "text-foreground hover:bg-cyan-500 hover:text-white"
                    }
                  `}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

const TemplateHeroPreview = ({ templateId, portfolioData }) => {
  const Component = useMemo(() => {
    if (!templateId) return null;
    return React.lazy(() => import(`../components/portfolio/templates/${templateId}/index.jsx`));
  }, [templateId]);

  if (!templateId) return null;
  return (
    <Suspense fallback={<div className="w-full h-full bg-muted/50" />}>
      <Component portfolioData={portfolioData} />
    </Suspense>
  );
};

function TemplateCard({ template, hovered, onHover, onLeave, onUse, aiDraft }) {
  return (
    <motion.div
      onMouseEnter={() => onHover(template.id)}
      onMouseLeave={onLeave}
      animate={hovered ? "hover" : "rest"}
      initial="rest"
      variants={{
        rest: {
          y: 0,
          scale: 1,
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          borderColor: "rgba(255,255,255,0.08)",
          transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
        },
        hover: {
          y: -10,
          scale: 1.02,
          boxShadow: "0 28px 52px rgba(0,0,0,0.50), 0 0 0 1px rgba(99,102,241,0.55)",
          borderColor: "rgba(99,102,241,0.65)",
          transition: { type: "spring", stiffness: 280, damping: 22 },
        },
      }}
      className="bg-card rounded-2xl overflow-hidden border border-border flex flex-col justify-between cursor-pointer"
    >
      <div className="overflow-hidden relative bg-background h-52">
        {template.isComplete ? (
          <div className="absolute top-0 left-0 origin-top-left pointer-events-none" style={{ width: '1280px', height: '800px', transform: 'scale(0.3)' }}>
            <TemplateHeroPreview templateId={template.id} portfolioData={aiDraft} />
          </div>
        ) : (
          <motion.img
            src={template.image}
            alt={template.title}
            className="w-full h-52 object-cover object-top"
            variants={{
              rest: { scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
              hover: { scale: 1.08, transition: { type: "spring", stiffness: 200, damping: 25 } },
            }}
          />
        )}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="p-5 flex-1">
        <h2 className="text-2xl font-semibold text-foreground">{template.title}</h2>
        <p className="text-muted-foreground mt-1 text-sm">By {template.author}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {[template.category, template.colorScheme, template.layout].map((tag) => (
            <span key={tag} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            {template.rating}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            {template.views.toLocaleString()}
          </span>
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              key="cta-group"
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: 1, y: 0,
                transition: { type: "spring", stiffness: 340, damping: 26, delay: 0.05 },
              }}
              exit={{
                opacity: 0, y: 10,
                transition: { duration: 0.16, ease: "easeIn" },
              }}
              className="flex gap-2 w-full mt-4"
            >
              <button
                onClick={(e) => { e.stopPropagation(); onUse(template.title, false, template.id); }}
                className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Use Theme
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onUse(template.id, true, template.id); }}
                className="flex-1 bg-muted text-foreground border border-border py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" /> Preview
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const TemplatePreviewModal = ({ templateId, isOpen, onClose, portfolioData }) => {
  const Component = useMemo(() => {
    if (!templateId) return null;
    return React.lazy(() => import(`../components/portfolio/templates/${templateId}/index.jsx`));
  }, [templateId]);

  if (!isOpen || !templateId) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 bg-card/80 border-b border-border shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            {templateId.replace(/_/g, ' ')} Preview
          </h2>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Live Demo
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-muted-foreground hover:text-foreground bg-muted hover:bg-accent rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto relative bg-background">
        <Suspense fallback={
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <p className="animate-pulse font-medium tracking-wide text-sm uppercase">Loading interactive preview...</p>
          </div>
        }>
          {Component && <Component portfolioData={portfolioData} />}
        </Suspense>
      </div>
    </div>
  );
};

export default function TemplateGallery() {
const { theme, toggleTheme } = useTheme();
const [searchParams, setSearchParams] = useSearchParams();
const previewTemplateId = searchParams.get("preview");
const [hoveredCard, setHoveredCard] = useState(null);

  const [category, setCategory] = useState("All");
  const [colorScheme, setColorScheme] = useState("All");
  const [layout, setLayout] = useState("All");
  const [sort, setSort] = useState("Popular");
  
  const [aiDraft, setAiDraft] = useState(null);

  useEffect(() => {
    const draft = localStorage.getItem('ai_portfolio_draft');
    if (draft) {
      try {
        setAiDraft(JSON.parse(draft));
      } catch(e) {}
    }
  }, []);

  const clearDraft = () => {
    localStorage.removeItem('ai_portfolio_draft');
    setAiDraft(null);
  };

  const [selectedTheme, setSelectedTheme] = useState("minimal");
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [selectedPortfolioTitle, setSelectedPortfolioTitle] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("default");

  const handleUseTemplate = (val, isPreview, id = "default") => {
    if (isPreview) {
      setSearchParams({ preview: val });
    } else {
      setSelectedPortfolioTitle(val);
      setSelectedTemplateId(id);
      setIsDeployModalOpen(true);
    }
  };

  const CATEGORY_OPTIONS = [
    { value: "All", label: "All Categories" },
    { value: "Portfolio", label: "Portfolio" },
    { value: "Resume", label: "Resume" },
    { value: "Dashboard", label: "Dashboard" },
  ];
  const COLOR_OPTIONS = [
    { value: "All", label: "All Color Schemes" },
    { value: "Dark", label: "Dark" },
    { value: "Light", label: "Light" },
    { value: "Colorful", label: "Colorful" },
  ];
  const LAYOUT_OPTIONS = [
    { value: "All", label: "All Layouts" },
    { value: "Grid", label: "Grid" },
    { value: "Minimal", label: "Minimal" },
    { value: "Cards", label: "Cards" },
    { value: "Interactive", label: "Interactive" },
  ];
  const SORT_OPTIONS = [
    { value: "Popular", label: "Popular" },
    { value: "Newest", label: "Newest" },
    { value: "Highest Rated", label: "Highest Rated" },
  ];

  const filteredTemplates = templates.filter((template) => {
    if (!template.isComplete) return false;
    const matchesCategory = category === "All" || template.category === category;
    const matchesColorScheme = colorScheme === "All" || template.colorScheme === colorScheme;
    const matchesLayout = layout === "All" || template.layout === layout;
    return matchesCategory && matchesColorScheme && matchesLayout;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sort === "Popular") return b.views - a.views;
    if (sort === "Highest Rated") return b.rating - a.rating;
    if (sort === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <div className="p-8 pt-24">
      <div className="flex items-center mb-8">
        <h1 className="text-4xl font-bold">Template Gallery</h1>
    <div className="min-h-screen bg-background text-foreground p-8 pt-24 transition-colors duration-300">
      <Navbar />
      
      {aiDraft && (
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <h3 className="text-emerald-400 font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> ✨ Resume Parsed Successfully!
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your data has been extracted. Select a template below and we'll automatically inject your experience and projects!
            </p>
          </div>
          <button 
            onClick={clearDraft}
            className="p-2 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
            title="Discard Draft"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Template Gallery</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-muted hover:bg-accent border border-border text-foreground transition-all cursor-pointer overflow-hidden relative group"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ y: 20, opacity: 0, rotate: 45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: -45 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      <div className="mb-8 rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Portfolio theme</h2>
            <p className="text-sm text-muted-foreground">
              Pick a theme before deploying. Premium themes are shown and locked in the live gallery flow.
            </p>
          </div>
          <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
            Selected: {selectedTheme}
          </span>
        </div>
        <ThemeSelector selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <FilterSelect value={category} onChange={setCategory} options={CATEGORY_OPTIONS} />
        <FilterSelect value={colorScheme} onChange={setColorScheme} options={COLOR_OPTIONS} />
        <FilterSelect value={layout} onChange={setLayout} options={LAYOUT_OPTIONS} />
        <FilterSelect value={sort} onChange={setSort} options={SORT_OPTIONS} className="ml-auto" />
      </div>

      {sortedTemplates.length === 0 ? (
        <div className="text-center text-muted-foreground mt-12 text-xl">
          No templates match the selected criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTemplates.map((template) => (
<TemplateCard
  key={template.id}
  template={template}
  hovered={hoveredCard === template.id}
  onHover={setHoveredCard}
  onLeave={() => setHoveredCard(null)}
  onUse={handleUseTemplate}
  aiDraft={aiDraft}
/>
 ))}
        </div>
      )}
      {/* Deploy Modal */}

      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        portfolioTitle={selectedPortfolioTitle}
        templateId={selectedTemplateId}
        aiDraft={aiDraft}
        onDeploySuccess={clearDraft}
      />

      {/* Section-only previews — no internal navbar, plain wrapper is fine */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400 border border-cyan-500/30">Preview</span>
          <h2 className="text-lg font-semibold text-foreground/70">Holographic Theme — About Section</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border"><HolographicAbout /></div>
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 border border-amber-500/30">Preview</span>
          <h2 className="text-lg font-semibold text-foreground/70">Geometric Shapes Theme — About Section</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border"><GeometricShapesAbout /></div>
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 border border-amber-500/30">Preview</span>
          <h2 className="text-lg font-semibold text-foreground/70">Culinary Restaurant Theme — About Section</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border"><CulinaryAbout /></div>
      <TemplatePreviewModal
        templateId={previewTemplateId}
        isOpen={!!previewTemplateId}
        onClose={() => {
          if (searchParams.has("preview")) {
            // Check if there is history to go back to, so we pop the preview state cleanly
            window.history.back();
          } else {
            setSearchParams({}, { replace: true });
          }
        }}
        portfolioData={aiDraft}
      />

      {/* Liquid Glass */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400 border border-cyan-500/30">
            Preview
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Liquid Glass Theme</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <LiquidGlass portfolioData={aiDraft} />
        </div>
      </div>

      {/* Midnight Gradient */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/30">
            Preview
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Midnight Gradient Theme</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <MidnightGradient />
        </div>
      </div>
      {/* Playing Cards Theme */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30">
            🃟 NEW — Playing Cards
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Playing Cards Theme — Click to flip, shuffle deck</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-emerald-500/20">
          <PlayingCardsPortfolio portfolioData={aiDraft} />
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400 border border-cyan-500/30">Preview</span>
          <h2 className="text-lg font-semibold text-foreground/70">Tech Startup Theme — Hero Section</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-cyan-500/20"><TechStartupHero /></div>
      </div>

      {/* Full-template previews — each has its own fixed/sticky navbar.
          TemplatePreviewFrame creates an isolated scroll container so
          that navbar stays inside the preview box and never bleeds out. */}
      <TemplatePreviewFrame
        label="Choose Adventure Theme — Full Interactive Template"
        badgeColor="bg-violet-500/20 text-violet-400 border-violet-500/30"
      >
        <ChooseAdventurePortfolio />
      </TemplatePreviewFrame>

      <TemplatePreviewFrame
        label="Weather Mood Theme — Full Interactive Template"
        badgeColor="bg-sky-500/20 text-sky-400 border-sky-500/30"
      >
        <WeatherMood />
      </TemplatePreviewFrame>

      <TemplatePreviewFrame
        label="Swiss Typography — Full Interactive Template"
        badgeColor="bg-red-500/20 text-red-400 border-red-500/30"
      >
        <SwissTypography />
      </TemplatePreviewFrame>

      <TemplatePreviewFrame
        label="Desert Dunes — Nature / Organic Template"
        badgeColor="bg-amber-500/20 text-amber-400 border-amber-500/30"
      >
        <DesertDunes />
      </TemplatePreviewFrame>
      </div>
          <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-400 border border-red-500/30">
            Preview
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Swiss Typography — Full Interactive Template</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <SwissTypography portfolioData={aiDraft} />
        </div>
      </div>
      {/* Psychedelic Swirl Theme */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-fuchsia-400 border border-fuchsia-500/30">
            ✿ Psychedelic Swirl
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">
            Psychedelic Swirl — Retro / Nostalgic Full Template
          </h2>
        </div>
        <div
          className="rounded-2xl border border-fuchsia-500/20"
          style={{ height: 640, overflowY: "auto", overflowX: "hidden", transform: "translate(0)", position: "relative" }}
        >
          <PsychedelicSwirl />
        </div>
      </div>

      {/* Desert Dunes Theme */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 border border-amber-500/30">
            🏜 Desert Dunes
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">
            Desert Dunes — Nature / Organic Full Template
          </h2>
        </div>
        <div
          className="rounded-2xl border border-amber-500/20"
          style={{ height: 640, overflowY: "auto", overflowX: "hidden", transform: "translate(0)", position: "relative" }}
        >
          <DesertDunes />
        </div>
      </div>

      {/* Memphis Pop Theme */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-yellow-400 border border-yellow-500/30">
            ★ Memphis Pop
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">
            Memphis Pop — Retro / Nostalgic Full Template
          </h2>
        </div>
        <div
          className="rounded-2xl border border-yellow-500/20"
          style={{ height: 640, overflowY: "auto", overflowX: "hidden", transform: "translate(0)", position: "relative" }}
        >
          <MemphisPop />
        </div>
      </div>

      {/* Cherry Blossom Theme */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-rose-400 border border-rose-500/30">
            🌸 Cherry Blossom
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Cherry Blossom Theme — Digital Spring</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-rose-500/20">
          <CherryBlossom portfolioData={aiDraft} />
        </div>
      </div>

      {/* Psychedelic Swirl Theme */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-fuchsia-400 border border-fuchsia-500/30">
            ✿ NEW — Psychedelic Swirl
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">
            Psychedelic Swirl — Retro / Nostalgic Full Template
          </h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <MidnightGradient />
        </div>
      </div>

      {/* Desert Dunes — sandboxed fixed-nav frame */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 border border-amber-500/30">
            🏜 Desert Dunes
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Desert Dunes — Nature / Organic Full Template</h2>
        </div>
        <div className="rounded-2xl border border-amber-500/20"
          style={{ height: 640, overflowY: "auto", overflowX: "hidden", transform: "translate(0)", position: "relative" }}>
          <DesertDunes />
        </div>
      </div>

      {/* Memphis Pop — sandboxed fixed-nav frame */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-yellow-400 border border-yellow-500/30">
            ★ Memphis Pop
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Memphis Pop — Retro / Nostalgic Full Template</h2>
        </div>
        <div className="rounded-2xl border border-yellow-500/20"
          style={{ height: 640, overflowY: "auto", overflowX: "hidden", transform: "translate(0)", position: "relative" }}>
          <MemphisPop />
        </div>
      </div>

      {/* Cassette Mixtape — sandboxed fixed-nav frame */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-orange-400 border border-orange-500/30">
            ▶ Cassette Mixtape
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Cassette Mixtape — Retro / Nostalgic Full Template</h2>
        </div>
        <div className="rounded-2xl border border-orange-500/20"
          style={{ height: 640, overflowY: "auto", overflowX: "hidden", transform: "translate(0)", position: "relative" }}>
          <CassetteMixtape />
        </div>
      </div>

      {/* Typewriter Effect — sandboxed fixed-nav frame */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest border" style={{ background: "rgba(139,37,0,.1)", color: "#8B2500", borderColor: "rgba(139,37,0,.25)" }}>
            ▮ Typewriter Effect
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Typewriter Effect — Vintage Paper Full Template</h2>
        </div>
        <div className="rounded-2xl" style={{ height: 640, overflowY: "auto", overflowX: "hidden", transform: "translate(0)", position: "relative", border: "1px solid rgba(139,37,0,.2)" }}>
          <TypewriterEffect />
      {/* Chromatic Glitch — sandboxed fixed-nav frame */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400 border border-cyan-500/30">
            ◈ Chromatic Glitch
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Chromatic Glitch — RGB Split / Colorful Full Template</h2>
        </div>
        <div className="rounded-2xl border border-cyan-500/20"
          style={{ height: 640, overflowY: "auto", overflowX: "hidden", transform: "translate(0)", position: "relative" }}>
          <ChromaticGlitch />
        </div>
      </div>
      {/* Magnetic Dock — sandboxed fixed-nav frame */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/25">
            ⬡ Magnetic Dock
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Magnetic Dock — macOS Spring-Physics Navigation</h2>
        </div>
        <div className="rounded-2xl border border-indigo-500/15"
          style={{ height: 640, overflowY: "auto", overflowX: "hidden", transform: "translate(0)", position: "relative" }}>
          <MagneticDock />
        </div>
      </div>

    </div>
  );
}
