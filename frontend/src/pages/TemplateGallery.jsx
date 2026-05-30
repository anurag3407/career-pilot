import React, { useState, useRef, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Eye, Star, Sparkles, X } from "lucide-react";
import { templates } from "../data/templates";
import dummyData from "../data/dummy_data.json";
import DeployModal from "../components/portfolio/DeployModal";
import ThemeSelector from "../components/portfolio/ThemeSelector";
import SwissTypography from "../components/portfolio/templates/Swiss_Typography";
import LiquidGlass from "../components/portfolio/templates/Liquid_Glass";
import MidnightGradient from "../components/portfolio/templates/Midnight_Gradient";
import PlayingCardsPortfolio from "../components/portfolio/templates/Playing_Cards";
import CherryBlossom from "../components/portfolio/templates/Cherry_Blossom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";

const DRAFT_STORAGE_KEYS = ["ai_portfolio_draft", "aiDraft", "portfolioAiDraft", "portfolioDraft", "parsedResumeDraft"];

function readStoredDraft() {
  for (const key of DRAFT_STORAGE_KEYS) {
    const rawDraft = localStorage.getItem(key);
    if (!rawDraft) continue;

    try {
      return JSON.parse(rawDraft);
    } catch {
      return rawDraft;
    }
  }

  return null;
}

function buildTemplateData(portfolioData) {
  const draft = portfolioData && typeof portfolioData === "object" ? portfolioData : {};
  const hero = draft.hero || {};
  const about = draft.about || {};
  const draftPersonal = draft.personal || {};

  const personal = {
    ...dummyData.personal,
    ...draftPersonal,
    ...(hero.subtitle && { name: hero.subtitle }),
    ...(hero.title && { title: hero.title }),
    ...(hero.tagline && { tagline: hero.tagline }),
    ...(about.bio && { bio: about.bio }),
  };

  const normalizeSkills = (skills) => {
    if (!Array.isArray(skills) || skills.length === 0) return dummyData.skills;
    return skills.map((skill) => (
      typeof skill === "string"
        ? { name: skill, level: 80, category: "Skills" }
        : { level: 80, category: "Skills", ...skill }
    ));
  };

  const normalizeProjects = (projects) => {
    if (!Array.isArray(projects) || projects.length === 0) return dummyData.projects;
    return projects.map((project, index) => ({
      ...dummyData.projects[index % dummyData.projects.length],
      ...project,
    }));
  };

  return {
    ...dummyData,
    ...draft,
    personal,
    socials: { ...dummyData.socials, ...draft.socials, email: draftPersonal.email || draft.socials?.email || dummyData.socials.email },
    stats: { ...dummyData.stats, ...draft.stats },
    skills: normalizeSkills(draft.skills),
    projects: normalizeProjects(draft.projects),
    experience: Array.isArray(draft.experience) && draft.experience.length > 0 ? draft.experience : dummyData.experience,
    testimonials: Array.isArray(draft.testimonials) && draft.testimonials.length > 0 ? draft.testimonials : dummyData.testimonials,
  };
}

function FilterSelect({ value, onChange, options, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selectedLabel = options.find((option) => option.value === value)?.label ?? value;

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
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
          rounded-xl border text-sm font-medium text-foreground bg-card backdrop-blur-sm
          transition-all duration-300 cursor-pointer select-none
          ${open
            ? "border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.45)] ring-1 ring-cyan-400/30"
            : "border-border hover:border-cyan-500/60 hover:shadow-[0_0_8px_rgba(34,211,238,0.25)]"}
        `}
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute z-50 left-0 top-[calc(100%+6px)] min-w-full bg-card border border-border shadow-[0_0_20px_rgba(34,211,238,0.2)] rounded-xl overflow-hidden py-1"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`
                    flex items-center justify-between gap-3 px-4 py-2.5 text-sm cursor-pointer select-none transition-all duration-200
                    ${isSelected ? "bg-cyan-500/20 text-cyan-300 font-semibold" : "text-foreground hover:bg-cyan-500 hover:text-white"}
                  `}
                >
                  <span>{option.label}</span>
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
    return React.lazy(() =>
      import(`../components/portfolio/templates/${templateId}/Hero.jsx`).catch(() =>
        import(`../components/portfolio/templates/${templateId}/index.jsx`)
      )
    );
  }, [templateId]);

  if (!Component) return null;

  return (
    <Suspense fallback={<div className="h-full w-full bg-muted" />}>
      <Component portfolioData={portfolioData} data={portfolioData} />
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
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {template.isComplete ? (
          <div
            className="absolute top-0 left-0 origin-top-left pointer-events-none"
            style={{ width: "1280px", height: "800px", transform: "scale(0.3)" }}
          >
            <TemplateHeroPreview templateId={template.id} portfolioData={aiDraft} />
          </div>
        ) : (
          <>
            <motion.img
              src={template.image}
              alt={template.title}
              loading="lazy"
              className="h-full w-full object-cover object-top"
              variants={{
                rest: { scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
                hover: { scale: 1.03, transition: { type: "spring", stiffness: 200, damping: 25 } },
              }}
              onError={(event) => {
                event.target.style.display = "none";
                event.target.nextSibling.style.display = "flex";
              }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 items-center justify-center"
              style={{ display: "none" }}
            >
              <span className="text-white/60 text-sm font-medium">{template.title}</span>
            </div>
          </>
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
              animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 340, damping: 26, delay: 0.05 } }}
              exit={{ opacity: 0, y: 10, transition: { duration: 0.16, ease: "easeIn" } }}
              className="flex gap-2 w-full mt-4"
            >
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onUse(template.title, false);
                }}
                className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Use Theme
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onUse(template.id, true);
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
    return React.lazy(() =>
      import(`../components/portfolio/templates/${templateId}/Hero.jsx`).catch(() =>
        import(`../components/portfolio/templates/${templateId}/index.jsx`)
      )
    );
  }, [templateId]);

  if (!isOpen || !templateId) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 bg-card/80 border-b border-border shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            {templateId.replace(/_/g, " ")} Preview
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
          {Component && <Component portfolioData={portfolioData} data={portfolioData} />}
        </Suspense>
      </div>
    </div>
  );
};

export default function TemplateGallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const previewTemplateId = searchParams.get("preview");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [category, setCategory] = useState("All");
  const [colorScheme, setColorScheme] = useState("All");
  const [layout, setLayout] = useState("All");
  const [sort, setSort] = useState("Popular");
  const [aiDraft, setAiDraft] = useState(null);
  const previewData = useMemo(() => buildTemplateData(aiDraft), [aiDraft]);
  const [selectedTheme, setSelectedTheme] = useState("minimal");
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [selectedPortfolioTitle, setSelectedPortfolioTitle] = useState("");

  useEffect(() => {
    setAiDraft(readStoredDraft());
  }, []);

  const clearDraft = () => {
    DRAFT_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    setAiDraft(null);
  };

  const handleUseTemplate = (value, isPreview) => {
    if (isPreview) {
      setSearchParams({ preview: value });
      return;
    }

    setSelectedPortfolioTitle(value);
    setIsDeployModalOpen(true);
  };

  const categoryOptions = [
    { value: "All", label: "All Categories" },
    { value: "Portfolio", label: "Portfolio" },
    { value: "Resume", label: "Resume" },
    { value: "Dashboard", label: "Dashboard" },
  ];
  const colorOptions = [
    { value: "All", label: "All Color Schemes" },
    { value: "Dark", label: "Dark" },
    { value: "Light", label: "Light" },
    { value: "Colorful", label: "Colorful" },
  ];
  const layoutOptions = [
    { value: "All", label: "All Layouts" },
    { value: "Grid", label: "Grid" },
    { value: "Minimal", label: "Minimal" },
    { value: "Cards", label: "Cards" },
    { value: "Interactive", label: "Interactive" },
  ];
  const sortOptions = [
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
    <div className="min-h-screen bg-background text-foreground p-8 pt-24 transition-colors duration-300">
      <Navbar />
      <Breadcrumb className="mb-6" />

      {aiDraft && (
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <h3 className="text-emerald-400 font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Resume Parsed Successfully!
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

      <div className="mb-8">
        <h1 className="text-4xl font-bold">Template Gallery</h1>
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
        <FilterSelect value={category} onChange={setCategory} options={categoryOptions} />
        <FilterSelect value={colorScheme} onChange={setColorScheme} options={colorOptions} />
        <FilterSelect value={layout} onChange={setLayout} options={layoutOptions} />
        <FilterSelect value={sort} onChange={setSort} options={sortOptions} className="ml-auto" />
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
              aiDraft={previewData}
            />
          ))}
        </div>
      )}

      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        portfolioTitle={selectedPortfolioTitle}
        aiDraft={aiDraft}
        onDeploySuccess={clearDraft}
      />

      <TemplatePreviewModal
        templateId={previewTemplateId}
        isOpen={!!previewTemplateId}
        onClose={() => setSearchParams({}, { replace: true })}
        portfolioData={previewData}
      />

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

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-400 border border-indigo-500/30">
            Preview
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Midnight Gradient Theme</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <MidnightGradient portfolioData={aiDraft} />
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30">
            New - Playing Cards
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Playing Cards Theme - Click to flip, shuffle deck</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-emerald-500/20">
          <PlayingCardsPortfolio portfolioData={aiDraft} />
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-red-400 border border-red-500/30">
            Preview
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Swiss Typography - Full Interactive Template</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <SwissTypography portfolioData={aiDraft} />
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-rose-400 border border-rose-500/30">
            New - Cherry Blossom
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Cherry Blossom Theme - Digital Spring</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-rose-500/20">
          <CherryBlossom portfolioData={aiDraft} />
        </div>
      </div>
    </div>
  );
}
