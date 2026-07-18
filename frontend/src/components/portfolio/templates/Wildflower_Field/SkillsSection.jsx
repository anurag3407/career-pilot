// SkillsSection.jsx
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Daisy, ButtercupFlower, CornflowerBlue, Poppy, WildLeaf, WatercolorBlob } from "./WildflowerSVGs";

const categoryConfig = {
  Frontend: { flower: Daisy, color: "#fda4af", bgColor: "#fce7f3", accent: "#be185d", flowerProps: { color: "#fda4af", centerColor: "#fde68a" } },
  Backend: { flower: ButtercupFlower, color: "#fde68a", bgColor: "#fefce8", accent: "#b45309", flowerProps: { color: "#fde68a" } },
  DevOps: { flower: CornflowerBlue, color: "#93c5fd", bgColor: "#eff6ff", accent: "#2563eb", flowerProps: { color: "#93c5fd" } },
  Design: { flower: Poppy, color: "#c4b5fd", bgColor: "#f5f3ff", accent: "#7c3aed", flowerProps: { color: "#c4b5fd" } },
};

function AnimatedSection({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SkillBar({ skill, index, accent }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group"
    >
      <div className="flex justify-between items-center mb-2">
        <span
          className="text-sm font-medium"
          style={{ color: "#374151", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem" }}
        >
          {skill.name}
        </span>
        <span className="text-xs font-medium" style={{ color: accent }}>
          {skill.level}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(0,0,0,0.06)" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1.2, delay: index * 0.1 + 0.3, ease: "easeOut" }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${accent}99, ${accent})`,
          }}
        >
          {/* Flower at end of bar */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: index * 0.1 + 1.2, duration: 0.3 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: accent, boxShadow: `0 0 0 2px white, 0 0 0 3px ${accent}` }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function CategoryCard({ category, skills, config, categoryIndex }) {
  const FlowerComponent = config.flower;

  return (
    <AnimatedSection delay={categoryIndex * 0.15}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="p-6 rounded-2xl relative overflow-hidden h-full"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${config.color}60`,
          boxShadow: `0 8px 30px ${config.color}20`,
        }}
      >
        {/* Decorative background blob */}
        <div className="absolute -right-4 -top-4 opacity-20 pointer-events-none">
          <FlowerComponent size={80} {...config.flowerProps} />
        </div>

        {/* Category header */}
        <div className="flex items-center gap-3 mb-5">
          <motion.div
            animate={{ rotate: [0, 10, -8, 10, 0] }}
            transition={{ duration: 6 + categoryIndex, repeat: Infinity, ease: "easeInOut" }}
          >
            <FlowerComponent size={32} {...config.flowerProps} />
          </motion.div>
          <div>
            <h3
              className="font-serif text-lg font-semibold"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: config.accent,
              }}
            >
              {category}
            </h3>
            <p className="text-xs" style={{ color: "#9ca3af" }}>
              {skills.length} technologies
            </p>
          </div>
        </div>

        {/* Skill bars */}
        <div className="space-y-4">
          {skills.map((skill, i) => (
            <SkillBar key={skill.name} skill={skill} index={i} accent={config.accent} />
          ))}
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

export default function SkillsSection({ data }) {
  const { skills } = data;

  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const allCategories = Object.keys(grouped);

  return (
    <section
      id="skills"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fefce8 0%, #fdf6f0 50%, #fef3f8 100%)" }}
    >
      {/* BG blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10">
          <WatercolorBlob width={260} height={180} color="#fce7f3" id="skills-bl1" />
        </div>
        <div className="absolute bottom-10 left-10">
          <WatercolorBlob width={220} height={160} color="#ecfdf5" id="skills-bl2" />
        </div>
      </div>

      {/* Floating flowers */}
      <motion.div
        className="absolute top-12 left-8 hidden lg:block"
        animate={{ rotate: [0, 12, -8, 12, 0], y: [-4, 6, -4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <WildLeaf size={42} color="#86efac" />
      </motion.div>
      <motion.div
        className="absolute bottom-16 right-12 hidden lg:block"
        animate={{ rotate: [0, -10, 7, -10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <ButtercupFlower size={50} color="#fde68a" />
      </motion.div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, #86efac)", display: "block" }} />
            <Daisy size={24} color="#fda4af" centerColor="#fde68a" />
            <span className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, #86efac)", display: "block" }} />
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
            Skills & Tools
          </h2>
          <p className="text-sm tracking-widest uppercase" style={{ color: "#9ca3af", letterSpacing: "0.2em" }}>
            my garden of expertise
          </p>
        </AnimatedSection>

        {/* Skill "bouquet" tags — top decorative row */}
        <AnimatedSection delay={0.1} className="mb-10">
          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, i) => (
              <motion.span
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                whileHover={{ scale: 1.1, y: -3 }}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: `${categoryConfig[skill.category]?.bgColor || "#fce7f3"}`,
                  border: `1px solid ${categoryConfig[skill.category]?.color || "#fda4af"}60`,
                  color: categoryConfig[skill.category]?.accent || "#be185d",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "0.85rem",
                }}
              >
                {skill.name}
              </motion.span>
            ))}
          </div>
        </AnimatedSection>

        {/* Category cards grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {allCategories.map((category, i) => (
            <CategoryCard
              key={category}
              category={category}
              skills={grouped[category]}
              config={categoryConfig[category] || categoryConfig.Frontend}
              categoryIndex={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
