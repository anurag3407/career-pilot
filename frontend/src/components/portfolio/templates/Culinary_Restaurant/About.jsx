import React, { useState } from 'react';
import {
  ChefHat,
  Award,
  Flame,
  Leaf,
  Star,
  UtensilsCrossed,
  Globe,
  Heart,
} from 'lucide-react';

const CHEF_STORY = {
  name: 'Alexandre Moreau',
  title: 'Executive Chef & Founder',
  tagline: 'Born in Lyon. Perfected in Paris. Celebrated Worldwide.',
  bio1:
    'With over two decades behind the pass, Alexandre Moreau has transformed simple ingredients into extraordinary experiences. Trained under three Michelin-starred mentors across France and Japan, his philosophy marries classical French technique with fearless global inspiration.',
  bio2:
    'Every plate that leaves our kitchen carries the weight of tradition and the spark of creativity. A promise to honour the seasons, respect the craft, and never stop pushing the boundary of what fine dining can be.',
  since: '2004',
  restaurants: '3',
  michelin: '2',
};

const MILESTONES = [
  { year: '2004', label: 'First kitchen, Lyon' },
  { year: '2009', label: 'Michelin Star #1' },
  { year: '2014', label: 'Opened Moreau Paris' },
  { year: '2019', label: 'Michelin Star #2' },
  { year: '2023', label: 'Global expansion' },
];

const VALUES = [
  {
    icon: Leaf,
    title: 'Farm to Table',
    desc: 'Every ingredient is sourced within 100 miles, partnering with local farmers who share our obsession with quality.',
  },
  {
    icon: Flame,
    title: 'Artisan Craft',
    desc: 'We still hand-make every pasta, ferment every vinegar, and cure every protein in-house. No shortcuts, ever.',
  },
  {
    icon: Globe,
    title: 'Global Palate',
    desc: 'Seasonal menus pull inspiration from Tokyo, Mexico City, Marrakesh. Always rooted, never predictable.',
  },
  {
    icon: Heart,
    title: 'Guest First',
    desc: 'Hospitality is our highest ingredient. Every detail, from napkin fold to farewell, is crafted to move you.',
  },
];

const STATS = [
  { icon: Award, value: '2', label: 'Michelin Stars' },
  { icon: UtensilsCrossed, value: '20+', label: 'Years of Mastery' },
  { icon: Star, value: '4.9', label: 'Guest Rating' },
  { icon: ChefHat, value: '38', label: 'Brigade Members' },
];

function GoldDivider({ icon: Icon }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <div className="h-px w-12 bg-[#c5a880]" />
      {Icon && <Icon className="w-5 h-5 text-[#c5a880]" />}
      <div className="h-px w-12 bg-[#c5a880]" />
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <span className="block text-[10px] font-medium tracking-[0.25em] uppercase text-[#c5a880] mb-4">
      {children}
    </span>
  );
}

export default function About() {
  const [activeValue, setActiveValue] = useState(0);

  return (
    <section className="w-full bg-[#0a0a0a] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 border border-[#c5a880]/20 pointer-events-none" />
            <div className="absolute -inset-8 border border-[#c5a880]/10 pointer-events-none" />

            <div className="relative overflow-hidden bg-[#111111] border border-[#222222]">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=900"
                alt={CHEF_STORY.name || "Profile Avatar"}
                className="w-full h-[520px] object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] mb-2">
                  Executive Chef & Founder
                </p>
                <h3 className="font-serif text-3xl font-light tracking-wide text-white">
                  {CHEF_STORY.name}
                </h3>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-[#c5a880] text-[#0a0a0a] px-6 py-4 text-center shadow-2xl">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1">Crafting since</p>
              <p className="font-serif text-3xl font-bold leading-none">{CHEF_STORY.since}</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <GoldDivider icon={ChefHat} />
            <Eyebrow>The Chef Behind the Craft</Eyebrow>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-wide mb-4">
              A Story Told Through Food
            </h2>

            <p className="text-[#c5a880] font-light italic text-lg mb-8 border-l-2 border-[#c5a880]/40 pl-5 leading-relaxed">
              "{CHEF_STORY.tagline}"
            </p>

            <p className="text-gray-400 font-light leading-relaxed mb-6 text-[15px]">
              {CHEF_STORY.bio1}
            </p>
            <p className="text-gray-400 font-light leading-relaxed mb-10 text-[15px]">
              {CHEF_STORY.bio2}
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Michelin Stars', value: CHEF_STORY.michelin },
                { label: 'Restaurants', value: CHEF_STORY.restaurants },
                { label: 'Years Mastery', value: '20+' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="border border-[#222222] hover:border-[#c5a880]/50 transition-colors duration-300 p-4 text-center"
                >
                  <p className="font-serif text-3xl text-[#c5a880] font-light mb-1">{value}</p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#1a1a1a]">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="group flex flex-col items-center justify-center gap-3 py-12 px-6 hover:bg-[#111111] transition-colors duration-300"
              >
                <Icon className="w-6 h-6 text-[#c5a880] group-hover:scale-110 transition-transform duration-300" />
                <p className="font-serif text-4xl font-light text-white">{value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <GoldDivider />
          <Eyebrow>The Journey</Eyebrow>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-wide">
            Milestones of Excellence
          </h2>
        </div>

        <div className="relative">
          <div className="absolute top-5 left-0 right-0 h-px bg-[#1e1e1e] hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
            {MILESTONES.map(({ year, label }, i) => (
              <div key={year} className="flex flex-col items-center text-center gap-4 relative">
                <div className="relative z-10 w-10 h-10 rounded-full border-2 border-[#c5a880] bg-[#0a0a0a] flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#c5a880]" />
                </div>

                <div>
                  <p className="font-serif text-2xl text-[#c5a880] font-light mb-1">{year}</p>
                  <p className="text-gray-400 text-sm font-light leading-snug">{label}</p>
                </div>

                {/* gradient connector between dots, desktop only */}
                {i < MILESTONES.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[calc(50%+20px)] right-[-50%] h-px bg-gradient-to-r from-[#c5a880]/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#0d0d0d] border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="text-center mb-16">
            <GoldDivider />
            <Eyebrow>Our Philosophy</Eyebrow>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-wide">
              What Guides Every Dish
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
             <button
                key={title}
                onClick={() => setActiveValue(i)}
                aria-pressed={activeValue === i}
                className={`group text-left p-8 border transition-all duration-500 ${
                  activeValue === i
                    ? 'border-[#c5a880]/60 bg-[#111111]'
                    : 'border-[#1e1e1e] bg-transparent hover:border-[#c5a880]/30 hover:bg-[#0f0f0f]'
                }`}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center mb-6 border transition-colors duration-500 ${
                    activeValue === i
                      ? 'border-[#c5a880] bg-[#c5a880]/10'
                      : 'border-[#2a2a2a] group-hover:border-[#c5a880]/50'
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#c5a880]" />
                </div>

                <h3
                  className={`font-serif text-xl mb-3 font-light tracking-wide transition-colors duration-300 ${
                    activeValue === i ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  {title}
                </h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed">{desc}</p>

                <div
                  className={`mt-6 h-px bg-[#c5a880] transition-all duration-500 ${
                    activeValue === i ? 'w-full' : 'w-0'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #c5a880 0px,
              #c5a880 1px,
              transparent 1px,
              transparent 60px
            )`,
          }}
        />

        <div className="absolute top-8 left-1/2 -translate-x-1/2 font-serif text-[200px] leading-none text-[#c5a880]/5 select-none pointer-events-none">
          "
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <GoldDivider icon={ChefHat} />
          <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl text-white font-light leading-relaxed tracking-wide mb-10">
            "Cooking is not a profession. It is a devotion. Every flame, every knife stroke,
            every plated moment is an act of love for the person sitting at the table."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-[#c5a880]/50" />
            <p className="text-[#c5a880] text-sm tracking-[0.2em] uppercase font-medium">
              {CHEF_STORY.name}
            </p>
            <div className="h-px w-16 bg-[#c5a880]/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
