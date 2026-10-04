import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Wand2, BookOpen, Github, Linkedin, Twitter, ExternalLink, ChevronDown, Flame, ShieldAlert, Cpu } from 'lucide-react';

/* ──────────────────────────────────────────────────────────────
   Mystical Embers Canvas
   Renders rising magical sparks of gold and purple.
   ────────────────────────────────────────────────────────────── */
function MysticalEmbersCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 45;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      r: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.6 + 0.2),
      speedX: (Math.random() - 0.5) * 0.3,
      color: Math.random() > 0.5 ? '#D4AF37' : '#A855F7', // Gold or Purple
      opacity: Math.random() * 0.6 + 0.2,
      fadeSpeed: Math.random() * 0.002 + 0.001
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        
        // Reset when floating off top
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
          p.opacity = Math.random() * 0.6 + 0.2;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0; // reset
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
}

export default function Hero({ data }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const defaultData = {
    personalInfo: {
      name: "Valerius Vance",
      title: "Lead Web Alchemist & Interface Illusionist",
      location: "San Francisco, CA / Remote",
      bio: "Conjuring clean logic from raw complexity. Specializing in high-performance React architectures, serverless incantations, and responsive design magic that behaves like clockwork.",
      socials: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com"
      }
    },
    stats: {
      experience: "8+ Yrs Mastery",
      projects: "42 Spells Cast",
      uptime: "99.9% Mana Reserve"
    },
    skills: [
      { name: "React / Next.js", school: "Transmutation" },
      { name: "TypeScript", school: "Divination" },
      { name: "Node.js / Go", school: "Conjuration" },
      { name: "TailwindCSS", school: "Illusion" }
    ]
  };

  const profile = data?.personalInfo || defaultData.personalInfo;
  const stats = data?.stats || defaultData.stats;
  const skills = data?.skills || defaultData.skills;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#09080C] text-white select-none"
    >
      {/* ── Mystical particles ── */}
      <MysticalEmbersCanvas />

      {/* ── Magic Radial Glows ── */}
      <div
        className="absolute top-[-100px] left-[10%] w-[500px] h-[500px] rounded-full opacity-[0.12] blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #A855F7 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-80px] right-[10%] w-[450px] h-[450px] rounded-full opacity-[0.08] blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }}
      />

      {/* ── Gold Constellation Overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#D4AF37 1px, transparent 1px), radial-gradient(#A855F7 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pt-24 pb-16">
          
          {/* ── Left Column: Text & CTAs ── */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            
            {/* Theme Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold tracking-widest uppercase border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.15)]"
            >
              <Wand2 className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" />
              Stage Magician Theme
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight uppercase">
              <span className="block text-white">Weaving Web</span>
              <span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#D4AF37] relative"
                style={{ textShadow: '0 0 40px rgba(168,85,247,0.2)' }}
              >
                Into Pure Illusion.
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              {profile.bio}
            </p>

            {/* Magical Stats Bar */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 pt-4">
              <div className="bg-[#121016]/80 border border-[#D4AF37]/15 p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1 flex items-center justify-center lg:justify-start gap-1">
                  <Flame className="w-3 h-3" /> Mana Level
                </div>
                <div className="text-sm font-bold font-mono tracking-wide text-[#D4AF37]">
                  {stats.experience}
                </div>
              </div>
              <div className="bg-[#121016]/80 border border-[#D4AF37]/15 p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1 flex items-center justify-center lg:justify-start gap-1">
                  <BookOpen className="w-3 h-3" /> Grimoires
                </div>
                <div className="text-sm font-bold font-mono tracking-wide text-[#D4AF37]">
                  {stats.projects}
                </div>
              </div>
              <div className="bg-[#121016]/80 border border-[#D4AF37]/15 p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1 flex items-center justify-center lg:justify-start gap-1">
                  <Cpu className="w-3 h-3" /> Stability
                </div>
                <div className="text-sm font-bold font-mono tracking-wide text-emerald-400">
                  {stats.uptime}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-mono font-bold text-sm bg-gradient-to-r from-[#A855F7] to-[#8B5CF6] text-white border border-[#A855F7]/40 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.55)] hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                REVEAL SPELLS
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-mono font-semibold text-sm bg-[#121016] text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37]/80 hover:bg-[#1A1722]/50 hover:scale-105 transition-all duration-300"
              >
                SUMMON WIZARD
              </a>
            </div>

            {/* Social Links */}
            {profile.socials && (
              <div className="flex items-center gap-6 pt-6 justify-center lg:justify-start text-xs font-mono text-gray-500">
                <span className="uppercase tracking-widest">Connect:</span>
                <div className="flex gap-4">
                  {profile.socials.github && (
                    <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] text-gray-400 transition-colors">
                      <Github className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {profile.socials.linkedin && (
                    <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] text-gray-400 transition-colors">
                      <Linkedin className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {profile.socials.twitter && (
                    <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] text-gray-400 transition-colors">
                      <Twitter className="w-4.5 h-4.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column: Interactive Spellbook / Status Panel ── */}
          <div className="flex-shrink-0 w-full max-w-sm lg:max-w-[360px] relative z-10">
            {/* Glowing magic frame */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#A855F7] via-[#D4AF37] to-[#8B5CF6] opacity-30 blur-md pointer-events-none" />
            
            <div
              className="relative rounded-2xl p-6 overflow-hidden bg-[#100D15] border border-[#D4AF37]/25 shadow-2xl"
            >
              {/* Internal card top gold border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A855F7] via-[#D4AF37] to-[#8B5CF6]" />

              {/* Spellbook Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Grimoire Status</span>
                </div>
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              </div>

              {/* Status details */}
              <div className="space-y-4 font-mono text-xs text-gray-300">
                <div className="border-b border-gray-800 pb-2">
                  <p className="text-[10px] text-gray-500 uppercase">Magician</p>
                  <p className="text-[#D4AF37] font-semibold">{profile.name}</p>
                </div>
                <div className="border-b border-gray-800 pb-2">
                  <p className="text-[10px] text-gray-500 uppercase">Class Tier</p>
                  <p className="text-purple-300">{profile.title}</p>
                </div>
                <div className="border-b border-gray-800 pb-2">
                  <p className="text-[10px] text-gray-500 uppercase">Sanctum Location</p>
                  <p className="text-gray-400">{profile.location}</p>
                </div>

                {/* Spell schools checklist */}
                <div className="pt-2">
                  <p className="text-[10px] text-gray-500 uppercase mb-2">Mastered Magic Schools</p>
                  <div className="grid grid-cols-2 gap-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1.5 p-1.5 rounded border border-[#D4AF37]/10 bg-[#15111C]"
                      >
                        <Flame className="w-3 h-3 text-[#D4AF37] shrink-0" />
                        <span className="text-[10px] font-semibold text-gray-300 truncate">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Magic Alert */}
              <div
                className="mt-6 flex items-center gap-3 p-3 rounded-lg border border-[#A855F7]/25 bg-[#171120]"
              >
                <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 animate-bounce" />
                <div className="text-[10px]">
                  <p className="font-bold text-purple-300 uppercase font-mono">Spell Ready</p>
                  <p className="text-gray-400 font-mono">Build compiled. Ready to cast.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-opacity duration-500 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
      >
        <span className="text-[9px] tracking-widest uppercase font-mono text-[#D4AF37]">Enter Grimoire</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-purple-400" />
      </div>
    </section>
  );
}
