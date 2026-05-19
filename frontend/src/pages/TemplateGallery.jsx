import { useState } from "react";

export default function TemplateGallery() {
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
      image: "https://picsum.photos/400/200?1",
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
      image: "https://picsum.photos/400/200?2",
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
      image: "https://picsum.photos/400/200?3",
      createdAt: "2026-05-15",
    },
  ];

  // State for filtering and sorting
  const [category, setCategory] = useState("All");
  const [colorScheme, setColorScheme] = useState("All");
  const [layout, setLayout] = useState("All");
  const [sort, setSort] = useState("Popular");

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
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Template Gallery</h1>

      {/* Filters and Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        {/* Category Filter */}
        <select
          className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 text-gray-300 focus:outline-none"
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
          className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 text-gray-300 focus:outline-none"
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
          className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 text-gray-300 focus:outline-none"
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
          className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 text-gray-300 focus:outline-none ml-auto"
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
        <div className="text-center text-gray-500 mt-12 text-xl">
          No templates match the selected criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg border border-zinc-800 flex flex-col justify-between"
            >
              <div>
                <img
                  src={template.image}
                  alt={template.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">
                  <h2 className="text-2xl font-semibold">{template.title}</h2>
                  <p className="text-gray-400 mt-1 text-sm">By {template.author}</p>
                  
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
                      {template.category}
                    </span>
                    <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
                      {template.colorScheme}
                    </span>
                    <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
                      {template.layout}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5">
                <div className="flex justify-between text-sm text-gray-300 mt-2">
                  <span>⭐ {template.rating}</span>
                  <span>👁 {template.views.toLocaleString()}</span>
                </div>

                <button className="mt-5 w-full bg-white text-black py-2 rounded-xl font-medium hover:bg-gray-200 transition">
                  Use This Theme
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}