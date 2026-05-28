import React from 'react';
import { Coffee, MapPin, Clock, ArrowDown, Star } from 'lucide-react';

export default function Hero() {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

          .cs-playfair { font-family: 'Playfair Display', serif; }
          .cs-cormorant { font-family: 'Cormorant Garamond', serif; }
          .cs-dmsans    { font-family: 'DM Sans', sans-serif; }

          @keyframes cs-fade-up {
            0%   { opacity: 0; transform: translateY(28px); filter: blur(6px); }
            100% { opacity: 1; transform: translateY(0);    filter: blur(0);   }
          }
          .cs-animate {
            animation: cs-fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
          }

          @keyframes cs-steam {
            0%   { opacity: 0; transform: translateY(0)     scaleX(1);   }
            20%  { opacity: 0.7; }
            80%  { opacity: 0.3; }
            100% { opacity: 0; transform: translateY(-55px) scaleX(1.4); }
          }
          .cs-steam-1 { animation: cs-steam 3s ease-in-out infinite 0s;   }
          .cs-steam-2 { animation: cs-steam 3s ease-in-out infinite 0.9s; }
          .cs-steam-3 { animation: cs-steam 3s ease-in-out infinite 1.8s; }

          @keyframes cs-float {
            0%, 100% { transform: translateY(0px)   rotate(-1.5deg); }
            50%      { transform: translateY(-10px) rotate(1.5deg);  }
          }
          .cs-float { animation: cs-float 5s ease-in-out infinite; }

          @keyframes cs-shimmer {
            0%   { background-position: -200% 0; }
            100% { background-position:  200% 0; }
          }
          .cs-shimmer {
            background: linear-gradient(90deg, #D4A574 0%, #F5D6A8 40%, #D4A574 60%, #A0714F 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: cs-shimmer 4s linear infinite;
          }

          @keyframes cs-rotate {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          .cs-rotate-slow    { animation: cs-rotate 22s linear infinite; }
          .cs-rotate-reverse { animation: cs-rotate 32s linear infinite reverse; }

          @keyframes cs-pulse-ring {
            0%, 100% { transform: scale(0.96); opacity: 0.6; }
            50%      { transform: scale(1.04); opacity: 0.2; }
          }
          .cs-pulse-ring { animation: cs-pulse-ring 3.5s ease-in-out infinite; }

          .cs-grain::before {
            content: '';
            position: absolute; inset: -50%;
            width: 200%; height: 200%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
            opacity: 0.04;
            pointer-events: none;
            z-index: 1;
          }

          .cs-bean-bg {
            background-image: radial-gradient(ellipse 2px 3px at center, rgba(90,50,20,0.28) 0%, transparent 100%);
            background-size: 28px 28px;
          }

          @media (prefers-reduced-motion: reduce) {
            .cs-animate, .cs-steam-1, .cs-steam-2, .cs-steam-3,
            .cs-float, .cs-shimmer, .cs-rotate-slow, .cs-rotate-reverse, .cs-pulse-ring {
              animation: none;
              opacity: 1;
              transform: none;
              filter: none;
            }
          }
        `}
      </style>

      <section className="relative w-full min-h-screen flex flex-col overflow-hidden bg-[#1A0F0A] text-white selection:bg-[#5C3318]">

        {/* Background: radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_62%_42%,#3D1F0D_0%,#1A0F0A_70%)] z-0" />

        {/* Background: bean dot pattern */}
        <div className="cs-bean-bg absolute inset-0 opacity-40 z-0" />

        {/* Background: grain overlay */}
        <div className="cs-grain absolute inset-0 pointer-events-none z-0" />

        {/* Top vignette */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#0D0704] to-transparent z-0" />

        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0D0704] to-transparent z-0" />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4A574]/40 to-transparent z-10" />

        {/* Decorative rings (desktop only) */}
        <div className="hidden lg:block absolute top-1/2 right-[4%] -translate-y-1/2 w-[480px] h-[480px] z-0">
          <div className="cs-pulse-ring absolute inset-0 rounded-full border border-[#5C3318]/20" />
          <div className="absolute inset-8 rounded-full border border-[#8B5E3C]/12" />
          <div className="cs-rotate-slow absolute inset-16 rounded-full border border-[#D4A574]/8" />
        </div>

        {/* Decorative coffee icons */}
        <div className="cs-rotate-slow hidden md:block absolute top-16 right-[11%] opacity-10 z-0">
          <Coffee size={60} color="#D4A574" />
        </div>
        <div className="cs-rotate-reverse hidden lg:block absolute bottom-28 left-[7%] opacity-8 z-0">
          <Coffee size={44} color="#A0714F" />
        </div>

        {/* ── NAV ── */}
        <nav className="cs-animate relative z-20 flex items-center justify-between px-6 md:px-12 lg:px-20 py-6" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2">
            <Coffee size={18} className="text-[#D4A574]" />
            <span className="cs-cormorant text-[#F5D6A8] text-xl font-light tracking-widest uppercase">
              Brew & Craft
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Menu', 'Story', 'Events', 'Contact'].map((item) => (
              <a
                key={item}
                href="#"
                className="cs-dmsans text-[#A0714F] text-xs tracking-[0.2em] uppercase hover:text-[#F5D6A8] transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>

          <button className="cs-dmsans text-xs tracking-widest uppercase bg-[#D4A574] text-[#1A0F0A] px-5 py-2 font-medium hover:bg-[#F5D6A8] transition-colors duration-300">
            Reserve
          </button>
        </nav>

        {/* ── MAIN CONTENT ── */}
        <div className="relative z-20 flex-1 flex items-center">
          <div className="w-full px-6 md:px-12 lg:px-20 py-8 lg:py-0">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 items-center max-w-7xl mx-auto">

              {/* Left: text */}
              <div className="flex flex-col gap-6 order-2 lg:order-1">

                {/* Eyebrow */}
                <div className="cs-animate flex items-center gap-3" style={{ animationDelay: '0.3s' }}>
                  <div className="w-8 h-px bg-[#D4A574]" />
                  <span className="cs-dmsans text-[#D4A574] text-[10px] tracking-[0.28em] uppercase">
                    Est. 2009 · Artisan Roasters
                  </span>
                </div>

                {/* Headline */}
                <div className="cs-animate" style={{ animationDelay: '0.7s' }}>
                  <h1 className="cs-playfair leading-[0.95] font-black">
                    <span className="block text-[clamp(3rem,8vw,7rem)] text-[#F5E6D0]">Where</span>
                    <span className="cs-shimmer cs-playfair block text-[clamp(3rem,8vw,7rem)] font-black italic">Coffee</span>
                    <span className="block text-[clamp(3rem,8vw,7rem)] text-[#F5E6D0]">Tells a</span>
                    <span className="block text-[clamp(3rem,8vw,7rem)] text-[#C4956A]">Story.</span>
                  </h1>
                </div>

                {/* Tagline */}
                <div className="cs-animate" style={{ animationDelay: '1.1s' }}>
                  <p className="cs-cormorant text-[#9B7A5A] text-xl md:text-2xl font-light leading-relaxed max-w-md italic">
                    "Single-origin beans, hand-roasted with care. Every cup brewed to perfection."
                  </p>
                </div>

                {/* Roles — mirrors Cinematic credits row */}
                <div
                  className="cs-animate flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-14 cs-dmsans text-xs text-[#A0714F] uppercase tracking-widest font-semibold"
                  style={{ animationDelay: '1.5s' }}
                >
                  <div className="flex flex-col items-start sm:items-center">
                    <span className="text-[#5C3318] text-[9px] mb-1.5 tracking-[0.22em]">Specialty</span>
                    <span className="text-[#F5E6D0]">Espresso Bar</span>
                  </div>
                  <div className="flex flex-col items-start sm:items-center">
                    <span className="text-[#5C3318] text-[9px] mb-1.5 tracking-[0.22em]">Craft</span>
                    <span className="text-[#F5E6D0]">Cold Brew</span>
                  </div>
                  <div className="flex flex-col items-start sm:items-center">
                    <span className="text-[#5C3318] text-[9px] mb-1.5 tracking-[0.22em]">Roast</span>
                    <span className="text-[#F5E6D0]">Single Origin</span>
                  </div>
                </div>

                {/* CTAs */}
                <div
                  className="cs-animate flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-2"
                  style={{ animationDelay: '1.9s' }}
                >
                  <button className="group relative flex items-center justify-center gap-3 px-10 py-4 bg-[#D4A574] text-[#1A0F0A] cs-dmsans font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#F5D6A8] transition-all duration-500 overflow-hidden w-full sm:w-auto">
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <Coffee size={14} className="relative z-10" />
                    <span className="relative z-10">Explore Menu</span>
                  </button>

                  <button className="group flex items-center justify-center gap-2 px-10 py-4 bg-transparent border border-[#5C3318] text-[#D4A574] cs-dmsans font-bold uppercase tracking-[0.2em] text-xs hover:border-[#D4A574] transition-all duration-500 w-full sm:w-auto">
                    <span className="group-hover:translate-x-1 transition-transform duration-500">Our Story</span>
                    <span className="text-[#5C3318] group-hover:text-[#D4A574] transition-colors duration-500">›</span>
                  </button>
                </div>

                {/* Stats */}
                <div
                  className="cs-animate flex gap-10 pt-4 border-t border-[#2C1810]"
                  style={{ animationDelay: '2.2s' }}
                >
                  {[
                    { value: '12+',  label: 'Origins'  },
                    { value: '4.9★', label: 'Rating'   },
                    { value: '15yr', label: 'Roasting' },
                  ].map(({ value, label }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <span className="cs-playfair text-2xl text-[#D4A574] font-bold">{value}</span>
                      <span className="cs-dmsans text-[#6B4E35] text-[10px] tracking-widest uppercase">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: cup illustration */}
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end items-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px]">

                  {/* Warm glow */}
                  <div className="absolute inset-8 rounded-full bg-[#8B4513]/20 blur-3xl" />

                  {/* Steam */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-16 pointer-events-none">
                    <svg className="cs-steam-1 absolute" style={{ left: '18%' }} width="14" height="48" viewBox="0 0 14 48">
                      <path d="M7 48 C4 38 10 28 7 18 C4 8 10 0 7 0" stroke="rgba(255,245,220,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    </svg>
                    <svg className="cs-steam-2 absolute" style={{ left: '44%' }} width="14" height="60" viewBox="0 0 14 60">
                      <path d="M7 60 C4 48 10 36 7 24 C4 12 10 0 7 0" stroke="rgba(255,245,220,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    </svg>
                    <svg className="cs-steam-3 absolute" style={{ left: '68%' }} width="14" height="44" viewBox="0 0 14 44">
                      <path d="M7 44 C4 35 10 26 7 16 C4 7 10 0 7 0" stroke="rgba(255,245,220,0.45)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    </svg>
                  </div>

                  {/* Cup */}
                  <div className="cs-float w-full h-full px-8 py-10">
                    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ filter: 'drop-shadow(0 10px 28px rgba(139,69,19,0.5))' }}>
                      <ellipse cx="60" cy="128" rx="45" ry="8"  fill="#6B3F1F" opacity="0.4"/>
                      <ellipse cx="60" cy="124" rx="42" ry="6"  fill="#8B5E3C"/>
                      <ellipse cx="60" cy="122" rx="40" ry="5"  fill="#A0714F"/>
                      <path d="M25 55 Q22 110 30 118 Q60 128 90 118 Q98 110 95 55 Z" fill="url(#csGrad)"/>
                      <ellipse cx="60" cy="55" rx="35" ry="8"   fill="#C4956A"/>
                      <ellipse cx="60" cy="54" rx="33" ry="7"   fill="#D4A574"/>
                      <path d="M90 70 Q115 70 115 88 Q115 106 90 106" stroke="#8B5E3C" strokeWidth="8"  fill="none" strokeLinecap="round"/>
                      <path d="M90 70 Q110 70 110 88 Q110 106 90 106" stroke="#A0714F" strokeWidth="5"  fill="none" strokeLinecap="round"/>
                      <ellipse cx="60" cy="54" rx="30" ry="6"   fill="#2C1810"/>
                      <ellipse cx="60" cy="54" rx="28" ry="5"   fill="#3D2314"/>
                      <path d="M48 54 Q60 48 72 54" stroke="rgba(255,245,220,0.55)" strokeWidth="2" fill="none" strokeLinecap="round"/>
                      <circle cx="60" cy="54" r="5" fill="rgba(255,245,220,0.18)"/>
                      <path d="M40 80 Q60 75 80 80" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none"/>
                      <path d="M38 92 Q60 87 82 92" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none"/>
                      <defs>
                        <linearGradient id="csGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%"   stopColor="#7A4F2C"/>
                          <stop offset="40%"  stopColor="#C4956A"/>
                          <stop offset="100%" stopColor="#8B5E3C"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Badge: Open Now */}
                  <div className="absolute top-4 right-0 bg-[#2C1810] border border-[#5C3318] px-3 py-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="cs-dmsans text-[#D4A574] text-[10px] tracking-wider uppercase">Open Now</span>
                  </div>

                  {/* Badge: Location */}
                  <div className="absolute bottom-8 left-0 bg-[#2C1810] border border-[#5C3318] px-3 py-2 flex items-center gap-2 max-w-[152px]">
                    <MapPin size={11} className="text-[#D4A574] shrink-0"/>
                    <span className="cs-dmsans text-[#9B7A5A] text-[10px] truncate">Downtown, 5th Ave</span>
                  </div>

                  {/* Badge: Hours */}
                  <div className="hidden md:flex absolute top-1/2 -right-4 lg:-right-8 -translate-y-1/2 bg-[#D4A574] px-3 py-2 items-center gap-2">
                    <Clock size={11} className="text-[#1A0F0A]"/>
                    <span className="cs-dmsans text-[#1A0F0A] text-[10px] font-medium">7am – 9pm</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR — mirrors Cinematic letterbox bar ── */}
        <div className="relative z-20 flex items-center justify-center py-4 border-t border-[#2C1810]">
          <div className="flex items-center gap-4 sm:gap-6 cs-dmsans text-[9px] sm:text-[10px] text-[#5C3318] tracking-[0.28em] uppercase">
            <span className="flex items-center gap-1.5">
              <Star size={10} className="text-[#6B4E35]" /> Specialty Grade 2024
            </span>
            <span className="hidden sm:inline opacity-40">|</span>
            <span className="hidden sm:inline">Small Batch Roasted</span>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#5C3318]/50 to-transparent z-10" />

      </section>
    </>
  );
}