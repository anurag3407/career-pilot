import React, { useState, useEffect, useRef } from 'react';

// =========================================================================
// PRODUCTION INTEGRATION INSTRUCTIONS:
// In your local project repository, uncomment the line below to connect 
// the template to your live database profile data context:
// 
import { usePortfolio } from '../../../../context/PortfolioContext';
// =========================================================================

const fallbackPortfolioData = {
  details: {
    name: "Dev Jadiya",
    title: "Full Stack Developer & Systems Architect",
    about: "I build high-performance distributed systems, low-latency web architectures, and interactive command-line experiences. Specializing in Go, React, Python, and system design optimization.",
    location: "Madhya Pradesh, India",
    email: "devjadiya@example.com",
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    }
  },
  skills: [
    "HTML", "CSS", "JavaScript", "TypeScript", "Node.js", "GraphQL", 
    "PostgreSQL", "Automated Testing", "React (Native)", "Bash", "Go", 
    "Docker", "Python", "C++", "Redis", "gRPC", "AWS", "Kubernetes", "Git", "Linux"
  ],
  experience: [
    { role: "Software Developer", company: "Encoderspro Pvt. Ltd.", duration: "Dec'23 - Feb'24", description: "Developed scalable course platforms with lead generation using React, Node.js, and Firebase. Optimized page performance and SEO." },
    { role: "Project Engineer", company: "Mindmediahouse", duration: "Feb'24 - Present", description: "Built customized cloud dashboards, handling real-time high-throughput client sockets and secure credentials architecture." },
    { role: "Full Stack Developer", company: "Bluemind Global Ltd.", duration: "Jan'24 - Mar'24", description: "Maintained React-based enterprise suites, engineered REST APIs, and automated secure unit-testing deployment workflows." },
    { role: "Systems Engineer", company: "SteelX Pvt. Ltd.", duration: "Mar'24 - Present", description: "Refactored Go-based backend microservices, reducing payload response overhead by 32% and automating CI/CD routines." }
  ],
  projects: [
    { name: "Bluemind", description: "A high-performance system for orchestrating secure organizational workflows and cloud permissions.", tech: ["React", "Node.js", "PostgreSQL"], link: "#" },
    { name: "Encoderspro", description: "SEO-optimized course delivery engine with integrated interactive quizzes, dynamic grade tracking, and Stripe billing.", tech: ["React", "Firebase", "Node.js"], link: "#" },
    { name: "ITCouncil", description: "Collaborative workspace hub linking technical councils with automated deployment monitoring utilities.", tech: ["TypeScript", "Next.js", "Docker"], link: "#" },
    { name: "Minor-Project", description: "Edge-computed image processing suite utilizing Python and fast neural networks.", tech: ["Python", "TensorFlow", "OpenCV"], link: "#" },
    { name: "Steelx", description: "Industrial inventory management dashboard utilizing WebSockets for real-time status reporting.", tech: ["Go", "React", "Tailwind CSS"], link: "#" }
  ],
  education: [
    { degree: "Bachelor of Technology in Computer Science", institution: "State University", duration: "2020 - 2024" }
  ]
};

function Dynamic3DCanvas({ themeColor }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const generatePrismVertices = (offsetX) => [
      // Top face loop (Y = -35)
      { x: offsetX - 25, y: -35, z: -15 },
      { x: offsetX + 0,  y: -35, z: -30 },
      { x: offsetX + 25, y: -35, z: -15 },
      { x: offsetX + 25, y: -35, z: 15 },
      { x: offsetX + 0,  y: -35, z: 30 },
      { x: offsetX - 25, y: -35, z: 15 },
      // Bottom face loop (Y = 35)
      { x: offsetX - 25, y: 35,  z: -15 },
      { x: offsetX + 0,  y: 35,  z: -30 },
      { x: offsetX + 25, y: 35,  z: -15 },
      { x: offsetX + 25, y: 35,  z: 15 },
      { x: offsetX + 0,  y: 35,  z: 30 },
      { x: offsetX - 25, y: 35,  z: 15 }
    ];

    const prismEdges = [
      // Face connecting indices
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 6],
      // Structural pillars
      [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11],
      // Aesthetic cross joints
      [1, 9], [4, 6]
    ];

    const generateLetterVertices = (letter, offsetX) => {
      if (letter === 'D') {
        return [
          { x: offsetX - 12, y: -20, z: 0 },
          { x: offsetX + 12, y: -20, z: 0 },
          { x: offsetX + 12, y: 20,  z: 0 },
          { x: offsetX - 12, y: 20,  z: 0 },
          { x: offsetX,      y: 0,   z: 10 }
        ];
      } else if (letter === 'E') {
        return [
          { x: offsetX - 12, y: -20, z: 0 },
          { x: offsetX + 12, y: -20, z: 0 },
          { x: offsetX - 12, y: 0,   z: 0 },
          { x: offsetX + 8,  y: 0,   z: 0 },
          { x: offsetX - 12, y: 20,  z: 0 },
          { x: offsetX + 12, y: 20,  z: 0 }
        ];
      } else { // V
        return [
          { x: offsetX - 12, y: -20, z: -10 },
          { x: offsetX + 12, y: -20, z: 10 },
          { x: offsetX,      y: 20,  z: 0 }
        ];
      }
    };

    const letterEdges = {
      'D': [[0, 1], [1, 4], [4, 2], [2, 3], [3, 0]],
      'E': [[0, 1], [0, 4], [2, 3], [4, 5]],
      'V': [[0, 2], [1, 2]]
    };

    const datasets = [
      { vertices: generatePrismVertices(-110), edges: prismEdges, letter: 'D', letterVertices: generateLetterVertices('D', -110), letterEdges: letterEdges['D'] },
      { vertices: generatePrismVertices(0),    edges: prismEdges, letter: 'E', letterVertices: generateLetterVertices('E', 0),    letterEdges: letterEdges['E'] },
      { vertices: generatePrismVertices(110),  edges: prismEdges, letter: 'V', letterVertices: generateLetterVertices('V', 110),  letterEdges: letterEdges['V'] }
    ];

    let angleY = 0;
    let angleX = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseRef.current.targetX = (x / (rect.width / 2)) * 0.8;
      mouseRef.current.targetY = (y / (rect.height / 2)) * 0.8;
    };

    const handleMouseEnter = () => { mouseRef.current.isHovering = true; };
    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Damp mouse target vectors for smooth fluid transition momentum
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      angleY = (Date.now() * 0.0006) + mouseRef.current.x;
      angleX = 0.15 + mouseRef.current.y;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const fov = 300;

      const project = (v) => {
        let x1 = v.x * cosY - v.z * sinY;
        let z1 = v.x * sinY + v.z * cosY;
        let y2 = v.y * cosX - z1 * sinX;
        let z2 = v.y * sinX + z1 * cosX;

        const scale = fov / (fov + z2);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2
        };
      };

      datasets.forEach((shape) => {
        const projectedPrisms = shape.vertices.map(project);
        const projectedLetters = shape.letterVertices.map(project);

        // Render outer prism segments
        ctx.lineWidth = 1;
        shape.edges.forEach(([p1, p2]) => {
          const pt1 = projectedPrisms[p1];
          const pt2 = projectedPrisms[p2];

          const depthAvg = (pt1.z + pt2.z) / 2;
          const opacity = Math.max(0.08, 0.45 - depthAvg / 400);

          ctx.strokeStyle = themeColor === 'matrix' ? `rgba(51, 255, 51, ${opacity})` : 
                            themeColor === 'dracula' ? `rgba(189, 147, 249, ${opacity})` :
                            themeColor === 'monokai' ? `rgba(249, 38, 114, ${opacity})` :
                            `rgba(56, 139, 253, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.stroke();
        });

        // Render bold central letters D, E, V
        ctx.lineWidth = 2.5;
        shape.letterEdges.forEach(([p1, p2]) => {
          const pt1 = projectedLetters[p1];
          const pt2 = projectedLetters[p2];
          const opacity = Math.max(0.3, 0.9 - (pt1.z + pt2.z) / 400);

          ctx.strokeStyle = themeColor === 'matrix' ? `rgba(51, 255, 51, ${opacity})` : 
                            themeColor === 'dracula' ? `rgba(189, 147, 249, ${opacity})` :
                            themeColor === 'monokai' ? `rgba(166, 226, 46, ${opacity})` :
                            `rgba(255, 255, 255, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.stroke();
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseenter', handleMouseEnter);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [themeColor]);

  return (
    <div className="w-full h-48 sm:h-56 bg-[#03060a] border border-[#21262d] relative group overflow-hidden">
      <div className="absolute top-2 left-3 text-[10px] font-mono text-[#8b949e] uppercase tracking-wider flex items-center gap-1.5 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        3D Wireframe Vector Mesh: Interactive
      </div>
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}

export default function InspiredDevJadiya() {
  // Use fallbacks automatically to keep compilation safe in preview environments
  const hookInstance = usePortfolio?.();
  const data = hookInstance?.portfolioData || fallbackPortfolioData;

  const [theme, setTheme] = useState('tokyonight');
  const [activeItem, setActiveItem] = useState({ section: 'home', index: 0 });
  const [paneFocus, setPaneFocus] = useState('experience');

  const details = data.details || fallbackPortfolioData.details;
  const skills = data.skills || fallbackPortfolioData.skills;
  const experience = data.experience || fallbackPortfolioData.experience;
  const projects = data.projects || fallbackPortfolioData.projects;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (paneFocus === 'experience' && experience.length > 0) {
          setActiveItem(prev => ({
            section: 'experience',
            index: (prev.section === 'experience' ? prev.index - 1 + experience.length : experience.length - 1) % experience.length
          }));
        } else if (paneFocus === 'projects' && projects.length > 0) {
          setActiveItem(prev => ({
            section: 'projects',
            index: (prev.section === 'projects' ? prev.index - 1 + projects.length : projects.length - 1) % projects.length
          }));
        } else if (paneFocus === 'skills' && skills.length > 0) {
          setActiveItem(prev => ({
            section: 'skills',
            index: (prev.section === 'skills' ? prev.index - 1 + skills.length : skills.length - 1) % skills.length
          }));
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (paneFocus === 'experience' && experience.length > 0) {
          setActiveItem(prev => ({
            section: 'experience',
            index: (prev.section === 'experience' ? prev.index + 1 : 0) % experience.length
          }));
        } else if (paneFocus === 'projects' && projects.length > 0) {
          setActiveItem(prev => ({
            section: 'projects',
            index: (prev.section === 'projects' ? prev.index + 1 : 0) % projects.length
          }));
        } else if (paneFocus === 'skills' && skills.length > 0) {
          setActiveItem(prev => ({
            section: 'skills',
            index: (prev.section === 'skills' ? prev.index + 1 : 0) % skills.length
          }));
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const cycleLeft = { 'experience': 'skills', 'projects': 'experience', 'skills': 'projects' };
        setPaneFocus(cycleLeft[paneFocus]);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const cycleRight = { 'experience': 'projects', 'projects': 'skills', 'skills': 'experience' };
        setPaneFocus(cycleRight[paneFocus]);
      } else if (e.key === '1') {
        setPaneFocus('experience');
      } else if (e.key === '2') {
        setPaneFocus('projects');
      } else if (e.key === '3') {
        setPaneFocus('skills');
      } else if (e.key === 'h' || e.key === 'H') {
        setActiveItem({ section: 'home', index: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paneFocus, experience, projects, skills]);

  const getThemeClasses = () => {
    switch (theme) {
      case 'matrix':
        return {
          bg: 'bg-[#020a02]',
          borderActive: 'border-[#33ff33]',
          borderMuted: 'border-[#0a4d0a]',
          textHighlight: 'text-[#33ff33]',
          textBody: 'text-[#00cc00]',
          textMuted: 'text-[#006600]',
          bgSelection: 'bg-[#0a4d0a] text-white',
          bannerHex: '#33ff33'
        };
      case 'dracula':
        return {
          bg: 'bg-[#1e1f29]',
          borderActive: 'border-[#bd93f9]',
          borderMuted: 'border-[#44475a]',
          textHighlight: 'text-[#ff79c6]',
          textBody: 'text-[#f8f8f2]',
          textMuted: 'text-[#6272a4]',
          bgSelection: 'bg-[#44475a] text-[#f8f8f2]',
          bannerHex: '#bd93f9'
        };
      case 'monokai':
        return {
          bg: 'bg-[#1b1c1e]',
          borderActive: 'border-[#a6e22e]',
          borderMuted: 'border-[#49483e]',
          textHighlight: 'text-[#f92672]',
          textBody: 'text-[#f8f8f2]',
          textMuted: 'text-[#75715e]',
          bgSelection: 'bg-[#49483e] text-[#f8f8f2]',
          bannerHex: '#a6e22e'
        };
      default: // tokyonight
        return {
          bg: 'bg-[#05080c]',
          borderActive: 'border-[#388bfd]',
          borderMuted: 'border-[#21262d]',
          textHighlight: 'text-[#58a6ff]',
          textBody: 'text-[#c9d1d9]',
          textMuted: 'text-[#8b949e]',
          bgSelection: 'bg-[#163356] text-white',
          bannerHex: '#388bfd'
        };
    }
  };

  const style = getThemeClasses();

  return (
<div className={`min-h-screen ${style.bg} ${style.textBody} font-mono flex flex-col justify-between selection:bg-[#163356] selection:text-white`}>      
      {/* Visual Terminal Bar Header */}
      <header className={`px-4 py-2 border-b ${style.borderMuted} flex justify-between items-center text-xs text-center md:text-left`}>
        <div className="flex items-center gap-4">
          <span className={`font-bold ${style.textHighlight}`}>SYS_CORE_ACTIVE</span>
          <span className={`${style.textMuted} hidden md:inline`}>Terminal Location: {details.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`${style.textMuted}`}>Theme Mode:</span>
          {['tokyonight', 'matrix', 'dracula', 'monokai'].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-1.5 py-0.5 border uppercase text-[10px] ${
                theme === t ? `${style.borderActive} ${style.textHighlight}` : `${style.borderMuted} ${style.textMuted}`
              }`}
            >
              {t === 'tokyonight' ? 'Tokyo' : t}
            </button>
          ))}
        </div>
      </header>

      {/* Main Responsive Split Layout Pane */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Columns - Scroll List Blocks */}
        <div className={`w-full lg:w-[450px] border-b lg:border-b-0 lg:border-r ${style.borderMuted} p-3 flex flex-col gap-3 overflow-y-auto shrink-0`}>
          
          {/* Home Box */}
          <div 
            onClick={() => setActiveItem({ section: 'home', index: 0 })}
            className={`border p-3 cursor-pointer transition-all ${
              activeItem.section === 'home' ? style.borderActive : style.borderMuted
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className={`text-xs uppercase tracking-wider font-bold ${style.textHighlight}`}>Home Panel</span>
              <span className={`text-[10px] ${style.textMuted}`}>[H]</span>
            </div>
            <p className="text-xs leading-relaxed">{details.about}</p>
          </div>

          {/* Experience list box */}
          <div 
            onClick={() => setPaneFocus('experience')}
            className={`border p-3 transition-all ${
              paneFocus === 'experience' ? style.borderActive : style.borderMuted
            }`}
          >
            <div className="flex justify-between items-center mb-2 border-b pb-1 border-[#21262d]">
              <span className={`text-xs uppercase tracking-wider font-bold ${
                paneFocus === 'experience' ? style.textHighlight : style.textMuted
              }`}>
                [1] Experience History
              </span>
              <span className={`text-[10px] ${style.textMuted}`}>
                {activeItem.section === 'experience' ? activeItem.index + 1 : 1} of {experience.length}
              </span>
            </div>
            <div className="space-y-1">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveItem({ section: 'experience', index });
                  }}
                  className={`px-2 py-1.5 text-xs flex justify-between items-center cursor-pointer ${
                    activeItem.section === 'experience' && activeItem.index === index ? style.bgSelection : 'hover:bg-white/5'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="font-bold">{exp.role}</span>
                    <span className={`ml-1 text-[11px] ${style.textMuted}`}>@ {exp.company}</span>
                  </div>
                  <span className={`text-[10px] shrink-0 ${style.textMuted}`}>{exp.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Projects list box */}
          <div 
            onClick={() => setPaneFocus('projects')}
            className={`border p-3 transition-all ${
              paneFocus === 'projects' ? style.borderActive : style.borderMuted
            }`}
          >
            <div className="flex justify-between items-center mb-2 border-b pb-1 border-[#21262d]">
              <span className={`text-xs uppercase tracking-wider font-bold ${
                paneFocus === 'projects' ? style.textHighlight : style.textMuted
              }`}>
                [2] Projects Index
              </span>
              <span className={`text-[10px] ${style.textMuted}`}>
                {activeItem.section === 'projects' ? activeItem.index + 1 : 1} of {projects.length}
              </span>
            </div>
            <div className="space-y-1">
              {projects.map((proj, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveItem({ section: 'projects', index });
                  }}
                  className={`px-2 py-1.5 text-xs flex justify-between items-center cursor-pointer ${
                    activeItem.section === 'projects' && activeItem.index === index ? style.bgSelection : 'hover:bg-white/5'
                  }`}
                >
                  <span className="font-bold">{proj.name}</span>
                  <div className="flex gap-1">
                    {(proj.tech || proj.techStack || []).slice(0, 2).map((t, idx) => (
                      <span
                        key={idx}
                        className={`text-[9px] px-1 border ${style.borderMuted} ${style.textMuted}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills box */}
          <div 
            onClick={() => setPaneFocus('skills')}
            className={`border p-3 transition-all ${
              paneFocus === 'skills' ? style.borderActive : style.borderMuted
            }`}
          >
            <div className="flex justify-between items-center mb-2 border-b pb-1 border-[#21262d]">
              <span className={`text-xs uppercase tracking-wider font-bold ${
                paneFocus === 'skills' ? style.textHighlight : style.textMuted
              }`}>
                [3] Skills &amp; Tools
              </span>
              <span className={`text-[10px] ${style.textMuted}`}>
                1 of {skills.length}
              </span>
            </div>
            <div className="max-h-40 overflow-y-auto pr-1 space-y-0.5 custom-scrollbar">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveItem({ section: 'skills', index });
                  }}
                  className={`px-2 py-1 text-xs flex items-center justify-between cursor-pointer ${
                    activeItem.section === 'skills' && activeItem.index === index ? style.bgSelection : 'hover:bg-white/5'
                  }`}
                >
                  <span>🔧 {typeof skill === "string" ? skill : (skill?.name || "Skill")}</span>
                  <span className={`text-[9px] ${style.textMuted}`}>env_val_ready</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Content Console Pane */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto flex flex-col justify-between bg-black/10">
          
          <div className="space-y-6">
            
            {/* Dynamic 3D Projection Canvas */}
            <Dynamic3DCanvas themeColor={theme} />

            {/* Display Board Views */}
            {activeItem.section === 'home' && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className={`text-xl font-bold ${style.textHighlight}`}>Hi, I'm {details.name} 👋</h2>
                <h3 className="text-sm font-bold">{details.title}</h3>
                
                <p className="text-sm leading-relaxed">
                  Although my primary focus is building scalable backend architectures, I enjoy constructing full-stack, terminal-inspired responsive web systems.
                </p>
                <p className="text-sm leading-relaxed">
                  Feel free to browse through my past experiences, structured projects, and technical skills using the index blocks on the left.
                </p>

                <div className={`mt-6 p-4 border ${style.borderMuted} bg-[#03060a]`}>
                  <div className={`text-xs uppercase font-bold mb-2 ${style.textHighlight}`}>Dynamic Console Instruction Tips:</div>
                  <ul className="text-xs space-y-1.5 text-slate-400">
                    <li>• Use <span className={style.textHighlight}>[1]</span>, <span className={style.textHighlight}>[2]</span>, or <span className={style.textHighlight}>[3]</span> keys to focus on menu categories.</li>
                    <li>• Use <span className={style.textHighlight}>[ArrowUp / ArrowDown]</span> keys to cycle active list targets.</li>
                    <li>• Use <span className={style.textHighlight}>[ArrowLeft / ArrowRight]</span> keys to switch panel boundaries dynamically.</li>
                    <li>• Click on any visual segment or file directory directly in the menu list.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeItem.section === 'experience' && experience[activeItem.index] && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-start border-b pb-2 border-[#21262d]">
                  <div>
                    <span className={`text-[10px] uppercase ${style.textHighlight}`}>Job Segment: {activeItem.index + 1} of {experience.length}</span>
                    <h2 className="text-xl font-bold">{experience[activeItem.index].role}</h2>
                  </div>
                  <span className={`text-xs border ${style.borderActive} ${style.textHighlight} px-2 py-0.5`}>
                    {experience[activeItem.index].duration}
                  </span>
                </div>
                <h3 className="text-md font-bold text-slate-300">🏢 Employer: {experience[activeItem.index].company}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{experience[activeItem.index].description}</p>
                <div className="text-[11px] text-slate-500">
                  Status: Archive successfully read from memory block.
                </div>
              </div>
            )}

            {activeItem.section === 'projects' && projects[activeItem.index] && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-start border-b pb-2 border-[#21262d]">
                  <div>
                    <span className={`text-[10px] uppercase ${style.textHighlight}`}>Repository File: {activeItem.index + 1} of {projects.length}</span>
                    <h2 className="text-xl font-bold">{projects[activeItem.index].name}</h2>
                  </div>
                  {projects[activeItem.index].link && (
                    <a href={projects[activeItem.index].link} target="_blank" rel="noreferrer" className={`text-xs border ${style.borderActive} ${style.textHighlight} px-2 py-0.5 hover:bg-white/5`}>
                      Source Code ↗
                    </a>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{projects[activeItem.index].description}</p>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Target Stack Integration:</h4>
                  <div className="flex gap-2">
                    {projects[activeItem.index].tech.map((t, idx) => (
                      <span key={idx} className={`text-xs px-2 py-0.5 border ${style.borderMuted} bg-[#03060a]`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeItem.section === 'skills' && skills[activeItem.index] && (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b pb-2 border-[#21262d]">
                  <span className={`text-[10px] uppercase ${style.textHighlight}`}>Environment Variables</span>
                  <h2 className="text-xl font-bold">🛠️ {typeof skills[activeItem.index] === "string" ? skills[activeItem.index] : (skills[activeItem.index]?.name || "Skill")}</h2>
                </div>
                <p className="text-sm leading-relaxed">
                  This technology/capability is registered inside the primary development environment with the status <span className="text-emerald-500 font-bold">ACTIVE</span>. Fully integrated and utilized across multiple production architectures and active systems.
                </p>
                <div className={`mt-4 p-4 border ${style.borderMuted} bg-[#03060a] space-y-1 text-xs`}>
                <div>
                  <span className="text-slate-500">Path:</span>{" "}
                  <span className={style.textHighlight}>
                    /env/tools/
                    {(typeof skills?.[activeItem?.index] === "string"
                      ? skills[activeItem.index]
                      : skills?.[activeItem?.index]?.name || "unknown")
                      .toLowerCase()
                      .replace(/[^a-z0-9]/g, "_")}
                  </span>
                  </div>

                  <div>
                    <span className="text-slate-500">Integration:</span> 100% Core Competence Verified
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Navigation Control Hint Bar at Bottom */}
          <div className={`mt-8 pt-4 border-t ${style.borderMuted} flex flex-col md:flex-row justify-between text-xs ${style.textMuted} gap-2`}>
            <div>
              <span>&lt;arrow_keys&gt;: Navigate items</span>
              <span className="ml-4">&lt;1-3&gt;: Switch focused category</span>
              <span className="ml-4">&lt;H&gt;: Home screen</span>
            </div>
            <div className="flex gap-4">
              <a href={details.socialLinks?.github || "#"} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
              <a href={details.socialLinks?.linkedin || "#"} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
              <a href={details.socialLinks?.twitter || "#"} target="_blank" rel="noreferrer" className="hover:underline">X (Twitter)</a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}