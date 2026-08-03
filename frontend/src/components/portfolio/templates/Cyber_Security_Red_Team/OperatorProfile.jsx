import { MapPin, Crosshair, Calendar, Shield, ChevronRight, Terminal } from "lucide-react";
import { useInView } from "./useInView";
import { usePortfolio } from '../../../../context/PortfolioContext';

export function OperatorProfile() {
  const [cardRef, cardInView] = useInView(0.2);
  const { portfolioData } = usePortfolio();

  const personal = (portfolioData && portfolioData.personal) || {};
  const skills = Array.isArray(portfolioData?.skills) ? portfolioData.skills : [];
  const stats = (portfolioData && portfolioData.stats) || {};

  const name = personal.name || 'Operator';
  const callsign = personal.name
    ? personal.name.split(' ').map((n) => n[0]).join('').slice(0, 6).toUpperCase()
    : 'UNKNOWN';
  const specialization = skills && skills.length
    ? skills.slice(0, 2).map((s) => (typeof s === 'string' ? s : s.name)).join(' & ')
    : personal.tagline || 'Unknown';
  const experience = stats.yearsExperience ? `${stats.yearsExperience}+ Years` : 'N/A';
  const location = personal.location || 'Remote';
  const clearance = stats.projectsCompleted ? 'Active' : 'N/A';
  const bio = personal.bio || 'N/A';
  const avatar = personal.avatar || "";
  const focusAreas = skills && skills.length ? skills.slice(0, 8).map(s => (typeof s === 'string' ? s : s.name)) : [];

  const profileFields = [
    { icon: Crosshair, label: 'SPECIALIZATION', value: specialization },
    { icon: Calendar, label: 'EXPERIENCE', value: experience },
    { icon: MapPin, label: 'LOCATION', value: location },
    { icon: Shield, label: 'CLEARANCE STATUS', value: clearance },
  ];

  const initials = (personal.name || name).split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  // Helper to generate a consistent pseudo-random hex code for UI aesthetics
  const generateHex = (index) => `0x${((index + 1) * 314159).toString(16).slice(0, 4).toUpperCase().padStart(4, '0')}`;

  return (
    <section id="profile" className="relative py-32 overflow-hidden bg-[#050505] cursor-crosshair">
      {/* Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,43,43,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,43,43,0.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-[#FF2B2B] opacity-50" />
            <span className="relative inline-flex h-2 w-2 bg-[#FF2B2B]" />
          </div>
          <span className="text-[#FF2B2B] tracking-[0.35em] font-medium font-mono text-[0.7rem]">
            02 // OPERATOR PROFILE
          </span>
          <div className="h-px flex-1 bg-[linear-gradient(90deg,#FF2B2B20_0%,transparent_100%)]" />
        </div>

        <div
          ref={cardRef}
          className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8"
          style={{
            opacity: cardInView ? 1 : 0,
            transform: cardInView ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          {/* ── Left Column: Profile Card ── */}
          <div
            className="border border-[#1A1A1A] relative overflow-hidden flex flex-col bg-[rgba(11,11,11,0.85)] group transition-all duration-500 hover:border-[#FF2B2B]/40 hover:shadow-[0_0_30px_rgba(255,43,43,0.05)]"
          >
            {/* Animated Top Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF2B2B] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF2B2B]/50 to-[#D60000]/50" />

            {/* Card header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A] group-hover:border-[#333] transition-colors duration-500">
              <div className="flex gap-3">
                <span className="text-[#FF2B2B] tracking-[0.2em] font-mono text-[0.55rem] flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-[#FF2B2B] rounded-full animate-pulse" />
                  VERIFIED
                </span>
                <span className="text-[#9A9A9A] tracking-[0.2em] font-mono text-[0.55rem]">[ SENIOR ]</span>
              </div>
              <Shield size={14} className="text-[#FF2B2B] opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6 flex flex-col flex-1">
              {/* Avatar Section */}
              <div className="flex items-start gap-5 mb-8">
                <div className="relative flex-shrink-0 group/avatar cursor-pointer">
                  {/* Tactical Brackets */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#555] group-hover/avatar:border-[#FF2B2B] group-hover/avatar:-translate-x-1 group-hover/avatar:-translate-y-1 transition-all duration-300 z-20" />
                  <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#555] group-hover/avatar:border-[#FF2B2B] group-hover/avatar:translate-x-1 group-hover/avatar:-translate-y-1 transition-all duration-300 z-20" />
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#555] group-hover/avatar:border-[#FF2B2B] group-hover/avatar:-translate-x-1 group-hover/avatar:translate-y-1 transition-all duration-300 z-20" />
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#555] group-hover/avatar:border-[#FF2B2B] group-hover/avatar:translate-x-1 group-hover/avatar:translate-y-1 transition-all duration-300 z-20" />
                  
                  <div className="w-24 h-24 bg-[#111] border border-[#222] overflow-hidden relative">
                    <div className="absolute inset-0 bg-[#FF2B2B]/10 mix-blend-overlay z-10 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name}
                        className="w-full h-full object-cover grayscale opacity-60 group-hover/avatar:grayscale-0 group-hover/avatar:opacity-100 group-hover/avatar:scale-110 transition-all duration-700 ease-in-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center grayscale opacity-60 group-hover/avatar:grayscale-0 group-hover/avatar:opacity-100 transition-all duration-500">
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: "1.75rem", color: "#FF2B2B" }}>
                          {initials}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#4ADE80] border-2 border-[#0B0B0B] rounded-full z-20 shadow-[0_0_8px_rgba(74,222,128,0.4)]" />
                </div>

                <div className="pt-2">
                  <div className="text-[#555] mb-1.5 tracking-[0.2em] font-mono text-[0.55rem]">
                    CALLSIGN: <span className="text-[#888]">{callsign}</span>
                  </div>
                  <h2
                    className="text-[#F5F5F5] leading-none mb-3"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "1.75rem", letterSpacing: "0.02em" }}
                  >
                    {name}
                  </h2>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-[#4ADE80]/30 bg-[#4ADE80]/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
                    <span className="text-[#4ADE80] tracking-[0.15em] font-mono text-[0.55rem]">AVAILABLE FOR DEPLOYMENT</span>
                  </div>
                </div>
              </div>

              {/* Profile fields */}
              <div className="space-y-4 flex-1">
                {profileFields.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex justify-between items-end border-b border-[#1A1A1A] group-hover:border-[#2A2A2A] pb-2 transition-colors duration-300">
                    <div className="flex items-center gap-2">
                      <Icon size={12} className="text-[#555] group-hover:text-[#FF2B2B] transition-colors duration-500" />
                      <span className="text-[#666] tracking-[0.15em] font-mono text-[0.55rem]">{label}</span>
                    </div>
                    <span className="text-[#E5E5E5] text-right" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: "0.95rem", letterSpacing: "0.05em" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="flex flex-col gap-6">
            
            {/* Bio Card */}
            <div className="border border-[#1A1A1A] relative overflow-hidden group bg-[rgba(11,11,11,0.6)] hover:bg-[rgba(15,15,15,0.8)] transition-colors duration-500 hover:border-[#333]">
              {/* Scanline Element */}
              <div className="absolute top-0 left-0 w-0.5 h-full bg-[#111]">
                <div className="w-full h-1/3 bg-[#FF2B2B] opacity-50 group-hover:opacity-100 transition-all duration-700 translate-y-[-100%] group-hover:translate-y-[300%] ease-linear" />
              </div>
              
              <div className="p-8 pl-10 relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="px-2 py-1 bg-[#FF2B2B]/10 border border-[#FF2B2B]/20 text-[#FF2B2B] tracking-[0.2em] font-mono text-[0.55rem] group-hover:bg-[#FF2B2B]/20 transition-colors duration-300">
                    MISSION BRIEF
                  </div>
                </div>
                <p className="text-[#888] leading-relaxed text-[0.9rem] font-mono group-hover:text-[#AAA] transition-colors duration-300">
                  {bio}
                </p>
              </div>
            </div>

            {/* CYBER SEC MODERNISED: Focus Areas Card */}
            <div className="border border-[#1A1A1A] p-8 flex-1 bg-[rgba(11,11,11,0.6)] group hover:border-[#FF2B2B]/30 transition-all duration-500 relative overflow-hidden flex flex-col">
              
              {/* Tactical Brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#1A1A1A] group-hover:border-[#FF2B2B] transition-colors duration-500 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#1A1A1A] group-hover:border-[#FF2B2B] transition-colors duration-500 pointer-events-none" />

              {/* Decorative background grid map */}
              <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle at center, #FF2B2B 1px, transparent 1px)`, backgroundSize: "20px 20px" }}
              />
              
              {/* Header Container */}
              <div className="flex justify-between items-end mb-8 relative z-10 border-b border-[#222] pb-3">
                <h3 className="text-[#F5F5F5] tracking-[0.2em] flex items-center gap-3" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1.2rem" }}>
                  <Terminal size={16} className="text-[#FF2B2B]" />
                  PRIMARY FOCUS AREAS
                </h3>
                <span className="text-[#555] font-mono text-[0.6rem] tracking-[0.2em] group-hover:text-[#FF2B2B] transition-colors duration-300 animate-pulse">
                  [ ACTIVE SCAN ]
                </span>
              </div>
              
              {/* Tactical Telemetry Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                {focusAreas.map((area, index) => (
                  <div 
                    key={area} 
                    className="relative p-4 border border-[#1A1A1A] bg-[#0A0A0A] hover:bg-[#0F0F0F] transition-all duration-300 group/item cursor-crosshair overflow-hidden"
                  >
                    {/* Left Activation Line */}
                    <div className="absolute top-0 left-0 w-0.5 h-full bg-[#1A1A1A] group-hover/item:bg-[#FF2B2B] transition-colors duration-300" />
                    
                    {/* Inner Content */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#444] font-mono text-[0.55rem] tracking-widest group-hover/item:text-[#FF2B2B] transition-colors duration-300">
                          {generateHex(index)}
                        </span>
                        <span className="text-[#333] font-mono text-[0.55rem] tracking-widest group-hover/item:text-[#777] transition-colors duration-300">
                          SEQ // {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <ChevronRight size={12} className="text-[#333] group-hover/item:text-[#FF2B2B] group-hover/item:translate-x-1 transition-all duration-300 flex-shrink-0" />
                        <span className="text-[#888] font-bold tracking-wider text-[0.85rem] uppercase group-hover/item:text-[#F5F5F5] transition-colors duration-300" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                          {area}
                        </span>
                      </div>

                      {/* Fake Signal/Complexity Bar */}
                      <div className="flex gap-1 mt-1 pl-5">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-[3px] flex-1 ${i < 3 ? 'bg-[#222] group-hover/item:bg-[#FF2B2B]' : 'bg-[#111] group-hover/item:bg-[#FF2B2B]/30'} transition-colors`} 
                            style={{ transitionDuration: '300ms', transitionDelay: `${i * 40}ms` }} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}