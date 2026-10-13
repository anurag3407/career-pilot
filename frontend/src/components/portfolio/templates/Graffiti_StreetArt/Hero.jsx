import React from 'react';
import { SprayCan, Brush, ArrowRight, Star, Zap, Palette } from 'lucide-react';

export default function Hero() {
  // For demo/preview purposes, just show an alert when clicked
  const handleExploreClick = () => {
    alert('🚀 This is a preview! In the full template, this would scroll to your portfolio section.');
  };

  const handleContactClick = () => {
    alert('📧 This is a preview! In the full template, this would scroll to the contact section.');
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      {/* Animated background graffiti splatters */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-80 w-80 animate-pulse rounded-full bg-pink-500 opacity-20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 animate-pulse rounded-full bg-yellow-500 opacity-20 blur-3xl delay-700" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 animate-pulse rounded-full bg-green-500 opacity-10 blur-3xl delay-1000" />
        
        {/* Spray dots / graffiti texture */}
        <div className="absolute left-10 top-20 hidden md:block">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white opacity-30"
              style={{
                left: Math.random() * 100,
                top: Math.random() * 100,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Drip effects */}
      <div className="absolute left-1/4 top-0 h-24 w-1 bg-pink-400 opacity-60" />
      <div className="absolute left-1/4 top-6 h-16 w-1 bg-pink-400 opacity-40" />
      <div className="absolute right-1/3 top-0 h-32 w-0.5 bg-yellow-400 opacity-60" />
      <div className="absolute right-1/3 top-8 h-20 w-0.5 bg-yellow-400 opacity-40" />

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center md:px-12">
        {/* Animated badge */}
        <div className="animate-bounce rounded-full border-2 border-pink-400 bg-black/50 px-6 py-2 backdrop-blur-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-400 md:text-sm">
            🎨 StreetArt Collective
          </span>
        </div>

        {/* Graffiti-styled heading */}
        <h1 className="mt-8 font-black uppercase leading-[1.1] tracking-tighter">
          <span className="block text-5xl text-white drop-shadow-lg md:text-7xl lg:text-8xl">
            CREATE YOUR
          </span>
          <span className="relative mt-4 inline-block">
            <span className="absolute inset-0 -rotate-3 transform bg-gradient-to-r from-pink-500 via-yellow-500 to-green-500 bg-clip-text text-5xl text-transparent blur-sm md:text-7xl lg:text-8xl">
              MASTERPIECE
            </span>
            <span className="relative -rotate-3 bg-gradient-to-r from-pink-500 via-yellow-500 to-green-500 bg-clip-text text-5xl font-black text-transparent md:text-7xl lg:text-8xl">
              MASTERPIECE
            </span>
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-8 max-w-2xl text-base text-gray-200 md:text-lg lg:text-xl">
          Bold colors, authentic street energy, and unforgettable design — 
          your portfolio starts here. Let your creativity run wild.
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          {/* Primary CTA */}
          <button type="button"
            onClick={handleExploreClick}
            className="group relative inline-flex cursor-pointer items-center overflow-hidden rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 px-8 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/50"
            aria-label="Explore portfolio work"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Creating <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          
          {/* Secondary CTA */}
          <button type="button"
            onClick={handleContactClick}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-white/30 bg-transparent px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-pink-400 hover:bg-white/10"
            aria-label="Contact me"
          >
            <Brush className="h-5 w-5" />
            Contact Me
          </button>
        </div>

        {/* Stats with icons */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-200">500+ Artists</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-gray-200">10k+ Creations</span>
          </div>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-pink-400" />
            <span className="text-sm text-gray-200">Street Certified</span>
          </div>
        </div>

        {/* Decorative spray can */}
        <div className="absolute bottom-8 left-8 opacity-50 md:opacity-100">
          <SprayCan className="h-16 w-16 rotate-12 text-pink-400 drop-shadow-lg" />
        </div>
      </div>

      {/* Bottom border tape effect */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 via-yellow-500 to-green-500" />
    </section>
  );
}