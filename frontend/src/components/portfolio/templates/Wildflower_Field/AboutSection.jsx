// AboutSection.jsx
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Heart } from "lucide-react";
import { Daisy, WildLeaf, CornflowerBlue, WatercolorBlob, StemWithLeaves, TinyLeaf } from "./WildflowerSVGs";

function AnimatedSection({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

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

export default function AboutSection({ data }) {
  const { personal } = data;

  return (
    <section
      id="about"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fef3f8 0%, #f0fdf4 50%, #fefce8 100%)" }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0">
          <WatercolorBlob width={320} height={220} color="#fce7f3" id="about-bl1" />
        </div>
        <div className="absolute bottom-0 right-0">
          <WatercolorBlob width={280} height={200} color="#ecfdf5" id="about-bl2" />
        </div>
      </div>

      {/* Decorative botanical borders */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden xl:block opacity-50">
        <StemWithLeaves height={160} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 block" style={{ background: "linear-gradient(to right, transparent, #fda4af)" }} />
            <WildLeaf size={28} color="#86efac" />
            <span className="h-px w-12 block" style={{ background: "linear-gradient(to left, transparent, #fda4af)" }} />
          </div>
          <h2
            className="text-4xl md:text-5xl font-serif mb-3"
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              background: "linear-gradient(135deg, #be185d, #065f46)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            About Me
          </h2>
          <p className="text-sm tracking-widest uppercase" style={{ color: "#9ca3af", letterSpacing: "0.2em" }}>
            the gardener behind the code
          </p>
        </AnimatedSection>

        {/* Content grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Avatar column */}
          <AnimatedSection delay={0.2} className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Blob behind avatar */}
              <motion.div
                className="absolute inset-0 -m-8"
                animate={{ rotate: [0, 5, -3, 5, 0], scale: [1, 1.03, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              >
                <WatercolorBlob width={320} height={320} color="#fce7f3" id="about-avatar-blob" />
              </motion.div>

              {/* Avatar frame */}
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div
                  className="w-64 h-64 md:w-80 md:h-80 rounded-[40%_60%_55%_45%_/_45%_55%_60%_40%] overflow-hidden"
                  style={{
                    border: "3px solid rgba(253,186,216,0.6)",
                    boxShadow: "0 20px 60px rgba(190,24,93,0.12), 0 8px 30px rgba(190,24,93,0.08)",
                  }}
                >
                  <img
                    src={personal.avatar}
                    alt={`${personal.name}'s portrait`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Floating flowers around avatar */}
              <motion.div
                className="absolute -top-6 -right-4 z-20"
                animate={{ rotate: [0, 15, -10, 15, 0], y: [-3, 5, -3] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <Daisy size={52} color="#fda4af" centerColor="#fde68a" />
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-6 z-20"
                animate={{ rotate: [0, -12, 8, -12, 0], y: [3, -4, 3] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <CornflowerBlue size={44} color="#93c5fd" />
              </motion.div>
              <motion.div
                className="absolute top-1/2 -right-8 z-20"
                animate={{ rotate: [-5, 8, -5] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <TinyLeaf size={32} color="#bbf7d0" />
              </motion.div>

              {/* Location badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(253,186,216,0.5)",
                  color: "#be185d",
                  boxShadow: "0 4px 15px rgba(190,24,93,0.1)",
                }}
              >
                <MapPin size={13} />
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem" }}>
                  {personal.location}
                </span>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Bio column */}
          <AnimatedSection delay={0.35} className="space-y-6 mt-8 lg:mt-0">
            <div
              className="p-8 rounded-[24px] relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.65)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(253,186,216,0.4)",
                boxShadow: "0 8px 40px rgba(190,24,93,0.06)",
              }}
            >
              {/* Decorative corner */}
              <div className="absolute top-4 right-4 opacity-30">
                <Daisy size={36} color="#fda4af" centerColor="#fde68a" />
              </div>

              <h3
                className="text-2xl font-serif mb-4"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#1f2937",
                }}
              >
                Hello, I'm{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #be185d, #065f46)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {personal.name.split(" ")[0]}
                </span>
              </h3>

              <p
                className="leading-relaxed text-base md:text-lg mb-6"
                style={{
                  color: "#4b5563",
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: "1.1rem",
                  lineHeight: "1.8",
                }}
              >
                {personal.bio}
              </p>

              {/* Decorative footer of card */}
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid rgba(253,186,216,0.3)" }}>
                <Heart size={14} fill="rgba(253,186,216,0.8)" style={{ color: "#be185d" }} />
                <span
                  className="text-sm italic"
                  style={{ color: "#9ca3af", fontFamily: "'Cormorant Garamond', serif" }}
                >
                  crafted with care & curiosity
                </span>
              </div>
            </div>

            {/* Extra info pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { emoji: "🌱", text: "Open Source" },
                { emoji: "🎨", text: "Digital Art" },
                { emoji: "🔭", text: "New Tech" },
                { emoji: "☕", text: "Coffee Driven" },
              ].map(({ emoji, text }) => (
                <motion.span
                  key={text}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    border: "1px solid rgba(253,186,216,0.4)",
                    color: "#4b5563",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "0.95rem",
                  }}
                >
                  <span>{emoji}</span>
                  {text}
                </motion.span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
