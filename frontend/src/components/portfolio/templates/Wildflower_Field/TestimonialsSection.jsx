// TestimonialsSection.jsx
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Quote } from "lucide-react";
import { Daisy, Poppy, ButtercupFlower, CornflowerBlue, WatercolorBlob, TinyLeaf } from "./WildflowerSVGs";

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

const cardStyles = [
  {
    bg: "linear-gradient(135deg, rgba(252,231,243,0.7), rgba(255,255,255,0.8))",
    border: "rgba(253,186,216,0.5)",
    accent: "#be185d",
    shadow: "rgba(190,24,93,0.08)",
    quoteColor: "#fda4af",
    FlowerComp: Daisy,
    flowerProps: { color: "#fda4af", centerColor: "#fde68a" },
  },
  {
    bg: "linear-gradient(135deg, rgba(254,252,232,0.7), rgba(255,255,255,0.8))",
    border: "rgba(253,230,138,0.5)",
    accent: "#b45309",
    shadow: "rgba(180,83,9,0.06)",
    quoteColor: "#fbbf24",
    FlowerComp: ButtercupFlower,
    flowerProps: { color: "#fde68a" },
  },
  {
    bg: "linear-gradient(135deg, rgba(239,246,255,0.7), rgba(255,255,255,0.8))",
    border: "rgba(191,219,254,0.5)",
    accent: "#2563eb",
    shadow: "rgba(37,99,235,0.06)",
    quoteColor: "#93c5fd",
    FlowerComp: CornflowerBlue,
    flowerProps: { color: "#93c5fd" },
  },
  {
    bg: "linear-gradient(135deg, rgba(245,243,255,0.7), rgba(255,255,255,0.8))",
    border: "rgba(221,214,254,0.5)",
    accent: "#7c3aed",
    shadow: "rgba(124,58,237,0.06)",
    quoteColor: "#c4b5fd",
    FlowerComp: Poppy,
    flowerProps: { color: "#c4b5fd" },
  },
];

function TestimonialCard({ testimonial, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const style = cardStyles[index % cardStyles.length];
  const FlowerComp = style.FlowerComp;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.75, delay: (index % 2) * 0.18, ease: "easeOut" }}
    >
      <motion.article
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 240, damping: 18 }}
        className="relative p-7 rounded-3xl h-full flex flex-col overflow-hidden"
        style={{
          background: style.bg,
          backdropFilter: "blur(16px)",
          border: `1px solid ${style.border}`,
          boxShadow: `0 12px 40px ${style.shadow}, 0 4px 16px rgba(0,0,0,0.04)`,
        }}
      >
        {/* Decorative blob inside card */}
        <div className="absolute -bottom-6 -right-6 opacity-15 pointer-events-none">
          <FlowerComp size={90} {...style.flowerProps} />
        </div>

        {/* Big decorative quote mark */}
        <div className="absolute top-5 right-6 opacity-20">
          <Quote size={48} style={{ color: style.quoteColor }} fill={style.quoteColor} />
        </div>

        {/* Small rotating flower top-left */}
        <motion.div
          className="absolute top-4 left-4 opacity-60"
          animate={{ rotate: [0, 12, -8, 12, 0] }}
          transition={{ duration: 7 + index, repeat: Infinity, ease: "easeInOut" }}
        >
          <FlowerComp size={22} {...style.flowerProps} />
        </motion.div>

        {/* Quote icon */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mb-5 self-start"
          style={{
            background: `${style.quoteColor}25`,
            border: `1px solid ${style.quoteColor}60`,
          }}
        >
          <Quote size={16} style={{ color: style.quoteColor }} fill={style.quoteColor} />
        </div>

        {/* Quote text */}
        <blockquote
          className="flex-1 mb-6 leading-relaxed italic"
          style={{
            color: "#374151",
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: "1.05rem",
            lineHeight: "1.8",
          }}
        >
          "{testimonial.text}"
        </blockquote>

        {/* Divider */}
        <div
          className="h-px mb-5"
          style={{ background: `linear-gradient(to right, ${style.quoteColor}60, transparent)` }}
        />

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-11 h-11 rounded-full object-cover"
              style={{
                border: `2px solid ${style.quoteColor}70`,
                boxShadow: `0 0 0 2px white`,
              }}
            />
            {/* Small petal overlay */}
            <div className="absolute -bottom-1 -right-1">
              <TinyLeaf size={14} color="#bbf7d0" />
            </div>
          </div>
          <div>
            <div
              className="font-semibold text-sm"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#1f2937",
              }}
            >
              {testimonial.name}
            </div>
            <div
              className="text-xs"
              style={{ color: style.accent, fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem" }}
            >
              {testimonial.role}
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function TestimonialsSection({ data }) {
  const { testimonials } = data;
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section
      id="testimonials"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fdf6f0 0%, #fef3f8 50%, #f0fdf4 100%)" }}
    >
      {/* BG watercolor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4">
          <WatercolorBlob width={400} height={280} color="#fce7f3" id="test-bl1" />
        </div>
        <div className="absolute bottom-0 right-1/4">
          <WatercolorBlob width={360} height={240} color="#ecfdf5" id="test-bl2" />
        </div>
      </div>

      {/* Floating flowers */}
      <motion.div
        className="absolute top-12 left-6 hidden lg:block"
        animate={{ rotate: [0, 12, -8, 12, 0], y: [-4, 6, -4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <Daisy size={54} color="#fda4af" centerColor="#fde68a" />
      </motion.div>
      <motion.div
        className="absolute bottom-16 right-8 hidden lg:block"
        animate={{ rotate: [0, -10, 7, -10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <ButtercupFlower size={46} color="#fde68a" />
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-4 hidden xl:block"
        animate={{ rotate: [0, 8, -5, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <TinyLeaf size={30} color="#bbf7d0" />
      </motion.div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 block" style={{ background: "linear-gradient(to right, transparent, #c4b5fd)" }} />
            <Poppy size={26} color="#c4b5fd" />
            <span className="h-px w-12 block" style={{ background: "linear-gradient(to left, transparent, #c4b5fd)" }} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-serif mb-3"
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              background: "linear-gradient(135deg, #7c3aed, #be185d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Kind Words
          </h2>
          <p className="text-sm tracking-widest uppercase" style={{ color: "#9ca3af", letterSpacing: "0.2em" }}>
            whispers from the meadow
          </p>
        </AnimatedSection>

        {/* Testimonial grid */}
        <div className="grid md:grid-cols-2 gap-7">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
