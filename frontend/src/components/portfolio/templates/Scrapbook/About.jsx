import { MapPin, Twitter, Linkedin, Github, Mail, Check } from "lucide-react";

const SAMPLE_DATA = {
  name: "Alex Jordan",
  role: "Full-Stack Developer",
  bio: [
    "Hey! I'm a creative developer who loves building things that live on the internet. I believe great software is equal parts logic and magic.",
    "When I'm not writing code, you'll catch me hiking trails, sketching in notebooks, or hunting down the best coffee in the city ☕",
  ],
  quote: '"code is just organized chaos" 🎨',
  location: "San Francisco, CA",
  locationSub: "Based on the west coast ☀️",
  photoLabel: "summer '24 🌻",
  facts: [
    "Built my first website at age 12 — a terrible fan page for a video game 🎮",
    "Open source contributor with 300+ GitHub stars across my projects ⭐",
    "I journal every single day — analog, pen on paper 📓",
  ],
  skills: [
    { label: "React", color: "blue" },
    { label: "Node.js", color: "green" },
    { label: "TypeScript", color: "amber" },
    { label: "Figma", color: "pink" },
    { label: "PostgreSQL", color: "blue" },
    { label: "Docker", color: "green" },
    { label: "GraphQL", color: "amber" },
    { label: "Tailwind", color: "pink" },
    { label: "Next.js", color: "blue" },
  ],
  links: [
    { icon: "twitter", label: "@alex.dev", href: "#" },
    { icon: "linkedin", label: "linkedin.com/in/alexjordan", href: "#" },
    { icon: "github", label: "github.com/alexjordan", href: "#" },
  ],
};

/* ─── sub-components ──────────────────────────────────────── */

function Tape({ className = "" }) {
  return (
    <div
      className={`absolute bg-yellow-200/55 border border-yellow-400/30 rounded-sm z-10 ${className}`}
    />
  );
}

function PolaroidAvatar({ label }) {
  return (
    <div className="relative animate-[popIn_0.4s_ease_both]">
      <Tape className="w-16 h-5 -top-2.5 left-1/2 -translate-x-1/2 -rotate-2" />
      <div
        className="bg-white p-3.5 pb-11 shadow-[3px_4px_12px_rgba(0,0,0,0.18),-1px_-1px_0_rgba(0,0,0,0.06)]
                   rotate-[2.2deg] hover:rotate-0 hover:scale-[1.02] transition-transform duration-300"
      >
        {/* illustrated avatar */}
        <div className="w-full aspect-square bg-gradient-to-br from-[#dcc5a4] via-[#c4a882] to-[#b89870] flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="w-3/5 h-3/5 opacity-50"
          >
            <circle cx="50" cy="38" r="22" fill="#c4a882" stroke="#a07850" strokeWidth="2" />
            <ellipse cx="50" cy="85" rx="30" ry="18" fill="#c4a882" stroke="#a07850" strokeWidth="2" />
            <circle cx="43" cy="36" r="3" fill="#7a5c40" />
            <circle cx="57" cy="36" r="3" fill="#7a5c40" />
            <path d="M44 46 Q50 52 56 46" stroke="#7a5c40" strokeWidth="2" strokeLinecap="round" />
            <path d="M30 30 Q35 18 50 20 Q65 18 70 30" stroke="#8b6340" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="font-[Caveat,cursive] text-xl text-[#4a3728] text-center mt-2.5 -rotate-[0.5deg]">
          {label}
        </p>
      </div>
    </div>
  );
}

function SkillTag({ label, color }) {
  const palette = {
    pink:  "bg-pink-50   border-pink-500   text-pink-900",
    blue:  "bg-blue-50   border-blue-600   text-blue-900",
    green: "bg-green-50  border-green-600  text-green-900",
    amber: "bg-amber-50  border-amber-600  text-amber-900",
  };
  return (
    <span
      className={`font-[Caveat,cursive] font-semibold text-[15px] px-3 py-1 rounded-full border-[1.5px]
                  transition-transform duration-200 hover:scale-110 hover:-rotate-1 cursor-default
                  ${palette[color] ?? palette.blue}`}
    >
      {label}
    </span>
  );
}

function SocialIcon({ icon }) {
  const size = 16;
  if (icon === "twitter")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.4 5.4 3.9 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    );
  if (icon === "linkedin")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" fill="white" />
        <circle cx="4" cy="4" r="2" fill="white" />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

const iconBg = {
  twitter: "bg-[#1da1f2]",
  linkedin: "bg-[#0a66c2]",
  github: "bg-[#333]",
};

/* ─── main component ──────────────────────────────────────── */

export default function About({ data = SAMPLE_DATA }) {
  const {
    name,
    role,
    bio,
    quote,
    location,
    locationSub,
    photoLabel,
    facts,
    skills,
    links,
  } = data;

  return (
    <>
      {/* Google Fonts — scrapbook handwriting stack */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Patrick+Hand&family=Permanent+Marker&display=swap');

        .sb-body  { font-family: 'Patrick Hand', cursive; }
        .sb-hand  { font-family: 'Caveat', cursive; }
        .sb-marker{ font-family: 'Permanent Marker', cursive; }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; }
        }
        .anim-1 { animation: popIn 0.4s ease both 0.00s; }
        .anim-2 { animation: popIn 0.4s ease both 0.07s; }
        .anim-3 { animation: popIn 0.4s ease both 0.14s; }
        .anim-4 { animation: popIn 0.4s ease both 0.21s; }
        .anim-5 { animation: popIn 0.4s ease both 0.28s; }
        .anim-6 { animation: popIn 0.4s ease both 0.35s; }

        .sb-highlight { background: rgba(255,225,80,0.60); padding: 1px 3px; }
      `}</style>

      {/* ── page wrapper ── */}
      <section
        className="sb-body relative min-h-screen bg-[#f5efe6] overflow-x-hidden"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(180,160,130,0.15) 27px, rgba(180,160,130,0.15) 28px),
            repeating-linear-gradient(90deg, transparent, transparent 27px, rgba(180,160,130,0.10) 27px, rgba(180,160,130,0.10) 28px)
          `,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

          {/* ── heading ── */}
          <div className="text-center mb-12 relative">
            <div className="inline-block mb-2 w-20 h-5 bg-yellow-200/55 border border-yellow-400/30 rounded-sm -rotate-3" />
            <h1 className="sb-marker text-5xl sm:text-6xl lg:text-7xl text-[#2d1f0e] -rotate-[1.5deg] inline-block leading-none">
              About Me ✂
            </h1>
            <div className="h-1 w-[70%] bg-[#e05a3a] mx-auto mt-2 rotate-[0.5deg] -skew-x-6 rounded" />
          </div>

          {/* ── two-column grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

            {/* ── LEFT column ── */}
            <div className="flex flex-col gap-7">

              {/* polaroid */}
              <div className="anim-1">
                <PolaroidAvatar label={photoLabel} />
              </div>

              {/* location */}
              <div
                className="anim-4 relative bg-[#e8eaf6] border-[1.5px] border-[#9fa8da] rounded-[3px] p-5
                           flex items-center gap-4 shadow-[2px_3px_8px_rgba(0,0,0,0.10)]
                           rotate-[1.5deg] hover:rotate-0 transition-transform duration-300"
              >
                <div className="absolute w-12 h-[18px] bg-[rgba(200,210,255,0.6)] border border-[rgba(100,120,220,0.3)] rounded-sm -top-2 left-4 rotate-2" />
                {/* map pin */}
                <div className="shrink-0 w-11 h-11 bg-[#3f51b5] rounded-[50%_50%_50%_0] -rotate-45 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full rotate-45" />
                </div>
                <div className="sb-body text-[15px] text-[#283593]">
                  <span className="sb-hand font-bold text-lg text-[#1a237e] block">{location}</span>
                  {locationSub}
                </div>
              </div>

              {/* connect */}
              <div
                className="anim-5 relative bg-[#fff8e1] border-[1.5px] border-[#f0cc72] rounded-[3px] p-5
                           shadow-[2px_3px_8px_rgba(0,0,0,0.10)]
                           -rotate-[1.8deg] hover:rotate-0 transition-transform duration-300"
              >
                <div className="absolute w-12 h-[18px] bg-yellow-200/55 border border-yellow-400/30 rounded-sm -top-2 right-5 -rotate-2" />
                <p className="sb-hand font-bold text-xl text-[#5d3a00] mb-3">✉ Let's connect!</p>
                <div className="flex flex-col gap-2.5">
                  {links.map(({ icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      className="flex items-center gap-2.5 sb-body text-[15px] text-[#4a2f00]
                                 no-underline hover:translate-x-1 transition-transform duration-200"
                    >
                      <span className={`w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 ${iconBg[icon]}`}>
                        <SocialIcon icon={icon} />
                      </span>
                      {label}
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* ── RIGHT column ── */}
            <div className="flex flex-col gap-7">

              {/* main info card */}
              <div
                className="anim-2 relative bg-[#fffdf5] border-[1.5px] border-[#d4b896] rounded-[3px] p-7
                           shadow-[2px_3px_8px_rgba(0,0,0,0.12)]
                           -rotate-1 hover:rotate-0 transition-transform duration-300"
              >
                <div className="absolute w-12 h-[18px] bg-yellow-200/55 border border-yellow-400/30 rounded-sm -top-2 right-6 rotate-2" />
                {/* corner deco */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-[3px] border-r-[3px] border-[#c9a06a] opacity-50" />

                <h2 className="sb-marker text-3xl sm:text-4xl text-[#2d1f0e] leading-tight mb-1.5">
                  {name}
                </h2>
                <span
                  className="inline-block bg-[#e05a3a] text-[#fff5f0] sb-hand text-base
                             px-3.5 py-0.5 rounded-sm -rotate-[0.8deg] mb-5"
                >
                  ✦ {role}
                </span>
                {bio.map((p, i) => (
                  <p key={i} className="sb-body text-[16px] text-[#4a3828] leading-relaxed mb-4 last:mb-5">
                    {i === 0 ? (
                      <>
                        Hey! I'm a{" "}
                        <span className="sb-highlight">creative developer</span>{" "}
                        who loves building things that live on the internet. I believe great software
                        is equal parts logic and{" "}
                        <span className="sb-highlight">magic</span>.
                      </>
                    ) : (
                      p
                    )}
                  </p>
                ))}
                <p className="sb-hand text-lg text-[#e05a3a] -rotate-[0.5deg]">
                  — {quote}
                </p>
              </div>

              {/* fun facts */}
              <div
                className="anim-3 relative bg-[#e8f5e9] border-[1.5px] border-[#a5c8a1] rounded-[3px] p-5
                           shadow-[2px_3px_8px_rgba(0,0,0,0.10)]
                           rotate-[1.2deg] hover:rotate-0 transition-transform duration-300"
              >
                <div className="absolute w-12 h-[18px] bg-[rgba(180,230,180,0.6)] border border-[rgba(100,180,100,0.35)] rounded-sm -top-2 left-4 -rotate-2" />
                <p className="sb-hand font-bold text-xl text-[#2d5a27] mb-3 flex items-center gap-2">
                  📌 Fun facts about me
                </p>
                <ul className="flex flex-col gap-2.5">
                  {facts.map((fact, i) => {
                    const colors = ["bg-[#e05a3a]", "bg-[#3f51b5]", "bg-[#388e3c]"];
                    return (
                      <li key={i} className="flex items-start gap-2.5 sb-body text-[15px] text-[#2d4a2a]">
                        <span
                          className={`shrink-0 mt-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center ${colors[i % colors.length]}`}
                        >
                          <Check size={10} color="white" strokeWidth={3} />
                        </span>
                        {fact}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* skills */}
              <div
                className="anim-6 relative bg-[#fce4ec] border-[1.5px] border-[#e8a4b8] rounded-[3px] p-5
                           shadow-[2px_3px_8px_rgba(0,0,0,0.10)]
                           -rotate-[0.8deg] hover:rotate-0 transition-transform duration-300"
              >
                <div className="absolute w-12 h-[18px] bg-[rgba(255,180,200,0.5)] border border-[rgba(220,100,140,0.3)] rounded-sm -top-2 right-5 rotate-[1.5deg]" />
                <p className="sb-hand font-bold text-xl text-[#880e4f] mb-3">🎨 My toolkit</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map(({ label, color }) => (
                    <SkillTag key={label} label={label} color={color} />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* bottom tape */}
          <div className="w-28 h-6 mx-auto mt-10 bg-yellow-200/55 border border-yellow-400/30 rounded-sm -rotate-1" />
        </div>
      </section>
    </>
  );
}
