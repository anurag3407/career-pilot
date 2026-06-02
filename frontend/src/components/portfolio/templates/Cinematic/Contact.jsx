import React, { useState } from 'react';
import { Mail, MapPin, Github, Linkedin, Twitter, Send, Film, Award } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Contact() {
  const { personal, socials } = data;
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [takeNumber] = useState(
    () => String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')
  );

  const handleChange = (e) =>
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const socialLinks = [
    { icon: Github,   href: socials.github,   label: 'GitHub'   },
    { icon: Linkedin, href: socials.linkedin, label: 'LinkedIn' },
    { icon: Twitter,  href: socials.twitter,  label: 'Twitter'  },
  ];

  const credits = [
    { role: 'Director of Engineering', value: personal.name     },
    { role: 'Studio Location',         value: personal.location },
    { role: 'Open Transmission',       value: socials.email     },
  ];

  const fields = [
    { id: 'name',    label: 'Your Name',     type: 'text',  placeholder: 'Alex Rivera'           },
    { id: 'email',   label: 'Email Address', type: 'email', placeholder: 'you@studio.com'        },
    { id: 'subject', label: 'Subject',       type: 'text',  placeholder: 'Project Collaboration' },
  ];

  /* Clapperboard stripe style — reused for both section headers */
  const clapperStripe = {
    background: 'repeating-linear-gradient(-45deg, #1c1c1c 0px, #1c1c1c 10px, #0a0a0a 10px, #0a0a0a 20px)',
  };

  return (
    <>
      <style>{`
        @keyframes cinematic-fade-up {
          0%   { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0)    scale(1);    filter: blur(0);   }
        }
        @keyframes cin-flicker {
          0%, 88%, 91%, 94%, 100% { opacity: 1;   }
          89% { opacity: 0.38; }
          92% { opacity: 0.82; }
        }
        .animate-cinematic {
          animation: cinematic-fade-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .cin-flicker { animation: cin-flicker 12s infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-cinematic { animation: none; opacity: 1; transform: none; filter: none; }
          .cin-flicker        { animation: none; }
        }
      `}</style>

      <section className="relative w-full overflow-hidden bg-black text-white font-sans selection:bg-neutral-800">

        {/* ── Letterbox bars ── */}
        <div className="absolute top-0 left-0 w-full h-[8vh] min-h-[48px] bg-black z-30 pointer-events-none
                        shadow-[0_20px_50px_rgba(0,0,0,1)] flex items-center justify-center">
          <div className="flex items-center gap-3 sm:gap-5 text-[9px] sm:text-[10px] text-neutral-500 font-mono tracking-[0.25em] uppercase">
            <span className="flex items-center gap-1.5">
              <Film size={11} className="text-neutral-400 shrink-0" />
              <span>A Portfolio Production</span>
            </span>
            <span className="hidden sm:inline opacity-40 tracking-normal">|</span>
            <span className="hidden sm:inline">{personal.name}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[8vh] min-h-[48px] bg-black z-30 pointer-events-none
                        shadow-[0_-20px_50px_rgba(0,0,0,1)] flex items-center justify-center">
          <div className="flex items-center gap-3 sm:gap-5 text-[9px] sm:text-[10px] text-neutral-500 font-mono tracking-[0.25em] uppercase">
            <span className="flex items-center gap-1.5">
              <Award size={11} className="text-neutral-400 shrink-0" />
              <span>Official Selection 2024</span>
            </span>
            <span className="hidden sm:inline opacity-40 tracking-normal">|</span>
            <span className="hidden sm:inline">Dolby Digital</span>
            <span className="hidden md:inline opacity-40 tracking-normal">|</span>
            <span className="hidden md:inline">&copy; {new Date().getFullYear()}</span>
          </div>
        </div>


        {/* ── Film grain ── */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none z-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")',
          }}
        />

        {/* ── Radial backdrop ── */}
        <div className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle at 50% 30%, rgba(50,50,50,0.2) 0%, #000 60%)',
          }}
        />

        {/* ── Stage spotlight cone — strong, visible ── */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.07) 30%, transparent 55%)',
          }}
        />

        {/* ── Deep corner vignette ── */}
        <div className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)',
          }}
        />

        {/* ── Main content ── */}
        <div className="relative z-10 mx-auto max-w-6xl px-8 md:px-16
                        pt-[calc(8vh+0.75rem)] pb-[calc(8vh+1.5rem)]">

          {/* ── Title card ── */}
          <div className="text-center mb-12 md:mb-16">
            <div className="animate-cinematic" style={{ animationDelay: '0.2s' }}>
              <h2 className="cin-flicker text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase
                             tracking-tighter mb-5 leading-none px-2
                             text-transparent bg-clip-text
                             bg-gradient-to-b from-white via-neutral-200 to-neutral-600
                             drop-shadow-2xl filter drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                Direct Line
              </h2>
            </div>

            <div className="animate-cinematic px-4" style={{ animationDelay: '1s' }}>
              <p className="text-base sm:text-xl font-light tracking-wide text-neutral-300
                            max-w-2xl mx-auto mb-0 italic opacity-90 font-serif">
                &ldquo;Every great collaboration starts with a single message.&rdquo;
              </p>
            </div>
          </div>

          {/* ── Film perforation strip divider ── */}
          <div className="animate-cinematic flex items-center gap-0 mb-12 md:mb-16"
            style={{ animationDelay: '1.3s' }}>
            <div className="h-px flex-1 bg-neutral-800" />
            <div className="flex items-center gap-1.5 px-4">
              {[...Array(9)].map((_, i) => (
                <div key={i}
                  className="w-3 h-5 rounded-[3px] border border-neutral-700 bg-neutral-900/80"
                  style={{ boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8)' }}
                />
              ))}
            </div>
            <div className="h-px flex-1 bg-neutral-800" />
          </div>

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

            {/* LEFT — Call Sheet */}
            <div className="animate-cinematic" style={{ animationDelay: '1.5s' }}>

              {/* Clapperboard header */}
              <div className="mb-6 overflow-hidden border border-neutral-800">
                <div className="h-7 w-full" style={clapperStripe} />
                <div className="bg-neutral-950 px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[9px] font-mono tracking-[0.3em] text-neutral-300 uppercase font-bold">
                    Production Credits
                  </span>
                  <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-600 uppercase">
                    Roll A · Cam 1
                  </span>
                </div>
              </div>

              {/* Credits table */}
              <div className="mb-8">
                {credits.map(({ role, value }) => (
                  <div key={role}
                    className="flex items-baseline justify-between border-b border-neutral-800/70 py-3.5 gap-3">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em]
                                     text-neutral-500 font-mono shrink-0">
                      {role}
                    </span>
                    <span className="text-neutral-100 text-sm text-right min-w-0 break-all">{value}</span>
                  </div>
                ))}
              </div>

              {/* Contact info */}
              <div className="space-y-2 mb-8">
                <a href={`mailto:${socials.email}`}
                  className="group flex items-center gap-4 px-4 py-3.5
                             border-l-2 border-l-neutral-700 border-y border-r border-neutral-800
                             bg-neutral-950/70 hover:border-l-white hover:bg-neutral-900/60
                             transition-all duration-400">
                  <Mail size={15} className="text-neutral-500 group-hover:text-white shrink-0 transition-colors duration-300" />
                  <div className="min-w-0">
                    <p className="text-[8px] uppercase tracking-[0.35em] text-neutral-600 font-mono">Email</p>
                    <p className="text-sm text-neutral-200 mt-0.5 truncate">{socials.email}</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 px-4 py-3.5
                               border-l-2 border-l-neutral-700 border-y border-r border-neutral-800
                               bg-neutral-950/70">
                  <MapPin size={15} className="text-neutral-500 shrink-0" />
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.35em] text-neutral-600 font-mono">Location</p>
                    <p className="text-sm text-neutral-200 mt-0.5">{personal.location}</p>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="flex gap-2">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label}
                    target="_blank" rel="noopener noreferrer"
                    className="group p-3 border border-neutral-800 hover:border-neutral-500
                               bg-neutral-950/60 hover:bg-neutral-900/60
                               transition-all duration-300">
                    <Icon size={17} className="text-neutral-500 group-hover:text-white transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* RIGHT — Production Inquiry */}
            <div className="animate-cinematic" style={{ animationDelay: '1.7s' }}>

              {/* Clapperboard header */}
              <div className="mb-6 overflow-hidden border border-neutral-800">
                <div className="h-7 w-full" style={clapperStripe} />
                <div className="bg-neutral-950 px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[9px] font-mono tracking-[0.3em] text-neutral-300 uppercase font-bold">
                    Production Inquiry
                  </span>
                  <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-600 uppercase">
                    Take {takeNumber} · Action
                  </span>
                </div>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center min-h-[380px]
                               border border-neutral-800 bg-neutral-950/50 p-10 text-center gap-5">
                  <div className="h-5 w-full" style={clapperStripe} />
                  <p className="text-[9px] font-mono tracking-[0.4em] text-neutral-600 uppercase mt-2">
                    Scene Complete
                  </p>
                  <h3 className="cin-flicker text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-tight
                                 text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-300 to-neutral-600">
                    Transmission<br />Received
                  </h3>
                  <p className="font-serif italic text-neutral-400 text-sm max-w-[220px]">
                    &ldquo;Standing by for response.&rdquo;
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {fields.map(({ id, label, type, placeholder }) => (
                    <div key={id}>
                      <label htmlFor={`cin-${id}`}
                        className="block text-[9px] sm:text-[10px] uppercase tracking-[0.4em]
                                   text-neutral-500 font-mono mb-1.5">
                        {label}
                      </label>
                      <input
                        id={`cin-${id}`} name={id} type={type}
                        placeholder={placeholder} required
                        value={formState[id]} onChange={handleChange}
                        className="w-full bg-transparent border-0 border-b border-neutral-700 text-white
                                   placeholder:text-neutral-700 px-0 py-2.5 text-sm outline-none
                                   focus:border-b-white transition-colors duration-300"
                      />
                    </div>
                  ))}

                  <div>
                    <label htmlFor="cin-message"
                      className="block text-[9px] sm:text-[10px] uppercase tracking-[0.4em]
                                 text-neutral-500 font-mono mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="cin-message" name="message" rows={5}
                      placeholder="Tell me about your vision..."
                      required value={formState.message} onChange={handleChange}
                      className="w-full bg-transparent border-0 border-b border-neutral-700 text-white
                                 placeholder:text-neutral-700 px-0 py-2.5 text-sm outline-none resize-none
                                 focus:border-b-white transition-colors duration-300"
                    />
                  </div>

                  <button type="submit"
                    className="group relative flex items-center justify-center gap-3 w-full py-4 mt-2
                               bg-white text-black font-bold uppercase tracking-[0.2em] text-xs sm:text-sm
                               rounded-sm overflow-hidden hover:bg-neutral-100
                               transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.12)]
                               hover:shadow-[0_0_60px_rgba(255,255,255,0.25)]">
                    <div className="absolute inset-0 bg-neutral-900/8 translate-y-full
                                    group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="relative z-10">Send Transmission</span>
                    <Send size={15} className="relative z-10 fill-black
                                               transition-transform duration-500 group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
