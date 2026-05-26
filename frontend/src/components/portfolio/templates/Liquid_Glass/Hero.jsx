import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  ChevronDown,
  Briefcase,
  FolderGit2,
  Users,
} from "lucide-react";

/* ──────────────────────────────────────────────
   CSS keyframe animations for floating orbs
   Injected once via a <style> tag so we don't
   need an external stylesheet.
   ────────────────────────────────────────────── */
const orbKeyframes = `
@keyframes float-orb-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25%      { transform: translate(60px, -80px) scale(1.12); }
  50%      { transform: translate(-40px, -140px) scale(0.95); }
  75%      { transform: translate(80px, -60px) scale(1.08); }
}
@keyframes float-orb-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25%      { transform: translate(-90px, 50px) scale(1.1); }
  50%      { transform: translate(70px, 100px) scale(0.92); }
  75%      { transform: translate(-50px, -30px) scale(1.05); }
}
@keyframes float-orb-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25%      { transform: translate(100px, 40px) scale(0.9); }
  50%      { transform: translate(-60px, -90px) scale(1.15); }
  75%      { transform: translate(30px, 70px) scale(1.02); }
}
@keyframes float-orb-4 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%      { transform: translate(-70px, -100px) scale(1.08); }
  66%      { transform: translate(50px, 60px) scale(0.93); }
}
@keyframes float-orb-5 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  20%      { transform: translate(40px, 70px) scale(1.1); }
  40%      { transform: translate(-80px, 30px) scale(0.95); }
  60%      { transform: translate(60px, -50px) scale(1.06); }
  80%      { transform: translate(-30px, -80px) scale(0.98); }
}
@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; }
  50%      { opacity: 1; }
}
@keyframes bounce-chevron {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50%      { transform: translateY(10px); opacity: 1; }
}
`;

/* ──────────────────────────────────────────────
   Animated background orb definitions
   ────────────────────────────────────────────── */
const orbs = [
  {
    color: "bg-sky-400/18",
    size: "w-[420px] h-[420px] md:w-[600px] md:h-[600px]",
    position: "top-[-10%] left-[-8%]",
    animation: "float-orb-1 18s ease-in-out infinite",
    blur: "blur-[100px]",
  },
  {
    color: "bg-cyan-400/16",
    size: "w-[350px] h-[350px] md:w-[520px] md:h-[520px]",
    position: "top-[20%] right-[-6%]",
    animation: "float-orb-2 22s ease-in-out infinite",
    blur: "blur-[120px]",
  },
  {
    color: "bg-sky-300/16",
    size: "w-[300px] h-[300px] md:w-[450px] md:h-[450px]",
    position: "bottom-[5%] left-[10%]",
    animation: "float-orb-3 20s ease-in-out infinite",
    blur: "blur-[110px]",
  },
  {
    color: "bg-cyan-300/14",
    size: "w-[250px] h-[250px] md:w-[380px] md:h-[380px]",
    position: "bottom-[30%] right-[15%]",
    animation: "float-orb-4 25s ease-in-out infinite",
    blur: "blur-[90px]",
  },
  {
    color: "bg-sky-200/12",
    size: "w-[200px] h-[200px] md:w-[340px] md:h-[340px]",
    position: "top-[50%] left-[40%]",
    animation: "float-orb-5 28s ease-in-out infinite",
    blur: "blur-[130px]",
  },
];

/* ──────────────────────────────────────────────
   Framer-motion variants
   ────────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const avatarVariant = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 180, damping: 18 },
  },
};

const statCardVariant = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const socialVariant = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

/* ──────────────────────────────────────────────
   Social link config helper
   ────────────────────────────────────────────── */
const buildSocials = (socials) => {
  const list = [];
  if (socials?.github)
    list.push({
      Icon: Github,
      href: socials.github,
      label: "GitHub",
    });
  if (socials?.linkedin)
    list.push({
      Icon: Linkedin,
      href: socials.linkedin,
      label: "LinkedIn",
    });
  if (socials?.twitter)
    list.push({
      Icon: Twitter,
      href: socials.twitter,
      label: "Twitter",
    });
  if (socials?.email)
    list.push({
      Icon: Mail,
      href: `mailto:${socials.email}`,
      label: "Email",
    });
  return list;
};

/* ──────────────────────────────────────────────
   Stats config helper
   ────────────────────────────────────────────── */
const buildStats = (stats) => {
  const list = [];
  if (stats?.yearsExperience != null)
    list.push({
      value: stats.yearsExperience,
      label: "Years Exp.",
      Icon: Briefcase,
    });
  if (stats?.projectsCompleted != null)
    list.push({
      value: stats.projectsCompleted,
      label: "Projects",
      Icon: FolderGit2,
    });
  if (stats?.happyClients != null)
    list.push({
      value: stats.happyClients,
      label: "Clients",
      Icon: Users,
    });
  return list;
};

/* ══════════════════════════════════════════════
   HERO COMPONENT
   ══════════════════════════════════════════════ */
export default function Hero({ data }) {
  const personal = data?.personal ?? {};
  const socials = buildSocials(data?.socials);
  const stats = buildStats(data?.stats);

  return (
    <>
      {/* Inject keyframe animations */}
      <style>{orbKeyframes}</style>

      <section
        className="relative min-h-[100dvh] w-full flex items-stretch justify-center overflow-hidden px-0 py-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(7,11,18,0.75) 0%, rgba(8,14,22,0.7) 50%, rgba(6,10,16,0.8) 100%)",
        }}
      >
        {/* ── Animated floating orbs ─────────────── */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          {orbs.map((orb, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${orb.color} ${orb.size} ${orb.position} ${orb.blur}`}
              style={{ animation: orb.animation }}
            />
          ))}
        </div>

        {/* ── Subtle radial vignette overlay ────── */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* ── Main glass panel ───────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full min-h-[100dvh] max-w-none border border-white/[0.08] bg-white/[0.06] px-6 py-12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-10 sm:py-12 md:px-16 md:py-14"
        >
          {/* ── Avatar ───────────────────────────── */}
          {personal.avatar && (
            <motion.div
              variants={avatarVariant}
              className="mx-auto mb-6 flex items-center justify-center pt-6"
            >
              <div
                className="relative flex h-28 w-28 items-center justify-center rounded-full sm:h-32 sm:w-32 md:h-36 md:w-36"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(56,189,248,0.5), rgba(34,211,238,0.5))",
                  padding: "3px",
                }}
              >
                {/* Glow ring behind avatar */}
                <div
                  className="pointer-events-none absolute inset-[-6px] rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(56,189,248,0.35), rgba(34,211,238,0.35))",
                    filter: "blur(14px)",
                    animation: "pulse-glow 4s ease-in-out infinite",
                  }}
                />
                <img
                  src={personal.avatar}
                  alt={personal.name ?? "Avatar"}
                  className="relative h-full w-full rounded-full border-2 border-white/[0.15] object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* ── Name ─────────────────────────────── */}
          {personal.name && (
            <motion.h1
              variants={fadeSlideUp}
              className="mb-2 text-center text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[64px]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #ffffff 35%, #bae6fd 70%, #7dd3fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {personal.name}
            </motion.h1>
          )}

          {/* ── Title ────────────────────────────── */}
          {personal.title && (
            <motion.p
              variants={fadeSlideUp}
              className="mb-3 text-center text-sm font-medium tracking-wide text-sky-200/70 sm:text-base md:text-lg"
            >
              {personal.title}
            </motion.p>
          )}

          {/* ── Location ─────────────────────────── */}
          {personal.location && (
            <motion.div
              variants={fadeSlideUp}
              className="mb-4 flex items-center justify-center gap-1.5 text-sm text-white/50 sm:text-base"
            >
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{personal.location}</span>
            </motion.div>
          )}

          {/* ── Bio ──────────────────────────────── */}
          {personal.bio && (
            <motion.p
              variants={fadeSlideUp}
              className="mx-auto mb-6 max-w-xl text-center text-sm leading-relaxed text-white/55 sm:text-base md:mb-8"
            >
              {personal.bio}
            </motion.p>
          )}

          {/* ── Stats row ────────────────────────── */}
          {stats.length > 0 && (
            <motion.div
              variants={fadeSlideUp}
              className="mx-auto mb-6 flex max-w-md flex-wrap items-center justify-center gap-3 sm:gap-4 md:mb-8"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={statCardVariant}
                  whileHover={{ scale: 1.06, y: -2 }}
                  className="flex min-w-[100px] flex-1 flex-col items-center gap-1 rounded-2xl border border-white/[0.1] bg-white/[0.05] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-colors hover:border-white/[0.18] sm:min-w-[110px] sm:px-5"
                >
                  <stat.Icon className="mb-1 h-4 w-4 text-sky-300/70" />
                  <span className="lg-mono text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {stat.value}
                    <span className="text-sky-300/70">+</span>
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-widest text-white/40 sm:text-xs">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── Social links ─────────────────────── */}
          {socials.length > 0 && (
            <motion.div
              variants={fadeSlideUp}
              className="flex items-center justify-center gap-3 sm:gap-4"
            >
              {socials.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  variants={socialVariant}
                  whileHover={{
                    scale: 1.15,
                    boxShadow: "0 0 20px rgba(56,189,248,0.28)",
                  }}
                  whileTap={{ scale: 0.92 }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] text-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-colors hover:border-white/[0.22] hover:text-white/90 sm:h-12 sm:w-12"
                >
                  <s.Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
                </motion.a>
              ))}
            </motion.div>
          )}
        </motion.div>

      </section>
    </>
  );
}
