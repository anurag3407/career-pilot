import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const PortfolioContext = React.createContext(null);

const dummyData = {
  name: "Adrian Voss",
  title: "Brand & Product Designer",
  tagline: "Crafting quiet, confident interfaces for ambitious studios.",
  location: "Lisbon, Portugal",
  bio:
    "I'm a multidisciplinary designer with a decade of practice across branding, editorial systems, and digital product design. My work leans toward restraint — fewer elements, stronger hierarchy, and typography that does the heavy lifting. I partner closely with founders and creative teams to build identities that age well.",
  stats: [
    { label: "Years of Experience", value: "10+" },
    { label: "Projects Completed", value: "86" },
    { label: "Happy Clients", value: "47" },
  ],
  skills: [
    {
      category: "Design",
      accent: "#B08968",
      items: [
        { name: "Brand Identity", level: 95 },
        { name: "UI / UX", level: 92 },
        { name: "Editorial Layout", level: 88 },
        { name: "Typography", level: 90 },
      ],
    },
    {
      category: "Development",
      accent: "#7C8B7A",
      items: [
        { name: "React", level: 85 },
        { name: "Tailwind CSS", level: 88 },
        { name: "Framer Motion", level: 80 },
        { name: "Webflow", level: 75 },
      ],
    },
    {
      category: "Tools",
      accent: "#9C7A6B",
      items: [
        { name: "Figma", level: 96 },
        { name: "After Effects", level: 70 },
        { name: "Notion", level: 85 },
      ],
    },
  ],
  projects: [
    {
      title: "Marrow Studio",
      description:
        "A full rebrand and editorial site for an architecture collective in Porto.",
      image:
        "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=800&auto=format&fit=crop",
      tags: ["Branding", "Webflow", "Print"],
    },
    {
      title: "Linen & Co.",
      description:
        "E-commerce experience and packaging system for a slow-fashion textile brand.",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
      tags: ["Shopify", "Packaging", "UI/UX"],
    },
    {
      title: "Field Atlas",
      description:
        "A travel-journal app concept with a custom type system and offline-first design.",
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
      tags: ["Mobile App", "React Native", "Design System"],
    },
  ],
  experience: [
    {
      role: "Principal Designer",
      company: "Studio Loma",
      period: "2022 — Present",
      summary:
        "Leading brand and product design for hospitality and lifestyle clients across Europe.",
    },
    {
      role: "Senior Product Designer",
      company: "Northbound",
      period: "2019 — 2022",
      summary:
        "Owned design systems and shipped 12+ web platforms for early-stage startups.",
    },
    {
      role: "Designer",
      company: "Folio Collective",
      period: "2016 — 2019",
      summary:
        "Designed identity systems and printed collateral for independent publishers.",
    },
  ],
  contact: {
    email: "hello@adrianvoss.studio",
    github: "github.com/adrianvoss",
    linkedin: "linkedin.com/in/adrianvoss",
    twitter: "@adrianvoss",
    availability: "Available for select projects — Autumn 2026",
  },
  avatar:
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
};

const PANEL_BASE = "10%";
const PANEL_HOVER = "26%";

const easeBrochure = [0.22, 1, 0.36, 1];

function FoldDivider() {
  return (
    <div className="pointer-events-none absolute right-0 top-0 h-full w-10 -mr-5 z-20">
      <div className="h-full w-full bg-gradient-to-r from-transparent via-black/[0.14] to-transparent" />
      <div className="absolute inset-y-0 right-[22px] w-px bg-white/70" />
      <div className="absolute inset-y-0 right-5 w-px bg-[#cdc2af]" />
      <div className="absolute inset-y-0 right-[18px] w-px bg-black/[0.08]" />
    </div>
  );
}

function PanelShell({
  id,
  index,
  total,
  hovered,
  setHovered,
  children,
  className = "",
}) {
  const isHovered = hovered === id;
  const isDimmed = hovered !== null && hovered !== id;

  return (
    <motion.section
      onMouseEnter={() => setHovered(id)}
      onMouseLeave={() => setHovered(null)}
      onFocus={() => setHovered(id)}
      onBlur={() => setHovered(null)}
      tabIndex={0}
      initial={false}
      animate={{
        flexBasis: isHovered ? PANEL_HOVER : PANEL_BASE,
        flexGrow: isHovered ? 1.6 : 1,
      }}
      transition={{ duration: 0.6, ease: easeBrochure }}
      className={
        "relative flex-shrink-0 min-w-[78vw] md:min-w-0 h-full overflow-hidden " +
        "border-r border-[#cdc2af] last:border-r-0 shadow-[inset_-1px_0_0_rgba(255,255,255,0.5)] " +
        className
      }
      style={{
        background:
          "linear-gradient(180deg, #FBF8F2 0%, #F4EEE4 55%, #EFE7D9 100%)",
      }}
    >
      
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-10 z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(50,40,30,0.16), rgba(50,40,30,0.03) 60%, transparent)",
        }}
      />
      
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-white/60 z-10" />
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          opacity: isDimmed ? 0.55 : 1,
          background:
            "radial-gradient(120% 60% at 50% -10%, rgba(255,255,255,0.6), transparent)",
        }}
      />
      {index < total - 1 && <FoldDivider />}

      <motion.div
        animate={{ opacity: isDimmed ? 0.6 : 1, scale: isDimmed ? 0.99 : 1 }}
        transition={{ duration: 0.5, ease: easeBrochure }}
        className="relative z-10 h-full flex flex-col px-5 md:px-6 py-8 md:py-10"
      >
        {children}
      </motion.div>
    </motion.section>
  );
}

function Eyebrow({ children }) {
  return (
    <p className="text-[10px] tracking-[0.28em] uppercase text-[#A6886F] font-semibold mb-3">
      {children}
    </p>
  );
}

function normalize(raw) {
  if (!raw) return null;
  const p = raw.personal || {};

  const skillGroups = {};
  const accents = ["#B08968", "#7C8B7A", "#9C7A6B", "#8B95A6", "#A68B7C"];
  (raw.skills || []).forEach((s) => {
    const cat = s.category || "Core Skills";
    if (!skillGroups[cat]) skillGroups[cat] = [];
    skillGroups[cat].push({ name: s.name, level: s.level ?? 80 });
  });
  const skills = Object.keys(skillGroups).map((cat, i) => ({
    category: cat,
    accent: accents[i % accents.length],
    items: skillGroups[cat],
  }));

  return {
    name: p.name || dummyData.name,
    title: p.title || dummyData.title,
    tagline: p.tagline || p.bio || dummyData.tagline,
    location: p.location || dummyData.location,
    bio: p.bio || dummyData.bio,
    avatar: p.avatar || dummyData.avatar,
    stats: raw.stats || dummyData.stats,
    skills: skills.length ? skills : dummyData.skills,
    projects: (raw.projects || []).map((proj) => ({
      title: proj.title,
      description: proj.description || "",
      image: proj.image || dummyData.projects[0].image,
      tags: proj.tags || proj.technologies || [],
    })),
    experience: (raw.experience || []).map((exp) => ({
      role: exp.role || exp.title,
      company: exp.company,
      period: exp.period || exp.duration || "",
      summary: exp.summary || exp.description || "",
    })),
    contact: {
      email: raw.socials?.email || dummyData.contact.email,
      github: raw.socials?.github || dummyData.contact.github,
      linkedin: raw.socials?.linkedin || dummyData.contact.linkedin,
      twitter: raw.socials?.twitter || dummyData.contact.twitter,
      availability:
        raw.socials?.availability || dummyData.contact.availability,
    },
  };
}

export default function AccordionFoldBrochure({ portfolioData } = {}) {
  const ctx = useContext(PortfolioContext);
  const contextData = ctx && (ctx.data || ctx);
  let data = dummyData;
  if (contextData && Object.keys(contextData).length) {
    data = contextData.name ? contextData : normalize(contextData) || dummyData;
  } else if (portfolioData) {
    data = normalize(portfolioData) || dummyData;
  }
  const [hovered, setHovered] = useState(null);

  return (
    <div className="w-full min-h-screen bg-[#EDE6D8] flex items-center justify-center py-6 md:py-12 px-2 md:px-6 font-[Inter,sans-serif]">
      <div
        className="w-full max-w-[1400px] h-[720px] md:h-[640px] rounded-[6px] shadow-[0_30px_80px_-20px_rgba(60,45,30,0.35)] overflow-hidden flex flex-row"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
        }}
      >
       
        <div className="flex flex-row w-full h-full overflow-x-auto md:overflow-hidden snap-x snap-mandatory md:snap-none scroll-smooth">
          
          <PanelShell
            id="cover"
            index={0}
            total={6}
            hovered={hovered}
            setHovered={setHovered}
            className="snap-start"
          >
            <div className="relative flex flex-col h-full items-center text-center justify-between">
              
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center z-0 select-none"
              >
                <span
                  className="font-serif font-black leading-none text-[#2E2A26] opacity-[0.05]"
                  style={{ fontSize: "13rem", letterSpacing: "-0.05em" }}
                >
                  {data.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>

              <div className="relative z-10 self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#cbbba1] bg-white/50 backdrop-blur-sm text-[10px] tracking-[0.2em] uppercase text-[#7A6A56] font-semibold">
                <Sparkles size={11} strokeWidth={1.5} />
                Creative Portfolio
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute -inset-3 rounded-full border border-[#cbbba1]/70" />
                  <img
                    src={data.avatar}
                    alt={data.name}
                    className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover shadow-lg ring-4 ring-white"
                  />
                </div>
                <h1 className="font-serif font-bold text-4xl md:text-[3.2rem] leading-[1.05] text-[#2E2A26] tracking-tight">
                  {data.name}
                </h1>
                <p className="mt-3 text-sm md:text-base text-[#A6886F] uppercase tracking-[0.22em] font-semibold">
                  {data.title}
                </p>

                <div className="flex items-center gap-2 my-6">
                  <span className="w-10 h-px bg-[#cbbba1]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A6886F]" />
                  <span className="w-10 h-px bg-[#cbbba1]" />
                </div>

                <p className="font-serif italic text-base md:text-lg text-[#5A5248] leading-relaxed max-w-[240px]">
                  &ldquo;{data.tagline}&rdquo;
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-2 text-xs text-[#8A7E6E]">
                <MapPin size={13} strokeWidth={1.5} />
                {data.location}
              </div>
            </div>
          </PanelShell>

          
          <PanelShell
            id="about"
            index={1}
            total={6}
            hovered={hovered}
            setHovered={setHovered}
            className="snap-start"
          >
            <Eyebrow>About</Eyebrow>
            <h2 className="font-serif text-2xl text-[#2E2A26] mb-5">
              A little about me
            </h2>
            <p className="text-[13.5px] leading-[1.85] text-[#5A5248] mb-8">
              {data.bio}
            </p>

            <div className="mt-auto grid grid-cols-1 gap-3">
              {data.stats.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between rounded-lg border border-[#e3dbcd] bg-white/60 px-4 py-3 backdrop-blur-sm shadow-sm"
                >
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[#8A7E6E]">
                    {s.label}
                  </span>
                  <span className="font-serif text-xl text-[#2E2A26]">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </PanelShell>

          
          <PanelShell
            id="skills"
            index={2}
            total={6}
            hovered={hovered}
            setHovered={setHovered}
            className="snap-start"
          >
            <Eyebrow>Skills</Eyebrow>
            <h2 className="font-serif text-2xl text-[#2E2A26] mb-6">
              What I bring
            </h2>

            <div className="flex flex-col gap-6 overflow-y-auto pr-1 -mr-1">
              {data.skills.map((group) => (
                <div key={group.category}>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: group.accent }}
                    />
                    <h3 className="text-[12px] uppercase tracking-[0.16em] text-[#5A5248] font-semibold">
                      {group.category}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {group.items.map((skill) => (
                      <span
                        key={skill.name}
                        className="text-[12px] px-3 py-1 rounded-full border bg-white/60 text-[#5A5248]"
                        style={{ borderColor: group.accent + "55" }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    {group.items.map((skill) => (
                      <div key={skill.name + "-bar"}>
                        <div className="h-1 w-full rounded-full bg-[#e6ddcd] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${skill.level}%`,
                              backgroundColor: group.accent,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PanelShell>

          
          <PanelShell
            id="projects"
            index={3}
            total={6}
            hovered={hovered}
            setHovered={setHovered}
            className="snap-start"
          >
            <Eyebrow>Selected Work</Eyebrow>
            <h2 className="font-serif text-2xl text-[#2E2A26] mb-5">
              Featured Projects
            </h2>

            <div className="flex flex-col gap-4 overflow-y-auto pr-1 -mr-1">
              {data.projects.map((p, i) => {
                const isFeatured = i === 0;
                return (
                  <div
                    key={p.title}
                    className={
                      "group relative rounded-lg overflow-hidden border bg-white/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 " +
                      (isFeatured
                        ? "border-[#A6886F]/50 shadow-md ring-1 ring-[#A6886F]/20 hover:shadow-xl"
                        : "border-[#e3dbcd] shadow-sm hover:shadow-md")
                    }
                  >
                    <div
                      className={
                        "relative overflow-hidden " +
                        (isFeatured ? "h-36" : "h-28")
                      }
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
                      <span className="absolute top-2 left-2 font-serif text-2xl text-white/90 tracking-tight drop-shadow">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {isFeatured && (
                        <span className="absolute top-2 right-2 text-[9px] uppercase tracking-[0.18em] font-semibold px-2 py-1 rounded-full bg-[#A6886F] text-white shadow">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-base text-[#2E2A26]">
                          {p.title}
                        </h3>
                        <ArrowUpRight
                          size={14}
                          className="text-[#A6886F] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>
                      <p className="text-[12px] text-[#5A5248] mt-1 leading-relaxed">
                        {p.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full border border-[#e3dbcd] bg-white/70 text-[#8A7E6E] font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </PanelShell>

          
          <PanelShell
            id="experience"
            index={4}
            total={6}
            hovered={hovered}
            setHovered={setHovered}
            className="snap-start"
          >
            <Eyebrow>Career</Eyebrow>
            <h2 className="font-serif text-2xl text-[#2E2A26] mb-6">
              Experience
            </h2>

            <div className="relative pl-5 overflow-y-auto pr-1 -mr-1">
              <div className="absolute left-1.5 top-1 bottom-1 w-px bg-[#d8cfc1]" />
              <div className="flex flex-col gap-7">
                {data.experience.map((job) => (
                  <div key={job.role + job.company} className="relative">
                    <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-[#A6886F] ring-4 ring-[#F4EEE4]" />
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#A6886F] font-semibold mb-1">
                      {job.period}
                    </p>
                    <h3 className="font-serif text-base text-[#2E2A26]">
                      {job.role}
                    </h3>
                    <p className="text-[12px] text-[#8A7E6E] mb-1.5">
                      {job.company}
                    </p>
                    <p className="text-[12.5px] text-[#5A5248] leading-relaxed">
                      {job.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </PanelShell>

          
          <PanelShell
            id="contact"
            index={5}
            total={6}
            hovered={hovered}
            setHovered={setHovered}
            className="snap-start"
          >
            <div className="flex flex-col h-full">
              <Eyebrow>Get in Touch</Eyebrow>
              <h2 className="font-serif text-2xl text-[#2E2A26] mb-3 leading-snug">
                Let&apos;s Work
                <br />
                Together
              </h2>
              <p className="text-[12.5px] text-[#5A5248] leading-relaxed mb-6">
                Have a project in mind? I&apos;d love to hear about it.
              </p>

              <div className="flex flex-col gap-2.5 text-[13px] text-[#5A5248] mb-6">
                <a
                  href={`mailto:${data.contact.email}`}
                  className="flex items-center gap-2.5 hover:text-[#A6886F] transition-colors"
                >
                  <Mail size={15} strokeWidth={1.5} />
                  {data.contact.email}
                </a>
                <a
                  href={`https://${data.contact.github}`}
                  className="flex items-center gap-2.5 hover:text-[#A6886F] transition-colors"
                >
                  <Github size={15} strokeWidth={1.5} />
                  {data.contact.github}
                </a>
                <a
                  href={`https://${data.contact.linkedin}`}
                  className="flex items-center gap-2.5 hover:text-[#A6886F] transition-colors"
                >
                  <Linkedin size={15} strokeWidth={1.5} />
                  {data.contact.linkedin}
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2.5 hover:text-[#A6886F] transition-colors"
                >
                  <Twitter size={15} strokeWidth={1.5} />
                  {data.contact.twitter}
                </a>
              </div>

              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-4">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C8B7A] opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7C8B7A]" />
                  </span>
                  <p className="text-[12px] text-[#5A5248]">
                    {data.contact.availability}
                  </p>
                </div>

                
                <div className="w-20 h-20 rounded-md bg-white/70 border border-[#e3dbcd] p-2 grid grid-cols-5 grid-rows-5 gap-[2px]">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-[1px]"
                      style={{
                        backgroundColor:
                          [0, 4, 20, 24, 12, 6, 8, 16, 18, 2, 22, 11, 13].includes(
                            i
                          )
                            ? "#2E2A26"
                            : "transparent",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PanelShell>
        </div>
      </div>
    </div>
  );
}