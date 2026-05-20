import { useState } from "react";
import DeployModal from "../components/portfolio/DeployModal";
import ThemeSelector from "../components/portfolio/ThemeSelector";

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

  // State for filtering and sorting
  const [category, setCategory] = useState("All");
  const [colorScheme, setColorScheme] = useState("All");
  const [layout, setLayout] = useState("All");
  const [sort, setSort] = useState("Popular");
  const [selectedTheme, setSelectedTheme] = useState("minimal");
  
  // State for deployment modal
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [selectedPortfolioTitle, setSelectedPortfolioTitle] = useState("");

  // 1. Filter Logic
  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = category === "All" || template.category === category;
    const matchesColorScheme = colorScheme === "All" || template.colorScheme === colorScheme;
    const matchesLayout = layout === "All" || template.layout === layout;
    return matchesCategory && matchesColorScheme && matchesLayout;
  });

  // 2. Sort Logic
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sort === "Popular") return b.views - a.views;
    if (sort === "Highest Rated") return b.rating - a.rating;
    if (sort === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-8 pt-24 transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Template Gallery</h1>
        {/* Theme Toggle */}
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
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Portfolio theme</h2>
            <p className="text-sm text-gray-400">Pick a theme before deploying. Premium themes are shown and locked in the live gallery flow.</p>
          </div>
          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
            Selected: {selectedTheme}
          </span>
        </div>
        <ThemeSelector selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} />
      </div>

      {/* Filters and Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Category Filter */}
        <select
          className="bg-card p-3 rounded-lg border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Portfolio">Portfolio</option>
          <option value="Resume">Resume</option>
          <option value="Dashboard">Dashboard</option>
        </select>

        {/* Color Scheme Filter */}
        <select
          className="bg-card p-3 rounded-lg border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          value={colorScheme}
          onChange={(e) => setColorScheme(e.target.value)}
        >
          <option value="All">All Color Schemes</option>
          <option value="Dark">Dark</option>
          <option value="Light">Light</option>
          <option value="Colorful">Colorful</option>
        </select>

        {/* Layout Filter */}
        <select
          className="bg-card p-3 rounded-lg border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
        >
          <option value="All">All Layouts</option>
          <option value="Grid">Grid</option>
          <option value="Minimal">Minimal</option>
          <option value="Cards">Cards</option>
        </select>

        {/* Sort Selector */}
        <select
          className="bg-card p-3 rounded-lg border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ml-auto"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="Popular">Popular</option>
          <option value="Newest">Newest</option>
          <option value="Highest Rated">Highest Rated</option>
        </select>
      </div>

      {/* Gallery Grid */}
      {sortedTemplates.length === 0 ? (
        <div className="text-center text-muted-foreground mt-12 text-xl">
          No templates match the selected criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-card rounded-2xl overflow-hidden shadow-lg border border-border flex flex-col justify-between group transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-1"
            >
              <div>
                <img
                  src={template.image}
                  alt={template.title}
                  className="w-full h-52 object-cover object-top transition-transform duration-2000 group-hover:scale-105 "
                />

                <div className="p-5">
                  <h2 className="text-2xl font-semibold text-foreground">{template.title}</h2>
                  <p className="text-muted-foreground mt-1 text-sm">By {template.author}</p>
                  
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      {template.category}
                    </span>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      {template.colorScheme}
                    </span>
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      {template.layout}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5">
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>⭐ {template.rating}</span>
                  <span>👁 {template.views.toLocaleString()}</span>
                </div>

                <button 
                  onClick={() => {
                    setSelectedPortfolioTitle(template.title);
                    setIsDeployModalOpen(true);
                  }}
                  className="mt-5 w-full bg-primary text-primary-foreground py-2 rounded-xl font-medium hover:bg-primary/90 transition cursor-pointer opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                >
                  Use This Theme
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Deploy Modal */}
      <DeployModal 
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        portfolioTitle={selectedPortfolioTitle}
      />
    </div>
  );
}