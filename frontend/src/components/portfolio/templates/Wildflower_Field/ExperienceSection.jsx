// ExperienceSection.jsx
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Calendar } from "lucide-react";
import { Daisy, WildLeaf, Lavender, WatercolorBlob, TinyLeaf } from "./WildflowerSVGs";

function AnimatedSection({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function TimelineNode({ index }) {
  const colors = ["#fda4af", "#fde68a", "#93c5fd", "#c4b5fd"];
  const color = colors[index % colors.length];
  return (
    <div className="relative flex flex-col items-center">
      {/* Flower node */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 + 0.3, duration: 0.5, type: "spring" }}
        className="relative z-10"
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: `${color}30`,
            border: `2px solid ${color}`,
            boxShadow: `0 0 0 4px ${color}20`,
          }}
        >
          <Briefcase size={14} style={{ color }} />
        </div>
      </motion.div>
    </div>
  );
}

function ExperienceCard({ exp, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const isEven = index % 2 === 0;

  const accentColors = ["#be185d", "#b45309", "#2563eb", "#7c3aed"];
  const bgColors = ["#fce7f3", "#fefce8", "#eff6ff", "#f5f3ff"];
  const borderColors = ["rgba(253,186,216,0.5)", "rgba(253,230,138,0.5)", "rgba(191,219,254,0.5)", "rgba(221,214,254,0.5)"];

  const accent = accentColors[index % accentColors.length];
  const bg = bgColors[index % bgColors.length];
  const border = borderColors[index % borderColors.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: "easeOut" }}
      className={`flex items-start gap-4 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.02, y: -3 }}
        transition={{ type: "spring", stiffness: 280 }}
        className="flex-1 p-6 rounded-2xl relative overflow-hidden group"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(12px)",
          border: `1px solid ${border}`,
          boxShadow: `0 6px 28px ${bg}80`,
        }}
      >
        {/* Accent top line */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${accent}60, ${accent})` }}
        />

        {/* Decorative background floral */}
        <div className="absolute -bottom-2 -right-2 opacity-10 pointer-events-none">
          {index % 2 === 0 ? (
            <Daisy size={70} color={accent} centerColor="#fde68a" />
          ) : (
            <TinyLeaf size={60} color="#86efac" />
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <div>
            <h3
              className="text-xl font-serif font-bold mb-1"
              style={{ fontFamily: "'Playfair Display', serif", color: "#1f2937" }}
            >
              {exp.role}
            </h3>
            <div
              className="text-base font-semibold"
              style={{ color: accent, fontFamily: "'Cormorant Garamond', serif", fontSize: "1.05rem" }}
            >
              {exp.company}
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap self-start"
            style={{
              background: `${bg}`,
              border: `1px solid ${border}`,
              color: accent,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.85rem",
            }}
          >
            <Calendar size={11} />
            {exp.period}
          </div>
        </div>

        <p
          className="text-sm leading-relaxed"
          style={{
            color: "#4b5563",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1rem",
            lineHeight: "1.75",
          }}
        >
          {exp.description}
        </p>
      </motion.div>

      {/* Center stem connector — visible on md+ */}
      <div className="hidden md:flex flex-col items-center pt-2 flex-shrink-0">
        <TimelineNode index={index} />
      </div>

      {/* Spacer for alternating layout */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
}

export default function ExperienceSection({ data }) {
  const { experience } = data;

  return (
    <section
      id="experience"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #fefce8 50%, #fdf6f0 100%)" }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0">
          <WatercolorBlob width={320} height={240} color="#ecfdf5" id="exp-bl1" />
        </div>
        <div className="absolute bottom-0 left-0">
          <WatercolorBlob width={280} height={200} color="#fefce8" id="exp-bl2" />
        </div>
      </div>

      {/* Decorative botanicals */}
      <motion.div
        className="absolute left-4 top-1/3 hidden xl:block"
        animate={{ rotate: [-5, 8, -5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <Lavender size={30} />
      </motion.div>
      <motion.div
        className="absolute right-6 bottom-1/4 hidden xl:block"
        animate={{ rotate: [0, 10, -7, 10, 0], y: [-3, 4, -3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <WildLeaf size={48} color="#86efac" />
      </motion.div>

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 block" style={{ background: "linear-gradient(to right, transparent, #86efac)" }} />
            <WildLeaf size={26} color="#86efac" />
            <span className="h-px w-12 block" style={{ background: "linear-gradient(to left, transparent, #86efac)" }} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-serif mb-3"
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              background: "linear-gradient(135deg, #065f46, #be185d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Experience
          </h2>
          <p className="text-sm tracking-widest uppercase" style={{ color: "#9ca3af", letterSpacing: "0.2em" }}>
            seasons of growth
          </p>
        </AnimatedSection>

        {/* Timeline — vertical stem */}
        <div className="relative">
          {/* Central vine line — desktop only */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block -translate-x-1/2"
            style={{
              background: "linear-gradient(to bottom, transparent, rgba(134,239,172,0.6) 10%, rgba(134,239,172,0.6) 90%, transparent)",
            }}
          />

          {/* Experience cards */}
          <div className="space-y-10 md:space-y-6">
            {experience.map((exp, index) => (
              <ExperienceCard key={exp.company + exp.period} exp={exp} index={index} />
            ))}
          </div>
        </div>

        {/* Bottom vine decoration */}
        <AnimatedSection delay={0.4} className="flex justify-center mt-10">
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Daisy size={38} color="#fda4af" centerColor="#fde68a" />
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}
