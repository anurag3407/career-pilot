import React, { useState, useEffect, useRef } from "react";
import { Download, ExternalLink, Play, Pause, Music, Disc3, Radio } from "lucide-react";

const TRACKS = [
  { id: "01", title: "Open Source Remix",  genre: "Full Stack Dev",    duration: "3:42" },
  { id: "02", title: "React Rhythms",      genre: "Frontend Lead",     duration: "4:15" },
  { id: "03", title: "API Grooves",        genre: "Backend Architect", duration: "2:58" },
];

// ── Isolated disc component — only THIS re-renders on each RAF frame ──
// Prevents full Hero tree from re-rendering ~60 times/sec
const VinylDisc = ({ playing }) => {
  const [angle, setAngle] = useState(0);
  const rafRef            = useRef(null);
  const prevTime          = useRef(null);

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      prevTime.current = null;
      return;
    }
    const step = (ts) => {
      if (prevTime.current !== null)
        setAngle(a => (a + (ts - prevTime.current) * 0.04) % 360);
      prevTime.current = ts;
      rafRef.current   = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  return (
    <div
      className="absolute inset-0 rounded-full bg-zinc-900"
      style={{
        transform: `rotate(${angle}deg)`,
        boxShadow: "0 0 60px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      {/* Groove rings */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            inset: `${8 + i * 7}px`,
            border: `1px solid ${i % 3 === 0
              ? "rgba(255,255,255,0.06)"
              : "rgba(255,255,255,0.025)"}`,
          }}
        />
      ))}

      {/* Iridescent sheen */}
      <div
        className="absolute inset-0 rounded-full opacity-[0.07]"
        style={{
          background: "conic-gradient(from 0deg, #ff0000, #ff8800, #ffff00, #00ff00, #0000ff, #8800ff, #ff0000)",
        }}
      />

      {/* Center label */}
      <div
        className="absolute inset-[36%] rounded-full flex flex-col items-center justify-center"
        style={{
          background: "linear-gradient(145deg, #7f1d1d, #991b1b)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        <div className="absolute inset-2 rounded-full border border-red-700/30" />
        <div className="absolute inset-4 rounded-full border border-red-700/15" />
        <p className="text-amber-300 text-sm font-black leading-none z-10">YN</p>
        <p className="text-red-300/60 text-[7px] font-mono tracking-widest mt-1 z-10">VOL.I</p>
        {/* Spindle hole */}
        <div className="absolute w-[16%] h-[16%] rounded-full bg-zinc-950" />
      </div>
    </div>
  );
};

export default function Hero({
  resumeUrl    = "#",
  portfolioUrl = "#",
  githubUrl    = "https://github.com",
  linkedinUrl  = "https://linkedin.com",
  twitterUrl   = "https://twitter.com",
}) {
  const [playing, setPlaying] = useState(true);
  const [activeTrack, setTrack] = useState(0);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const currentYear = new Date().getFullYear();

  const SOCIALS = [
    { label: "GitHub",   href: githubUrl   },
    { label: "LinkedIn", href: linkedinUrl },
    { label: "Twitter",  href: twitterUrl  },
  ];

  return (
    <section className="relative w-full min-h-screen bg-zinc-950 overflow-hidden">

      {/* ── Red ambient left glow ── */}
      <div className="absolute -left-40 top-1/3 w-96 h-96 bg-red-800 rounded-full opacity-20 blur-3xl pointer-events-none" />

      {/* ── Amber ambient right glow ── */}
      <div className="absolute -right-20 bottom-20 w-80 h-80 bg-amber-800 rounded-full opacity-15 blur-3xl pointer-events-none" />

      {/* ── TOP LABEL BAR ── */}
      <div className="relative z-10 flex items-center gap-3 px-8 md:px-16 pt-8">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <div className="h-px flex-1 bg-gradient-to-r from-red-900 via-red-900/40 to-transparent" />
        <span className="text-amber-700 text-xs font-mono tracking-widest uppercase">
          Side A · Portfolio Record {currentYear}
        </span>
        <div className="h-px w-12 bg-amber-900/50" />
      </div>

      {/* ── MAIN GRID ── */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 px-8 md:px-16 py-12 items-center min-h-[90vh]">

        {/* ══ COL 1: IDENTITY ══ */}
        <div
          className={`flex flex-col gap-8 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* NOW PLAYING badge */}
          <div className="flex items-center gap-2 w-fit bg-red-950 border border-red-800 rounded-full px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <Music size={12} className="text-red-400" />
            <span className="text-red-300 text-xs font-mono tracking-widest uppercase">
              Now Playing
            </span>
          </div>

          {/* NAME */}
          <div>
            <p className="text-amber-500 text-xs font-mono tracking-[0.3em] uppercase mb-3">
              — Track 01, Side A
            </p>
            <h1
              className="font-black leading-none tracking-tight text-white"
              style={{ fontSize: "clamp(3rem,7vw,5.5rem)" }}
            >
              Your
              <br />
              <span className="text-red-500">Name</span>
            </h1>
            <div className="flex items-center gap-3 mt-4">
              <span className="w-8 h-px bg-amber-600" />
              <p className="text-zinc-400 text-xs font-mono tracking-widest uppercase">
                Full Stack Developer
              </p>
            </div>
          </div>

          {/* BIO */}
          <p className="text-zinc-300 text-sm leading-relaxed max-w-sm">
            Crafting digital experiences with the warmth of analog.
            Every project is a record worth playing — each commit,
            a groove pressed into the vinyl of the web.
          </p>

          {/* CTAs — wired up with props */}
          <div className="flex flex-wrap gap-3">
            <a
              href={resumeUrl}
              download
              className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-900/50"
            >
              <Download size={15} />
              Download Resume
            </a>
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-zinc-700 hover:border-amber-600 text-zinc-300 hover:text-amber-400 text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300"
            >
              <ExternalLink size={15} />
              View Work
            </a>
          </div>

          {/* STATS */}
          <div
            className={`grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800 transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {[
              { v: "3+",  l: "Years Exp."  },
              { v: "40+", l: "Projects"    },
              { v: "12+", l: "Open Source" },
            ].map(s => (
              <div key={s.l}>
                <p className="text-white text-3xl font-black">{s.v}</p>
                <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase mt-1">
                  {s.l}
                </p>
              </div>
            ))}
          </div>

          {/* TECH TAGS */}
          <div
            className={`flex flex-wrap gap-2 transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {["React", "Node.js", "TypeScript", "MongoDB", "Tailwind"].map(tag => (
              <span
                key={tag}
                className="border border-zinc-800 text-zinc-500 text-xs font-mono px-3 py-1 rounded-full tracking-wider uppercase hover:border-red-800 hover:text-red-400 transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ══ COL 2: VINYL RECORD ══ */}
        <div
          className={`flex flex-col items-center gap-6 transition-all duration-700 delay-150 ${
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          {/* RECORD WRAPPER */}
          <div className="relative">
            {/* Glow ring behind disc */}
            <div className="absolute inset-0 rounded-full bg-red-800/25 blur-2xl scale-110 pointer-events-none" />

            {/* Disc container */}
            <div
              className="relative rounded-full overflow-hidden"
              style={{
                width:  "clamp(240px,32vw,340px)",
                height: "clamp(240px,32vw,340px)",
              }}
            >
              {/* Isolated spinning disc — only this re-renders on RAF */}
              <VinylDisc playing={playing} />
            </div>

            {/* TONEARM — static overlay, not part of spinning disc */}
            <div
              className="absolute top-0 right-0 pointer-events-none"
              style={{ transformOrigin: "top right", transform: "rotate(-20deg)" }}
            >
              <div className="w-1.5 h-24 bg-gradient-to-b from-zinc-400 to-zinc-600 rounded-full ml-auto" />
              <div
                className="w-1 h-8 bg-zinc-600 rounded-full ml-2 mt-0.5"
                style={{ transform: "rotate(25deg)", transformOrigin: "top" }}
              />
              <div className="w-3 h-3 rounded-full bg-amber-600 ml-0.5 shadow-md" />
            </div>
          </div>

          {/* PLAY / PAUSE TOGGLE */}
          <button
            onClick={() => setPlaying(p => !p)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full border font-mono text-xs tracking-widest uppercase transition-all duration-300 ${
              playing
                ? "border-red-800 text-red-400 bg-red-950/30 hover:bg-red-950/50"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            {playing ? <Pause size={12} /> : <Play size={12} />}
            {playing ? "Playing" : "Paused"}
          </button>
        </div>

        {/* ══ COL 3: TRACKLIST + CARDS ══ */}
        <div
          className={`flex flex-col gap-6 transition-all duration-700 delay-200 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          {/* TRACKLIST */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5">
            <div className="flex items-center gap-2 mb-5">
              <Disc3 size={13} className="text-amber-600" />
              <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase">
                Featured Projects
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {TRACKS.map((tr, i) => (
                <button
                  key={i}
                  onClick={() => setTrack(i)}
                  className={`flex items-center gap-3 w-full text-left rounded-xl px-4 py-3 transition-all duration-200 hover:scale-[1.01] ${
                    activeTrack === i
                      ? "bg-red-950/50 border border-red-800/40"
                      : "bg-zinc-800/30 border border-transparent hover:border-zinc-700"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activeTrack === i ? "bg-red-800/60" : "bg-zinc-800"
                    }`}
                  >
                    {activeTrack === i
                      ? <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      : <span className="text-zinc-500 text-xs font-mono">{tr.id}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${activeTrack === i ? "text-white" : "text-zinc-300"}`}>
                      {tr.title}
                    </p>
                    <p className="text-zinc-500 text-xs font-mono mt-0.5">{tr.genre}</p>
                  </div>
                  <span className="text-zinc-600 text-xs font-mono flex-shrink-0">
                    {tr.duration}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* NOW PLAYING CARD */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio size={13} className="text-amber-600" />
                <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase">
                  Now Playing
                </p>
              </div>
              <span className="text-zinc-600 text-xs font-mono">
                {TRACKS[activeTrack].duration}
              </span>
            </div>
            <div>
              <p className="text-white text-base font-bold">{TRACKS[activeTrack].title}</p>
              <p className="text-zinc-400 text-xs font-mono mt-1">{TRACKS[activeTrack].genre}</p>
            </div>
            {/* Progress bar */}
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-800 via-red-600 to-red-400 transition-all duration-1000"
                style={{ width: playing ? "62%" : "28%" }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-zinc-600">
              <span>2:18</span>
              <span>{TRACKS[activeTrack].duration}</span>
            </div>
          </div>

          {/* VINYL INFO GRID */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Label",  value: "Indie Dev Records" },
              { label: "Format", value: "Digital 12-inch"   },
              { label: "Genre",  value: "Full Stack"         },
              { label: "Status", value: "Open to Work 🟢"   },
            ].map(item => (
              <div
                key={item.label}
                className="rounded-xl bg-zinc-900/40 border border-zinc-800 px-4 py-3"
              >
                <p className="text-zinc-600 text-xs font-mono tracking-widest uppercase mb-1">
                  {item.label}
                </p>
                <p className="text-zinc-200 text-xs font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          {/* SOCIAL LINKS — wired up with props */}
          <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 text-xs font-mono tracking-widest uppercase hover:text-amber-500 transition-colors duration-200"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM STRIP ── */}
      <div className="relative z-10 flex items-center gap-4 px-8 md:px-16 pb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />
        <p className="text-zinc-700 text-xs font-mono tracking-widest">
          ℗ {currentYear} · ALL RIGHTS RESERVED · MADE WITH ♥
        </p>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-900/30 to-transparent" />
      </div>
    </section>
  );
}