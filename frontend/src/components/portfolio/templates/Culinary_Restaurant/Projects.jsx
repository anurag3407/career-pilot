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
  // State handles for smooth micro-interactions across mouse hovers and keyboard focus tracks
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredTag, setHoveredTag] = useState(null);

  return (
    <section className="w-full min-h-screen bg-stone-50 text-stone-900 py-16 px-4 sm:px-6 lg:px-8 selection:bg-amber-100 selection:text-amber-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Michelin-Inspired Premium Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-950 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase shadow-sm">
            {/* aria-hidden added to decorative animated icons */}
            <Sparkles size={14} className="animate-spin text-amber-600" style={{ animationDuration: '4s' }} aria-hidden="true" />
            <span>Signature Work</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-stone-900">
            Culinary Creations & Projects
          </h2>
          
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full" />
          
          <p className="text-stone-600 font-sans text-sm sm:text-base leading-relaxed max-w-xl mx-auto pt-2">
            A showcase of gastronomic concepts, high-performance kitchen layouts, and curated dining experiences executed across the globe.
          </p>
        </div>

        {/* Responsive Flex / Grid Layout Grid */}
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
                /**
                 * ACCESSIBILITY OPTIMIZATION (Copilot Fix):
                 * Added structural support for keyboard navigation using onFocus and onBlur.
                 * Now, navigating via the 'Tab' key safely triggers identical luxury focus transitions.
                 */
                onFocus={() => setHoveredCard(project.id)}
                onBlur={() => setHoveredCard(null)}
                style={{ 
                  cursor: 'pointer',
                  transform: isCardHovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0px) scale(1)',
                  boxShadow: isCardHovered ? '0 25px 50px -12px rgba(120, 113, 108, 0.25)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  borderColor: isCardHovered ? '#f59e0b' : '#e7e5e4',
                  transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                  textDecoration: 'none'
                }}
                className="relative bg-white rounded-2xl border flex flex-col justify-between overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                {/* Image-Free Visual Header Area Block */}
                <div className="relative h-44 bg-gradient-to-br from-stone-900 to-stone-800 p-6 flex items-center justify-center overflow-hidden">
                  {/* Fine Geometric Background Grid pattern overlay */}
                  <div 
                    style={{ 
                      transform: isCardHovered ? 'scale(1.2) translateY(4px)' : 'scale(1) translateY(0px)',
                      transition: 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:10px_10px]" 
                  />
                  
                  {/* Fine Framing Accents lines */}
                  <div 
                    style={{ borderColor: isCardHovered ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.1)' }}
                    className="absolute inset-4 border rounded-xl pointer-events-none transition-colors duration-500" 
                  />
                  
                  {/* Central Animated Floating Icon Badge Circle */}
                  <div 
                    style={{ 
                      backgroundColor: isCardHovered ? '#f59e0b' : '#1c1917',
                      color: isCardHovered ? '#0c0a09' : '#fbbf24',
                      transform: isCardHovered ? 'scale(1.1) rotate(12deg)' : 'scale(1) rotate(0deg)',
                      transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    className="relative z-10 w-16 h-16 rounded-full border border-white/10 flex items-center justify-center shadow-xl"
                  >
                    {/* STYLING ACCESSIBILITY FIX: Added aria-hidden="true" to decorative graphical SVGs */}
                    <IconComponent size={26} aria-hidden="true" />
                  </div>
                </div>

                {/* Main Text Content Wrapper Frame */}
                <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between bg-white relative">
                  <div>
                    <span 
                      style={{ color: isCardHovered ? '#b45309' : '#d97706' }}
                      className="text-xs font-bold uppercase tracking-widest block mb-2 font-mono transition-colors duration-300"
                    >
                      {project.category}
                    </span>
                    
                    <h3 
                      style={{ color: isCardHovered ? '#78350f' : '#1c1917' }}
                      className="text-xl sm:text-2xl font-serif font-bold mb-3 transition-colors duration-300"
                    >
                      {project.title}
                    </h3>
                    
                    <p className="text-stone-600 text-sm leading-relaxed font-normal mb-6">
                      {project.description}
                    </p>
                  </div>

                  {/* Micro Metadata Statistics Container Box */}
                  <div 
                    style={{ 
                      backgroundColor: isCardHovered ? 'rgba(254, 243, 199, 0.2)' : 'rgba(245, 245, 244, 0.5)',
                      borderColor: isCardHovered ? 'rgba(251, 191, 36, 0.3)' : '#f5f5f4'
                    }}
                    className="grid grid-cols-2 gap-2 py-3 px-4 mb-6 rounded-xl border text-xs font-mono text-stone-500 transition-all duration-500"
                  >
                    <div className="flex items-center gap-1">⏱ {project.stats.prep}</div>
                    <div 
                      style={{ color: isCardHovered ? '#78350f' : '#44403c' }}
                      className="text-right font-semibold transition-colors"
                    >
                      ★ {project.stats.rating}
                    </div>
                  </div>

                  {/* Footer Interactive Dynamic Pill Tags */}
                  <div className="border-t border-stone-100 pt-6">
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tags.map((tag, index) => {
                        const tagKey = `${project.id}-${index}`;
                        const isTagHovered = hoveredTag === tagKey;
                        
                        return (
                          <span 
                            key={index}
                            onMouseEnter={() => setHoveredTag(tagKey)}
                            onMouseLeave={() => setHoveredTag(null)}
                            style={{ 
                              cursor: 'pointer',
                              backgroundColor: isTagHovered ? '#78350f' : '#f5f5f4',
                              color: isTagHovered ? '#ffffff' : '#44403c',
                              borderColor: isTagHovered ? '#78350f' : 'rgba(231, 229, 230, 0.4)',
                              transition: 'all 300ms ease-out'
                            }}
                            className="text-[11px] font-medium tracking-wide font-sans px-3 py-1 rounded-md border shadow-sm"
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>

                    {/* Premium Interactive Action Bar Styling element */}
                    <div 
                      style={{ 
                        backgroundColor: isCardHovered ? '#1c1917' : '#f5f5f4',
                        color: isCardHovered ? '#ffffff' : '#1c1917',
                        borderColor: isCardHovered ? '#1c1917' : 'rgba(231, 229, 230, 0.6)',
                        boxShadow: isCardHovered ? '0 10px 15px -3px rgba(28, 25, 23, 0.15)' : 'none',
                        transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl border"
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