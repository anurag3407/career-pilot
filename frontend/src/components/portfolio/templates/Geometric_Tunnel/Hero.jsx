import { useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, ChevronDown } from "lucide-react";
import data from "../../../../data/dummy_data.json";

export default function Hero() {
  const { personal, socials } = data;

  // Mouse parallax rings
  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e) => {
      mouseX.set((e.clientX / window.innerWidth)  * 50 - 25);
      mouseY.set((e.clientY / window.innerHeight) * 50 - 25);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const { scrollYProgress } = useScroll();

  const socList = [
    { Icon: Github,   href: socials?.github,           label: "GitHub"   },
    { Icon: Linkedin, href: socials?.linkedin,          label: "LinkedIn" },
    { Icon: Twitter,  href: socials?.twitter,           label: "Twitter"  },
    { Icon: Mail,     href: `mailto:${socials?.email}`, label: "Email"    },
  ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative py-20 text-center">

      {/* Parallax dashed squares reacting to mouse */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {[0, 1, 2, 3, 4].map(i => {
          const s = useTransform(scrollYProgress, [0, 0.4], [1 + i * 0.3, 2.5 + i * 0.6]);
          return (
            <motion.div
              key={i}
              className="absolute border border-dashed border-indigo-500/12 rounded-xl"
              style={{
                width:  `${280 + i * 130}px`,
                height: `${280 + i * 130}px`,
                x: springX,
                y: springY,
                rotate: i * 15,
                scale: s,
              }}
            />
          );
        })}
      </div>

      {/* Content — no card, fully transparent, tunnel shows through */}
      <div className="relative z-10 flex flex-col items-center gap-6">

        {/* Avatar with rotating rings */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center"
        >
          <motion.div
            className="absolute inset-0 border-2 border-indigo-400 rounded-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 border border-dashed border-purple-400/70 rounded-2xl"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <img
            src={personal?.avatar || "https://api.dicebear.com/7.x/shapes/svg?seed=geo"}
            alt={personal?.name}
            className="w-20 h-20 md:w-28 md:h-28 rounded-xl object-cover z-10 shadow-2xl"
            style={{ boxShadow: "0 0 40px rgba(99,102,241,0.25)" }}
          />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-9xl font-extrabold tracking-tighter text-white leading-none"
          style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
        >
          {personal?.name || "Your Name"}
        </motion.h1>

        {/* Title — continuous shimmer, no bio/other text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-xl md:text-2xl font-semibold tracking-widest uppercase"
          style={{
            backgroundImage: "linear-gradient(to right, #818cf8, #c084fc, #f472b6, #818cf8)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 5s linear infinite",
          }}
        >
          {personal?.title}
        </motion.p>

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex items-center gap-4"
        >
          {socList.map(({ Icon, href, label }) => href && (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.2, y: -4 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-xl border border-white/10 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/10 backdrop-blur-sm transition-all duration-300"
              style={{ background: "rgba(5,5,10,0.4)" }}
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-indigo-400/50 z-10"
      >
        <ChevronDown size={26} />
      </motion.div>

      <style>{`
        @keyframes shimmer {
          from { background-position: 0% center; }
          to   { background-position: 200% center; }
        }
      `}</style>
    </section>
  );
}