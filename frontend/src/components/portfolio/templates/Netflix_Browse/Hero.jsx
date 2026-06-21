import { motion } from "framer-motion";
import { MapPin, Star, Briefcase, Users } from "lucide-react";

export default function Hero({ personal, stats }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image with Netflix overlay */}
      <div className="absolute inset-0">
        <img
          src={personal.avatar}
          alt={personal.name || "Profile Avatar"}
          className="w-full h-full object-cover object-center opacity-20"
          style={{ filter: "blur(2px) saturate(0.5)" }}
        />
        {/* Left-heavy gradient like Netflix */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
      </div>

      {/* Netflix-style top bar shimmer */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#E50914] via-transparent to-transparent opacity-60" />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-4xl">
        {/* Maturity rating-style badge */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="text-[#E50914] text-xs font-black uppercase tracking-[0.4em] border border-[#E50914] px-2 py-1 rounded">
            Portfolio
          </span>
          <span className="text-[#737373] text-sm flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {personal.location}
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-4"
        >
          {personal.name}
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-[#E50914] text-lg md:text-2xl font-semibold mb-4"
        >
          {personal.title}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-[#e5e5e5] text-base md:text-lg max-w-xl leading-relaxed mb-8"
        >
          {personal.tagline}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap gap-4 mb-14"
        >
          <a
            href="#projects"
            className="flex items-center gap-2 px-8 py-3 bg-[#E50914] text-white font-bold text-base rounded hover:bg-red-700 transition-colors shadow-[0_0_30px_rgba(229,9,20,0.5)]"
          >
            ▶ View Projects
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 px-8 py-3 bg-white/20 backdrop-blur text-white font-bold text-base rounded hover:bg-white/30 transition-colors border border-white/20"
          >
            Contact Me
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-wrap gap-8"
        >
          {[
            { icon: Star, label: "Years Experience", value: `${stats.yearsExperience}+` },
            { icon: Briefcase, label: "Projects", value: `${stats.projectsCompleted}+` },
            { icon: Users, label: "Happy Clients", value: `${stats.happyClients}+` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#E50914]" />
              </div>
              <div>
                <p className="text-white font-bold text-xl leading-none">{value}</p>
                <p className="text-[#737373] text-xs mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Avatar — right side, desktop only */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute right-8 bottom-8 md:right-16 md:bottom-0 hidden md:block"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#E50914]/30 blur-3xl scale-110" />
          <img
            src={personal.avatar}
            alt={personal.name || "Profile Avatar"}
            className="relative w-56 h-56 md:w-72 md:h-72 rounded-full object-cover border-4 border-[#E50914]/60 shadow-[0_0_60px_rgba(229,9,20,0.4)]"
          />
        </div>
      </motion.div>
    </section>
  );
}
