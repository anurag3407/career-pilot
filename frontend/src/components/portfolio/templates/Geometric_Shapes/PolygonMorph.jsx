import React from 'react';

// Custom floating polygon decoration component
const FloatingPolygon = ({ className, delay = '0s', duration = '6s' }) => (
  <div 
    className={`absolute opacity-20 bg-gradient-to-tr from-cyan-500 to-fuchsia-500 pointer-events-none blur-sm ${className}`}
    style={{
      animation: `float-polygon ${duration} ease-in-out infinite`,
      animationDelay: delay,
      clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
    }}
  />
);

export default function PolygonMorph() {
  const coreFeatures = [
    {
      id: "01",
      title: "Dynamic Morphs",
      description: "Fluid state translations leveraging mathematical vertex layouts for pristine component geometry.",
      points: ["clip-path orchestration", "subtle scale transitions"],
      accent: "from-cyan-500 to-blue-600"
    },
    {
      id: "02",
      title: "Asymmetric Grids",
      description: "Break away from rigid web layouts with abstract polygon boundaries and multi-axis alignment.",
      points: ["isometric layouts", "per-pixel responsiveness"],
      accent: "from-fuchsia-500 to-purple-600"
    },
    {
      id: "03",
      title: "Vector Precision",
      description: "Lightweight architectural UI footprints built exclusively using native utility abstractions.",
      points: ["zero external assets", "pure hardware acceleration"],
      accent: "from-emerald-400 to-cyan-500"
    }
  ];

  return (
    <section className="relative min-h-screen w-full bg-[#0a0a16] text-slate-100 py-24 px-4 overflow-hidden flex flex-col justify-center items-center">
      
      {/* Global CSS Injection for the custom floating/morph keyframes without an external stylesheet */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-polygon {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-25px) rotate(15deg) scale(1.05); }
        }
        @keyframes mesh-pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }
      `}} />

      {/* Futuristic Geometric Background Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Floating Decorative Polygons */}
      <FloatingPolygon className="w-24 h-24 top-20 left-[10%]" delay="0s" duration="7s" />
      <FloatingPolygon className="w-32 h-32 bottom-16 right-[8%] from-purple-500 to-pink-500" delay="1.5s" duration="9s" />
      <FloatingPolygon className="w-16 h-16 top-1/3 right-[15%] from-emerald-500 to-cyan-400" delay="3s" duration="6s" />

      <div className="max-w-6xl w-full z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Core Architecture
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
            Polygon Morphism
          </h2>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-400 font-light leading-relaxed">
            A venture into sharp edges, futuristic perspective shifts, and complex geometric matrices tailored for the modern digital portfolio.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
          {coreFeatures.map((feature) => (
            <div 
              key={feature.id}
              className="group relative bg-slate-900/40 border border-slate-800 rounded-2xl p-8 transition-all duration-500 hover:border-slate-700/60 hover:-translate-y-2 flex flex-col justify-between backdrop-blur-md overflow-hidden"
            >
              {/* Card Corner Highlight Accent */}
              <div className={`absolute top-0 left-0 w-24 h-[2px] bg-gradient-to-r ${feature.accent} opacity-50 group-hover:w-full transition-all duration-700`} />
              
              {/* Subtle inner polygon hover background shape */}
              <div 
                className="absolute -right-12 -bottom-12 w-44 h-44 bg-slate-800/20 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none rotate-12 scale-75 group-hover:scale-110"
                style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}
              />

              <div>
                {/* Header info */}
                <div className="flex justify-between items-start mb-8">
                  <span className={`text-sm font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r ${feature.accent}`}>
                    // {feature.id}
                  </span>
                  
                  {/* Miniature Geometric Vector Icon */}
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                    </svg>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold mb-3 text-slate-100 tracking-wide group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-light mb-6">
                  {feature.description}
                </p>
              </div>

              {/* Point Checklist items */}
              <ul className="space-y-2 mt-auto border-t border-slate-800/60 pt-5">
                {feature.points.map((point, index) => (
                  <li key={index} className="flex items-center gap-2.5 text-xs font-mono text-slate-500 group-hover:text-slate-400 transition-colors">
                    <span className={`w-1 h-1 rotate-45 bg-gradient-to-r ${feature.accent}`} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Futuristic CTA Area */}
        <div className="mt-20 text-center">
          <button type="button" className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-transparent rounded-lg font-mono text-sm tracking-wider text-cyan-400 font-medium transition-all duration-300 overflow-hidden border border-cyan-500/30 hover:border-cyan-400 hover:text-white">
            
            {/* Morphing background layer on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            
            <span>INITIALIZE MATRIX</span>
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}