import React, { useState } from 'react';
import { Heart, Camera, MapPin, Calendar } from 'lucide-react';

const polaroids = [
  {
    id: 1,
    title: "Summer Picnic",
    caption: "golden afternoons ☀️",
    date: "July 2023",
    location: "Central Park",
    rotate: "-rotate-3",
    bg: "bg-amber-50",
    tape: "bg-red-300",
    tapeRotate: "rotate-12",
    emoji: "🌻",
    color: "text-amber-700",
  },
  {
    id: 2,
    title: "Road Trip!!",
    caption: "best adventure ever",
    date: "Aug 2023",
    location: "Route 66",
    rotate: "rotate-2",
    bg: "bg-sky-50",
    tape: "bg-blue-300",
    tapeRotate: "-rotate-6",
    emoji: "🚗",
    color: "text-sky-700",
  },
  {
    id: 3,
    title: "Birthday Bash",
    caption: "cake + chaos = love",
    date: "Sep 2023",
    location: "Home Sweet Home",
    rotate: "-rotate-1",
    bg: "bg-pink-50",
    tape: "bg-pink-300",
    tapeRotate: "rotate-3",
    emoji: "🎂",
    color: "text-pink-700",
  },
  {
    id: 4,
    title: "Beach Day",
    caption: "salty hair, don't care",
    date: "Oct 2023",
    location: "Malibu Beach",
    rotate: "rotate-3",
    bg: "bg-teal-50",
    tape: "bg-teal-300",
    tapeRotate: "-rotate-12",
    emoji: "🏖️",
    color: "text-teal-700",
  },
  {
    id: 5,
    title: "Winter Walk",
    caption: "hot cocoa weather ❄️",
    date: "Dec 2023",
    location: "City Streets",
    rotate: "-rotate-2",
    bg: "bg-violet-50",
    tape: "bg-violet-300",
    tapeRotate: "rotate-6",
    emoji: "☃️",
    color: "text-violet-700",
  },
  {
    id: 6,
    title: "Garden Party",
    caption: "flowers everywhere 🌸",
    date: "May 2024",
    location: "Grandma's Garden",
    rotate: "rotate-1",
    bg: "bg-lime-50",
    tape: "bg-lime-300",
    tapeRotate: "-rotate-3",
    emoji: "🌺",
    color: "text-lime-700",
  },
];

export default function MemoryPolaroids() {
  const [liked, setLiked] = useState({});
  const [hovered, setHovered] = useState(null);

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      className="w-full min-h-screen py-16 px-4 sm:px-8 relative overflow-hidden"
      style={{ backgroundColor: '#fdf6e3', fontFamily: "'Georgia', serif" }}
    >
      <GoogleFontLoader />

      {/* Background texture dots */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #c4a882 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Decorative corner stickers */}
      <div className="absolute top-6 left-6 text-3xl opacity-40 rotate-12">📌</div>
      <div className="absolute top-6 right-6 text-3xl opacity-40 -rotate-12">📌</div>
      <div className="absolute bottom-6 left-6 text-2xl opacity-30 -rotate-6">✂️</div>
      <div className="absolute bottom-6 right-6 text-2xl opacity-30 rotate-6">🎀</div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <Camera size={20} className="text-amber-600" />
            <span
              className="text-xs tracking-[0.3em] uppercase text-amber-700 font-medium"
              style={{ fontFamily: 'sans-serif' }}
            >
              Memory Lane
            </span>
            <Camera size={20} className="text-amber-600" />
          </div>

          <h2
            className="text-5xl sm:text-6xl font-bold text-stone-800 leading-tight mb-3"
            style={{ fontFamily: "'Caveat', cursive, Georgia, serif" }}
          >
            Our Polaroid Wall
          </h2>

          {/* Zigzag underline */}
          <svg viewBox="0 0 200 12" className="mx-auto w-48 mb-4" xmlns="http://www.w3.org/2000/svg">
            <polyline
              points="0,8 20,2 40,8 60,2 80,8 100,2 120,8 140,2 160,8 180,2 200,8"
              fill="none"
              stroke="#d97706"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          <p
            className="text-stone-500 text-base max-w-sm mx-auto leading-relaxed"
            style={{ fontFamily: 'sans-serif' }}
          >
            snippets of joy, laughter & love — all in one place 🤍
          </p>
        </div>

        {/* Polaroids Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {polaroids.map((p) => (
            <div
              key={p.id}
              className={`relative ${p.rotate} transition-all duration-300 cursor-pointer
                ${hovered === p.id ? 'scale-105 rotate-0 z-20 shadow-2xl' : 'hover:scale-102 z-10'}`}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ filter: 'drop-shadow(3px 6px 12px rgba(0,0,0,0.18))' }}
            >
              {/* Washi tape top */}
              <div
                className={`absolute -top-4 left-1/2 -translate-x-1/2 w-14 h-6 ${p.tape} ${p.tapeRotate} rounded-sm opacity-80 z-10`}
                style={{ mixBlendMode: 'multiply' }}
              />

              {/* Polaroid card */}
              <div className={`${p.bg} p-3 pb-10 rounded-sm border border-stone-200`}>

                {/* Photo area */}
                <div
                  className="w-full aspect-square rounded-sm flex items-center justify-center relative overflow-hidden mb-1"
                  style={{ backgroundColor: '#e8dcc8' }}
                >
                  {/* Photo texture */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 4px,
                        rgba(0,0,0,0.05) 4px,
                        rgba(0,0,0,0.05) 5px
                      )`,
                    }}
                  />

                  {/* Emoji illustration */}
                  <div className="text-7xl sm:text-8xl select-none" style={{ lineHeight: 1 }}>
                    {p.emoji}
                  </div>

                  {/* Corner date stamp */}
                  <div
                    className="absolute bottom-2 right-2 bg-white/70 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1"
                    style={{ fontFamily: 'sans-serif' }}
                  >
                    <Calendar size={9} className="text-stone-500" />
                    <span className="text-stone-600 text-[10px]">{p.date}</span>
                  </div>

                  {/* Location stamp */}
                  <div
                    className="absolute top-2 left-2 bg-white/70 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1"
                    style={{ fontFamily: 'sans-serif' }}
                  >
                    <MapPin size={9} className="text-stone-500" />
                    <span className="text-stone-600 text-[10px]">{p.location}</span>
                  </div>
                </div>

                {/* Caption area */}
                <div className="px-1 pt-3 pb-1">
                  <p
                    className={`text-xl font-bold ${p.color} leading-tight mb-0.5`}
                    style={{ fontFamily: "'Caveat', cursive, Georgia, serif" }}
                  >
                    {p.title}
                  </p>
                  <p
                    className="text-stone-500 text-sm italic"
                    style={{ fontFamily: "'Caveat', cursive, Georgia, serif" }}
                  >
                    {p.caption}
                  </p>
                </div>
              </div>

              {/* Like button */}
              <button
                onClick={() => toggleLike(p.id)}
                className="absolute bottom-2 right-3 transition-transform duration-150 hover:scale-125 active:scale-90"
                aria-label="Like"
              >
                <Heart
                  size={18}
                  className={liked[p.id] ? 'text-red-500 fill-red-500' : 'text-stone-400'}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="text-center mt-16">
          <div
            className="inline-block bg-white/60 backdrop-blur border border-stone-200 rounded-2xl px-8 py-4"
            style={{ boxShadow: '2px 3px 12px rgba(0,0,0,0.08)' }}
          >
            <p
              className="text-stone-600 text-lg"
              style={{ fontFamily: "'Caveat', cursive, Georgia, serif" }}
            >
              "collect moments, not things" 📷
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

function GoogleFontLoader() {
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
}
