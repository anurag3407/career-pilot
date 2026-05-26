import { useState, useRef, useEffect } from "react";
import DeployModal from "../components/portfolio/DeployModal";
import ThemeSelector from "../components/portfolio/ThemeSelector";
import { useTheme } from "../hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, ChevronDown, Check, Eye, Star } from "lucide-react";
import HolographicAbout from "../components/portfolio/templates/Holographic/About";
import Hero from "../components/portfolio/templates/Holographic/Hero";
import CulinaryAbout from "../components/portfolio/templates/Culinary_Restaurant/About";
import TechStartupHero from "../components/portfolio/templates/Tech_Startup/Hero";
import GeometricShapesAbout from "../components/portfolio/templates/Geometric_Shapes/About";
import ChooseAdventurePortfolio from "../components/portfolio/templates/Choose_Adventure/index";
import RetroProjects from "../components/portfolio/templates/2D_Retro_8bit/Projects";
import FantasyRPGProjects from "../components/portfolio/templates/Fantasy_RPG/Projects";
import Navbar from '../components/Navbar'

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

function TemplateCard({ template, onUse }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
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
      <div className="overflow-hidden relative">
        <motion.img
          src={template.image}
          alt={template.title}
          className="w-full h-52 object-cover object-top"
          variants={{
            rest: { scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
            hover: { scale: 1.08, transition: { type: "spring", stiffness: 200, damping: 25 } },
          }}
        />
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
            <motion.button
              key="cta"
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: 1, y: 0,
                transition: { type: "spring", stiffness: 340, damping: 26, delay: 0.05 },
              }}
              exit={{
                opacity: 0, y: 10,
                transition: { duration: 0.16, ease: "easeIn" },
              }}
              whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onUse(template.title)}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm cursor-pointer"
            >
              Use This Theme
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function TemplateGallery() {
  const { theme, toggleTheme } = useTheme();

  const templates = [
    {
      id: 1,
      title: "Modern Portfolio",
      category: "Portfolio",
      colorScheme: "Dark",
      layout: "Grid",
      author: "Alex Johnson",
      views: 1200,
      rating: 4.8,
      image: "/template-previews/Modern-Portfolio.png",
      createdAt: "2026-05-10",
    },
    {
      id: 2,
      title: "Minimal Resume",
      category: "Resume",
      colorScheme: "Light",
      layout: "Minimal",
      author: "Sarah Lee",
      views: 980,
      rating: 4.6,
      image: "/template-previews/Minimal-Resume.png",
      createdAt: "2026-05-18",
    },
    {
      id: 3,
      title: "Creative Dashboard",
      category: "Dashboard",
      colorScheme: "Colorful",
      layout: "Cards",
      author: "Michael",
      views: 2100,
      rating: 4.9,
      image: "/template-previews/Creative-Dashboard.png",
      createdAt: "2026-05-15",
    },
  ];

  const [category, setCategory] = useState("All");
  const [colorScheme, setColorScheme] = useState("All");
  const [layout, setLayout] = useState("All");
  const [sort, setSort] = useState("Popular");
  const [selectedTheme, setSelectedTheme] = useState("minimal");
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [selectedPortfolioTitle, setSelectedPortfolioTitle] = useState("");

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
  ];
  const SORT_OPTIONS = [
    { value: "Popular", label: "Popular" },
    { value: "Newest", label: "Newest" },
    { value: "Highest Rated", label: "Highest Rated" },
  ];

  const filteredTemplates = templates.filter((template) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onUse={(title) => {
                setSelectedPortfolioTitle(title);
                setIsDeployModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        portfolioTitle={selectedPortfolioTitle}
      />

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-yellow-400 border border-yellow-500/30">
            Preview
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">2D Retro 8-bit Theme — Projects Section</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <RetroProjects />
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 border border-amber-500/30">
            Preview
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Fantasy RPG Theme — Projects Section</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <FantasyRPGProjects />
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400 border border-cyan-500/30">
            Preview
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Holographic Theme — Hero & About Sections</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
           <Hero />
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <HolographicAbout />
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 border border-amber-500/30">
            Preview
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Geometric Shapes Theme — About Section</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <GeometricShapesAbout />
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 border border-amber-500/30">
            Preview
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Culinary Restaurant Theme — About Section</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <CulinaryAbout />
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-400 border border-cyan-500/30">
            Preview
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Tech Startup Theme — Hero Section</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-cyan-500/20">
          <TechStartupHero />
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-4 flex items-center gap-3 px-1">
          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-400 border border-violet-500/30">
            Preview
          </span>
          <h2 className="text-lg font-semibold text-foreground/70">Choose Adventure Theme — Full Interactive Template</h2>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <ChooseAdventurePortfolio />
        </div>
      </div>
    </div>
  );
}