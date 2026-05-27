import React, { useState } from 'react';
import { Utensils, Award, Clock, ArrowRight, Sparkles } from 'lucide-react';

/**
 * PERFORMANCE OPTIMIZATION (Copilot Fix):
 * Moved data array completely outside the functional component scope. 
 * This prevents the array and component references from being wastefully 
 * recreated in memory on every component state render cycle.
 */
const culinaryProjects = [
  {
    id: 1,
    title: "The Alchemist's Tasting Menu",
    category: "Menu Design & Concept",
    description: "Curated a multi-sensory 9-course fine dining experience blending molecular gastronomy with traditional heritage flavors.",
    icon: Utensils,
    tags: ["Molecular Gastronomy", "Fine Dining", "Menu Curation"],
    stats: { prep: "9 Courses", rating: "Experimental" }
  },
  {
    id: 2,
    title: "Saffron & Stone Bistro",
    category: "Culinary Consultation",
    description: "Designed a sustainable, farm-to-table kitchen workflow and menu architecture, increasing seasonal profit margins by 22%.",
    icon: Award,
    tags: ["Kitchen Optimization", "Sourcing", "Profit Strategy"],
    stats: { prep: "Turnkey Setup", rating: "Sustainable" }
  },
  {
    id: 3,
    title: "Le Petit Paris Pop-Up",
    category: "Event Production",
    description: "Led a highly acclaimed 3-week Parisian pastry pop-up event in downtown, serving over 4,500 artisanal desserts.",
    icon: Clock,
    tags: ["Event Logistics", "Pastry Design", "High Volume"],
    stats: { prep: "3 Weeks Only", rating: "4.5k+ Served" }
  }
];

export default function Projects() {
  // Theme uses shared app tokens so this page follows global light/dark selection.
  // State handles for smooth micro-interactions across mouse hovers and keyboard focus tracks
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredTag, setHoveredTag] = useState(null);

  return (
    <section className="w-full min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8 selection:bg-primary selection:text-primary-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Deep Blue Premium Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-card/80 text-muted-foreground px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-border shadow-sm">
            <Sparkles size={14} className="animate-spin text-primary" style={{ animationDuration: '4s' }} aria-hidden="true" />
            <span>Signature Work</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-sans font-bold tracking-tight text-foreground">
            Culinary Creations & Projects
          </h2>
          
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full" />
          
          <p className="text-muted-foreground font-sans text-sm sm:text-base leading-relaxed max-w-xl mx-auto pt-2">
            A showcase of gastronomic concepts, high-performance kitchen layouts, and curated dining experiences executed across the globe.
          </p>
        </div>

        {/* Responsive Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
          {culinaryProjects.map((project) => {
            const IconComponent = project.icon;
            const isCardHovered = hoveredCard === project.id;

            return (
              <a 
                key={project.id}
                href={`#project-${project.id}`}
                onMouseEnter={() => setHoveredCard(project.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onFocus={() => setHoveredCard(project.id)}
                onBlur={() => setHoveredCard(null)}
                style={{ 
                  cursor: 'pointer',
                  transform: isCardHovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0px) scale(1)',
                  transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                  textDecoration: 'none'
                }}
                className={`relative rounded-2xl border flex flex-col justify-between overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary bg-card/40 transition-all duration-500 ${
                  isCardHovered 
                    ? 'border-primary shadow-xl shadow-primary/20 bg-card/80' 
                    : 'border-border shadow-sm'
                }`}
              >
                {/* Image-Free Visual Header Area Block */}
                <div className="relative h-44 bg-gradient-to-br from-background via-card to-muted p-6 flex items-center justify-center overflow-hidden border-b border-border/50">
                  {/* Fine Geometric Background Grid pattern overlay */}
                  <div 
                    style={{ 
                      transform: isCardHovered ? 'scale(1.2) translateY(4px)' : 'scale(1) translateY(0px)',
                      transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px]" 
                  />
                  
                  {/* Fine Framing Accents lines */}
                  <div 
                    className={`absolute inset-4 border rounded-xl pointer-events-none transition-colors duration-500 ${
                      isCardHovered ? 'border-primary/30' : 'border-border'
                    }`}
                  />
                  
                  {/* Central Animated Floating Icon Badge Circle */}
                  <div 
                    style={{ 
                      transform: isCardHovered ? 'scale(1.1) rotate(12deg)' : 'scale(1) rotate(0deg)',
                      transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    className={`relative z-10 w-16 h-16 rounded-full border flex items-center justify-center shadow-xl transition-all duration-500 ${
                      isCardHovered 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-card text-primary border-border'
                    }`}
                  >
                    <IconComponent size={24} aria-hidden="true" />
                  </div>
                </div>

                {/* Main Text Content Wrapper Frame */}
                <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between bg-card/20 relative">
                  <div>
                    <span 
                      className={`text-xs font-bold uppercase tracking-widest block mb-2 font-mono transition-colors duration-300 ${
                        isCardHovered ? 'text-secondary' : 'text-primary'
                      }`}
                    >
                      {project.category}
                    </span>
                    
                    <h3 
                      className={`text-xl sm:text-2xl font-sans font-bold mb-3 transition-colors duration-300 ${
                        isCardHovered ? 'text-card-foreground' : 'text-foreground'
                      }`}
                    >
                      {project.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed font-normal mb-6">
                      {project.description}
                    </p>
                  </div>

                  {/* Micro Metadata Statistics Container Box */}
                  <div 
                    className={`grid grid-cols-2 gap-2 py-3 px-4 mb-6 rounded-xl border text-xs font-mono transition-all duration-500 ${
                      isCardHovered 
                        ? 'bg-accent/70 border-primary/50 text-accent-foreground' 
                        : 'bg-muted/40 border-border text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-1">⏱ {project.stats.prep}</div>
                    <div 
                      className={`text-right font-semibold transition-colors ${
                        isCardHovered ? 'text-card-foreground' : 'text-foreground'
                      }`}
                    >
                      ★ {project.stats.rating}
                    </div>
                  </div>

                  {/* Footer Interactive Dynamic Pill Tags */}
                  <div className="border-t border-border pt-6">
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tags.map((tag, index) => {
                        const tagKey = `${project.id}-${index}`;
                        const isTagHovered = hoveredTag === tagKey;
                        
                        return (
                          <span 
                            key={index}
                            onMouseEnter={() => setHoveredTag(tagKey)}
                            onMouseLeave={() => setHoveredTag(null)}
                            className={`text-[11px] font-medium tracking-wide font-sans px-3 py-1 rounded-md border shadow-sm cursor-pointer transition-all duration-300 ${
                              isTagHovered 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'bg-muted text-muted-foreground border-border'
                            }`}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>

                    {/* Premium Interactive Action Bar Styling element */}
                    <div 
                      style={{ 
                        transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      className={`w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl border transition-all duration-300 ${
                        isCardHovered 
                          ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/50' 
                          : 'bg-background text-foreground border-border'
                      }`}
                    >
                      <span>Explore Case Study</span>
                      <ArrowRight 
                        size={14} 
                        style={{ 
                          transform: isCardHovered ? 'translateX(6px)' : 'translateX(0px)',
                          transition: 'transform 300ms ease-out'
                        }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}