import React from 'react';
import { 
  BookOpen, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Compass, 
  Award, 
  FileText, 
  Briefcase, 
  Link as LinkIcon, 
  Github, 
  Linkedin, 
  Twitter 
} from 'lucide-react';

// Common visual ornaments
function CornerGoldOrnaments() {
  return (
    <>
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#d4af37]" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#d4af37]" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#d4af37]" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#d4af37]" />
    </>
  );
}

function SpineShadow({ side }) {
  if (side === 'left') {
    return (
      <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-black/25 via-black/8 to-transparent pointer-events-none z-20" />
    );
  }
  return (
    <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-black/25 via-black/8 to-transparent pointer-events-none z-20" />
  );
}

function PageThicknessLines({ side }) {
  // Simulates stacked paper edges
  if (side === 'left') {
    return (
      <div className="absolute left-0 top-2 bottom-2 w-[4px] border-l border-r border-[#e6dfd1]/80 bg-[#fbf9f4] pointer-events-none z-10 shadow-sm" />
    );
  }
  return (
    <div className="absolute right-0 top-2 bottom-2 w-[4px] border-l border-r border-[#e6dfd1]/80 bg-[#fbf9f4] pointer-events-none z-10 shadow-sm" />
  );
}

// ----------------------------------------------------
// PAGE 1: FRONT COVER (Leather, Gold Foil Title)
// ----------------------------------------------------
export const Page1_FrontCover = React.forwardRef(function Page1_FrontCover({ personal }, ref) {
  return (
    <div ref={ref} className="h-full w-full overflow-hidden bg-[#24130d] relative flex flex-col justify-between p-8 sm:p-12 shadow-2xl select-none" style={{
      backgroundImage: `radial-gradient(circle at center, rgba(54,28,21,0.2) 0%, rgba(15,8,6,0.9) 100%), 
        repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 2px, transparent 2px, transparent 4px)`
    }}>
      {/* Embossed leather borders */}
      <div className="absolute inset-4 border-[3px] border-[#c5a059] opacity-85 pointer-events-none rounded-sm" />
      <div className="absolute inset-[22px] border border-[#c5a059]/40 pointer-events-none rounded-sm" />
      
      {/* Corner metal guards look */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-[#c5a059]" />
      <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-[#c5a059]" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-[#c5a059]" />
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-[#c5a059]" />

      <div className="text-center mt-12">
        <div className="text-[#c5a059] font-mono text-xs uppercase tracking-[0.4em] mb-4">THE PERSONAL HISTORY</div>
        <div className="w-16 h-[1px] bg-[#c5a059]/60 mx-auto mb-8" />
      </div>

      <div className="text-center my-auto px-4">
        <h1 className="text-[#c5a059] font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'Cinzel, Georgia, serif' }}>
          {personal.name.toUpperCase()}
        </h1>
        <div className="my-6 flex justify-center items-center gap-3">
          <div className="h-[2px] w-8 bg-gradient-to-r from-transparent to-[#c5a059]" />
          <Compass className="text-[#c5a059] w-5 h-5 animate-spin-slow" />
          <div className="h-[2px] w-8 bg-gradient-to-l from-transparent to-[#c5a059]" />
        </div>
        <p className="text-[#ebd095] font-serif text-sm sm:text-base italic tracking-widest leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          {personal.title}
        </p>
      </div>

      <div className="text-center mb-8">
        <div className="text-[#c5a059]/75 font-mono text-[9px] uppercase tracking-[0.3em]">
          COLLECTOR'S EDITION
        </div>
        <div className="text-[#c5a059]/40 font-serif text-[10px] mt-1">
          EST. {new Date().getFullYear()} • CAREERPILOT EDITIONS
        </div>
      </div>
    </div>
  );
});

// ----------------------------------------------------
// PAGE 2: INSIDE FRONT COVER (Ex Libris Bookplate)
// ----------------------------------------------------
export const Page2_InsideCover = React.forwardRef(function Page2_InsideCover({ personal }, ref) {
  return (
    <div ref={ref} className="h-full w-full overflow-hidden bg-[#faf6ee] relative flex flex-col items-center justify-center p-8 sm:p-12" style={{
      backgroundImage: `radial-gradient(circle at center, transparent 70%, rgba(200,185,160,0.15) 100%),
        radial-gradient(circle at 10% 20%, rgba(255,255,255,0.8) 0%, transparent 100%)`
    }}>
      <SpineShadow side="right" />
      <PageThicknessLines side="left" />

      {/* Decorative Bookplate Panel */}
      <div className="w-full max-w-sm border-2 border-double border-[#8b5a2b] p-6 text-center bg-[#f7f2e4] shadow-md relative">
        <div className="absolute inset-1 border border-[#8b5a2b]/30" />
        
        {/* Bookplate frame corner ornaments */}
        <div className="absolute top-2 left-2 text-[#8b5a2b] text-[10px]">❖</div>
        <div className="absolute top-2 right-2 text-[#8b5a2b] text-[10px]">❖</div>
        <div className="absolute bottom-2 left-2 text-[#8b5a2b] text-[10px]">❖</div>
        <div className="absolute bottom-2 right-2 text-[#8b5a2b] text-[10px]">❖</div>

        <div className="text-[#8d6e63] font-serif italic text-sm tracking-widest mb-1" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          Ex Libris
        </div>
        
        <div className="text-[#5d4037] font-serif text-xl sm:text-2xl font-bold uppercase tracking-[0.2em] mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
          HERITAGE LIBRARY
        </div>

        <div className="my-6 mx-auto w-24 h-24 border border-[#8b5a2b]/40 rounded-full flex items-center justify-center p-2 relative bg-[#f1ebd9]">
          <BookOpen className="w-10 h-10 text-[#8b5a2b]" />
          <div className="absolute w-28 h-28 border border-dashed border-[#8b5a2b]/30 rounded-full" />
        </div>

        <div className="text-xs font-mono uppercase tracking-widest text-[#8d6e63] mb-1">
          This volume belongs to
        </div>
        <div className="text-lg font-serif italic text-[#3e2723] font-bold border-b border-[#8b5a2b]/30 pb-1 px-4 inline-block min-w-48" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          {personal.name}
        </div>

        <div className="text-[9px] font-mono text-[#8d6e63]/80 mt-6 tracking-widest uppercase">
          Classification: Portfolio Memoir
        </div>
      </div>
    </div>
  );
});

// ----------------------------------------------------
// PAGE 3: TITLE PAGE (Formal vintage style)
// ----------------------------------------------------
export const Page3_TitlePage = React.forwardRef(function Page3_TitlePage({ personal }, ref) {
  return (
    <div ref={ref} className="h-full w-full overflow-hidden bg-[#faf6ee] relative flex flex-col justify-between p-8 sm:p-12" style={{
      backgroundImage: `radial-gradient(circle at center, transparent 70%, rgba(200,185,160,0.15) 100%)`
    }}>
      <SpineShadow side="left" />
      <PageThicknessLines side="right" />
      <CornerGoldOrnaments />

      <div className="text-center mt-8">
        <span className="text-xs font-mono tracking-[0.35em] text-[#8d6e63] uppercase">
          Curriculum & Memoirs
        </span>
        <div className="h-[1px] w-16 bg-[#8b5a2b]/30 mx-auto mt-4" />
      </div>

      <div className="text-center my-auto max-w-sm mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-[#2b1810] tracking-wide font-serif mb-4 leading-tight" style={{ fontFamily: 'Cinzel, serif' }}>
          {personal.name}
        </h2>
        <div className="text-xs uppercase tracking-[0.25em] text-[#8b5a2b] font-mono my-4">
          — Biography & Professional Works —
        </div>
        <div className="w-6 h-6 border border-[#8b5a2b]/40 rotate-45 mx-auto my-6 flex items-center justify-center">
          <div className="w-3 h-3 bg-[#8b5a2b] rotate-45" />
        </div>
        <p className="text-sm font-serif italic text-[#5d4037] leading-relaxed" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          "An catalog of design, technical achievements, and architectural accomplishments compiled by hand for review."
        </p>
      </div>

      <div className="text-center mb-6">
        <div className="text-[10px] font-mono text-[#8d6e63] tracking-widest uppercase">
          Authorized Archives
        </div>
        <div className="text-[9px] text-[#8d6e63]/75 font-serif mt-1">
          Printed & Rendered via CareerPilot Digital Press • {personal.location}
        </div>
      </div>
    </div>
  );
});

// ----------------------------------------------------
// PAGE 4: CHAPTER 1 - BIOGRAPHY (About Me)
// ----------------------------------------------------
export const Page4_AboutIntro = React.forwardRef(function Page4_AboutIntro({ personal }, ref) {
  const firstLetter = personal.bio ? personal.bio.charAt(0) : 'D';
  const restOfBio = personal.bio ? personal.bio.slice(1) : '';

  return (
    <div ref={ref} className="h-full w-full overflow-hidden bg-[#faf6ee] relative flex flex-col justify-between p-8 sm:p-10" style={{
      backgroundImage: `radial-gradient(circle at center, transparent 75%, rgba(200,185,160,0.1) 100%)`
    }}>
      <SpineShadow side="right" />
      <PageThicknessLines side="left" />

      <div>
        <div className="text-[10px] font-mono tracking-[0.3em] text-[#8b5a2b] uppercase mb-1">
          Chapter I
        </div>
        <h3 className="text-2xl font-bold text-[#2b1810] font-serif border-b border-[#8b5a2b]/20 pb-2 mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
          The Archivist's Tale
        </h3>

        {/* Narrative Biography */}
        <div className="text-sm text-[#3e2723] leading-relaxed font-serif text-justify pr-2 custom-scrollbar overflow-y-auto max-h-[360px]" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          {/* Drop Cap */}
          <span className="float-left text-4xl sm:text-5xl font-bold text-[#8b5a2b] mr-2 mt-1 line-height-none border border-[#8b5a2b]/30 p-2 bg-[#f4eee1] rounded-sm font-serif">
            {firstLetter}
          </span>
          {restOfBio}
        </div>
      </div>

      {/* Elegant signature / seal section */}
      <div className="flex justify-between items-end border-t border-[#8b5a2b]/15 pt-4 mt-4">
        <div>
          <div className="text-[10px] font-mono uppercase text-[#8d6e63] tracking-widest">Signed Attestation</div>
          <div className="text-xl font-serif italic text-[#3e2723] mt-1" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            {personal.name}
          </div>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-double border-[#8b5a2b]/40 flex items-center justify-center bg-[#f7f2e4] text-[#8b5a2b] font-serif font-bold text-xs shadow-inner">
          SEAL
        </div>
      </div>
    </div>
  );
});

// ----------------------------------------------------
// PAGE 5: BIOGRAPHY DETAILS (Stats & Manifesto)
// ----------------------------------------------------
export const Page5_AboutStats = React.forwardRef(function Page5_AboutStats({ personal }, ref) {
  return (
    <div ref={ref} className="h-full w-full overflow-hidden bg-[#faf6ee] relative flex flex-col justify-between p-8 sm:p-10" style={{
      backgroundImage: `radial-gradient(circle at center, transparent 75%, rgba(200,185,160,0.1) 100%)`
    }}>
      <SpineShadow side="left" />
      <PageThicknessLines side="right" />

      <div>
        <div className="text-[10px] font-mono tracking-[0.3em] text-[#8b5a2b] uppercase mb-1">
          Chronology & Tenets
        </div>
        <h3 className="text-xl font-bold text-[#2b1810] font-serif border-b border-[#8b5a2b]/20 pb-2 mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
          Philosophical Creed
        </h3>

        {/* Custom motto/philosophy */}
        <div className="bg-[#f5ebd6]/60 border border-[#8b5a2b]/20 p-4 rounded-sm italic text-[#5d4037] text-sm font-serif mb-6 relative">
          <div className="absolute top-1 left-2 text-[#8b5a2b]/40 text-xl font-serif">“</div>
          <p className="px-3">{personal.tagline || "To build, to design, and to leave a lasting footprint in the digital sand."}</p>
          <div className="absolute bottom-1 right-2 text-[#8b5a2b]/40 text-xl font-serif">”</div>
        </div>

        {/* Vintage Stats Seals */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-[#8b5a2b]/20 p-3 text-center bg-[#f9f5eb] shadow-sm">
            <Award className="w-5 h-5 text-[#8b5a2b] mx-auto mb-1" />
            <div className="text-xs font-mono uppercase text-[#8d6e63] tracking-widest">Sanctum Status</div>
            <div className="text-base font-serif font-bold text-[#3e2723] mt-1">Active Archivist</div>
          </div>
          <div className="border border-[#8b5a2b]/20 p-3 text-center bg-[#f9f5eb] shadow-sm">
            <MapPin className="w-5 h-5 text-[#8b5a2b] mx-auto mb-1" />
            <div className="text-xs font-mono uppercase text-[#8d6e63] tracking-widest">Base Territory</div>
            <div className="text-xs font-serif font-bold text-[#3e2723] mt-1.5 truncate">
              {personal.location}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#8b5a2b]/15 pt-4 text-center">
        <span className="text-[9px] font-mono uppercase text-[#8d6e63] tracking-widest">
          CareerPilot Chronicles • Vol I
        </span>
      </div>
    </div>
  );
});

// ----------------------------------------------------
// PAGE 6: CHAPTER 2 - SKILLS (Introduction)
// ----------------------------------------------------
export const Page6_SkillsIntro = React.forwardRef(function Page6_SkillsIntro({ skills }, ref) {
  // Extract unique categories
  const categories = Array.from(new Set(skills.map(s => s.category || 'Expertise')));

  return (
    <div ref={ref} className="h-full w-full overflow-hidden bg-[#faf6ee] relative flex flex-col justify-between p-8 sm:p-10" style={{
      backgroundImage: `radial-gradient(circle at center, transparent 75%, rgba(200,185,160,0.1) 100%)`
    }}>
      <SpineShadow side="right" />
      <PageThicknessLines side="left" />

      <div>
        <div className="text-[10px] font-mono tracking-[0.3em] text-[#8b5a2b] uppercase mb-1">
          Chapter II
        </div>
        <h3 className="text-2xl font-bold text-[#2b1810] font-serif border-b border-[#8b5a2b]/20 pb-2 mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
          The Scale of Knowledge
        </h3>
        
        <p className="text-sm font-serif italic text-[#5d4037] leading-relaxed mb-6" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
          "An assessment of technical crafts, digital proficiencies, and creative capabilities acquired over periods of testing."
        </p>

        {/* Parchment Labels representing Categories */}
        <div className="flex flex-col gap-3">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-[#f3ecd9] border border-[#8b5a2b]/30 px-4 py-2.5 shadow-sm rounded-sm">
              <Compass className="w-4 h-4 text-[#8b5a2b] shrink-0" />
              <div className="text-xs font-mono uppercase tracking-widest text-[#3e2723] font-bold">
                {cat}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#8b5a2b]/15 pt-4 text-center">
        <span className="text-[9px] font-mono uppercase text-[#8d6e63] tracking-widest">
          Knowledge Indices
        </span>
      </div>
    </div>
  );
});

// ----------------------------------------------------
// PAGE 7: SKILLS CHART (The Scale of Mastery)
// ----------------------------------------------------
export const Page7_SkillsDetails = React.forwardRef(function Page7_SkillsDetails({ skills }, ref) {
  return (
    <div ref={ref} className="h-full w-full overflow-hidden bg-[#faf6ee] relative flex flex-col justify-between p-8 sm:p-10" style={{
      backgroundImage: `radial-gradient(circle at center, transparent 75%, rgba(200,185,160,0.1) 100%)`
    }}>
      <SpineShadow side="left" />
      <PageThicknessLines side="right" />

      <div>
        <div className="text-[10px] font-mono tracking-[0.3em] text-[#8b5a2b] uppercase mb-1">
          Craft Proficiency
        </div>
        <h3 className="text-xl font-bold text-[#2b1810] font-serif border-b border-[#8b5a2b]/20 pb-2 mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
          Level of Mastery
        </h3>

        {/* Custom Progress gauges styled as hand-drawn ink slots */}
        <div className="space-y-4 pr-1 custom-scrollbar overflow-y-auto max-h-[380px]">
          {skills.slice(0, 7).map((skill, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-serif italic text-[#3e2723] font-bold" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                  {skill.name}
                </span>
                <span className="font-mono text-[#8b5a2b] font-semibold">{skill.level || skill.rating || 80}%</span>
              </div>
              <div className="h-2 w-full bg-[#ebdcb9]/40 border border-[#8b5a2b]/20 p-[1px] rounded-sm">
                <div 
                  className="h-full bg-gradient-to-r from-[#8b5a2b] to-[#6e461f] rounded-sm" 
                  style={{ width: `${skill.level || skill.rating || 80}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#8b5a2b]/15 pt-4 text-center">
        <span className="text-[9px] font-mono uppercase text-[#8d6e63] tracking-widest">
          Archivist's Hand-drawn Scales
        </span>
      </div>
    </div>
  );
});

// ----------------------------------------------------
// PAGE 8: CHAPTER 3 - EXPERIENCE (Volume I)
// ----------------------------------------------------
export const Page8_ExperienceIntro = React.forwardRef(function Page8_ExperienceIntro({ experience }, ref) {
  return (
    <div ref={ref} className="h-full w-full overflow-hidden bg-[#faf6ee] relative flex flex-col justify-between p-8 sm:p-10" style={{
      backgroundImage: `radial-gradient(circle at center, transparent 75%, rgba(200,185,160,0.1) 100%)`
    }}>
      <SpineShadow side="right" />
      <PageThicknessLines side="left" />

      <div>
        <div className="text-[10px] font-mono tracking-[0.3em] text-[#8b5a2b] uppercase mb-1">
          Chapter III
        </div>
        <h3 className="text-2xl font-bold text-[#2b1810] font-serif border-b border-[#8b5a2b]/20 pb-2 mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
          Ledger of Service
        </h3>

        {/* Timeline representation */}
        <div className="relative border-l border-[#8b5a2b]/40 ml-2 pl-5 space-y-6 pr-1 custom-scrollbar overflow-y-auto max-h-[360px]">
          {experience.slice(0, 2).map((exp, idx) => (
            <div key={idx} className="relative">
              {/* Timeline marker */}
              <div className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-[#fbf9f4] border border-[#8b5a2b] flex items-center justify-center shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8b5a2b]" />
              </div>

              <div className="text-[10px] font-mono text-[#8b5a2b] font-bold uppercase tracking-widest">
                {exp.period}
              </div>
              <h4 className="text-sm font-serif font-black text-[#2b1810] mt-0.5 leading-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                {exp.role}
              </h4>
              <p className="text-[11px] font-mono uppercase text-[#8d6e63] mt-0.5">
                {exp.company}
              </p>
              <p className="text-[12px] font-serif text-[#5d4037] leading-relaxed mt-2 text-justify italic">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#8b5a2b]/15 pt-4 text-center">
        <span className="text-[9px] font-mono uppercase text-[#8d6e63] tracking-widest">
          Service Records Part I
        </span>
      </div>
    </div>
  );
});

// ----------------------------------------------------
// PAGE 9: EXPERIENCE DETAILS (Volume II)
// ----------------------------------------------------
export const Page9_ExperienceDetails = React.forwardRef(function Page9_ExperienceDetails({ experience }, ref) {
  // If we have more than 2 experiences, render them. Otherwise repeat/show secondary info.
  const records = experience.length > 2 ? experience.slice(2, 4) : experience.slice(0, 2);

  return (
    <div ref={ref} className="h-full w-full overflow-hidden bg-[#faf6ee] relative flex flex-col justify-between p-8 sm:p-10" style={{
      backgroundImage: `radial-gradient(circle at center, transparent 75%, rgba(200,185,160,0.1) 100%)`
    }}>
      <SpineShadow side="left" />
      <PageThicknessLines side="right" />

      <div>
        <div className="text-[10px] font-mono tracking-[0.3em] text-[#8b5a2b] uppercase mb-1">
          Journal Continua
        </div>
        <h3 className="text-xl font-bold text-[#2b1810] font-serif border-b border-[#8b5a2b]/20 pb-2 mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
          Historical Tenures
        </h3>

        <div className="relative border-l border-[#8b5a2b]/40 ml-2 pl-5 space-y-6 pr-1 custom-scrollbar overflow-y-auto max-h-[360px]">
          {records.map((exp, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[26px] top-1.5 w-3 h-3 rounded-full bg-[#fbf9f4] border border-[#8b5a2b] flex items-center justify-center shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8b5a2b]" />
              </div>

              <div className="text-[10px] font-mono text-[#8b5a2b] font-bold uppercase tracking-widest">
                {exp.period}
              </div>
              <h4 className="text-sm font-serif font-black text-[#2b1810] mt-0.5 leading-tight" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                {exp.role}
              </h4>
              <p className="text-[11px] font-mono uppercase text-[#8d6e63] mt-0.5">
                {exp.company}
              </p>
              <p className="text-[12px] font-serif text-[#5d4037] leading-relaxed mt-2 text-justify italic">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#8b5a2b]/15 pt-4 text-center">
        <span className="text-[9px] font-mono uppercase text-[#8d6e63] tracking-widest">
          Service Records Part II
        </span>
      </div>
    </div>
  );
});

// ----------------------------------------------------
// PAGE 10: CHAPTER 4 - PROJECTS (Stories Part I)
// ----------------------------------------------------
export const Page10_ProjectsIntro = React.forwardRef(function Page10_ProjectsIntro({ projects }, ref) {
  return (
    <div ref={ref} className="h-full w-full overflow-hidden bg-[#faf6ee] relative flex flex-col justify-between p-8 sm:p-10" style={{
      backgroundImage: `radial-gradient(circle at center, transparent 75%, rgba(200,185,160,0.1) 100%)`
    }}>
      <SpineShadow side="right" />
      <PageThicknessLines side="left" />

      <div>
        <div className="text-[10px] font-mono tracking-[0.3em] text-[#8b5a2b] uppercase mb-1">
          Chapter IV
        </div>
        <h3 className="text-2xl font-bold text-[#2b1810] font-serif border-b border-[#8b5a2b]/20 pb-2 mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
          The Artifact Showcase
        </h3>

        <div className="space-y-5 pr-1 custom-scrollbar overflow-y-auto max-h-[360px]">
          {projects.slice(0, 2).map((proj, idx) => (
            <div key={idx} className="border border-[#8b5a2b]/25 bg-[#faf7ef] p-4 shadow-sm relative">
              {/* Wax Seal style index */}
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#8b5a2b]/15 border border-[#8b5a2b]/35 flex items-center justify-center font-mono text-[9px] text-[#8b5a2b] font-bold">
                0{idx + 1}
              </div>

              <h4 className="text-sm font-serif font-bold text-[#2b1810] pr-6" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                {proj.title}
              </h4>
              <p className="text-[11px] font-serif text-[#5d4037] leading-relaxed mt-1 text-justify italic">
                {proj.description}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-[#8b5a2b]/10">
                {(proj.techStack || proj.technologies || []).map((t, idx) => (
                  <span key={idx} className="text-[9px] font-mono bg-[#eedfb9]/30 border border-[#8b5a2b]/15 text-[#6e461f] px-2 py-0.5 rounded-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#8b5a2b]/15 pt-4 text-center">
        <span className="text-[9px] font-mono uppercase text-[#8d6e63] tracking-widest">
          Artifact Ledger Part I
        </span>
      </div>
    </div>
  );
});

// ----------------------------------------------------
// PAGE 11: PROJECTS SHOWCASE (Stories Part II)
// ----------------------------------------------------
export const Page11_ProjectsDetails = React.forwardRef(function Page11_ProjectsDetails({ projects }, ref) {
  // Take next projects or fallback to first ones
  const records = projects.length > 2 ? projects.slice(2, 4) : projects.slice(0, 2);

  return (
    <div ref={ref} className="h-full w-full overflow-hidden bg-[#faf6ee] relative flex flex-col justify-between p-8 sm:p-10" style={{
      backgroundImage: `radial-gradient(circle at center, transparent 75%, rgba(200,185,160,0.1) 100%)`
    }}>
      <SpineShadow side="left" />
      <PageThicknessLines side="right" />

      <div>
        <div className="text-[10px] font-mono tracking-[0.3em] text-[#8b5a2b] uppercase mb-1">
          Catalog Continued
        </div>
        <h3 className="text-xl font-bold text-[#2b1810] font-serif border-b border-[#8b5a2b]/20 pb-2 mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
          Invented Apparatuses
        </h3>

        <div className="space-y-5 pr-1 custom-scrollbar overflow-y-auto max-h-[360px]">
          {records.map((proj, idx) => (
            <div key={idx} className="border border-[#8b5a2b]/25 bg-[#faf7ef] p-4 shadow-sm relative">
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#8b5a2b]/15 border border-[#8b5a2b]/35 flex items-center justify-center font-mono text-[9px] text-[#8b5a2b] font-bold">
                0{idx + 3}
              </div>

              <h4 className="text-sm font-serif font-bold text-[#2b1810] pr-6" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                {proj.title}
              </h4>
              <p className="text-[11px] font-serif text-[#5d4037] leading-relaxed mt-1 text-justify italic">
                {proj.description}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-[#8b5a2b]/10">
                {(proj.techStack || proj.technologies || []).map((t, idx) => (
                  <span key={idx} className="text-[9px] font-mono bg-[#eedfb9]/30 border border-[#8b5a2b]/15 text-[#6e461f] px-2 py-0.5 rounded-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#8b5a2b]/15 pt-4 text-center">
        <span className="text-[9px] font-mono uppercase text-[#8d6e63] tracking-widest">
          Artifact Ledger Part II
        </span>
      </div>
    </div>
  );
});

// ----------------------------------------------------
// PAGE 12: CHAPTER 5 - EDUCATION & SEALS
// ----------------------------------------------------
export const Page12_EducationAchievements = React.forwardRef(function Page12_EducationAchievements({ education, testimonials }, ref) {
  const edu = education[0] || { degree: 'Master of Arts', institution: 'Royal Archives Academy', year: '2016', description: 'Study of historical archiving.' };
  const testimonial = testimonials[0] || { name: 'Dr. Clara Sterling', role: 'Archival lead', text: 'Arthur maps digital experiences beautifully.' };

  return (
    <div ref={ref} className="h-full w-full overflow-hidden bg-[#faf6ee] relative flex flex-col justify-between p-8 sm:p-10" style={{
      backgroundImage: `radial-gradient(circle at center, transparent 75%, rgba(200,185,160,0.1) 100%)`
    }}>
      <SpineShadow side="right" />
      <PageThicknessLines side="left" />

      <div>
        <div className="text-[10px] font-mono tracking-[0.3em] text-[#8b5a2b] uppercase mb-1">
          Chapter V
        </div>
        <h3 className="text-2xl font-bold text-[#2b1810] font-serif border-b border-[#8b5a2b]/20 pb-2 mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
          Academic Seals & Patronage
        </h3>

        {/* Vintage Certificate Border Look for Education */}
        <div className="border-[3px] border-double border-[#8b5a2b]/30 p-4 bg-[#FAF7EF] rounded-sm text-center relative mb-6">
          <Award className="w-5 h-5 text-[#8b5a2b] mx-auto mb-1.5" />
          <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8d6e63]">Official Credential</h4>
          <p className="text-xs font-serif font-black text-[#2b1810] mt-1" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            {edu.degree}
          </p>
          <p className="text-[10px] font-mono text-[#8b5a2b] uppercase mt-0.5">
            {edu.institution}
          </p>
          <div className="text-[9px] font-mono text-[#8d6e63] mt-2">
            CONFERRED IN THE YEAR OF {edu.year}
          </div>
          <div className="absolute bottom-2 right-2 w-7 h-7 border border-[#8b5a2b]/30 bg-[#ebdcb9]/20 rounded-full flex items-center justify-center text-[7px] text-[#8b5a2b] font-bold rotate-12">
            SEAL
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="relative border-l border-[#8b5a2b]/20 pl-4 py-1">
          <p className="text-xs font-serif italic text-[#5d4037] leading-relaxed">
            "{testimonial.text || testimonial.content}"
          </p>
          <div className="text-[10px] font-mono text-[#8d6e63] mt-1.5 uppercase tracking-wider">
            — {testimonial.name || testimonial.author}, {testimonial.role}
          </div>
        </div>
      </div>

      <div className="border-t border-[#8b5a2b]/15 pt-4 text-center">
        <span className="text-[9px] font-mono uppercase text-[#8d6e63] tracking-widest">
          Scholastic Accolades
        </span>
      </div>
    </div>
  );
});

// ----------------------------------------------------
// PAGE 13: CHAPTER 6 - EPILOGUE & CONTACT
// ----------------------------------------------------
export const Page13_ContactEpilogue = React.forwardRef(function Page13_ContactEpilogue({ personal, socials }, ref) {
  return (
    <div ref={ref} className="h-full w-full overflow-hidden bg-[#faf6ee] relative flex flex-col justify-between p-8 sm:p-10" style={{
      backgroundImage: `radial-gradient(circle at center, transparent 75%, rgba(200,185,160,0.1) 100%)`
    }}>
      <SpineShadow side="left" />
      <PageThicknessLines side="right" />

      <div>
        <div className="text-[10px] font-mono tracking-[0.3em] text-[#8b5a2b] uppercase mb-1">
          Chapter VI
        </div>
        <h3 className="text-2xl font-bold text-[#2b1810] font-serif border-b border-[#8b5a2b]/20 pb-2 mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
          The Final Leaf
        </h3>

        {/* Contact info styled as an old envelope/letter */}
        <div className="bg-[#FAF7EF] border border-[#8b5a2b]/20 p-4 rounded-sm space-y-3 shadow-inner">
          <div className="text-[10px] font-mono text-[#8b5a2b] uppercase tracking-widest border-b border-[#8b5a2b]/10 pb-1.5">
            Mailing Dispatch
          </div>
          
          <div className="flex items-center gap-3 text-xs text-[#3e2723]">
            <Mail className="w-4 h-4 text-[#8b5a2b] shrink-0" />
            <a href={`mailto:${personal.email}`} className="hover:underline font-mono truncate">{personal.email}</a>
          </div>
          
          {personal.phone && (
            <div className="flex items-center gap-3 text-xs text-[#3e2723]">
              <Phone className="w-4 h-4 text-[#8b5a2b] shrink-0" />
              <span className="font-mono">{personal.phone}</span>
            </div>
          )}

          {personal.website && (
            <div className="flex items-center gap-3 text-xs text-[#3e2723]">
              <Globe className="w-4 h-4 text-[#8b5a2b] shrink-0" />
              <a href={personal.website} target="_blank" rel="noreferrer" className="hover:underline font-mono truncate">{personal.website}</a>
            </div>
          )}
        </div>

        {/* Cursive closing */}
        <div className="mt-6 text-center">
          <p className="text-sm font-serif italic text-[#8d6e63]" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            Until our paths converge once more,
          </p>
          <p className="text-lg font-serif italic text-[#3e2723] font-bold mt-1" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            {personal.name}
          </p>
        </div>
      </div>

      {/* Social seals */}
      <div className="border-t border-[#8b5a2b]/15 pt-4 flex justify-center gap-5">
        {socials.github && (
          <a href={socials.github} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-[#8b5a2b]/30 bg-[#f7f2e4] flex items-center justify-center text-[#8b5a2b] hover:bg-[#8b5a2b] hover:text-[#faf6ee] transition-colors shadow-sm">
            <Github className="w-4 h-4" />
          </a>
        )}
        {socials.linkedin && (
          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-[#8b5a2b]/30 bg-[#f7f2e4] flex items-center justify-center text-[#8b5a2b] hover:bg-[#8b5a2b] hover:text-[#faf6ee] transition-colors shadow-sm">
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        {socials.twitter && (
          <a href={socials.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-[#8b5a2b]/30 bg-[#f7f2e4] flex items-center justify-center text-[#8b5a2b] hover:bg-[#8b5a2b] hover:text-[#faf6ee] transition-colors shadow-sm">
            <Twitter className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
});

// ----------------------------------------------------
// PAGE 14: BACK COVER (Leather, Spine Gilt detailing)
// ----------------------------------------------------
export const Page14_BackCover = React.forwardRef(function Page14_BackCover({ personal }, ref) {
  return (
    <div ref={ref} className="h-full w-full overflow-hidden bg-[#24130d] relative flex flex-col justify-between p-8 sm:p-12 shadow-2xl select-none" style={{
      backgroundImage: `radial-gradient(circle at center, rgba(54,28,21,0.2) 0%, rgba(15,8,6,0.9) 100%), 
        repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 2px, transparent 2px, transparent 4px)`
    }}>
      {/* Leather borders */}
      <div className="absolute inset-4 border-[3px] border-[#c5a059] opacity-85 pointer-events-none rounded-sm" />
      <div className="absolute inset-[22px] border border-[#c5a059]/40 pointer-events-none rounded-sm" />
      
      {/* Corner metal guards */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-[#c5a059]" />
      <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-[#c5a059]" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-[#c5a059]" />
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-[#c5a059]" />

      <div className="text-center mt-12">
        <Compass className="text-[#c5a059]/40 w-10 h-10 mx-auto" />
      </div>

      {/* Ornate back seal */}
      <div className="text-center my-auto flex flex-col items-center">
        <div className="w-16 h-16 rounded-full border border-[#c5a059]/50 flex items-center justify-center p-2 relative bg-black/10">
          <BookOpen className="w-6 h-6 text-[#c5a059]/80" />
          <div className="absolute w-20 h-20 border border-dashed border-[#c5a059]/30 rounded-full" />
        </div>
        <p className="text-[#c5a059]/80 font-serif text-sm tracking-[0.2em] uppercase mt-6" style={{ fontFamily: 'Cinzel, serif' }}>
          ARCHIVES COMPLETED
        </p>
      </div>

      <div className="text-center mb-8">
        <div className="text-[#c5a059]/60 font-mono text-[9px] uppercase tracking-[0.35em]">
          FINIS • END OF VOLUME
        </div>
      </div>
    </div>
  );
});
