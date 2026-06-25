import React, { useState, useEffect, useRef } from "react";
import { usePortfolio } from "../../../../context/PortfolioContext";
import {
  Github, Linkedin, Mail, ExternalLink, Code2,
  Briefcase, Layers, Star, MapPin, Globe, Twitter,
  BarChart2, User, Quote
} from "lucide-react";

const MagnifyingGlassHiddenReveal = () => {
  const { portfolioData } = usePortfolio();

  if (!portfolioData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  // ── Destructure all top-level keys from context ──────────────────────────
  const personal     = portfolioData.personal     || {};
  const socials      = portfolioData.socials      || {};   // ← was missing entirely
  const stats        = portfolioData.stats        || {};   // ← was missing entirely
  const experience   = portfolioData.experience   || [];
  const projects     = portfolioData.projects     || [];
  const skills       = portfolioData.skills       || [];   // ← was missing entirely
  const testimonials = portfolioData.testimonials || [];   // ← was missing entirely

  // ── Cursor tracking ──────────────────────────────────────────────────────
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ── Social links — prefer socials object, fall back to personal fields ───
  const socialLinks = [
    {
      icon: <Github size={24} />,
      // PortfolioContext merges contact → socials, so socials.github is canonical
      url: socials.github || personal.github,
      label: "GitHub",
    },
    {
      icon: <Linkedin size={24} />,
      url: socials.linkedin || personal.linkedin,
      label: "LinkedIn",
    },
    {
      icon: <Twitter size={24} />,
      url: socials.twitter,                               // ← was missing
      label: "Twitter",
    },
    {
      icon: <Globe size={24} />,
      url: socials.website || socials.portfolio,          // ← was missing
      label: "Website",
    },
    {
      icon: <Mail size={24} />,
      // dummy_data has email inside socials, not personal — check both
      url: socials.email
        ? `mailto:${socials.email}`
        : personal.email
        ? `mailto:${personal.email}`
        : null,
      label: "Email",
    },
  ].filter((l) => !!l.url);

  // ── Render both layers (blurred bg + revealed fg) from one function ──────
  const renderContent = (isRevealed) => {
    const heading = isRevealed
      ? "text-slate-900"
      : "text-slate-500 blur-[2px]";
    const body = isRevealed
      ? "text-slate-600"
      : "text-slate-400 blur-[2px]";
    const card = isRevealed
      ? "bg-white border-slate-200 shadow-2xl shadow-slate-200/50"
      : "bg-slate-50 border-slate-200";
    const tag = isRevealed
      ? "bg-slate-100 text-slate-700"
      : "bg-slate-200 text-slate-500";

    return (
      <div
        className={`max-w-5xl mx-auto px-6 py-24 space-y-32 transition-all duration-300 ${
          isRevealed ? "text-slate-900" : "text-slate-400 blur-[4px] grayscale"
        }`}
      >
        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="min-h-[70vh] flex flex-col justify-center">
          <h2
            className={`text-2xl font-mono tracking-widest mb-4 flex items-center gap-3 ${heading}`}
          >
            <Code2 size={28} /> Hello, world.
          </h2>

          <h1
            className={`text-6xl md:text-8xl font-black mb-4 tracking-tighter leading-tight ${
              isRevealed
                ? "text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-600"
                : ""
            }`}
          >
            I'm {personal.name}.
          </h1>

          <h3 className={`text-3xl md:text-4xl font-bold mb-3 ${heading}`}>
            {personal.title}
          </h3>

          {/* tagline — was missing */}
          {personal.tagline && (
            <p className={`text-xl font-medium italic mb-4 ${body}`}>
              {personal.tagline}
            </p>
          )}

          {/* location — was missing */}
          {personal.location && (
            <p
              className={`flex items-center gap-2 text-sm font-mono mb-4 ${body}`}
            >
              <MapPin size={14} />
              {personal.location}
            </p>
          )}

          {/* availability — was missing */}
          {personal.availability && (
            <span
              className={`inline-flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full mb-6 w-fit ${
                isRevealed
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isRevealed ? "bg-green-500" : "bg-slate-400"
                }`}
              />
              {personal.availability}
            </span>
          )}

          <p className={`max-w-2xl text-xl md:text-2xl leading-relaxed mb-10 ${body}`}>
            {personal.bio}
          </p>

          {/* Social links — now reads from socials object correctly */}
          <div className="flex flex-wrap gap-4">
            {socialLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                title={item.label}
                className={`p-4 rounded-full transition-transform hover:scale-110 ${
                  isRevealed
                    ? "bg-white text-slate-800 shadow-xl shadow-slate-200 pointer-events-auto"
                    : "bg-slate-200 text-slate-500 pointer-events-none"
                }`}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </section>

        {/* ── STATS — was entirely missing ───────────────────────────────── */}
        {Object.keys(stats).length > 0 && (
          <section className="space-y-10">
            <h2
              className={`text-5xl font-black flex items-center gap-4 border-b-2 border-slate-200 pb-6 ${heading}`}
            >
              <BarChart2 size={40} /> At a Glance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(stats).map(([key, value], idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border text-center ${card}`}
                >
                  <p
                    className={`text-4xl font-black mb-1 ${
                      isRevealed ? "text-slate-900" : ""
                    }`}
                  >
                    {value}
                  </p>
                  <p
                    className={`text-xs font-mono uppercase tracking-widest ${body}`}
                  >
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SKILLS — was entirely missing ──────────────────────────────── */}
        {skills.length > 0 && (
          <section className="space-y-10">
            <h2
              className={`text-5xl font-black flex items-center gap-4 border-b-2 border-slate-200 pb-6 ${heading}`}
            >
              <Code2 size={40} /> Skills
            </h2>

            {/* Group by category */}
            {(() => {
              const grouped = skills.reduce((acc, skill) => {
                const cat = skill.category || "Core";
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(skill);
                return acc;
              }, {});

              return Object.entries(grouped).map(([cat, items]) => (
                <div key={cat} className="space-y-4">
                  <h3 className={`text-sm font-mono uppercase tracking-widest ${body}`}>
                    {cat}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((skill, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm font-semibold ${heading}`}>
                            {skill.name}
                          </span>
                          <span
                            className={`text-xs font-mono ${
                              isRevealed ? "text-slate-500" : "text-slate-400"
                            }`}
                          >
                            {skill.level}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isRevealed
                                ? "bg-gradient-to-r from-slate-800 to-slate-600"
                                : "bg-slate-400"
                            }`}
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </section>
        )}

        {/* ── EXPERIENCE ────────────────────────────────────────────────── */}
        {experience.length > 0 && (
          <section className="space-y-16">
            <h2
              className={`text-5xl font-black flex items-center gap-4 border-b-2 border-slate-200 pb-6 ${heading}`}
            >
              <Briefcase size={40} /> Experience
            </h2>
            <div className="grid gap-12">
              {experience.map((exp, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`md:flex items-start justify-between p-8 rounded-3xl border transition-colors ${card}`}
                  >
                    <div className="md:w-1/3 mb-6 md:mb-0">
                      <div
                        className={`text-sm font-mono mb-2 px-3 py-1 inline-block rounded-full ${tag}`}
                      >
                        {exp.duration || exp.period || exp.date}
                      </div>
                      <h3 className={`text-2xl font-bold ${heading}`}>
                        {exp.company}
                      </h3>
                    </div>
                    <div className="md:w-2/3 md:pl-8 md:border-l border-slate-200">
                      <h4 className={`text-xl font-bold mb-4 ${heading}`}>
                        {exp.role || exp.title}
                      </h4>
                      <p className={`text-lg leading-relaxed ${body}`}>
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── PROJECTS ──────────────────────────────────────────────────── */}
        {projects.length > 0 && (
          <section className="space-y-16">
            <h2
              className={`text-5xl font-black flex items-center gap-4 border-b-2 border-slate-200 pb-6 ${heading}`}
            >
              <Layers size={40} /> Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, idx) => (
                <div
                  key={idx}
                  className={`p-8 rounded-3xl border flex flex-col transition-colors ${card}`}
                >
                  {/* project.image — was missing */}
                  {project.image && (
                    <div className="mb-6 rounded-2xl overflow-hidden h-44">
                      <img
                        src={project.image}
                        alt={project.title}
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          isRevealed ? "" : "grayscale opacity-50"
                        }`}
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-6">
                    <h3 className={`text-2xl font-bold ${heading}`}>
                      {project.title}
                    </h3>
                    <div className="flex gap-4">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`transition-colors ${
                            isRevealed
                              ? "text-slate-600 hover:text-slate-900 pointer-events-auto"
                              : "pointer-events-none"
                          }`}
                        >
                          <Github size={24} />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`transition-colors ${
                            isRevealed
                              ? "text-slate-600 hover:text-slate-900 pointer-events-auto"
                              : "pointer-events-none"
                          }`}
                        >
                          <ExternalLink size={24} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className={`text-lg mb-8 grow ${body}`}>
                    {project.description}
                  </p>

                  {/* techStack — was using project.tags which doesn't exist in context */}
                  <div className="flex flex-wrap gap-2">
                    {(project.techStack || project.tags || []).map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold ${tag}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── TESTIMONIALS — was entirely missing ────────────────────────── */}
        {testimonials.length > 0 && (
          <section className="space-y-16">
            <h2
              className={`text-5xl font-black flex items-center gap-4 border-b-2 border-slate-200 pb-6 ${heading}`}
            >
              <Quote size={40} /> Testimonials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className={`p-8 rounded-3xl border flex flex-col gap-6 ${card}`}
                >
                  <Quote
                    size={28}
                    className={isRevealed ? "text-slate-300" : "text-slate-200"}
                  />
                  <p className={`text-lg leading-relaxed italic ${body}`}>
                    "{t.text || t.quote}"
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className={`w-12 h-12 rounded-full object-cover ${
                          isRevealed ? "" : "grayscale opacity-60"
                        }`}
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isRevealed
                            ? "bg-slate-100 text-slate-600"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        <User size={20} />
                      </div>
                    )}
                    <div>
                      <p className={`font-bold text-sm ${heading}`}>{t.name}</p>
                      <p className={`text-xs font-mono ${body}`}>
                        {t.role}
                        {t.company ? `, ${t.company}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CONTACT ───────────────────────────────────────────────────── */}
        {/* All contact info lives in socials + personal.location in dummy_data */}
        <section className="space-y-10">
          <h2 className={`text-5xl font-black flex items-center gap-4 border-b-2 border-slate-200 pb-6 ${heading}`}>
            <Mail size={40} /> Get In Touch
          </h2>
          <p className={`text-xl max-w-xl leading-relaxed ${body}`}>
            Have a project in mind or just want to say hello? My inbox is always open.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {(socials.email || personal.email) && (
              <a href={`mailto:${socials.email || personal.email}`}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-colors ${card} ${isRevealed ? "pointer-events-auto" : "pointer-events-none"}`}>
                <div className={`p-3 rounded-xl ${isRevealed ? "bg-slate-100 text-slate-700" : "bg-slate-200 text-slate-400"}`}><Mail size={20} /></div>
                <div>
                  <p className={`text-xs font-mono uppercase tracking-widest mb-0.5 ${body}`}>Email</p>
                  <p className={`text-sm font-semibold ${heading}`}>{socials.email || personal.email}</p>
                </div>
              </a>
            )}

            {personal.location && (
              <div className={`flex items-center gap-4 p-5 rounded-2xl border ${card}`}>
                <div className={`p-3 rounded-xl ${isRevealed ? "bg-slate-100 text-slate-700" : "bg-slate-200 text-slate-400"}`}><MapPin size={20} /></div>
                <div>
                  <p className={`text-xs font-mono uppercase tracking-widest mb-0.5 ${body}`}>Location</p>
                  <p className={`text-sm font-semibold ${heading}`}>{personal.location}</p>
                </div>
              </div>
            )}

            {(socials.github || personal.github) && (
              <a href={socials.github || personal.github} target="_blank" rel="noreferrer"
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-colors ${card} ${isRevealed ? "pointer-events-auto" : "pointer-events-none"}`}>
                <div className={`p-3 rounded-xl ${isRevealed ? "bg-slate-100 text-slate-700" : "bg-slate-200 text-slate-400"}`}><Github size={20} /></div>
                <div>
                  <p className={`text-xs font-mono uppercase tracking-widest mb-0.5 ${body}`}>GitHub</p>
                  <p className={`text-sm font-semibold ${heading}`}>View my repositories</p>
                </div>
              </a>
            )}

            {(socials.linkedin || personal.linkedin) && (
              <a href={socials.linkedin || personal.linkedin} target="_blank" rel="noreferrer"
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-colors ${card} ${isRevealed ? "pointer-events-auto" : "pointer-events-none"}`}>
                <div className={`p-3 rounded-xl ${isRevealed ? "bg-slate-100 text-slate-700" : "bg-slate-200 text-slate-400"}`}><Linkedin size={20} /></div>
                <div>
                  <p className={`text-xs font-mono uppercase tracking-widest mb-0.5 ${body}`}>LinkedIn</p>
                  <p className={`text-sm font-semibold ${heading}`}>Connect with me</p>
                </div>
              </a>
            )}

            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noreferrer"
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-colors ${card} ${isRevealed ? "pointer-events-auto" : "pointer-events-none"}`}>
                <div className={`p-3 rounded-xl ${isRevealed ? "bg-slate-100 text-slate-700" : "bg-slate-200 text-slate-400"}`}><Twitter size={20} /></div>
                <div>
                  <p className={`text-xs font-mono uppercase tracking-widest mb-0.5 ${body}`}>Twitter</p>
                  <p className={`text-sm font-semibold ${heading}`}>Follow my updates</p>
                </div>
              </a>
            )}

            {(socials.website || socials.portfolio) && (
              <a href={socials.website || socials.portfolio} target="_blank" rel="noreferrer"
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-colors ${card} ${isRevealed ? "pointer-events-auto" : "pointer-events-none"}`}>
                <div className={`p-3 rounded-xl ${isRevealed ? "bg-slate-100 text-slate-700" : "bg-slate-200 text-slate-400"}`}><Globe size={20} /></div>
                <div>
                  <p className={`text-xs font-mono uppercase tracking-widest mb-0.5 ${body}`}>Website</p>
                  <p className={`text-sm font-semibold ${heading}`}>Visit my site</p>
                </div>
              </a>
            )}

          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────────── */}
        <footer className={`text-center py-20 border-t-2 border-slate-200 ${body}`}>
          <p className="text-lg font-mono opacity-50">
            © {new Date().getFullYear()} {personal.name}. All rights reserved.
          </p>
        </footer>
      </div>
    );
  };

  return (
    <div
      className="relative w-full min-h-screen bg-slate-100 font-sans text-slate-800 overflow-x-hidden"
      ref={containerRef}
    >
      {/* Layer 1 — blurred background */}
      <div className="w-full h-full">{renderContent(false)}</div>

      {/* Layer 2 — revealed foreground clipped to lens circle */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-slate-50 pointer-events-none"
        style={{
          clipPath: `circle(250px at ${mousePos.x}px ${mousePos.y}px)`,
          WebkitClipPath: `circle(250px at ${mousePos.x}px ${mousePos.y}px)`,
        }}
      >
        {renderContent(true)}

        {/* Lens rim */}
        <div
          className="absolute rounded-full border-2 border-white/50 shadow-[0_0_20px_rgba(0,0,0,0.05)] backdrop-blur-[1px] mix-blend-overlay"
          style={{
            width: 500,
            height: 500,
            left: mousePos.x - 250,
            top: mousePos.y - 250,
            pointerEvents: "none",
          }}
        />
        <div
          className="absolute rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.05)]"
          style={{
            width: 500,
            height: 500,
            left: mousePos.x - 250,
            top: mousePos.y - 250,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

export default MagnifyingGlassHiddenReveal;