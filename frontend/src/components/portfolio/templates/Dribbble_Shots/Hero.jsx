import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Twitter, Mail } from "lucide-react";
import data from "../../../../data/dummy_data.json";

// Animated morphing blob SVG that floats behind avatar
function MorphBlob() {
  return (
    <motion.div
      className="absolute inset-0 -z-10"
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
        <motion.path
          fill="#ea4c89"
          animate={{
            d: [
              "M44.3,-67.2C56.6,-60.3,65.2,-46.8,70.1,-32.2C75,-17.6,76.1,-1.9,72.8,12.8C69.5,27.5,61.8,41.2,51,51.6C40.2,62,26.3,69.1,11.1,72.4C-4.2,75.7,-20.7,75.2,-34.6,69.1C-48.5,63,-59.7,51.2,-66.2,37.3C-72.7,23.4,-74.4,7.3,-72.1,-8.1C-69.8,-23.5,-63.5,-38.2,-53.2,-48.6C-42.9,-59,-28.6,-65.1,-14.2,-67.8C0.2,-70.5,31.9,-74.1,44.3,-67.2Z",
              "M47.5,-72C60.3,-63.5,69.2,-49.3,73.8,-34C78.4,-18.7,78.6,-2.4,74.5,12.4C70.4,27.2,62,40.5,51.1,51.2C40.2,61.9,26.8,70,12,73.4C-2.8,76.8,-19,75.6,-33.2,69.7C-47.4,63.8,-59.6,53.2,-67.7,39.8C-75.8,26.4,-79.8,10.2,-78.5,-5.6C-77.2,-21.4,-70.6,-36.8,-60.2,-48.4C-49.8,-60,-35.6,-67.8,-21.1,-72.1C-6.6,-76.4,8.2,-77.2,22.5,-74.1C36.8,-71,51.5,-64,47.5,-72Z",
              "M44.3,-67.2C56.6,-60.3,65.2,-46.8,70.1,-32.2C75,-17.6,76.1,-1.9,72.8,12.8C69.5,27.5,61.8,41.2,51,51.6C40.2,62,26.3,69.1,11.1,72.4C-4.2,75.7,-20.7,75.2,-34.6,69.1C-48.5,63,-59.7,51.2,-66.2,37.3C-72.7,23.4,-74.4,7.3,-72.1,-8.1C-69.8,-23.5,-63.5,-38.2,-53.2,-48.6C-42.9,-59,-28.6,-65.1,-14.2,-67.8C0.2,-70.5,31.9,-74.1,44.3,-67.2Z",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}

// Continuously cycling role titles
function CyclingTitle({ titles }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % titles.length), 2800);
    return () => clearInterval(t);
  }, [titles.length]);

  return (
    <div className="relative h-9 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: 36, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -36, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 text-2xl md:text-3xl font-light text-[#ea4c89] tracking-tight"
        >
          {titles[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// Floating particle field
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1.5,
    dur: 6 + Math.random() * 8,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#ea4c89]"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: 0.25 }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const { personal, stats, socials } = data;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const titleWords = (personal?.title || "Creative Developer").split(" ");
  const cyclingRoles = titleWords.length > 1 ? titleWords : ["Designer", "Developer", "Creator"];

  const sociaLinks = [
    { icon: Github,   href: socials?.github,   label: "GitHub" },
    { icon: Linkedin, href: socials?.linkedin,  label: "LinkedIn" },
    { icon: Twitter,  href: socials?.twitter,   label: "Twitter" },
    { icon: Mail,     href: `mailto:${socials?.email}`, label: "Email" },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 md:px-16 overflow-hidden"
    >
      <Particles />

      <motion.div style={{ y, opacity }} className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center gap-0">

          {/* Availability pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/70 border border-[#ea4c89]/20 shadow-sm mb-10 backdrop-blur-sm"
          >
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#ea4c89]"
            />
            <span className="text-[10px] text-[#ea4c89] tracking-[0.2em] uppercase font-semibold">
              Open to opportunities
            </span>
          </motion.div>

          {/* Avatar with morphing blob */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-28 h-28 mb-8"
          >
            <MorphBlob />
            {/* Rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-10px] rounded-full"
              style={{
                background: "conic-gradient(from 0deg, transparent 70%, #ea4c89 100%)",
                borderRadius: "50%",
                padding: "1.5px",
              }}
            >
              <div className="w-full h-full rounded-full bg-white" />
            </motion.div>
            <img
              src={personal?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=portfolio"}
              alt={personal?.name}
              className="absolute inset-0 w-full h-full rounded-full object-cover border-2 border-white shadow-md"
            />
          </motion.div>

          {/* Name */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-[#1a1a1a] leading-none tracking-tight"
            >
              {personal?.name || "Alex Morgan"}
            </motion.h1>
          </div>

          {/* Cycling role */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <CyclingTitle titles={cyclingRoles} />
          </motion.div>

          {/* Bio — short */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-[#888] text-sm md:text-base leading-relaxed max-w-sm mb-10"
          >
            {personal?.bio?.slice(0, 120) || "Crafting digital experiences that feel alive."}
            {(personal?.bio?.length || 0) > 120 ? "…" : ""}
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center gap-4 mb-12 flex-wrap justify-center"
          >
            <a href="#projects">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(234,76,137,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-3 bg-[#ea4c89] text-white rounded-full text-sm font-semibold tracking-wide shadow-[0_4px_24px_rgba(234,76,137,0.25)] transition-shadow"
              >
                See my work <ArrowUpRight size={14} />
              </motion.button>
            </a>
            <a href="#contact">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3 border border-[#e0e0e0] text-[#555] rounded-full text-sm font-medium hover:border-[#ea4c89]/40 hover:text-[#ea4c89] transition-all bg-white/60 backdrop-blur-sm"
              >
                Get in touch
              </motion.button>
            </a>
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-3 mb-14"
          >
            {sociaLinks.map(({ icon: Icon, href, label }, i) => (
              <motion.a
                key={label}
                href={href || "#"}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.07 }}
                whileHover={{ y: -3, scale: 1.15 }}
                className="w-9 h-9 rounded-full bg-white border border-[#e8e8e8] shadow-sm flex items-center justify-center text-[#aaa] hover:text-[#ea4c89] hover:border-[#ea4c89]/30 transition-colors"
              >
                <Icon size={14} />
              </motion.a>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="flex items-center gap-8 md:gap-16"
          >
            {[
              { val: `${data.stats?.projectsCompleted || 120}+`, label: "Projects" },
              { val: `${data.stats?.yearsExperience || 8}+`,    label: "Years" },
              { val: `${data.stats?.happyClients || 60}+`,      label: "Clients" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2 + i * 0.1, type: "spring", stiffness: 200 }}
                  className="text-2xl md:text-3xl font-black text-[#1a1a1a]"
                >
                  {s.val}
                </motion.div>
                <div className="text-[10px] text-[#bbb] tracking-widest uppercase mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>

        </div>
      </motion.div>

      {/* Decorative bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}