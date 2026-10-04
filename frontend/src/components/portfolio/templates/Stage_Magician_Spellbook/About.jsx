import React, { useState } from 'react';
import { BookOpen, Star, Sparkles, Shield, Compass, Heart, Flame } from 'lucide-react';

export default function About({ data }) {
  const [activeCircle, setActiveCircle] = useState(0);

  const defaultData = {
    personalInfo: {
      name: "Valerius Vance",
      title: "Arch-Mage of Interfaces",
      tagline: "Formulating digital alchemy across distributed realms.",
      bio1: "For over eight cycles (years), Valerius has dedicated his existence to deciphering the arcane mysteries of the web. Having compiled countless React components and designed responsive interfaces, his philosophy merges clean architecture with stunning micro-interactions.",
      bio2: "Every line of code is a calculated spell. Every interface is a portal of interaction. A commitment to honor standard protocols, optimize client performance, and deliver pure digital delight.",
      since: "2018",
      mana: "99.9%",
      mastery: "Grandmaster"
    },
    milestones: [
      { year: '2018', label: 'First Incantation (First Dev Role)' },
      { year: '2020', label: 'Promotion to Sorcerer (Senior Dev)' },
      { year: '2022', label: 'Mastering the Cloud (Architect)' },
      { year: '2024', label: 'Interface Arch-Mage (Lead Engineer)' },
      { year: '2026', label: 'Shaping the Future (Principal Designer)' }
    ],
    principles: [
      {
        icon: Compass,
        title: 'Pixel-Perfect Illusion',
        desc: 'Precision and aesthetics are crucial. Every margin, alignment, and hover state is designed to create a flawless user journey.'
      },
      {
        icon: Shield,
        title: 'Clean Incantations',
        desc: 'Writing maintainable, self-documenting, and semantic code. No shortcuts, no dark magic hacks.'
      },
      {
        icon: Star,
        title: 'Performant Portals',
        desc: 'Optimizing speeds so that websites load instantly. Time is gold, and latency is a curse.'
      },
      {
        icon: Heart,
        title: 'User Empathy',
        desc: 'A designer at heart, crafting applications that prioritize accessibility, screen readers, and seamless interactions.'
      }
    ]
  };

  const profile = data?.personalInfo || defaultData.personalInfo;
  const milestones = data?.milestones || defaultData.milestones;
  const principles = data?.principles || defaultData.principles;

  return (
    <section className="w-full bg-[#0B0A0F] text-white overflow-hidden border-t border-[#D4AF37]/15">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left Column: Mystical Book Frame (Visual) */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 border border-[#D4AF37]/15 pointer-events-none rounded-xl" />
            <div className="absolute -inset-8 border border-[#A855F7]/10 pointer-events-none rounded-2xl" />

            <div className="relative overflow-hidden bg-[#110D17] border border-[#D4AF37]/25 rounded-lg shadow-2xl p-8">
              {/* Gold borders on book cover */}
              <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#D4AF37]/10 pointer-events-none" />
              <div className="absolute top-4 left-4 right-4 bottom-4 border border-dashed border-[#D4AF37]/20 pointer-events-none" />

              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37] pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37] pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none" />

              <div className="flex flex-col items-center py-10 relative">
                <BookOpen className="w-16 h-16 text-[#D4AF37] mb-6 animate-pulse" />
                <h3 className="font-mono text-2xl font-bold tracking-widest text-[#D4AF37] mb-2 uppercase">
                  Valerius Grimoire
                </h3>
                <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-6">
                  {profile.title}
                </p>
                <div className="w-12 h-px bg-[#D4AF37]/35 mb-6" />
                
                {/* Visual stats breakdown */}
                <div className="space-y-4 w-full max-w-xs font-mono text-xs">
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">Spell Origin</span>
                    <span className="text-gray-300">EST. {profile.since}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">Mana Reserve</span>
                    <span className="text-emerald-400">{profile.mana}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-500">Wizard Mastery</span>
                    <span className="text-[#D4AF37]">{profile.mastery}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[#D4AF37]" />
              <span className="text-xs font-mono tracking-widest uppercase text-[#D4AF37]">
                The Sorcerer's Chronicle
              </span>
              <div className="h-px w-8 bg-[#D4AF37]" />
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase leading-none">
              Archmage of Code
            </h2>

            <p className="text-purple-300 font-serif italic text-lg leading-relaxed border-l-2 border-[#D4AF37]/50 pl-5">
              "{profile.tagline}"
            </p>

            <div className="space-y-4 text-gray-400 text-sm leading-relaxed font-light">
              <p>{profile.bio1}</p>
              <p className="border-l-2 border-purple-800 pl-4 italic text-purple-200 bg-purple-950/10 p-3 rounded">
                {profile.bio2}
              </p>
            </div>
          </div>
        </div>

        {/* ── Chronicle Milestones Timeline ── */}
        <div className="mt-28">
          <div className="text-center mb-16 space-y-2">
            <div className="w-12 h-px bg-[#D4AF37] mx-auto" />
            <p className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">The Chronicle</p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">Milestones of Magic</h2>
          </div>

          <div className="relative">
            {/* Horizontal line (desktop) */}
            <div className="absolute top-5 left-0 right-0 h-px bg-[#D4AF37]/15 hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
              {milestones.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center gap-4 relative">
                  {/* Glowing runic node */}
                  <div className="relative z-10 w-10 h-10 rounded-full border border-[#D4AF37]/50 bg-[#0B0A0F] flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#A855F7] animate-ping opacity-75" />
                    <div className="absolute w-2 h-2 rounded-full bg-[#D4AF37]" />
                  </div>

                  <div>
                    <p className="font-mono text-xl text-[#D4AF37] font-semibold mb-1">{item.year}</p>
                    <p className="text-gray-400 text-xs font-light leading-relaxed">{item.label}</p>
                  </div>

                  {/* Gradient line connect (desktop) */}
                  {idx < milestones.length - 1 && (
                    <div className="hidden md:block absolute top-5 left-[calc(50%+20px)] right-[-50%] h-px bg-gradient-to-r from-[#D4AF37]/45 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Magical Principles ── */}
        <div className="mt-28 bg-[#110D17] border border-[#D4AF37]/20 p-8 sm:p-12 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)' }} />
          
          <div className="text-center mb-16 space-y-2">
            <div className="w-12 h-px bg-[#D4AF37] mx-auto" />
            <p className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">The Grimoire</p>
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight">Arcane Core Principles</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((pr, idx) => {
              const Icon = pr.icon;
              const isSelected = activeCircle === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveCircle(idx)}
                  className={`group text-left p-6 border transition-all duration-300 rounded-xl relative ${
                    isSelected
                      ? 'border-[#D4AF37]/60 bg-[#171220] shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                      : 'border-gray-800 bg-transparent hover:border-[#D4AF37]/35 hover:bg-[#120F18]'
                  }`}
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center mb-4 rounded border transition-colors duration-300 ${
                      isSelected
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-gray-700 group-hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>

                  <h3
                    className={`font-mono text-sm font-bold mb-2 uppercase tracking-wide ${
                      isSelected ? 'text-white' : 'text-gray-300'
                    }`}
                  >
                    {pr.title}
                  </h3>
                  <p className="text-gray-400 text-xs font-light leading-relaxed">{pr.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
