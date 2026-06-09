import { motion } from "framer-motion";
import { MapPin, Mail } from "lucide-react";

export default function About({ personal, socials }) {
  return (
    <section id="about" className="py-16 px-4 md:px-12">
      {/* Section row header */}
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-white text-xl md:text-2xl font-bold tracking-wide mb-8"
      >
        👤 About Me
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row gap-8 bg-[#1f1f1f] rounded-xl overflow-hidden border border-white/5"
      >
        {/* Avatar panel */}
        <div className="relative md:w-64 flex-shrink-0">
          <img
            src={personal.avatar}
            alt={personal.name}
            className="w-full h-64 md:h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#1f1f1f]" />
        </div>

        {/* Bio panel */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E50914] border border-[#E50914]/50 px-2 py-0.5 rounded">
              Bio
            </span>
          </div>
          <h3 className="text-white text-2xl md:text-3xl font-black mb-4">
            {personal.name}
          </h3>
          <p className="text-[#e5e5e5] text-base leading-relaxed mb-6">
            {personal.bio}
          </p>

          {/* Info chips */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="flex items-center gap-1.5 text-sm text-[#a3a3a3] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-[#E50914]" />
              {personal.location}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[#a3a3a3] bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <Mail className="w-3.5 h-3.5 text-[#E50914]" />
              {socials.email}
            </span>
          </div>

          {/* Social links */}
          <div className="flex gap-3">
            {[
              { href: socials.github, label: "GitHub", icon: "⌥" },
              { href: socials.linkedin, label: "LinkedIn", icon: "in" },
              { href: socials.twitter, label: "Twitter", icon: "𝕏" },
            ].map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#E50914]/10 border border-[#E50914]/30 flex items-center justify-center text-[#E50914] text-sm font-bold hover:bg-[#E50914] hover:text-white transition-all duration-200"
                aria-label={label}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
