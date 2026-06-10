import React from "react";
import { motion as Motion } from "framer-motion";
import { MapPin, Mail, CheckCircle2, User } from "lucide-react";

export default function About({ data }) {
  const { personal, socials } = data;

  return (
    <section id="about" className="relative py-20 px-4 md:px-8 overflow-hidden">
      {/* Ambient lights */}
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full blur-[120px] bg-pink-600 opacity-5 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-[120px] bg-cyan-500 opacity-5 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div
            className="inline-block px-6 py-3 rounded border-2 border-cyan-400 mb-4"
            style={{
              background: "rgba(0,212,255,0.05)",
              boxShadow: "0 0 20px #00d4ff, 0 0 40px #00d4ff40",
            }}
          >
            <h2
              className="text-3xl md:text-4xl font-black uppercase tracking-widest text-cyan-300"
              style={{
                fontFamily: "'Courier New', monospace",
                textShadow: "0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 40px #00d4ff",
              }}
            >
              ✦ ABOUT ME ✦
            </h2>
          </div>
          <div
            className="w-40 h-1 mx-auto mt-2 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, #00d4ff, transparent)",
              boxShadow: "0 0 10px #00d4ff",
            }}
          />
        </Motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left — Avatar & quick stats */}
          <Motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Avatar with neon glow */}
            <div className="relative">
              <div
                className="w-52 h-52 rounded-full overflow-hidden border-4 border-pink-400"
                style={{
                  boxShadow: "0 0 20px #ff2bd6, 0 0 40px #ff2bd640, inset 0 0 20px rgba(255,43,214,0.1)",
                }}
              >
                <img
                  src={personal.avatar}
                  alt={personal.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Status dot */}
              <div
                className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-green-400 border-2 border-black"
                style={{ boxShadow: "0 0 10px #39ff14" }}
              />
            </div>

            {/* Name */}
            <div className="text-center">
              <h3
                className="text-2xl font-black text-white uppercase"
                style={{
                  fontFamily: "'Courier New', monospace",
                  textShadow: "0 0 10px #ff2bd6, 0 0 20px #ff2bd640",
                }}
              >
                {personal.name}
              </h3>
              <p
                className="text-pink-400 text-xs font-bold tracking-widest uppercase mt-1"
                style={{ textShadow: "0 0 6px #ff2bd6" }}
              >
                {personal.title}
              </p>
            </div>

            {/* Availability badge */}
            <Motion.div
              animate={{ boxShadow: ["0 0 10px #39ff14", "0 0 25px #39ff14", "0 0 10px #39ff14"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-full px-5 py-3 rounded-lg border-2 border-green-400 flex items-center justify-center gap-2"
              style={{ background: "rgba(57,255,20,0.05)" }}
            >
              <CheckCircle2 size={16} className="text-green-400" style={{ filter: "drop-shadow(0 0 6px #39ff14)" }} />
              <span
                className="text-green-300 font-black text-xs tracking-widest uppercase"
                style={{ fontFamily: "'Courier New', monospace", textShadow: "0 0 8px #39ff14" }}
              >
                AVAILABLE FOR HIRE
              </span>
            </Motion.div>
          </Motion.div>

          {/* Right — Main about card */}
          <Motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div
              className="rounded-2xl border-2 border-pink-500 p-6 md:p-8 relative overflow-hidden group hover:border-pink-400 transition-all duration-500"
              style={{
                background: "rgba(255,43,214,0.04)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 0 30px #ff2bd620, inset 0 0 30px #ff2bd608",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 50px #ff2bd640, inset 0 0 40px #ff2bd610";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 30px #ff2bd620, inset 0 0 30px #ff2bd608";
              }}
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400" style={{ boxShadow: "0 0 8px #00d4ff" }} />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400" style={{ boxShadow: "0 0 8px #00d4ff" }} />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400" style={{ boxShadow: "0 0 8px #00d4ff" }} />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400" style={{ boxShadow: "0 0 8px #00d4ff" }} />

              {/* Section label */}
              <div className="flex items-center gap-3 mb-6">
                <User size={20} className="text-pink-400" style={{ filter: "drop-shadow(0 0 6px #ff2bd6)" }} />
                <span
                  className="text-pink-400 font-black text-xs tracking-widest uppercase"
                  style={{ fontFamily: "'Courier New', monospace", textShadow: "0 0 6px #ff2bd6" }}
                >
                  BIO.TXT
                </span>
              </div>

              {/* Bio */}
              <p
                className="text-gray-300 leading-relaxed text-sm md:text-base mb-8"
                style={{ fontFamily: "'Courier New', monospace" }}
              >
                {personal.bio}
              </p>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: MapPin,
                    label: "LOCATION",
                    value: personal.location,
                    color: "#00d4ff",
                  },
                  {
                    icon: Mail,
                    label: "EMAIL",
                    value: socials.email,
                    color: "#ff2bd6",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/10"
                      style={{
                        background: `rgba(${item.color === "#00d4ff" ? "0,212,255" : "255,43,214"},0.04)`,
                        boxShadow: `0 0 8px ${item.color}20`,
                      }}
                    >
                      <Icon
                        size={16}
                        style={{ color: item.color, filter: `drop-shadow(0 0 6px ${item.color})` }}
                      />
                      <div>
                        <div
                          className="text-gray-500 text-xs font-bold tracking-widest uppercase"
                          style={{ fontFamily: "'Courier New', monospace" }}
                        >
                          {item.label}
                        </div>
                        <div
                          className="text-gray-200 text-sm font-medium"
                          style={{ fontFamily: "'Courier New', monospace" }}
                        >
                          {item.value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Social links */}
              <div className="flex flex-wrap gap-3 mt-6">
                {Object.entries(socials).map(([platform, url]) => {
                  if (!url) return null;
                  const colors = {
                    github: "#b026ff",
                    linkedin: "#00d4ff",
                    twitter: "#00ffff",
                    email: "#ff2bd6",
                  };
                  const color = colors[platform] || "#ff2bd6";
                  return (
                    <Motion.a
                      key={platform}
                      href={platform === "email" ? `mailto:${url}` : url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded border text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
                      style={{
                        fontFamily: "'Courier New', monospace",
                        borderColor: color,
                        color: color,
                        background: `${color}10`,
                        boxShadow: `0 0 10px ${color}30`,
                        textShadow: `0 0 6px ${color}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 20px ${color}, 0 0 40px ${color}50`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 10px ${color}30`;
                      }}
                    >
                      {platform}
                    </Motion.a>
                  );
                })}
              </div>
            </div>
          </Motion.div>
        </div>
      </div>
    </section>
  );
}
