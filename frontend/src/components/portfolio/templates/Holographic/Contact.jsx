import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";
import { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Link, GitBranch, Send, Sparkles, Radio, User, AtSign, MessageSquare, Type } from 'lucide-react';

const CONTACT_ITEMS = [
  { icon: Mail,      label: 'Email',    value: 'hello@neonlab.dev',      href: '#',                          accent: 'from-cyan-400 to-blue-500'     },
  { icon: Phone,     label: 'Phone',    value: '+1 (555) 010-2049',       href: '#',                         accent: 'from-fuchsia-400 to-pink-500'  },
  { icon: MapPin,    label: 'Location', value: 'San Francisco, CA',       href: '#',                         accent: 'from-violet-400 to-indigo-500' },
  { icon: Link,      label: 'LinkedIn', value: 'linkedin.com/in/neonlab', href: '#',                         accent: 'from-sky-400 to-cyan-500'      },
  { icon: GitBranch, label: 'GitHub',   value: 'github.com/neonlab',      href: '#',                         accent: 'from-purple-400 to-fuchsia-500'},
];

/* Hexagon configs — sizes and colours are data-driven, keeping inline only for width/height/stroke */
const HEXAGONS = [
  { top: '8%',  left: '6%',  size: 90,  dur: 14, delay: 0,   color: '#00E5FF', op: 0.55, show: '' },
  { top: '18%', left: '82%', size: 130, dur: 18, delay: 1.2, color: '#8B5CF6', op: 0.45, show: '' },
  { top: '62%', left: '4%',  size: 70,  dur: 12, delay: 2,   color: '#EC4899', op: 0.5,  show: '' },
  { top: '74%', left: '88%', size: 110, dur: 20, delay: 0.6, color: '#00E5FF', op: 0.4,  show: '' },
  { top: '44%', left: '92%', size: 60,  dur: 16, delay: 3,   color: '#8B5CF6', op: 0.55, show: 'hidden sm:block' },
  { top: '86%', left: '42%', size: 80,  dur: 15, delay: 1.8, color: '#00E5FF', op: 0.35, show: 'hidden sm:block' },
  { top: '30%', left: '30%', size: 50,  dur: 13, delay: 2.4, color: '#EC4899', op: 0.45, show: 'hidden md:block' },
  { top: '10%', left: '55%', size: 65,  dur: 17, delay: 0.4, color: '#8B5CF6', op: 0.4,  show: 'hidden md:block' },
];

const PARTICLES = Array.from({ length: 28 }).map((_, i) => ({
  size:     2 + (i % 4),
  left:     (i * 37) % 100,
  delay:    (i * 0.6) % 14,
  duration: 12 + ((i * 3) % 10),
  color:    ['#00E5FF', '#8B5CF6', '#EC4899'][i % 3],
}));

/* ── HoloCard ── */
function HoloCard({ children, className = '' }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const onMove = e => {
    const r = ref.current.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div ref={ref} onMouseMove={onMove} className={`relative rounded-3xl group animate-holo-float ${className}`}>
      {/* Holographic border */}
      <div className="absolute -inset-px rounded-3xl opacity-70 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-cyan-400 animate-holo-border bg-[length:300%_300%] blur-[0.5px]" />

      <div className="relative rounded-3xl backdrop-blur-2xl border border-white/10 overflow-hidden bg-[rgba(7,11,28,0.85)]">
        {/* Mouse-follow shine — dynamic position must stay inline */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(380px circle at ${pos.x}% ${pos.y}%, rgba(0,229,255,0.18), rgba(139,92,246,0.12) 30%, transparent 60%)` }}
        />
        {/* Shine sweep */}
        <div className="pointer-events-none absolute -inset-y-10 -left-1/2 w-1/2 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine-sweep" />
        {/* Scan line */}
        <div className="pointer-events-none absolute inset-x-0 h-px opacity-60 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line" />
        {/* Corner accents */}
        <span className="pointer-events-none absolute top-[10px] left-[10px] h-5 w-5 border-t-2 border-l-2 border-cyan-300/80 drop-shadow-[0_0_6px_#00E5FF]" />
        <span className="pointer-events-none absolute top-[10px] right-[10px] h-5 w-5 border-t-2 border-r-2 border-cyan-300/80 drop-shadow-[0_0_6px_#00E5FF]" />
        <span className="pointer-events-none absolute bottom-[10px] left-[10px] h-5 w-5 border-b-2 border-l-2 border-cyan-300/80 drop-shadow-[0_0_6px_#00E5FF]" />
        <span className="pointer-events-none absolute bottom-[10px] right-[10px] h-5 w-5 border-b-2 border-r-2 border-cyan-300/80 drop-shadow-[0_0_6px_#00E5FF]" />
        {children}
      </div>
    </div>
  );
}

/* ── NeonField ── */
function NeonField({ icon: Icon, label, textarea = false, ...rest }) {
  const [focus, setFocus] = useState(false);
  const base = 'w-full bg-[#0A0F22]/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all';
  const ring = focus ? 'shadow-[0_0_0_1px_rgba(0,229,255,0.6),0_0_25px_rgba(0,229,255,0.35),0_0_50px_rgba(139,92,246,0.25)]' : '';

  return (
    <label className="block space-y-2">
      <span className="text-[11px] uppercase tracking-[0.25em] text-cyan-300/80">{label}</span>
      <div className={`relative rounded-xl transition-all ${ring}`}>
        <Icon className={`absolute left-3.5 top-3.5 h-4 w-4 transition-colors ${focus ? 'text-cyan-300' : 'text-slate-400'}`} />
        {textarea
          ? <textarea {...rest} rows={5} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} className={`${base} resize-none pt-3`} />
          : <input   {...rest}          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} className={base} />
        }
      </div>
    </label>
  );
}

/* ── Prism decoration ── */
function HoloPrism() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black text-white flex items-center justify-center px-6 py-20">

      {/* Glow Background Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/20 blur-3xl rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Left Content */}
        <div className="flex flex-col justify-center">

          <span className="mb-4 text-sm tracking-[0.3em] uppercase text-cyan-400">
            Contact Me
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Let’s Build Something Futuristic
          </h1>

          <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-xl">
            Have a project idea, collaboration, or just want to connect?
            Send a message and let’s create something extraordinary with a
            holographic touch.
          </p>

          {/* Contact Info */}
          <div className="mt-10 space-y-5">

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl">
                <Mail className="text-cyan-400" />
              </div>

              <span className="text-gray-300">
                hello@futureui.com
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl">
                <Phone className="text-pink-400" />
              </div>

              <span className="text-gray-300">
                +91 98765 43210
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl">
                <MapPin className="text-purple-400" />
              </div>

              <span className="text-gray-300">
                Chennai, India
              </span>
            </div>

          </div>

          {/* Social Icons */}
          <div className="flex gap-5 mt-10">

            {[
              {
                icon: Github,
                link: "https://github.com/",
              },
              {
                icon: Linkedin,
                link: "https://linkedin.com/",
              },
              {
                icon: Instagram,
                link: "https://instagram.com/",
              },
            ].map((item, index) => {

              const Icon = item.icon;

              return (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl hover:scale-110 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 cursor-pointer"
                >
                  <Icon size={22} />
                </a>
              );
            })}

          </div>

        </div>

        {/* Right Form */}
        <div className="relative">

          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30"></div>

          <div className="relative bg-white/10 border border-white/20 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.3)]">

            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Send Message
            </h2>

            <form
              className="space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >

              <div>

                <label className="sr-only">
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-5 py-4 rounded-2xl bg-black/30 border border-white/10 focus:border-cyan-400 outline-none text-white placeholder-gray-400"
                />

              </div>

              <div>

                <label className="sr-only">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-5 py-4 rounded-2xl bg-black/30 border border-white/10 focus:border-pink-400 outline-none text-white placeholder-gray-400"
                />

              </div>

              <div>

                <label className="sr-only">
                  Message
                </label>

                <textarea
                  rows="5"
                  placeholder="Your Message"
                  className="w-full px-5 py-4 rounded-2xl bg-black/30 border border-white/10 focus:border-purple-400 outline-none text-white placeholder-gray-400 resize-none"
                ></textarea>

              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.5)]"
              >
                <Send size={20} />
                Send Message
              </button>

            </form>

          </div>
        </div>
      </div>
    </section>
  );
}
    <div className="pointer-events-none absolute right-[4%] top-[8%] hidden lg:block animate-prism-float">
      <div className="h-40 w-40 opacity-80 animate-prism-spin drop-shadow-[0_0_40px_rgba(0,229,255,0.45)]">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <linearGradient id="prismFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#00E5FF" stopOpacity="0.7" />
              <stop offset="50%"  stopColor="#8B5CF6" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <polygon points="100,15 175,70 150,170 50,170 25,70" fill="url(#prismFill)" stroke="#00E5FF" strokeWidth="1.2" opacity="0.85" />
          <polyline points="100,15 100,170"        stroke="#fff"     strokeOpacity="0.4"  strokeWidth="1" />
          <polyline points="25,70 100,170 175,70"  stroke="#fff"     strokeOpacity="0.45" strokeWidth="1" />
          <polyline points="25,70 100,90 175,70"   stroke="#EC4899"  strokeOpacity="0.5"  strokeWidth="1" />
          <polyline points="100,15 100,90"         stroke="#fff"     strokeOpacity="0.35" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}

/* ── Section ── */
export default function Contact() {
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);

  const onSubmit = e => {
    e.preventDefault();
    setSending(true);
    // TODO: replace with real API call (Formspree, EmailJS, etc.)
    setTimeout(() => { setSending(false); setSent(true); setTimeout(() => setSent(false), 2400); }, 1400);
  };

  return (
    <section id="contact" className="relative isolate overflow-hidden text-white py-24 px-6 bg-gradient-to-b from-slate-950 to-[#0B1020]">

      {/* Animated grid */}
      <div className="absolute inset-0 opacity-[0.18] pointer-events-none animate-grid-drift bg-[linear-gradient(rgba(0,229,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.18)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_80%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_80%)]" />

      {/* Glow blobs */}
      <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full blur-3xl pointer-events-none animate-glow-pulse bg-[radial-gradient(circle,rgba(0,229,255,0.33),transparent_70%)]" />
      <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full blur-3xl pointer-events-none animate-glow-pulse-slow bg-[radial-gradient(circle,rgba(139,92,246,0.33),transparent_70%)]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[380px] w-[380px] rounded-full blur-3xl pointer-events-none bg-[radial-gradient(circle,rgba(236,72,153,0.2),transparent_70%)]" />

      {/* Floating hexagons — size/colour/timing are data-driven, keep minimal inline */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {HEXAGONS.map((h, i) => (
          <div key={i} className={`absolute origin-center ${h.show} animate-hex-drift`}
            style={{ top: h.top, left: h.left, width: h.size, height: h.size, animationDuration: `${h.dur}s`, animationDelay: `${h.delay}s`, opacity: h.op, filter: `drop-shadow(0 0 ${Math.round(h.size / 6)}px ${h.color})` }}>
            <svg viewBox="0 0 100 100" className="h-full w-full animate-hex-spin" style={{ animationDuration: `${h.dur * 2}s` }}>
              <polygon points="50,4 91,27 91,73 50,96 9,73 9,27" fill="none" stroke={h.color} strokeWidth="1.4" />
              <polygon points="50,22 75,36 75,64 50,78 25,64 25,36" fill="none" stroke={h.color} strokeWidth="0.8" opacity="0.5" />
            </svg>
          </div>
        ))}
      </div>

      {/* Floating particles — position/size/color are data-driven */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p, i) => (
          <span key={i} className="absolute rounded-full animate-particle-rise"
            style={{ width: p.size, height: p.size, left: `${p.left}%`, bottom: '-10px', background: p.color, boxShadow: `0 0 ${p.size * 4}px ${p.color}`, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}
          />
        ))}
      </div>

      {/* Scan line */}
      <div className="absolute inset-x-0 h-[2px] pointer-events-none opacity-50 blur-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line-slow" />

      <HoloPrism />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-5 animate-flicker">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-300/30 bg-white/5 backdrop-blur-xl">
            <Radio className="h-4 w-4 text-cyan-300" />
            <span className="text-xs uppercase tracking-[0.35em] text-cyan-100">Open Channel</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent animate-title-shimmer bg-[length:200%_100%]">
            Get In Touch
          </h2>
          <p className="text-slate-300/90 text-base md:text-lg">Let's build something extraordinary together.</p>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-400/70" />
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-fuchsia-400/70" />
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-8 lg:grid-cols-2">

          {/* LEFT — Info */}
          <HoloCard>
            <div className="p-8 md:p-10 space-y-7">
              <div>
                <span className="text-[11px] uppercase tracking-[0.3em] text-fuchsia-300/80">// contact.info</span>
                <h3 className="mt-2 text-2xl font-bold bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">Reach the signal</h3>
                <p className="mt-2 text-sm text-slate-400">Available worldwide. Replying within 24 hours across all channels.</p>
              </div>

              <ul className="space-y-3">
                {CONTACT_ITEMS.map(({ icon: Icon, label, value, href, accent }) => (
                  <li key={label}>
                    <a href={href} className="group/item flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-all hover:border-cyan-300/40 hover:bg-white/[0.06] hover:translate-x-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <span className={`relative grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${accent} shadow-[0_0_20px_rgba(0,229,255,0.25)] flex-shrink-0`}>
                        <Icon className="h-5 w-5 text-white" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500">{label}</div>
                        <div className="truncate text-sm font-medium text-white group-hover/item:text-cyan-200 transition-colors">{value}</div>
                      </div>
                      <span className="text-cyan-300/40 group-hover/item:text-cyan-300 transition-colors text-xs">▸</span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-500/10 via-transparent to-fuchsia-500/10 p-4 text-xs text-slate-300">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
                  <span className="uppercase tracking-[0.25em] text-emerald-300 text-[10px]">Status: Online</span>
                </div>
                Currently accepting new projects for Q3 2026.
              </div>
            </div>
          </HoloCard>

          {/* RIGHT — Form */}
          <HoloCard>
            <form onSubmit={onSubmit} className="p-8 md:p-10 space-y-5">
              <div>
                <span className="text-[11px] uppercase tracking-[0.3em] text-cyan-300/80">// transmission.form</span>
                <h3 className="mt-2 text-2xl font-bold bg-gradient-to-r from-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">Send a transmission</h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <NeonField icon={User}   label="Name"    placeholder="Jane Doe"           required />
                <NeonField icon={AtSign} label="Email"   placeholder="you@domain.com"      required type="email" />
              </div>
              <NeonField icon={Type}          label="Subject" placeholder="Project inquiry"       required />
              <NeonField icon={MessageSquare} label="Message" placeholder="Tell me about your vision..." required textarea />

              <button
                type="submit"
                disabled={sending}
                className="group/btn relative w-full overflow-hidden rounded-xl py-3.5 font-semibold text-slate-950 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-80 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500 animate-holo-border-fast bg-[length:300%_100%] shadow-[0_0_30px_rgba(0,229,255,0.45),0_0_60px_rgba(139,92,246,0.3)]"
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                  {sent    ? <><Sparkles className="h-4 w-4" /> Transmission received</>
                  : sending ? <><span className="h-4 w-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" /> Transmitting…</>
                  :           <><Send className="h-4 w-4" /> Transmit Message</>}
                </span>
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 opacity-60 bg-gradient-to-r from-transparent via-white/65 to-transparent animate-shine-sweep-alt" />
              </button>

              <p className="text-center text-[11px] uppercase tracking-[0.25em] text-slate-500">Encrypted · End-to-end secure channel</p>
            </form>
          </HoloCard>
        </div>
      </div>
    </section>
  );
}
