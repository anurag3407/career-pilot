import { usePortfolio } from "../../../../context/PortfolioContext";
﻿import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Twitter, ExternalLink } from "lucide-react";

const PixelBar = ({ label, level }) => (
  <div className="mb-3">
    <p className="text-xs text-purple-300 mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      {label}
    </p>
    <div className="h-3 bg-gray-900 border-2 border-purple-900">
      <motion.div
        className="h-full bg-green-400"
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-yellow-400 text-sm mb-6 flex items-center gap-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
    <span className="text-red-500">▶</span> {children}
  </h2>
);

export default function PixelQuest() {
  const { portfolioData: data } = usePortfolio();

  const [blink, setBlink] = useState(true);
  const { personal, socials, skills, projects, experience, testimonials, stats } = data;

  useEffect(() => {
    const interval = setInterval(() => setBlink((b) => !b), 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      <div className="bg-gray-950 text-gray-200 min-h-screen">

        <section className="bg-gradient-to-b from-gray-950 to-purple-950 border-b-4 border-green-400 py-16 px-4 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-yellow-400 text-xl tracking-widest mb-4">⭐⭐⭐⭐⭐</p>
            <h1 className="text-green-400 text-2xl md:text-4xl mb-4" style={{ fontFamily: "'Press Start 2P', monospace", textShadow: "4px 4px #005533" }}>
              {personal.name.toUpperCase()}
            </h1>
            <p className="text-pink-400 text-xs mb-6" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              {personal.title.toUpperCase()}
            </p>
            <div className="max-w-md mx-auto mb-6">
              <div className="h-4 bg-gray-900 border-2 border-purple-700">
                <div className="h-full bg-green-400" style={{ width: "75%" }} />
              </div>
              <p className="text-gray-500 text-xs mt-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                75% XP TO NEXT LEVEL
              </p>
            </div>
            <p className="text-green-400 text-xs" style={{ fontFamily: "'Press Start 2P', monospace", opacity: blink ? 1 : 0 }}>
              ▼ PRESS START ▼
            </p>
          </motion.div>
        </section>

        <section className="grid grid-cols-3 border-b-2 border-dashed border-purple-900">
          {[
            { num: `${stats.yearsExperience}+`, label: "YRS EXP" },
            { num: stats.projectsCompleted, label: "PROJECTS" },
            { num: stats.happyClients, label: "CLIENTS" },
          ].map(({ num, label }) => (
            <div key={label} className="text-center py-6 border-r border-purple-900 last:border-0">
              <p className="text-green-400 text-2xl" style={{ fontFamily: "'Press Start 2P', monospace" }}>{num}</p>
              <p className="text-purple-400 text-xs mt-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>{label}</p>
            </div>
          ))}
        </section>

        <section className="px-4 py-10 border-b-2 border-dashed border-purple-900 max-w-3xl mx-auto w-full">
          <SectionTitle>ABOUT PLAYER</SectionTitle>
          {personal.avatar && (
            <img src={personal.avatar} alt={personal.name} className="w-20 h-20 mb-4 border-4 border-green-400" />
          )}
          <p className="text-purple-200 text-sm leading-relaxed">{personal.bio}</p>
          <p className="text-gray-500 text-xs mt-3" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            📍 {personal.location}
          </p>
        </section>

        <section className="px-4 py-10 border-b-2 border-dashed border-purple-900 max-w-3xl mx-auto w-full">
          <SectionTitle>SKILL TREE</SectionTitle>
          {skills.map((skill) => (
            <PixelBar key={skill.name} label={skill.name.toUpperCase()} level={skill.level} />
          ))}
        </section>

        <section className="px-4 py-10 border-b-2 border-dashed border-purple-900 max-w-3xl mx-auto w-full">
          <SectionTitle>GAME LEVELS (PROJECTS)</SectionTitle>
          <div className="space-y-4">
            {projects.map((proj, i) => (
              <motion.div key={proj.title} whileHover={{ scale: 1.01 }} className="bg-gray-900 border-2 border-purple-900 hover:border-green-400 p-4 transition-colors">
                <p className="text-red-400 text-xs mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  STAGE {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="text-cyan-400 text-xs mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  {proj.title.toUpperCase()}
                </h3>
                <p className="text-purple-300 text-sm leading-relaxed mb-3">{proj.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {proj.techStack?.map((t) => (
                    <span key={t} className="bg-gray-800 border border-purple-700 text-purple-300 text-xs px-2 py-0.5" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-green-400 text-xs hover:underline">
                      <ExternalLink size={12} /> PLAY
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-pink-400 text-xs hover:underline">
                      <Github size={12} /> CODE
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-4 py-10 border-b-2 border-dashed border-purple-900 max-w-3xl mx-auto w-full">
          <SectionTitle>QUEST LOG (EXPERIENCE)</SectionTitle>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.company} className="border-l-4 border-pink-500 pl-4">
                <p className="text-pink-400 text-xs" style={{ fontFamily: "'Press Start 2P', monospace" }}>{exp.role.toUpperCase()}</p>
                <p className="text-yellow-400 text-xs mt-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>⚡ {exp.company.toUpperCase()}</p>
                <p className="text-gray-500 text-xs mt-1">{exp.period}</p>
                <p className="text-purple-300 text-sm leading-relaxed mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-10 border-b-2 border-dashed border-purple-900 max-w-3xl mx-auto w-full">
          <SectionTitle>PLAYER REVIEWS</SectionTitle>
          <div className="space-y-4">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-900 border-2 border-pink-800 p-4">
                <p className="text-purple-200 text-sm leading-relaxed italic">"{t.text}"</p>
                <p className="text-pink-400 text-xs mt-3" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  — {t.name.toUpperCase()} · {t.role.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-10 text-center max-w-3xl mx-auto w-full">
          <SectionTitle>CONTINUE? INSERT COIN</SectionTitle>
          <p className="text-4xl mb-6" style={{ opacity: blink ? 1 : 0 }}>🪙</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {socials.email && (
              <a href={`mailto:${socials.email}`} className="bg-green-400 text-black text-xs px-4 py-2 hover:bg-green-300 flex items-center gap-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                <Mail size={12} /> EMAIL
              </a>
            )}
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noreferrer" className="bg-pink-400 text-black text-xs px-4 py-2 hover:bg-pink-300 flex items-center gap-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                <Github size={12} /> GITHUB
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="bg-yellow-400 text-black text-xs px-4 py-2 hover:bg-yellow-300 flex items-center gap-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                <Linkedin size={12} /> LINKEDIN
              </a>
            )}
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noreferrer" className="bg-cyan-400 text-black text-xs px-4 py-2 hover:bg-cyan-300 flex items-center gap-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                <Twitter size={12} /> TWITTER
              </a>
            )}
          </div>
          <p className="text-gray-700 text-xs" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            © {new Date().getFullYear()} {personal.name.toUpperCase()} · ALL RIGHTS RESERVED
          </p>
        </section>

      </div>
    </>
  );
}
