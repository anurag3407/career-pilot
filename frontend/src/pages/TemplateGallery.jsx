import React, { useState, useRef, useEffect, Suspense, useMemo } from "react";
import { useTheme } from "../hooks/useTheme";
import Navbar from "../components/Navbar";
import DeployModal from "../components/portfolio/DeployModal";
import ThemeSelector from "../components/portfolio/ThemeSelector";
import { templates } from '../data/templates';
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, ChevronDown, Check, Eye, Star, Sparkles, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";


/* TemplatePreviewFrame — contains each full portfolio template in a
   sandboxed scrollable box. The key trick: CSS `transform` on the outer
   wrapper makes it the "containing block" for any position:fixed children,
   so a template's fixed navbar stays inside the frame instead of
   escaping to the top of the viewport and overlapping the page navbar. */
function TemplatePreviewFrame({ label, badgeColor, children }) {
  return (
    <div className="mt-12">
      <div className="mb-4 flex items-center gap-3 px-1">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest border ${badgeColor}`}
        >
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
          overflowY: 'auto',
          overflowX: 'hidden',
          transform: 'translate(0)',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
}
// import Hero from "../components/portfolio/templates/Holographic/Hero";
// import ChooseAdventurePortfolio from "../components/portfolio/templates/Choose_Adventure/index";
// import RetroProjects from "../components/portfolio/templates/2D_Retro_8bit/Projects";
// import FantasyRPGProjects from "../components/portfolio/templates/Fantasy_RPG/Projects";


function FilterSelect({ value, onChange, options, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
          ${
            open
              ? 'border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.45)] ring-1 ring-cyan-400/30'
              : 'border-border hover:border-cyan-500/60 hover:shadow-[0_0_8px_rgba(34,211,238,0.25)]'
          }
        `}
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          className={`w-4 h-4 text-cyan-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
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
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`
                    flex items-center justify-between gap-3
                    px-4 py-2.5 text-sm cursor-pointer select-none
                    transition-all duration-200
                    ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'text-foreground hover:bg-cyan-500 hover:text-white'
                    }
                  `}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}


function useInView(options = {}) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options.rootMargin, options.threshold]);

  return [ref, inView];
}

function TemplateCard({ template, hovered, onHover, onLeave, onUse, aiDraft }) {
  const [ref, inView] = useInView({ threshold: 0 });
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const shouldRenderIframe = inView || hovered;

  // Reset iframe loaded state when it unmounts
  useEffect(() => {
    if (!shouldRenderIframe) {
      setIframeLoaded(false);
    }
  }, [shouldRenderIframe]);

  return (
    <motion.div
      onMouseEnter={() => onHover(template.id)}
      onMouseLeave={onLeave}
      animate={hovered ? 'hover' : 'rest'}
      initial="rest"
      variants={{
        rest: {
          y: 0,
          scale: 1,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          borderColor: 'rgba(255,255,255,0.08)',
          transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
        },
        hover: {
          y: -10,
          scale: 1.02,
          boxShadow:
            '0 28px 52px rgba(0,0,0,0.50), 0 0 0 1px rgba(99,102,241,0.55)',
          borderColor: 'rgba(99,102,241,0.65)',
          transition: { type: 'spring', stiffness: 280, damping: 22 },
        },
      }}
      className="bg-card rounded-2xl overflow-hidden border border-border flex flex-col justify-between cursor-pointer"
      ref={ref}
    >
      <div className="overflow-hidden relative bg-background aspect-[16/10]">
        
        {/* Layer 0: Sleek Fallback Placeholder / Loading Screen */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-black p-6 text-center z-0">
           {!iframeLoaded ? (
             <div className="flex flex-col items-center gap-3">
               <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
               <span className="text-xs text-cyan-300 font-mono uppercase tracking-widest animate-pulse">Loading Hero Section</span>
             </div>
           ) : (
             <>
                <Sparkles className="w-8 h-8 text-primary mb-3 opacity-50" />
                <h3 className="text-lg font-semibold text-white/80 font-mono tracking-tight">{template.title}</h3>
             </>
           )}
        </div>

        {/* Layer 1: Live iframe — loads when in view to provide an always-visible hero section */}
        {shouldRenderIframe && (
          <div
            className="absolute top-0 left-0 origin-top-left pointer-events-none z-20"
            style={{
              width: '500%',
              height: '500%',
              transform: 'scale(0.2)',
              opacity: iframeLoaded ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out',
            }}
          >
            <iframe
              src={`/preview/${template.id}`}
              className="w-full h-full border-none pointer-events-none bg-background"
              title={template.title}
              sandbox="allow-scripts allow-same-origin"
              onLoad={() => setIframeLoaded(true)}
            />
          </div>
        )}

        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-30"
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="p-5 flex-1">
        <h2 className="text-2xl font-semibold text-foreground">
          {template.title}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          By {template.author}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {[template.category, template.colorScheme, template.layout].map(
            (tag) => (
              <span
                key={tag}
                className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            {template.rating || 0}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            {(template.views || 0).toLocaleString()}
          </span>
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              key="cta-group"
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  type: 'spring',
                  stiffness: 340,
                  damping: 26,
                  delay: 0.05,
                },
              }}
              exit={{
                opacity: 0,
                y: 10,
                transition: { duration: 0.16, ease: 'easeIn' },
              }}
              className="flex gap-2 w-full mt-4"
            >
              <button type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUse(template.title, false, template.id);
                }}
                className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Use Theme
              </button>
              <button type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUse(template.id, true, template.id);
                }}
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

  if (!templateId) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shrink-0">
            <span className="text-sm font-semibold text-foreground/70 uppercase tracking-widest">
              Preview — {templateId?.replace(/_/g, " ")}
            </span>
            <button type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto relative bg-background" style={{ transform: "translate(0)" }}>
            <Suspense fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-4">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <p className="animate-pulse font-medium tracking-wide text-sm uppercase">Loading interactive preview...</p>
              </div>
            }>
              {Component && <Component portfolioData={portfolioData} />}
            </Suspense>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
  const [search, setSearch] = useState("");

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
    { value: 'All', label: 'All Categories' },
    { value: 'Portfolio', label: 'Portfolio' },
    { value: 'Resume', label: 'Resume' },
    { value: 'Dashboard', label: 'Dashboard' },
  ];
  const COLOR_OPTIONS = [
    { value: 'All', label: 'All Color Schemes' },
    { value: 'Dark', label: 'Dark' },
    { value: 'Light', label: 'Light' },
    { value: 'Colorful', label: 'Colorful' },
  ];
  const LAYOUT_OPTIONS = [
    { value: 'All', label: 'All Layouts' },
    { value: 'Grid', label: 'Grid' },
    { value: 'Minimal', label: 'Minimal' },
    { value: 'Cards', label: 'Cards' },
    { value: 'Interactive', label: 'Interactive' },
  ];
  const SORT_OPTIONS = [
    { value: 'Popular', label: 'Popular' },
    { value: 'Newest', label: 'Newest' },
    { value: 'Highest Rated', label: 'Highest Rated' },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      category === 'All' || template.category === category;
    const matchesColorScheme =
      colorScheme === 'All' || template.colorScheme === colorScheme;
    const matchesLayout = layout === 'All' || template.layout === layout;
    const q = search.toLowerCase().trim();
    const matchesSearch = !q ||
      template.title?.toLowerCase().includes(q) ||
      template.author?.toLowerCase().includes(q) ||
      template.colorScheme?.toLowerCase().includes(q) ||
      template.layout?.toLowerCase().includes(q) ||
      template.category?.toLowerCase().includes(q);
    return matchesCategory && matchesColorScheme && matchesLayout && matchesSearch;
  });
  
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
  if (sort === 'Popular') return b.views - a.views;
  if (sort === 'Highest Rated') return b.rating - a.rating;
  if (sort === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
  return 0;
  });

  console.log(
    "Vercel cards:",
    sortedTemplates.filter(
      (t) => t.title === "Vercel Deploy"
    ).length
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <TemplatePreviewModal
        templateId={previewTemplateId}
        isOpen={!!previewTemplateId}
        onClose={() => {
          if (searchParams.has("preview")) {
            window.history.back();
          } else {
            setSearchParams({}, { replace: true });
          }
        }}
        portfolioData={aiDraft}
      />

      <div className="p-8 pt-24">

        {aiDraft && (
          <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <h3 className="text-emerald-400 font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> ✨ Resume Parsed Successfully!
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your data has been extracted. Select a template below and we'll
                automatically inject your experience and projects!
              </p>
            </div>
            <button type="button"
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
          <button type="button"
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
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>

        <div className="mb-8 rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Portfolio theme
              </h2>
              <p className="text-sm text-muted-foreground">
                Pick a theme before deploying. Premium themes are shown and
                locked in the live gallery flow.
              </p>
            </div>
            <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
              Selected: {selectedTheme}
            </span>
          </div>
          <ThemeSelector
            selectedTheme={selectedTheme}
            onSelectTheme={setSelectedTheme}
          />
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search templates... e.g. Cyberpunk, Minimal, Dark"
              className="w-full px-5 py-3.5 pl-12 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60 transition-all text-sm"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {search && (
              <button type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <FilterSelect
            value={category}
            onChange={setCategory}
            options={CATEGORY_OPTIONS}
          />
          <FilterSelect
            value={colorScheme}
            onChange={setColorScheme}
            options={COLOR_OPTIONS}
          />
          <FilterSelect
            value={layout}
            onChange={setLayout}
            options={LAYOUT_OPTIONS}
          />
          <FilterSelect
            value={sort}
            onChange={setSort}
            options={SORT_OPTIONS}
            className="ml-auto"
          />
        </div>

        {sortedTemplates.length === 0 ? (
          <div className="text-center text-muted-foreground mt-12">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-xl font-semibold mb-2">No templates found</div>
            <div className="text-sm">
              {search ? `No results for "${search}" — try a different keyword` : "No templates match the selected filters"}
            </div>
            {search && (
              <button type="button" onClick={() => setSearch("")} className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm underline">
                Clear search
              </button>
            )}
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

        <DeployModal
          isOpen={isDeployModalOpen}
          onClose={() => setIsDeployModalOpen(false)}
          portfolioTitle={selectedPortfolioTitle}
          templateId={selectedTemplateId}
          aiDraft={aiDraft}
          onDeploySuccess={clearDraft}
        />



      </div>

      {/* Inspired Clyde DSouza - sandboxed fixed-nav frame */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-500 border border-emerald-500/25">
            🧑 Clyde D'Souza Inspired
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Inspired by Clyde D'Souza - Vibrant Split Pane</h2>
        </div>
        <div className="rounded-2xl border border-emerald-500/15"
          style={{ height: 640, overflowY: "auto", overflowX: "hidden", transform: "translate(0)", position: "relative", backgroundColor: "#f9fafb" }}>
          <InspiredClydeDSouza />
        </div>
      </div>

      {/* Inspired Delba - sandboxed fixed-nav frame */}
      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-slate-500/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-500 border border-slate-500/25">
            ✨ Delba Inspired
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Inspired by Delba - Minimalist Typography</h2>
        </div>
        <div className="rounded-2xl border border-slate-500/15"
          style={{ height: 640, overflowY: "auto", overflowX: "hidden", transform: "translate(0)", position: "relative", backgroundColor: "#FAFAFA" }}>
          <InspiredDelba />
        </div>
      </div>

    </div>
  );
}
      
       
