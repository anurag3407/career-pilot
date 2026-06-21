import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, MapPin, Download, Globe } from "lucide-react";

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] ${className}`}
  >
    {children}
  </div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Hero({ data }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden text-left">
      {/* Gradient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/30 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-pink-500/20 blur-[100px] pointer-events-none" />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Left */}
        <motion.div variants={fadeUp}>
          <GlassCard className="inline-flex items-center gap-2 px-4 py-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/80 text-sm">
              {data.personal.availability ?? "Open to work"}
            </span>
          </GlassCard>

          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            {data.personal.name.split(" ")[0]}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              {data.personal.name.split(" ").slice(1).join(" ")}
            </span>
          </h1>

          <p className="text-white/70 text-lg mb-4">{data.personal.title}</p>
          <p className="text-white/50 text-sm mb-2 flex items-center gap-1">
            <MapPin size={14} className="text-cyan-400" /> {data.personal.location}
          </p>

          <p className="text-white/60 leading-relaxed mb-8">
            {data.personal.shortBio ?? data.personal.bio}
          </p>

          <div className="flex flex-wrap gap-3">
            {data.personal.resumeUrl && (
              <a
                href={data.personal.resumeUrl}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-medium text-sm backdrop-blur-sm transition-all"
              >
                <Download size={16} /> Download CV
              </a>
            )}
            {data.socials.email && (
              <a
                href={`mailto:${data.socials.email}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-400/40 text-cyan-200 font-medium text-sm backdrop-blur-sm transition-all"
              >
                <Mail size={16} /> Contact Me
              </a>
            )}
          </div>

          {/* Socials */}
          <div className="flex gap-4 mt-6">
            {[
              { icon: <Github size={18} />, href: data.socials.github, label: "GitHub" },
              { icon: <Linkedin size={18} />, href: data.socials.linkedin, label: "LinkedIn" },
              { icon: <Twitter size={18} />, href: data.socials.twitter, label: "Twitter" },
              { icon: <Globe size={18} />, href: data.socials.website, label: "Website" },
            ].filter(s => s.href).map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white transition-all"
              >
                {icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right — avatar card */}
        <motion.div variants={fadeUp} className="flex justify-center">
          <GlassCard className="p-6 w-full max-w-sm text-center">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 blur-md opacity-60" />
              <img
                src={data.personal.avatar}
                alt={data.personal.name || "Profile Avatar"}
                className="relative w-32 h-32 rounded-full object-cover border-2 border-white/30 mx-auto"
              />
            </div>
            <h2 className="text-white font-bold text-xl mb-1">{data.personal.name}</h2>
            <p className="text-white/60 text-sm mb-4">{data.personal.title}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: `${data.stats.yearsExperience}+`, label: "Years" },
                { value: `${data.stats.projectsCompleted}+`, label: "Projects" },
                { value: `${data.stats.happyClients}+`, label: "Clients" },
              ].map(({ value, label }) => (
                <div key={label} className="p-2 rounded-xl bg-white/10 border border-white/10">
                  <div className="text-white font-black text-lg">{value}</div>
                  <div className="text-white/50 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </section>
  );
}
