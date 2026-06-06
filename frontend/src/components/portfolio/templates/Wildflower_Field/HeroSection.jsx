// HeroSection.jsx
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, MapPin, ArrowDown } from "lucide-react";
import { Daisy, Poppy, ButtercupFlower, CornflowerBlue, WildLeaf, SmallPetal, TinyLeaf, WatercolorBlob } from "./WildflowerSVGs";

const floatingPetals = [
  { color: "#fbcfe8", x: "8%", y: "15%", size: 18, delay: 0, duration: 6 },
  { color: "#fde68a", x: "88%", y: "22%", size: 14, delay: 1.2, duration: 7 },
  { color: "#c4b5fd", x: "15%", y: "70%", size: 16, delay: 0.6, duration: 8 },
  { color: "#bbf7d0", x: "78%", y: "60%", size: 12, delay: 2, duration: 6.5 },
  { color: "#fca5a5", x: "45%", y: "88%", size: 15, delay: 0.3, duration: 7.5 },
  { color: "#fbcfe8", x: "92%", y: "78%", size: 10, delay: 1.8, duration: 9 },
  { color: "#fde68a", x: "5%", y: "42%", size: 13, delay: 2.5, duration: 6 },
  { color: "#a5f3fc", x: "60%", y: "12%", size: 11, delay: 0.9, duration: 8 },
  { color: "#c4b5fd", x: "32%", y: "6%", size: 14, delay: 1.5, duration: 7 },
  { color: "#fca5a5", x: "73%", y: "42%", size: 9, delay: 3, duration: 6.5 },
  { color: "#bbf7d0", x: "22%", y: "92%", size: 12, delay: 0.4, duration: 9 },
  { color: "#fde68a", x: "55%", y: "78%", size: 16, delay: 2.2, duration: 7 },
];

const FloatingPetal = ({ color, x, y, size, delay, duration }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    animate={{
      y: [-12, 12, -8, 12, -12],
      x: [-6, 8, -10, 4, -6],
      rotate: [0, 25, -15, 20, 0],
      opacity: [0.6, 0.9, 0.7, 0.85, 0.6],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <svg width={size} height={size * 2} viewBox="0 0 20 40" aria-hidden="true">
      <ellipse cx="10" cy="20" rx="7" ry="16" fill={color} opacity="0.75" />
    </svg>
  </motion.div>
);

export default function HeroSection({ data }) {
  const { personal, socials, stats } = data;

  const socialLinks = [
    { href: socials.github, icon: Github, label: "GitHub" },
    { href: socials.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: socials.twitter, icon: Twitter, label: "Twitter" },
    { href: `mailto:${socials.email}`, icon: Mail, label: "Email" },
  ];

  const statItems = [
    { value: `${stats.yearsExperience}+`, label: "Years Experience" },
    { value: `${stats.projectsCompleted}+`, label: "Projects Built" },
    { value: `${stats.happyClients}+`, label: "Happy Clients" },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fdf6f0 0%, #fef3f8 35%, #f0fdf4 70%, #fefce8 100%)" }}
    >
      {/* Watercolor blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20"
          animate={{ scale: [1, 1.05, 1], rotate: [0, 3, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <WatercolorBlob width={380} height={280} color="#fce7f3" id="hero-bl1" />
        </motion.div>
        <motion.div
          className="absolute top-10 right-0"
          animate={{ scale: [1, 1.04, 1], rotate: [0, -4, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <WatercolorBlob width={340} height={240} color="#ecfdf5" id="hero-bl2" />
        </motion.div>
        <motion.div
          className="absolute bottom-0 left-1/3"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <WatercolorBlob width={400} height={260} color="#fefce8" id="hero-bl3" />
        </motion.div>
      </div>

      {/* Floating petals */}
      {floatingPetals.map((petal, i) => (
        <FloatingPetal key={i} {...petal} />
      ))}

      {/* Corner flowers */}
      <motion.div
        className="absolute top-6 left-6 hidden md:block"
        animate={{ rotate: [0, 8, -5, 8, 0], y: [-3, 3, -3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Daisy size={72} color="#fda4af" centerColor="#fde68a" />
      </motion.div>
      <motion.div
        className="absolute top-8 right-8 hidden md:block"
        animate={{ rotate: [0, -6, 5, -6, 0], y: [3, -3, 3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <ButtercupFlower size={60} color="#fde68a" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 right-12 hidden lg:block"
        animate={{ rotate: [0, 10, -8, 10, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Poppy size={64} color="#fca5a5" />
      </motion.div>
      <motion.div
        className="absolute bottom-24 left-10 hidden lg:block"
        animate={{ rotate: [0, -8, 6, -8, 0], y: [-2, 4, -2] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <CornflowerBlue size={56} color="#93c5fd" />
      </motion.div>

      {/* Wild leaves scattered */}
      <motion.div
        className="absolute top-1/3 right-4 hidden lg:block"
        animate={{ rotate: [-5, 8, -5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <WildLeaf size={44} color="#86efac" />
      </motion.div>
      <motion.div
        className="absolute top-20 left-1/4 hidden md:block"
        animate={{ rotate: [5, -6, 5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <TinyLeaf size={28} color="#bbf7d0" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        {/* Location badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-sm font-medium"
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(253,186,216,0.5)",
            color: "#be185d",
          }}
        >
          <MapPin size={14} />
          {personal.location}
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-serif text-6xl md:text-8xl lg:text-9xl mb-4 leading-none tracking-tight"
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            background: "linear-gradient(135deg, #be185d 0%, #9d174d 40%, #065f46 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {personal.name}
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-2xl font-light tracking-widest uppercase mb-6"
          style={{ color: "#6b7280", fontFamily: "'Cormorant Garamond', 'Georgia', serif", letterSpacing: "0.18em" }}
        >
          {personal.title}
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="h-px w-16 md:w-24 block" style={{ background: "linear-gradient(to right, transparent, #fda4af)" }} />
          <Daisy size={22} color="#fda4af" centerColor="#fde68a" />
          <span className="h-px w-16 md:w-24 block" style={{ background: "linear-gradient(to left, transparent, #fda4af)" }} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-base md:text-lg italic mb-10 max-w-xl mx-auto"
          style={{ color: "#9ca3af", fontFamily: "'Cormorant Garamond', 'Georgia', serif", fontSize: "1.15rem" }}
        >
          "{personal.tagline}"
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-full text-white font-medium text-sm tracking-wide shadow-lg"
            style={{
              background: "linear-gradient(135deg, #be185d 0%, #9d174d 100%)",
              boxShadow: "0 8px 25px rgba(190,24,93,0.3)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1rem",
              letterSpacing: "0.08em",
            }}
          >
            View My Work
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-full font-medium text-sm tracking-wide"
            style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(190,24,93,0.35)",
              color: "#be185d",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1rem",
              letterSpacing: "0.08em",
            }}
          >
            Get In Touch
          </motion.a>
        </motion.div>

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="flex justify-center gap-4 mb-16"
        >
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(253,186,216,0.5)",
                color: "#be185d",
              }}
            >
              <Icon size={16} />
            </motion.a>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
        >
          {statItems.map(({ value, label }, i) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.05, y: -4 }}
              className="py-5 px-3 rounded-2xl text-center"
              style={{
                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(253,186,216,0.4)",
                boxShadow: "0 4px 20px rgba(190,24,93,0.08)",
              }}
            >
              <div
                className="text-3xl font-bold mb-1"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  background: "linear-gradient(135deg, #be185d, #065f46)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {value}
              </div>
              <div className="text-xs tracking-wider uppercase" style={{ color: "#9ca3af", letterSpacing: "0.1em" }}>
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 2, duration: 0.5 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "#be185d" }}
      >
        <span className="text-xs tracking-widest uppercase" style={{ letterSpacing: "0.18em", fontSize: "0.65rem", color: "#9ca3af" }}>
          Scroll
        </span>
        <ArrowDown size={16} />
      </motion.div>
    </section>
  );
}
