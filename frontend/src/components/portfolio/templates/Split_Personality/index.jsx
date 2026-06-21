import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import * as Icons from 'lucide-react';

// --- PERFORMANCE OPTIMIZATION: MEMOIZED SUB-COMPONENTS ---
const DynamicIcon = React.memo(({ name, className = "w-5 h-5" }) => {
  const IconComponent = Icons[name] || Icons.HelpCircle;
  return <IconComponent className={className} />;
});

export default function SplitPersonality() {
  const { portfolioData: data } = usePortfolio();

  const [sliderPos, setSliderPos] = useState(50);
  const [isActiveDrag, setIsActiveDrag] = useState(false);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  // Smooth Floating Mouse Parallax Physics using Framer Motion Spring
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100 };
  const blobX = useSpring(mouseX, springConfig);
  const blobY = useSpring(mouseY, springConfig);

  // Fallback Data Safe Binding
  const {
    personal = { name: "ALEX RIVERA", title: "Full Stack Developer & Creative Technologist", bio: "Passionate developer with 5+ years of experience crafting beautiful, performant web applications. I love turning complex problems into elegant, user-friendly solutions.", avatar: "" },
    socials = { github: "#", linkedin: "#", twitter: "#", email: "hello@alexrivera.com" },
    skills = [
      { name: "React / Next.js", category: "Frontend", level: 95 },
      { name: "Node.js / Express", category: "Backend", level: 90 },
      { name: "Tailwind & Shaders", category: "Design", level: 92 }
    ],
    projects = [
      { title: "Quantum Engine", description: "Procedural voxel world engine built with Three.js and custom GLSL noise shaders.", liveUrl: "#", githubUrl: "#", tags: ["Three.js", "WebGL", "React"], image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60" },
      { title: "Apex Dashboard", description: "Sub-second telemetry data streaming engine using Redis and distributed WebSockets.", liveUrl: "#", githubUrl: "#", tags: ["Next.js", "WebSockets", "Go"], image: "" }
    ],
    experience = [
      { period: "2024 - PRESENT", role: "Senior Frontend Engineer", company: "CyberLabs Index", description: "Engineered performant data rendering panels and micro-frontend architectures." },
      { period: "2022 - 2024", role: "Full Stack Developer", company: "Vortex Labs", description: "Built real-time asset pipelines and modular components using Tailwind Ecosystem." }
    ],
    testimonials = [
      { name: "Marcus Aurelius", role: "Engineering Lead", text: "Alex creates code that mirrors art. The UI optimization and rendering speeds are truly elite.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" }
    ],
    stats = { yearsExperience: "5", projectsCompleted: "48", happyClients: "32" }
  } = data;

  // --- HIGH FPS GESTURE & INTERACTION PROCESSOR ---
  const handleMove = (clientX, clientY) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (isDragging.current) {
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        requestAnimationFrame(() => setSliderPos(percentage));
      }
      
      const xOffset = (clientX - rect.left) - rect.width / 2;
      const yOffset = (clientY - rect.top) - rect.height / 2;
      mouseX.set(xOffset * 0.08);
      mouseY.set(yOffset * 0.08);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleStartDrag = (e) => {
    e.preventDefault();
    isDragging.current = true;
    setIsActiveDrag(true);
  };

  useEffect(() => {
    const stopDragging = () => { 
      isDragging.current = false; 
      setIsActiveDrag(false);
    };
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);
    return () => {
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchend', stopDragging);
    };
  }, []);

  const renderPortfolioStructure = (themeMode) => {
    const isDark = themeMode === 'dark';

    const brandStyles = {
      github: {
        dark: 'hover:text-white hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]',
        light: 'text-neutral-800 hover:text-black hover:border-black/30 hover:bg-black/5',
      },
      linkedin: {
        dark: 'hover:text-[#0077b5] hover:border-[#0077b5]/40 hover:shadow-[0_0_15px_rgba(0,119,181,0.5)]',
        light: 'text-[#0077b5] hover:bg-[#0077b5]/5 hover:border-[#0077b5]/30',
      },
      twitter: {
        dark: 'hover:text-[#1da1f2] hover:border-[#1da1f2]/40 hover:shadow-[0_0_15px_rgba(29,161,242,0.5)]',
        light: 'text-[#1da1f2] hover:bg-[#1da1f2]/5 hover:border-[#1da1f2]/30',
      },
      email: {
        dark: 'hover:text-[#ea4335] hover:border-[#ea4335]/40 hover:shadow-[0_0_15px_rgba(234,67,53,0.5)]',
        light: 'text-[#ea4335] hover:bg-[#ea4335]/5 hover:border-[#ea4335]/30',
      }
    };

    return (
      <div className={`w-full min-h-screen font-sans transition-colors duration-500 py-16 px-4 sm:px-6 lg:px-8 space-y-32 relative select-none overflow-hidden ${
        isDark ? 'bg-[#0a0a0c] text-neutral-100' : 'bg-[#f4f5f7] text-neutral-900'
      }`}>
        
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div 
            style={{ x: blobX, y: blobY }}
            className={`absolute top-[10%] left-[5%] w-[35vw] h-[35vw] rounded-full blur-[130px] mix-blend-screen opacity-40 animate-pulse bg-gradient-to-tr ${
              isDark ? 'from-purple-600 to-cyan-500' : 'from-indigo-400 to-pink-300'
            }`}
          />
          <motion.div 
            style={{ x: blobY, y: blobX }}
            className={`absolute bottom-[15%] right-[5%] w-[30vw] h-[30vw] rounded-full blur-[120px] mix-blend-screen opacity-30 bg-gradient-to-bl ${
              isDark ? 'from-blue-600 to-fuchsia-500' : 'from-violet-400 to-blue-300'
            }`}
          />
          {isDark ? (
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
          ) : (
            <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(rgba(99,102,241,0.06) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
          )}
        </div>

        {/* CONTENT PACK WRAPPER */}
        <div className="max-w-5xl mx-auto space-y-32 relative z-10">
          
          {/* NAVIGATION BAR */}
          <nav className="flex justify-between items-center w-full border-b pb-6 border-neutral-500/10">
            <span className="text-lg font-black tracking-widest uppercase">
              {personal.name?.split(' ')[0] || 'ALEX'}
              <span className={isDark ? 'text-cyan-400 drop-shadow-[0_0_8px_#22d3ee]' : 'text-indigo-600'}>.</span>
            </span>
            <div className="flex items-center gap-3">
              {Object.entries(socials).map(([platform, url]) => {
                if (!url) return null;
                const isEmail = platform === 'email';
                const currentPlatform = isEmail ? 'email' : platform;
                const styles = brandStyles[currentPlatform] || { dark: 'hover:text-cyan-400', light: 'text-neutral-600 hover:text-indigo-600' };

                return (
                  <a 
                    key={platform} 
                    href={isEmail ? `mailto:${url}` : url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`p-2.5 rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center ${
                      isDark 
                        ? 'bg-[#111115] border-neutral-800 text-neutral-400' 
                        : 'bg-white border-neutral-200 text-neutral-500 shadow-sm shadow-stone-200/40'
                    } ${isDark ? styles.dark : styles.light}`}
                  >
                    <DynamicIcon 
                      name={platform === 'linkedin' ? 'Linkedin' : platform === 'twitter' ? 'Twitter' : isEmail ? 'Mail' : 'Github'} 
                      className="w-4 h-4" 
                    />
                  </a>
                );
              })}
            </div>
          </nav>

          {/* ================= HERO SECTION ================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4 items-center min-h-[70vh]">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                isDark ? 'bg-purple-950/50 text-purple-300 border border-purple-500/20' : 'bg-indigo-50 text-indigo-950 border border-indigo-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-cyan-400 animate-ping' : 'bg-indigo-600 animate-pulse'}`} />
                {isDark ? 'CYBERPUNK ENGINE ACTIVE' : 'MODERNIST ELEGANCE'}
              </div>
              
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none uppercase">
                {personal.name?.split(' ')[0]} <br />
                <span className={`bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-cyan-400 via-purple-400 to-indigo-500' : 'from-indigo-600 via-violet-600 to-blue-600'}`}>
                  {personal.name?.split(' ').slice(1).join(' ')}
                </span>
              </h1>
              
              <p className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-neutral-200' : 'text-neutral-900'}`}>{personal.title}</p>
              <p className={`text-sm sm:text-base font-medium leading-relaxed max-w-xl ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>{personal.bio}</p>
            </div>
            
            {/* PORTRAIT AVATAR */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-72 h-72 sm:w-[360px] sm:h-[360px] flex items-center justify-center group">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-tr opacity-100 animate-spin group-hover:scale-105 transition-all duration-700 ${
                  isDark ? 'from-cyan-400 via-fuchsia-500 to-purple-600 shadow-[0_0_50px_rgba(34,211,238,0.4)] drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]' : 'from-indigo-500 via-purple-400 to-pink-400 shadow-[0_15px_45px_rgba(99,102,241,0.25)]'
                }`} style={{ animationDuration: '14s' }} />
                
                <div className={`absolute inset-[6px] rounded-full p-1.5 z-10 ${isDark ? 'bg-[#0a0a0c]' : 'bg-[#f4f5f7]'}`}>
                  <img 
                    src={personal.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"} 
                    alt={personal.name || "Profile Avatar"} 
                    className="w-full h-full object-cover rounded-full filter grayscale-[4%] transition-transform duration-700 group-hover:scale-[1.04]" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* STATS AREA */}
          <div className="grid grid-cols-3 gap-4 border-t-2 py-8 text-center border-neutral-500/10">
            <div>
              <div className="text-3xl sm:text-5xl font-black tracking-tight">{stats.yearsExperience}+</div>
              <div className={`text-[9px] uppercase tracking-widest font-black mt-1 ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>Years Experience</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-black">{stats.projectsCompleted}+</div>
              <div className={`text-[9px] uppercase tracking-widest font-black mt-1 ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>Systems Built</div>
            </div>
            <div>
              <div className="text-3xl sm:text-5xl font-black">{stats.happyClients}+</div>
              <div className={`text-[9px] uppercase tracking-widest font-black mt-1 ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>Happy Clients</div>
            </div>
          </div>

          {/* 2. ABOUT SECTION */}
          <section className="w-full text-left relative pt-4">
            <div className={`rounded-3xl border-2 p-10 sm:p-16 backdrop-blur-2xl transition-all duration-500 relative overflow-hidden group ${
              isDark 
                ? 'bg-neutral-900/40 border-neutral-900/90 shadow-[0_40px_80px_rgba(0,0,0,0.5)] hover:border-cyan-400/30' 
                : 'bg-white/90 border-neutral-200 shadow-2xl shadow-stone-200/60 hover:border-indigo-500/30'
            }`}>
              <div className={`absolute right-6 bottom-[-30px] text-[160px] font-serif font-black select-none pointer-events-none opacity-[0.06] transition-colors ${
                isDark ? 'text-cyan-400' : 'text-indigo-600'
              }`}>
                ”
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? 'text-cyan-400' : 'text-indigo-600'}`}>01 // PHILOSOPHY MANIFESTO</span>
                  <div className={`h-[1px] w-20 ${isDark ? 'bg-cyan-500/40' : 'bg-indigo-500/40'}`} />
                </div>
                
                <h3 className={`text-2xl sm:text-4xl font-black tracking-tight leading-normal max-w-4xl transition-all ${
                  isDark ? 'text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'text-neutral-950'
                }`}>
                  Engineering performance-driven code architectures that scale fluidly under heavy workloads, while defining premium, award-winning interactive aesthetics.
                </h3>
              </div>
            </div>
          </section>

          {/* 3. SKILLS SECTION - FIXED MANDATORY SYNTATIC RESOLUTION HERE */}
          <section className="space-y-6 text-left">
            <div className="flex items-center gap-2">
              <DynamicIcon name="Cpu" className={`w-5 h-5 ${isDark ? 'text-cyan-400 drop-shadow-[0_0_6px_#22d3ee]' : 'text-indigo-600'}`} />
              <h2 className="text-xl font-black uppercase tracking-tight">Technical Stack</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {skills.map((skill, i) => (
                <div key={i} className={`p-5 rounded-xl border-2 transition-all ${
                  isDark ? 'bg-[#111115] border-neutral-900' : 'bg-white border-neutral-200'
                }`}>
                  <div className="flex justify-between items-center text-xs font-black mb-3">
                    <span className={isDark ? 'text-white' : 'text-neutral-950'}>{skill.name}</span>
                    <span className={`text-[8px] px-2 py-0.5 rounded font-black ${isDark ? 'bg-purple-950/60 text-purple-300' : 'bg-indigo-50 text-indigo-600'}`}>{skill.category}</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
                    <div className={`h-full rounded-full ${isDark ? 'bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_10px_#22d3ee]' : 'bg-gradient-to-r from-indigo-600 to-blue-500'}`} style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. PROJECTS SECTION */}
          <section className="space-y-6 text-left">
            <div className="flex items-center gap-2">
              <Icons.Layers className={`w-5 h-5 ${isDark ? 'text-purple-400 drop-shadow-[0_0_6px_#a855f7]' : 'text-indigo-600'}`} />
              <h2 className="text-xl font-black uppercase tracking-tight">Selected Shipments</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, i) => (
                <div key={i} className={`rounded-2xl border-2 overflow-hidden flex flex-col group transition-all duration-300 transform hover:-translate-y-1.5 ${
                  isDark 
                    ? 'bg-[#111115]/80 border-neutral-900 shadow-2xl backdrop-blur-sm hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.18)]' 
                    : 'bg-white/90 border-neutral-200 shadow-xl hover:border-indigo-500/40 hover:shadow-[0_15px_30px_rgba(99,102,241,0.18)]'
                }`}>
                  <div className="w-full aspect-video overflow-hidden relative bg-neutral-900">
                    <img 
                      src={project.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=70"} 
                      alt={project.title || "Project Screenshot"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[8%]"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-[#111115] via-transparent' : 'from-white via-transparent'} to-transparent opacity-95`} />
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-base font-black tracking-tight uppercase">{project.title}</h3>
                      <p className={`text-xs font-medium leading-relaxed line-clamp-2 ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>{project.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags?.map((t, idx) => (
                          <span key={idx} className={`text-[8px] font-black px-2 py-0.5 rounded-md ${isDark ? 'bg-neutral-800 text-cyan-400 border border-neutral-700/50' : 'bg-stone-100 text-stone-800 border border-stone-200'}`}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs font-black pt-3 border-t border-neutral-500/10">
                      <a href={project.liveUrl} className={`inline-flex items-center gap-1 underline underline-offset-4 ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-indigo-600 hover:text-indigo-800'}`}>
                        Live Deployment <Icons.ArrowUpRight className="w-3 h-3" />
                      </a>
                      <a href={project.githubUrl} className={`${isDark ? 'text-neutral-500 hover:text-white' : 'text-neutral-400 hover:text-black'}`}>Repository</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. EXPERIENCE TIMELINE */}
          <section className="space-y-4 text-left">
            <div className="flex items-center gap-2">
              <DynamicIcon name="Briefcase" className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-indigo-600'}`} />
              <h2 className="text-lg font-black uppercase tracking-tight">Milestones</h2>
            </div>
            <div className={`border-l-2 pl-6 space-y-6 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`}>
              {experience.map((exp, i) => (
                <div key={i} className="space-y-1 relative">
                  <div className={`absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 ${isDark ? 'bg-cyan-400 border-neutral-950 shadow-[0_0_8px_#22d3ee]' : 'bg-indigo-600 border-white'}`} />
                  <span className={`text-[9px] font-mono font-black ${isDark ? 'text-purple-400' : 'text-indigo-600'}`}>{exp.period}</span>
                  <h3 className="text-base font-black tracking-tight">{exp.role}</h3>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>{exp.company}</h4>
                  <p className={`text-xs font-medium mt-1 leading-relaxed max-w-2xl ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 6. TESTIMONIALS */}
          <section className="space-y-4 text-left">
            <div className="flex items-center gap-2">
              <DynamicIcon name="MessageSquare" className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-indigo-600'}`} />
              <h2 className="text-lg font-black uppercase tracking-tight">Endorsements</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((test, i) => (
                <div key={i} className={`p-5 rounded-xl border-2 flex flex-col justify-between space-y-4 ${isDark ? 'bg-[#111115] border-neutral-900' : 'bg-white border-neutral-200'}`}>
                  <p className={`text-xs italic font-medium leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>"{test.text}"</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-neutral-500/10">
                    <img src={test.avatar} alt={test.name || "Profile Avatar"} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="font-black text-xs">{test.name}</div>
                      <div className={`text-[9px] font-bold ${isDark ? 'text-cyan-400' : 'text-indigo-600'}`}>{test.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 7. CONTACT FORM */}
          <section className="pt-4 text-left">
            <div className={`rounded-xl border-2 p-6 sm:p-8 ${isDark ? 'bg-[#111115] border-neutral-900' : 'bg-white border-neutral-200'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-3">
                  <div className={`p-2 inline-block rounded-xl ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-indigo-50 text-indigo-600'}`}>
                    <DynamicIcon name="Sparkles" className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-none">Let's create <br />something <span className={isDark ? 'text-cyan-400 drop-shadow-[0_0_8px_#22d3ee]' : 'text-indigo-600'}>elite</span></h2>
                  <p className={`text-xs font-bold leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-700'}`}>Have an optimization query or architecture challenge? Transmit a direct ping.</p>
                </div>
                <div className="lg:col-span-7 w-full">
                  <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" placeholder="Identity" className={`w-full px-4 py-2.5 rounded-lg text-xs font-bold border-2 outline-none transition-all ${isDark ? 'bg-neutral-950 border-neutral-900 text-white focus:border-cyan-400' : 'bg-stone-50 border-neutral-200 text-black focus:border-indigo-600'}`} />
                      <input type="email" placeholder="Email Channel" className={`w-full px-4 py-2.5 rounded-lg text-xs font-bold border-2 outline-none transition-all ${isDark ? 'bg-neutral-950 border-neutral-900 text-white focus:border-cyan-400' : 'bg-stone-50 border-neutral-200 text-black focus:border-indigo-600'}`} />
                    </div>
                    <textarea rows="3" placeholder="Payload Message..." className={`w-full px-4 py-2.5 rounded-lg text-xs font-bold border-2 outline-none transition-all ${isDark ? 'bg-neutral-950 border-neutral-900 text-white focus:border-purple-500' : 'bg-stone-50 border-neutral-200 text-black focus:border-indigo-600'}`} />
                    <button type="submit" className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-opacity duration-200 ${isDark ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'bg-neutral-950 text-white hover:bg-neutral-900'}`}>Transmit Payload</button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* 8. FOOTER */}
          <footer className="pt-4 border-t border-neutral-500/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[9px] font-bold tracking-wider uppercase opacity-50">
            <div>&copy; {new Date().getFullYear()} {personal.name}. All Matrix Nodes Online.</div>
            <div>Full Line Gesture Engine Active</div>
          </footer>

        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="w-full min-h-screen relative overflow-x-hidden select-none bg-[#0a0a0c]"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      
      {/* 1. BASE LAYER: Dark Cyberpunk Theme */}
      <div className="w-full min-h-screen z-10">
        {renderPortfolioStructure('dark')}
      </div>

      {/* 2. REVEAL LAYER: Light Modernist Theme */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden z-20 transition-all duration-75"
        style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
      >
        <div className="w-full min-h-screen pointer-events-auto">
          {renderPortfolioStructure('light')}
        </div>
      </div>

      {/* 3. CENTRAL FUTURISTIC GLOWING DIVIDER LINE */}
      <div 
        className={`absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 via-purple-500 to-indigo-500 transition-shadow duration-300 pointer-events-auto z-30 group cursor-ew-resize ${
          isActiveDrag ? 'shadow-[0_0_25px_rgba(168,85,247,1)]' : 'hover:shadow-[0_0_15px_rgba(34,211,238,0.8)]'
        }`}
        style={{ left: `${sliderPos}%` }}
        onMouseDown={handleStartDrag}
        onTouchStart={handleStartDrag}
      >
        <div className="absolute top-0 bottom-0 -left-3 w-7 bg-transparent z-40" />

        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-neutral-950 border transition-all duration-300 flex items-center justify-center pointer-events-none z-50 ${
            isActiveDrag 
              ? 'border-cyan-400 scale-90 shadow-[0_0_20px_#22d3ee]' 
              : 'border-purple-500 group-hover:scale-105 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_#a855f7]'
          }`}
        >
          <Icons.GripVertical className="w-4 h-4 text-cyan-400" />
        </div>
      </div>

    </div>
  );
}