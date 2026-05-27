import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { User, Briefcase, Code2, Heart } from "lucide-react";

export default function About({ data }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const personal = data?.personal || {};
  const stats = data?.stats || {};

  const statCards = [];

  if (stats?.yearsExperience !== undefined)
    statCards.push({
      value: stats.yearsExperience,
      label: "Years Experience",
      icon: Briefcase,
      suffix: "+",
    });

  if (stats?.projectsCompleted !== undefined)
    statCards.push({
      value: stats.projectsCompleted,
      label: "Projects Completed",
      icon: Code2,
      suffix: "+",
    });

  if (stats?.happyClients !== undefined)
    statCards.push({
      value: stats.happyClients,
      label: "Happy Clients",
      icon: Heart,
      suffix: "+",
    });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-32 h-[420px] w-[420px] rounded-full bg-sky-500/[0.06] blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 h-[360px] w-[360px] rounded-full bg-cyan-400/[0.05] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-16 text-center"
        >
          <h2 className="inline-block text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            About Me
          </h2>
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-400 opacity-80" />
        </motion.div>

        {/* Avatar + Bio layout */}
        <div className="grid items-center gap-12 lg:grid-cols-[auto_1fr] lg:gap-16">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="group relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-sky-400/20 via-cyan-300/10 to-sky-400/20 blur-xl opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

              {/* Glass container */}
              <div
                className="relative h-56 w-56 overflow-hidden rounded-full border border-white/[0.12] bg-white/[0.05] p-1.5 shadow-2xl backdrop-blur-lg sm:h-64 sm:w-64 lg:h-72 lg:w-72"
                style={{ transform: "rotate(-3deg)" }}
              >
                {personal.avatar ? (
                  <img
                    src={personal.avatar}
                    alt={personal.name || "Avatar"}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-sky-500/30 to-cyan-400/20">
                    <User className="h-20 w-20 text-white/40" strokeWidth={1.2} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Text content glass panel */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          >
            <div className="rounded-2xl border border-white/[0.1] bg-white/[0.05] p-6 shadow-xl backdrop-blur-lg sm:p-8 lg:p-10">
              {personal.name && (
                <h3 className="mb-1 text-xl font-semibold text-white sm:text-2xl">
                  {personal.name}
                </h3>
              )}

              {personal.title && (
                <p className="mb-4 bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-sm font-medium text-transparent sm:text-base">
                  {personal.title}
                </p>
              )}

              {personal.location && (
                <p className="mb-4 flex items-center gap-1.5 text-sm text-white/50">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400" />
                  {personal.location}
                </p>
              )}

              {personal.bio && (
                <p className="leading-relaxed text-white/60 text-sm sm:text-base lg:text-lg">
                  {personal.bio}
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.5 + index * 0.12,
                }}
              >
                <div className="group relative rounded-2xl border border-white/[0.1] bg-white/[0.05] p-6 text-center shadow-lg backdrop-blur-lg transition-colors duration-300 hover:border-white/[0.18] hover:bg-white/[0.08] sm:p-8">
                  <Icon
                    className="mx-auto mb-3 h-5 w-5 text-white/30 transition-colors duration-300 group-hover:text-white/50"
                    strokeWidth={1.5}
                  />
                  <p className="lg-mono bg-gradient-to-br from-sky-300 via-white to-cyan-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl">
                    {stat.value}
                    {stat.suffix}
                  </p>
                  <p className="mt-2 text-xs font-medium tracking-wide text-white/40 uppercase sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
