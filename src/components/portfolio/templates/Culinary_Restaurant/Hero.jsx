import React, { useState, useEffect } from 'react';
import { ChefHat, Star, Award, Clock, MapPin, ArrowRight, Utensils, Flame } from 'lucide-react';

export default function Hero() {
  const [visibleStats, setVisibleStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisibleStats(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Years Experience', value: '15+', icon: Clock },
    { label: 'Signature Dishes', value: '200+', icon: Utensils },
    { label: 'Awards Won', value: '12', icon: Award },
    { label: 'Cuisines Mastered', value: '8', icon: Flame },
  ];

  const specialties = [
    'Farm-to-Table Philosophy',
    'Modern French Techniques',
    'Artisan Pastry & Desserts',
    'Wine & Food Pairing',
  ];

  return (
    <section
      className="w-full min-h-screen bg-[#0d0d0d] relative overflow-hidden"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* Google Font link injected via effect */}
      <GoogleFontLoader />

      {/* Ambient Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-700/5 blur-[100px]" />
      </div>

      {/* Decorative top border line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-28">

        {/* Top Tag */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-px bg-amber-500/60" />
          <span className="text-amber-400/80 text-xs tracking-[0.35em] uppercase font-medium" style={{ fontFamily: 'sans-serif' }}>
            Chef & Culinary Artist
          </span>
          <div className="w-8 h-px bg-amber-500/60" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* LEFT COLUMN */}
          <div className="space-y-8">

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.05] tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Crafting{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
                  Unforgettable
                </span>
              </h1>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.05] tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Experiences
              </h1>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-amber-500/50" />
              <ChefHat className="text-amber-400/70" size={18} />
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Description */}
            <p className="text-gray-400 text-lg leading-relaxed max-w-md font-light" style={{ fontFamily: 'sans-serif' }}>
              A gastronomic journey rooted in seasonal ingredients, classical French
              technique, and the belief that every meal deserves to be a memory.
              Available for private dining, events, and culinary consulting.
            </p>

            {/* Specialties */}
            <ul className="space-y-3">
              {specialties.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300 text-sm" style={{ fontFamily: 'sans-serif' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button className="group flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm tracking-wide rounded-full transition-all duration-300"
                style={{ fontFamily: 'sans-serif' }}>
                View Signature Menu
                <ArrowRight size={16} />
              </button>
              <button className="flex items-center justify-center gap-2 px-8 py-4 border border-white/15 hover:border-amber-500/50 text-white/80 hover:text-white font-medium text-sm tracking-wide rounded-full transition-all duration-300 hover:bg-white/5"
                style={{ fontFamily: 'sans-serif' }}>
                Book a Private Event
              </button>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-500 text-sm pt-1" style={{ fontFamily: 'sans-serif' }}>
              <MapPin size={14} className="text-amber-500/60" />
              <span>Paris · New York · Tokyo</span>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-sm mx-auto">

              {/* Corner frame */}
              <div className="absolute -inset-3 pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-amber-500/30" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-amber-500/30" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-amber-500/30" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-amber-500/30" />
              </div>

              {/* Visual card */}
              <div className="relative bg-[#161616] border border-white/8 rounded-2xl overflow-hidden aspect-[3/4]">
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <svg viewBox="0 0 300 360" className="w-full h-full opacity-90" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="domGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2a2a2a" />
                        <stop offset="100%" stopColor="#181818" />
                      </linearGradient>
                    </defs>
                    <circle cx="150" cy="180" r="130" fill="none" stroke="#c5a880" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.3" />
                    <circle cx="150" cy="180" r="100" fill="none" stroke="#c5a880" strokeWidth="0.3" opacity="0.2" />
                    <ellipse cx="150" cy="220" rx="110" ry="18" fill="#1e1e1e" stroke="#c5a880" strokeWidth="0.8" opacity="0.9" />
                    <ellipse cx="150" cy="218" rx="108" ry="16" fill="#1a1a1a" stroke="#c5a880" strokeWidth="0.4" opacity="0.6" />
                    <ellipse cx="150" cy="216" rx="90" ry="12" fill="#222" />
                    <path d="M60 216 Q60 130 150 125 Q240 130 240 216 Z" fill="#1c1c1c" stroke="#c5a880" strokeWidth="1" opacity="0.95" />
                    <path d="M65 216 Q65 135 150 130 Q235 135 235 216 Z" fill="url(#domGrad)" />
                    <ellipse cx="118" cy="158" rx="18" ry="10" fill="white" opacity="0.04" transform="rotate(-30 118 158)" />
                    <ellipse cx="150" cy="126" rx="14" ry="5" fill="#c5a880" opacity="0.9" />
                    <rect x="144" y="112" width="12" height="14" rx="3" fill="#c5a880" opacity="0.85" />
                    <ellipse cx="150" cy="112" rx="8" ry="3" fill="#d4b896" opacity="0.9" />
                    <text x="90" y="88" fontSize="12" fill="#c5a880" opacity="0.7" textAnchor="middle">✦</text>
                    <text x="150" y="72" fontSize="8" fill="#c5a880" opacity="0.5" textAnchor="middle">✦</text>
                    <text x="210" y="88" fontSize="12" fill="#c5a880" opacity="0.7" textAnchor="middle">✦</text>
                    <text x="150" y="100" fontSize="8" fill="#c5a880" opacity="0.35" textAnchor="middle" letterSpacing="3">CHEF</text>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 via-transparent to-transparent" />
              </div>

              {/* Floating card — Experience */}
              <div className="absolute -left-6 top-10 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-xl">
                <p className="text-amber-400 text-xs tracking-widest uppercase mb-1" style={{ fontFamily: 'sans-serif' }}>Experience</p>
                <p className="text-white font-semibold text-lg leading-none">15+ Years</p>
                <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: 'sans-serif' }}>Culinary Artistry</p>
              </div>

              {/* Floating card — Michelin */}
              <div className="absolute -right-6 bottom-16 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-xl">
                <div className="flex gap-0.5 mb-1">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-white font-semibold text-sm" style={{ fontFamily: 'sans-serif' }}>Michelin</p>
                <p className="text-gray-500 text-xs" style={{ fontFamily: 'sans-serif' }}>Recognized</p>
              </div>
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div className={`mt-20 pt-10 border-t border-white/6 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700 ${
          visibleStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {stats.map(({ label, value, icon: Icon }, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-10 h-10 rounded-full border border-amber-500/20 flex items-center justify-center mb-3 group-hover:border-amber-500/50 transition-colors duration-300">
                <Icon size={16} className="text-amber-400/70" />
              </div>
              <span className="text-3xl font-light text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{value}</span>
              <span className="text-gray-500 text-xs tracking-wider uppercase mt-1" style={{ fontFamily: 'sans-serif' }}>{label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
    </section>
  );
}

function GoogleFontLoader() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
}
