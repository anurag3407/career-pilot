import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Send, MessageSquare } from "lucide-react";

export default function Contact({ data }) {
  const { socials, personal } = data;
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const socialLinks = [
    {
      key: "github",
      icon: Github,
      label: "GITHUB",
      url: socials.github,
      color: "#b026ff",
    },
    {
      key: "linkedin",
      icon: Linkedin,
      label: "LINKEDIN",
      url: socials.linkedin,
      color: "#00d4ff",
    },
    {
      key: "twitter",
      icon: Twitter,
      label: "TWITTER",
      url: socials.twitter,
      color: "#00ffff",
    },
    {
      key: "email",
      icon: Mail,
      label: "EMAIL",
      url: `mailto:${socials.email}`,
      color: "#ff2bd6",
    },
  ];

  return (
    <section id="contact" className="relative py-20 px-4 md:px-8 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-96 rounded-full blur-[150px] bg-pink-700 opacity-5 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[100px] bg-cyan-600 opacity-5 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-[100px] bg-purple-600 opacity-5 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
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
              ✉ CONTACT ✉
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT — CTA + Social links */}
          <Motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-8"
          >
            {/* Big CTA card */}
            <div
              className="rounded-2xl border-2 border-pink-500 p-8 relative overflow-hidden"
              style={{
                background: "rgba(255,43,214,0.04)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 0 30px #ff2bd620",
              }}
            >
              {/* Neon corner dots */}
              {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos, i) => (
                <div
                  key={i}
                  className={`absolute ${pos} w-2 h-2 rounded-full bg-pink-400`}
                  style={{ boxShadow: "0 0 6px #ff2bd6, 0 0 12px #ff2bd6" }}
                />
              ))}

              <div className="flex items-start gap-3 mb-4">
                <MessageSquare
                  size={24}
                  className="text-pink-400 mt-1 shrink-0"
                  style={{ filter: "drop-shadow(0 0 8px #ff2bd6)" }}
                />
                <div>
                  <h3
                    className="text-xl font-black uppercase tracking-wide text-pink-300 mb-2"
                    style={{
                      fontFamily: "'Courier New', monospace",
                      textShadow: "0 0 10px #ff2bd6",
                    }}
                  >
                    LET'S BUILD SOMETHING
                  </h3>
                  <p
                    className="text-gray-400 text-sm leading-relaxed"
                    style={{ fontFamily: "'Courier New', monospace" }}
                  >
                    Have a project in mind? I'm always open to new opportunities,
                    collaborations, and exciting challenges. Let's make something amazing.
                  </p>
                </div>
              </div>

              <Motion.a
                href={`mailto:${socials.email}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-4 flex items-center justify-center gap-3 w-full py-3 rounded-lg border-2 border-pink-400 text-pink-300 font-black text-sm uppercase tracking-widest cursor-pointer transition-all"
                style={{
                  fontFamily: "'Courier New', monospace",
                  background: "rgba(255,43,214,0.08)",
                  boxShadow: "0 0 15px #ff2bd640",
                  textShadow: "0 0 8px #ff2bd6",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 30px #ff2bd6, inset 0 0 20px rgba(255,43,214,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 15px #ff2bd640";
                }}
              >
                <Send size={16} style={{ filter: "drop-shadow(0 0 4px #ff2bd6)" }} />
                SEND A MESSAGE
              </Motion.a>
            </div>

            {/* Social links grid */}
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map(({ key, icon: Icon, label, url, color }) => (
                <Motion.a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredSocial(key)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  className="group flex flex-col items-center gap-3 py-5 px-4 rounded-xl border-2 cursor-pointer transition-all duration-300"
                  style={{
                    borderColor: hoveredSocial === key ? color : `${color}40`,
                    background: hoveredSocial === key ? `${color}10` : `${color}04`,
                    boxShadow:
                      hoveredSocial === key
                        ? `0 0 30px ${color}, 0 0 60px ${color}40`
                        : `0 0 10px ${color}20`,
                  }}
                >
                  <Icon
                    size={28}
                    style={{
                      color,
                      filter: `drop-shadow(0 0 ${hoveredSocial === key ? "12px" : "6px"} ${color})`,
                      transition: "filter 0.3s",
                    }}
                  />
                  <span
                    className="text-xs font-black uppercase tracking-widest"
                    style={{
                      fontFamily: "'Courier New', monospace",
                      color,
                      textShadow: `0 0 ${hoveredSocial === key ? "10px" : "4px"} ${color}`,
                      transition: "text-shadow 0.3s",
                    }}
                  >
                    {label}
                  </span>
                </Motion.a>
              ))}
            </div>
          </Motion.div>

          {/* RIGHT — Big neon sign footer CTA */}
          <Motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            {/* Neon OPEN sign */}
            <div
              className="rounded-2xl border-4 border-orange-400 p-8 flex flex-col items-center justify-center gap-4 relative overflow-hidden"
              style={{
                background: "rgba(255,140,0,0.04)",
                boxShadow: "0 0 30px #ff8c00, 0 0 60px #ff8c0030",
                minHeight: "200px",
              }}
            >
              <Motion.div
                animate={{
                  textShadow: [
                    "0 0 10px #ff8c00, 0 0 20px #ff8c00, 0 0 40px #ff8c00",
                    "0 0 20px #ff8c00, 0 0 40px #ff8c00, 0 0 80px #ff8c00",
                    "0 0 10px #ff8c00, 0 0 20px #ff8c00, 0 0 40px #ff8c00",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-5xl md:text-6xl font-black uppercase tracking-widest text-orange-300 text-center"
                style={{ fontFamily: "'Courier New', monospace" }}
              >
                OPEN
              </Motion.div>
              <div
                className="text-orange-400 text-xs font-black tracking-[0.4em] uppercase"
                style={{ fontFamily: "'Courier New', monospace", textShadow: "0 0 8px #ff8c00" }}
              >
                FOR OPPORTUNITIES
              </div>
              {/* Blinking dot */}
              <Motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-orange-400"
                style={{ boxShadow: "0 0 10px #ff8c00" }}
              />
            </div>

            {/* Contact info cards */}
            <div
              className="rounded-2xl border border-cyan-500 p-6 relative overflow-hidden"
              style={{
                background: "rgba(0,212,255,0.04)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 0 20px #00d4ff20",
              }}
            >
              <h4
                className="text-cyan-300 font-black text-xs tracking-widest uppercase mb-4"
                style={{
                  fontFamily: "'Courier New', monospace",
                  textShadow: "0 0 6px #00d4ff",
                }}
              >
                DIRECT CONTACT
              </h4>

              <div className="flex flex-col gap-3">
                {[
                  { icon: Mail, label: socials.email, href: `mailto:${socials.email}`, color: "#ff2bd6" },
                  { icon: Github, label: "GitHub Profile", href: socials.github, color: "#b026ff" },
                  { icon: Linkedin, label: "LinkedIn Profile", href: socials.linkedin, color: "#00d4ff" },
                ].map(({ icon: Icon, label, href, color }, i) => (
                  <Motion.a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 py-2 px-3 rounded-lg border border-white/5 hover:border-white/15 transition-all duration-300 cursor-pointer group"
                    style={{ background: `${color}05` }}
                  >
                    <Icon
                      size={16}
                      style={{ color, filter: `drop-shadow(0 0 4px ${color})` }}
                    />
                    <span
                      className="text-gray-400 group-hover:text-gray-200 text-xs font-medium transition-colors truncate"
                      style={{ fontFamily: "'Courier New', monospace" }}
                    >
                      {label}
                    </span>
                  </Motion.a>
                ))}
              </div>
            </div>

            {/* Footer signature */}
            <div className="text-center py-4">
              <p
                className="text-gray-600 text-xs tracking-widest uppercase"
                style={{ fontFamily: "'Courier New', monospace" }}
              >
                crafted with{" "}
                <span className="text-pink-500" style={{ textShadow: "0 0 6px #ff2bd6" }}>
                  ♥
                </span>{" "}
                by{" "}
                <span
                  className="text-cyan-500"
                  style={{ textShadow: "0 0 6px #00d4ff" }}
                >
                  {personal.name}
                </span>
              </p>
            </div>
          </Motion.div>
        </div>
      </div>
    </section>
  );
}
