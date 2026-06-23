import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '20px', backgroundColor: 'black', width: '100vw', height: '100vh', overflow: 'auto' }}>
          <h1>Component Error</h1>
          <pre>{this.state.error && this.state.error.toString()}</pre>
          <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function MichelinStarChefPlatingContent({ data, portfolioData }) {
  // 🔒 Safe anonymous template fallbacks
  const localDefault = {
    personal: {
      name: "Auguste Escoffier",
      title: "Executive Chef & Culinary Artist",
      summary: "Crafting multisensory dining experiences through modernist techniques and reverence for terroir. Every plate is a carefully composed symphony of flavors, textures, and visual poetry."
    },
    experience: [
      {
        position: "Executive Chef",
        company: "L'Atelier de la Gastronomie (3 Michelin Stars)",
        startDate: "2018 - Present",
        description: "Redefined contemporary fine dining by blending classic French technique with avant-garde fermentation."
      },
      {
        position: "Chef de Cuisine",
        company: "Maison d'Argent (2 Michelin Stars)",
        startDate: "2013 - 2018",
        description: "Led kitchen operations, developed seasonal tasting menus, and earned the restaurant its second star."
      }
    ],
    projects: [
      {
        name: "Spring Awakening",
        description: "A 12-course tasting menu exploring the transient nature of spring forage. Featuring white asparagus, morels, and fermented green almonds.",
        technologies: ["Foraging", "Fermentation", "Plating"]
      },
      {
        name: "Oceanic Depths",
        description: "Signature dish: Dry-aged turbot, sea grape caviar, and a masterfully reduced oyster emulsion.",
        technologies: ["Dry-aging", "Emulsions", "Precision Temperature Cooking"]
      }
    ],
    skills: ["Classic French Technique", "Molecular Gastronomy", "Menu Development", "Kitchen Management", "Fermentation", "Plating Artistry"]
  };

  // 🔄 Normalize incoming props contract
  const incoming = portfolioData || data || {};

  // 🧩 Section-by-section default merging
  const personal = incoming.personal && Object.keys(incoming.personal).length > 0 ? incoming.personal : localDefault.personal;
  const experience = incoming.experience && incoming.experience.length > 0 ? incoming.experience : localDefault.experience;
  const projects = incoming.projects && incoming.projects.length > 0 ? incoming.projects : localDefault.projects;
  const skills = incoming.skills && incoming.skills.length > 0 ? incoming.skills : localDefault.skills;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5dc] font-serif p-8 md:p-16 selection:bg-[#d4af37] selection:text-[#0a0a0a] overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#d4af37] via-transparent to-transparent"></div>
      
      <div className="max-w-6xl mx-auto relative z-10 border border-[#d4af37]/20 p-8 md:p-16 rounded-sm shadow-2xl bg-[#111111]/80 backdrop-blur-sm">
        
        {/* Masthead */}
        <header className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl tracking-widest text-[#d4af37] uppercase font-light mb-6">
            {personal.name || "Chef Name"}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-[#d4af37]/50"></div>
            <p className="text-xl md:text-2xl tracking-widest uppercase font-thin text-gray-300">
              {personal.title || "Culinary Artist"}
            </p>
            <div className="h-px w-16 bg-[#d4af37]/50"></div>
          </div>
          <p className="mt-10 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-gray-400 font-light italic">
            "{personal.summary || personal.bio || "Crafting multisensory dining experiences."}"
          </p>
        </header>

        {/* Menu Layout (Experience & Projects) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          
          {/* Left Column: Experience */}
          <section>
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-2xl tracking-[0.3em] uppercase text-[#d4af37] mb-2">Service</h2>
              <div className="w-8 h-px bg-[#d4af37]/70"></div>
            </div>
            
            <div className="space-y-12">
              {experience.map((exp, index) => (
                <div key={index} className="group relative">
                  <div className="absolute -left-6 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#d4af37]">
                    ✦
                  </div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl tracking-wider text-gray-200">{exp.position || exp.title}</h3>
                    <span className="text-sm font-sans tracking-widest text-[#d4af37]/70">{exp.startDate}</span>
                  </div>
                  <h4 className="text-md text-[#d4af37] mb-3 italic">{exp.company}</h4>
                  <p className="text-gray-400 leading-relaxed font-light text-sm">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Right Column: Projects (Signature Dishes) */}
          <section>
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-2xl tracking-[0.3em] uppercase text-[#d4af37] mb-2">Signature Plating</h2>
              <div className="w-8 h-px bg-[#d4af37]/70"></div>
            </div>

            <div className="space-y-12">
              {projects.map((proj, index) => (
                <div key={index} className="group border-b border-[#d4af37]/10 pb-8 last:border-0">
                  <h3 className="text-2xl tracking-wider text-gray-200 mb-4 font-light">{proj.name || proj.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-light text-sm mb-6">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {proj.technologies?.map((tech, tIdx) => (
                      <span key={tIdx} className="text-xs font-sans tracking-widest uppercase text-[#d4af37]/60">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer: Skills (Ingredients/Techniques) */}
        <section className="mt-24 pt-16 border-t border-[#d4af37]/20 text-center">
          <h2 className="text-sm tracking-[0.4em] uppercase text-[#d4af37] mb-8">Repertoire & Techniques</h2>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {skills.map((skill, index) => {
              const skillName = typeof skill === 'string' ? skill : skill.name;
              return (
                <span 
                  key={index} 
                  className="text-gray-400 text-sm tracking-wider uppercase font-light"
                >
                  {skillName}
                  {index < skills.length - 1 && <span className="ml-8 text-[#d4af37]/30">•</span>}
                </span>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}

export default function MichelinStarChefPlating(props) {
  return (
    <ErrorBoundary>
      <MichelinStarChefPlatingContent {...props} />
    </ErrorBoundary>
  );
}
