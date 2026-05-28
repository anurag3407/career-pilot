import React from 'react';
import { useState, useEffect } from "react";
import { MapPin, Clock, Coffee, ArrowDown, Star } from "lucide-react";

const SteamLine = ({ delay = 0, x = 50, height = 40 }) => (
  <div
    className="absolute bottom-full pointer-events-none"
    style={{ left: `${x}%`, animationDelay: `${delay}s` }}
  >
    <svg
      width="20"
      height={height}
      viewBox={`0 0 20 ${height}`}
      className="steam-wisp"
      style={{ animationDelay: `${delay}s` }}
    >
      <path
        d={`M10 ${height} C6 ${height * 0.8} 14 ${height * 0.6} 10 ${height * 0.4} C6 ${height * 0.2} 14 0 10 0`}
        stroke="rgba(255,245,220,0.5)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  </div>
);
 
const CoffeeCupSVG = () => (
  <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
    <ellipse cx="60" cy="128" rx="45" ry="8" fill="#6B3F1F" opacity="0.4" />
    <ellipse cx="60" cy="124" rx="42" ry="6" fill="#8B5E3C" />
    <ellipse cx="60" cy="122" rx="40" ry="5" fill="#A0714F" />
    <path d="M25 55 Q22 110 30 118 Q60 128 90 118 Q98 110 95 55 Z" fill="url(#cupGrad)" />
    <ellipse cx="60" cy="55" rx="35" ry="8" fill="#C4956A" />
    <ellipse cx="60" cy="54" rx="33" ry="7" fill="#D4A574" />
    <path d="M90 70 Q115 70 115 88 Q115 106 90 106" stroke="#8B5E3C" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d="M90 70 Q110 70 110 88 Q110 106 90 106" stroke="#A0714F" strokeWidth="5" fill="none" strokeLinecap="round" />
    <ellipse cx="60" cy="54" rx="30" ry="6" fill="#2C1810" />
    <ellipse cx="60" cy="54" rx="28" ry="5" fill="#3D2314" />
    <path d="M48 54 Q60 48 72 54" stroke="rgba(255,245,220,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="60" cy="54" r="5" fill="rgba(255,245,220,0.2)" />
    <path d="M40 80 Q60 75 80 80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
    <path d="M38 92 Q60 87 82 92" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
    <defs>
      <linearGradient id="cupGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#7A4F2C" />
        <stop offset="40%" stopColor="#C4956A" />
        <stop offset="100%" stopColor="#8B5E3C" />
      </linearGradient>
    </defs>
  </svg>
);
 
export default function Hero() {
  const [loaded, setLoaded] = useState(false);
 
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

   return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
 
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        .font-dmsans { font-family: 'DM Sans', sans-serif; }
 
        @keyframes steamRise {
          0%   { opacity: 0; transform: translateY(0) scaleX(1); }
          20%  { opacity: 0.7; }
          80%  { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-60px) scaleX(1.4); }
        }
        .steam-wisp { animation: steamRise 3s ease-in-out infinite; }
 
        @keyframes floatCup {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-12px) rotate(2deg); }
        }
        .float-cup { animation: floatCup 5s ease-in-out infinite; }
 
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up-0 { animation: fadeUp 0.8s ease forwards 0.1s; opacity: 0; }
        .fade-up-1 { animation: fadeUp 0.8s ease forwards 0.3s; opacity: 0; }
        .fade-up-2 { animation: fadeUp 0.8s ease forwards 0.5s; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.8s ease forwards 0.7s; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.8s ease forwards 0.9s; opacity: 0; }
 
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #D4A574 0%, #F5D6A8 40%, #D4A574 60%, #A0714F 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
 
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .rotate-slow { animation: rotateSlow 20s linear infinite; }
 
        @keyframes pulseRing {
          0%   { transform: scale(0.95); opacity: 0.7; }
          70%  { transform: scale(1.05); opacity: 0.3; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
        .pulse-ring { animation: pulseRing 3s ease-in-out infinite; }
 
        .bean-bg {
          background-image: radial-gradient(ellipse 2px 3px at center, rgba(90,50,20,0.3) 0%, transparent 100%);
          background-size: 30px 30px;
        }
 
        @keyframes grainShift {
          0%, 100% { transform: translate(0, 0); }
          10%  { transform: translate(-2%, -3%); }
          30%  { transform: translate(1%, -1%); }
          50%  { transform: translate(-1%, 2%); }
          70%  { transform: translate(2%, 1%); }
          90%  { transform: translate(-1%, -2%); }
        }
        .grain-overlay::before {
          content: '';
          position: absolute; inset: -50%;
          width: 200%; height: 200%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.04;
          animation: grainShift 0.5s steps(1) infinite;
          pointer-events: none;
          z-index: 10;
        }
      `}</style>
 
      <section className="relative min-h-screen overflow-hidden bg-[#1A0F0A] flex flex-col">
 
        {/* Grain overlay */}
        <div className="grain-overlay absolute inset-0 pointer-events-none z-10" />
 
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_40%,#3D1F0D_0%,#1A0F0A_70%)]" />
        <div className="absolute inset-0 bean-bg opacity-40" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0D0704] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0D0704] to-transparent" />
 
        {/* Decorative rings */}
        <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[500px] h-[500px] hidden lg:block">
          <div className="absolute inset-0 rounded-full border border-[#5C3318]/20 pulse-ring" />
          <div className="absolute inset-8 rounded-full border border-[#8B5E3C]/15" />
          <div className="absolute inset-16 rounded-full border border-[#D4A574]/10 rotate-slow" />
        </div>
 
        {/* Decorative coffee icons */}
        <div className="absolute top-16 right-[12%] opacity-10 rotate-slow hidden md:block">
          <Coffee size={64} color="#D4A574" />
        </div>
        <div className="absolute bottom-32 left-[8%] opacity-10 hidden lg:block" style={{ animation: 'rotateSlow 30s linear infinite reverse' }}>
          <Coffee size={48} color="#A0714F" />
        </div>
 
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4A574]/40 to-transparent" />
 
        {/* Navbar */}
        <nav className={`relative z-20 flex items-center justify-between px-6 md:px-12 lg:px-20 py-6 transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2">
            <Coffee size={20} className="text-[#D4A574]" />
            <span className="font-cormorant text-[#F5D6A8] text-xl font-light tracking-widest uppercase">Brew & Craft</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Menu", "Story", "Events", "Contact"].map((item) => (
              <a key={item} href="#" className="font-dmsans text-[#A0714F] text-sm tracking-wider hover:text-[#F5D6A8] transition-colors duration-300 uppercase">
                {item}
              </a>
            ))}
          </div>
          <button className="font-dmsans text-xs tracking-widest uppercase bg-[#D4A574] text-[#1A0F0A] px-5 py-2 hover:bg-[#F5D6A8] transition-colors duration-300 font-medium">
            Reserve
          </button>
        </nav>
 
        {/* Main content */}
        <div className="relative z-20 flex-1 flex items-center">
          <div className="w-full px-6 md:px-12 lg:px-20 py-8 lg:py-0">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 items-center max-w-7xl mx-auto">
 
              {/* Left: Text */}
              <div className="flex flex-col gap-6 order-2 lg:order-1">
 
                <div className="fade-up-0 flex items-center gap-3">
                  <div className="w-8 h-px bg-[#D4A574]" />
                  <span className="font-dmsans text-[#D4A574] text-xs tracking-[0.25em] uppercase">
                    Est. 2009 · Artisan Roasters
                  </span>
                </div>
 
                <div className="fade-up-1">
                  <h1 className="font-playfair leading-[0.95] font-black">
                    <span className="block text-[clamp(3rem,8vw,7rem)] text-[#F5E6D0]">Where</span>
                    <span className="block text-[clamp(3rem,8vw,7rem)] shimmer-text italic">Coffee</span>
                    <span className="block text-[clamp(3rem,8vw,7rem)] text-[#F5E6D0]">Tells a</span>
                    <span className="block text-[clamp(3rem,8vw,7rem)] text-[#C4956A]">Story.</span>
                  </h1>
                </div>
 
                <p className="fade-up-2 font-cormorant text-[#9B7A5A] text-xl md:text-2xl font-light leading-relaxed max-w-md italic">
                  Single-origin beans, hand-roasted with care. Every cup brewed to perfection — because the details make all the difference.
                </p>
 
                <div className="fade-up-3 flex flex-wrap gap-4 items-center mt-2">
                  <button className="group relative overflow-hidden font-dmsans text-sm tracking-widest uppercase bg-[#D4A574] text-[#1A0F0A] px-8 py-4 font-medium hover:bg-[#F5D6A8] transition-all duration-300">
                    <span className="relative z-10 flex items-center gap-2">
                      <Coffee size={14} />
                      Explore Menu
                    </span>
                  </button>
                  <button className="font-dmsans text-sm tracking-widest uppercase border border-[#5C3318] text-[#D4A574] px-8 py-4 hover:border-[#D4A574] transition-all duration-300">
                    Our Story
                  </button>
                </div>
 
                <div className="fade-up-4 flex gap-8 pt-4 border-t border-[#2C1810] mt-2">
                  {[
                    { value: "12+", label: "Origins" },
                    { value: "4.9", label: "Rating", icon: <Star size={10} className="text-[#D4A574] fill-[#D4A574] inline" /> },
                    { value: "15yr", label: "Roasting" },
                  ].map(({ value, label, icon }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <span className="font-playfair text-2xl text-[#D4A574] font-bold">
                        {value} {icon}
                      </span>
                      <span className="font-dmsans text-[#6B4E35] text-xs tracking-widest uppercase">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* Right: Cup */}
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end items-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px]">
 
                  <div className="absolute inset-8 rounded-full bg-[#8B4513]/20 blur-3xl" />
 
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-20">
                    <SteamLine delay={0} x={30} height={50} />
                    <SteamLine delay={0.8} x={50} height={65} />
                    <SteamLine delay={1.6} x={70} height={45} />
                  </div>
 
                  <div className="float-cup w-full h-full px-8 py-12">
                    <CoffeeCupSVG />
                  </div>
                </div>
              </div>
 
            </div>
          </div>
        </div>
 
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#5C3318]/60 to-transparent" />
 
      </section>
    </>
  );
}