  import { useState, useEffect, useRef } from "react";
  import data from "../../../../data/dummy_data.json";

  const PROJECT_COLORS = [
    "from-violet-500 to-purple-700",
    "from-cyan-500 to-blue-700",
    "from-emerald-500 to-teal-700",
    "from-rose-500 to-pink-700",
    "from-orange-500 to-amber-700",
    "from-sky-500 to-indigo-700",
  ];

  const SECTIONS = ["hero", "about", "skills", "projects", "experience", "testimonials", "contact"];

  function useActiveSection() {
    const [active, setActive] = useState("hero");
    useEffect(() => {
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
        { threshold: 0.5 }
      );
      SECTIONS.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
      return () => obs.disconnect();
    }, []);
    return active;
  }

  function useTypewriter(words) {
    const [text, setText] = useState("");
    const [wi, setWi] = useState(0);
    const [ci, setCi] = useState(0);
    const [deleting, setDeleting] = useState(false);
    useEffect(() => {
      const word = words[wi];
      const timeout = setTimeout(() => {
        if (!deleting) {
          setText(word.slice(0, ci + 1));
          if (ci + 1 === word.length) setTimeout(() => setDeleting(true), 1200);
          else setCi((c) => c + 1);
        } else {
          setText(word.slice(0, ci - 1));
          if (ci - 1 === 0) { setDeleting(false); setWi((w) => (w + 1) % words.length); setCi(0); }
          else setCi((c) => c - 1);
        }
      }, deleting ? 50 : 100);
      return () => clearTimeout(timeout);
    }, [text, deleting, ci, wi, words]);
    return text;
  }

  function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
      if (ref.current) obs.observe(ref.current);
      return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible];
  }

  function FadeIn({ children, delay = 0, className = "" }) {
    const [ref, visible] = useInView();
    return (
      <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
        {children}
      </div>
    );
  }

  export default function Portfolio() {
    const active = useActiveSection();
    const typed = useTypewriter([
      data.personal.title || "Developer",
      "Open Source Contributor",
      "Creative Developer",
    ]);

    return (
      <div className="bg-[#050510] text-white font-sans scroll-smooth" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

        {/* Top Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style={{ background: "rgba(5,5,16,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="#hero" className="text-lg font-black tracking-tight" style={{ background: "linear-gradient(135deg, #fff 0%, #a78bfa 60%, #38bdf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {data.personal.name}
            </a>
            <div className="hidden md:flex items-center gap-1">
              {SECTIONS.filter((id) => id !== "hero").map((id) => (
                <a key={id} href={`#${id}`}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
                    active === id
                      ? "bg-violet-500/20 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>
                  {id}
                </a>
              ))}
            </div>
            <a href="#contact" className="hidden md:inline-block px-5 py-2 rounded-full text-sm font-semibold bg-violet-600 hover:bg-violet-500 transition-all hover:shadow-[0_0_16px_rgba(139,92,246,0.5)] active:scale-95">
              Hire Me
            </a>
            {/* Mobile: dot nav */}
            <div className="flex md:hidden items-center gap-2">
              {SECTIONS.filter((id) => id !== "hero").map((id) => (
                <a key={id} href={`#${id}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${active === id ? "bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.8)]" : "bg-gray-600"}`}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section id="hero" className="relative h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
          {/* Animated background blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-700 rounded-full opacity-20 blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600 rounded-full opacity-15 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600 rounded-full opacity-10 blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
          </div>
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

          <div className="relative z-10">
            <div className="mb-6 inline-block">
              <span className="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase border border-violet-500/40 rounded-full text-violet-400 bg-violet-500/10">
                Available for work
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4" style={{ background: "linear-gradient(135deg, #fff 0%, #a78bfa 50%, #38bdf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {data.personal.name}
            </h1>
            <div className="h-10 flex items-center justify-center">
              <p className="text-xl md:text-2xl text-gray-400">
                {typed}<span className="animate-pulse text-violet-400">|</span>
              </p>
            </div>
            <p className="mt-6 max-w-xl text-gray-500 text-base leading-relaxed mx-auto">{data.personal.bio ? data.personal.bio.split(".")[0] + "." : ""}</p>
            <div className="mt-10 flex gap-4 justify-center flex-wrap">
              <a href="#projects" className="px-8 py-3 rounded-full font-semibold text-sm bg-violet-600 hover:bg-violet-500 transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] active:scale-95">
                View My Work
              </a>
              <a href="#contact" className="px-8 py-3 rounded-full font-semibold text-sm border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white transition-all active:scale-95">
                Get In Touch
              </a>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-gray-600 to-transparent animate-pulse" />
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" className="scroll-mt-20 min-h-screen flex flex-col justify-center items-center px-6 py-24 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
          <FadeIn className="text-center mb-16">
            <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">Who I Am</p>
            <h2 className="text-5xl font-black">About Me</h2>
          </FadeIn>
          <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
            <FadeIn delay={0.1}>
              <div className="relative">
                <div className="w-64 h-64 mx-auto rounded-2xl overflow-hidden border border-violet-500/20 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
                  {data.personal.avatar
                    ? <img src={data.personal.avatar} alt={data.personal.name} className="w-full h-full object-cover bg-violet-900/30" />
                    : <div className="w-full h-full bg-gradient-to-br from-violet-900 to-indigo-900 flex items-center justify-center text-6xl font-black text-violet-300">{data.personal.name?.[0]}</div>
                  }
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-violet-600/20 rounded-2xl blur-2xl" />
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">{data.personal.bio}</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  [data.skills?.length ? `${data.skills.length}+` : "—", "Skills"],
                  [data.projects?.length ? `${data.projects.length}+` : "—", "Projects"],
                  [data.experience?.length ? `${data.experience.length}+` : "—", "Roles"],
                ].map(([n, l]) => (
                  <div key={l} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-black text-violet-400">{n}</div>
                    <div className="text-xs text-gray-500 mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" className="scroll-mt-20 min-h-screen flex flex-col justify-center items-center px-6 py-24 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <FadeIn className="text-center mb-16">
            <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-3">What I Know</p>
            <h2 className="text-5xl font-black">Skills</h2>
          </FadeIn>
          <div className="max-w-3xl w-full grid grid-cols-1 gap-4">
            {data.skills.map((skill, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="flex items-center gap-4">
                  <span className="w-28 text-sm text-gray-400 text-right shrink-0">{skill.name}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: skill.level ? `${skill.level}%` : "40%", background: `linear-gradient(90deg, #7c3aed, #38bdf8)`, boxShadow: "0 0 10px rgba(139,92,246,0.5)", transition: "width 1.2s ease" }}
                    />
                  </div>
                  {skill.level && <span className="w-10 text-xs text-gray-500 shrink-0">{skill.level}%</span>}
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" className="scroll-mt-20 min-h-screen flex flex-col justify-center items-center px-6 py-24 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
          <FadeIn className="text-center mb-16">
            <p className="text-pink-400 text-sm font-semibold tracking-widest uppercase mb-3">What I've Built</p>
            <h2 className="text-5xl font-black">Projects</h2>
          </FadeIn>
          <div className="max-w-5xl w-full grid md:grid-cols-2 gap-6">
            {data.projects.slice(0, 6).map((proj, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div
                  className="relative group rounded-2xl overflow-hidden border border-white/10 cursor-pointer transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:-translate-y-1"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${PROJECT_COLORS[i % PROJECT_COLORS.length]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="p-6 relative z-10">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${PROJECT_COLORS[i % PROJECT_COLORS.length]} mb-4 flex items-center justify-center text-white font-black text-lg shadow-lg`}>
                      {proj.title[0]}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{proj.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{proj.description}</p>
                    {proj.tech && (
                      <div className="flex flex-wrap gap-2">
                        {proj.tech.map((t) => (
                          <span key={t} className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-gray-400">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section id="experience" className="scroll-mt-20 min-h-screen flex flex-col justify-center items-center px-6 py-24 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          <FadeIn className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">Where I've Worked</p>
            <h2 className="text-5xl font-black">Experience</h2>
          </FadeIn>
          <div className="max-w-2xl w-full relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent" />
            {data.experience.map((exp, i) => (
              <FadeIn key={i} delay={i * 0.15} className="relative pl-12 mb-10">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="p-5 rounded-2xl bg-white/3 border border-white/10 hover:border-emerald-500/20 transition-colors" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{exp.role}</h3>
                      <p className="text-emerald-400 text-sm font-medium">{exp.company}</p>
                    </div>
                    {(exp.period || exp.duration || exp.date) && (
                      <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        {exp.period || exp.duration || exp.date}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{exp.desc || exp.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="testimonials" className="scroll-mt-20 min-h-screen flex flex-col justify-center items-center px-6 py-24 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
          <FadeIn className="text-center mb-16">
            <p className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-3">Kind Words</p>
            <h2 className="text-5xl font-black">Testimonials</h2>
          </FadeIn>
          <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-6 rounded-2xl border border-white/10 hover:border-yellow-500/20 transition-all hover:-translate-y-1 duration-300" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="text-yellow-400 text-3xl mb-4">"</div>
                  <p className="text-gray-300 text-sm leading-relaxed italic mb-6">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-sm font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="scroll-mt-20 min-h-screen flex flex-col justify-center items-center px-6 py-24 relative text-center">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-700 opacity-10 blur-[120px] rounded-full" />
          </div>
          <FadeIn className="relative z-10 max-w-xl">
            <p className="text-violet-400 text-sm font-semibold tracking-widest uppercase mb-3">Let's Talk</p>
            <h2 className="text-5xl font-black mb-6">Get In Touch</h2>
            <p className="text-gray-400 mb-10">Have a project in mind or just want to say hi? My inbox is always open.</p>
            <a href={`mailto:${data.socials.email}`}
              className="inline-block px-10 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] active:scale-95 mb-12">
              {data.socials.email}
            </a>
            {data.socials && (
              <div className="flex justify-center gap-6 text-sm text-gray-500">
                {[["GitHub", data.socials.github], ["LinkedIn", data.socials.linkedin], ["Twitter", data.socials.twitter]]
                  .filter(([, val]) => val)
                  .map(([label, val]) => (
                    <a key={label} href={val && val.startsWith("http") ? val : `https://${val}`} className="hover:text-white transition-colors">{label}</a>
                  ))}
              </div>
            )}
          </FadeIn>
          <div className="absolute bottom-8 text-xs text-gray-700">
            © {new Date().getFullYear()} {data.personal.name} · Built with React
          </div>
        </section>

      </div>
    );
  }
