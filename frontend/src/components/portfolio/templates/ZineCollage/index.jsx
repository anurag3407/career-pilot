import React from 'react';

// Accept both portfolioData (global contract) and data (fallback)
export default function ZineCollage({ data, portfolioData }) {
  
  // 🔒 Safe anonymous template fallbacks
  const localDefault = {
    personal: {
      name: "Alex Morgan",
      title: "Creative Developer // Interface Designer",
      summary: "Crafting digital experiences at the intersection of avant-garde design systems and clean frontend architecture. Specialized in unconventional layouts, interactive visual mechanics, and pushing the limits of the traditional web canvas."
    },
    experience: [
      {
        position: "Frontend Engineering Intern",
        company: "Studio Nexus Labs",
        startDate: "Jan 2025",
        description: "Spearheaded modular UI component development and streamlined layout styling frameworks for high-traffic agency web properties."
      },
      {
        position: "Open Source Contributor",
        company: "DevCom Community Initiative",
        startDate: "Aug 2025",
        description: "Contributed to core responsive rendering layout logic and optimized compilation performance thresholds across shared UI toolkits."
      }
    ],
    projects: [
      {
        name: "Hyper-Grid Canvas Engine",
        description: "An experimental web environment featuring interactive user interface mechanics and radical typography formatting layouts.",
        technologies: ["React", "Tailwind CSS", "Framer Motion"]
      },
      {
        name: "Retro Sound Workstation",
        description: "A customizable in-browser soundboard workspace simulating hardware racks using responsive CSS layouts.",
        technologies: ["JavaScript", "Web Audio API", "CSS Grid"]
      }
    ],
    skills: ["React.js", "Tailwind CSS", "JavaScript (ES6+)", "Framer Motion", "UI/UX Design", "Git & GitHub", "Node.js"]
  };

  // 🔄 Normalize incoming props contract
  const incoming = portfolioData || data || {};

  // 🧩 CodeAnt Fix: Section-by-section default merging instead of all-or-nothing
  const personal = incoming.personal && Object.keys(incoming.personal).length > 0 ? incoming.personal : localDefault.personal;
  const experience = incoming.experience && incoming.experience.length > 0 ? incoming.experience : localDefault.experience;
  const projects = incoming.projects && incoming.projects.length > 0 ? incoming.projects : localDefault.projects;
  const skills = incoming.skills && incoming.skills.length > 0 ? incoming.skills : localDefault.skills;

  return (
    <div className="min-h-screen bg-[#f4ebd0] text-[#1e1e1e] font-mono p-6 md:p-12 selection:bg-black selection:text-white">
      
      {/* 📰 HEADER MASTHEAD */}
      <header className="border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-5xl mx-auto mb-12 -rotate-1">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{personal.name || "Alex Morgan"}</h1>
        <p className="text-lg md:text-xl font-bold border-t-2 border-black mt-4 pt-2 tracking-tight">
          {personal.title || "Creative Developer"} // VOL. 01
        </p>
      </header>

      {/* 🧩 COLLAGE CANVAS MASHUP */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN PANEL */}
        <div className="md:col-span-5 space-y-8">
          {/* Bio Manifest Card */}
          <section className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-1">
            <h2 className="text-xl font-black bg-black text-white px-2 py-1 inline-block uppercase mb-4 tracking-wider">
              Manifesto // Bio
            </h2>
            <p className="leading-relaxed font-semibold text-sm md:text-base">{personal.summary}</p>
          </section>

          {/* Stamped Label Skills Card */}
          <section className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            <h2 className="text-xl font-black bg-black text-white px-2 py-1 inline-block uppercase mb-4 tracking-wider">
              Core_Arsenal [Skills]
            </h2>
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-black text-white px-2.5 py-1 text-xs font-black uppercase tracking-tight shadow-[2px_2px_0px_0px_rgba(100,100,100,1)] transform hover:scale-105 transition-transform"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN PANEL */}
        <div className="md:col-span-7 space-y-8">
          {/* Experience Stack */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight underline decoration-4 mb-4">
              LOGGED_FRAGMENTS [EXPERIENCE]
            </h2>
            {experience.map((exp, index) => (
              <div 
                key={index} 
                className={`border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:rotate-0 ${
                  index % 2 === 0 ? '-rotate-1' : 'rotate-1'
                }`}
              >
                <div className="flex justify-between items-baseline mb-1 gap-2">
                  <h3 className="text-lg font-black uppercase tracking-tight">{exp.position}</h3>
                  <span className="text-[10px] bg-black text-white px-1.5 py-0.5 font-bold shrink-0">{exp.startDate}</span>
                </div>
                <h4 className="text-sm font-bold text-gray-700 uppercase mb-3">@{exp.company}</h4>
                <p className="text-xs font-medium border-l-2 border-dashed border-black pl-3 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </section>

          {/* Polaroid Clipboard Projects Section */}
          <section className="space-y-6 pt-4">
            <h2 className="text-2xl font-black uppercase tracking-tight underline decoration-4 mb-4">
              CUT_OUT_BLUEPRINTS [PROJECTS]
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((proj, index) => (
                <div 
                  key={index} 
                  className={`border-4 border-black p-4 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] pb-8 transform hover:scale-[1.02] transition-transform ${
                    index % 2 === 0 ? 'rotate-1' : '-rotate-2'
                  }`}
                >
                  <div className="bg-gray-100 border-2 border-black aspect-video mb-3 flex items-center justify-center p-2 text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">// CAPTURE_FRAME_0{index + 1}</span>
                  </div>
                  <h3 className="text-md font-black uppercase tracking-tight mb-1">{proj.name}</h3>
                  <p className="text-[11px] font-medium leading-normal text-gray-800 mb-3">{proj.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {proj.technologies?.map((tech, tIdx) => (
                      <span key={tIdx} className="text-[9px] font-bold border border-black px-1 bg-[#f4ebd0]">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}