// ContactSection.jsx
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Github, Linkedin, Twitter, Mail, Heart, Send, MapPin } from "lucide-react";
import { Daisy, ButtercupFlower, CornflowerBlue, WildLeaf, Lavender, WatercolorBlob, StemWithLeaves, TinyLeaf } from "./WildflowerSVGs";

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

export default function ContactSection({ data }) {
  const { personal, socials } = data;

  const socialLinks = [
    {
      href: socials.github,
      icon: Github,
      label: "GitHub",
      color: "#374151",
      bg: "#f9fafb",
      border: "rgba(209,213,219,0.7)",
      hoverBg: "#f3f4f6",
    },
    {
      href: socials.linkedin,
      icon: Linkedin,
      label: "LinkedIn",
      color: "#2563eb",
      bg: "#eff6ff",
      border: "rgba(191,219,254,0.7)",
      hoverBg: "#dbeafe",
    },
    {
      href: socials.twitter,
      icon: Twitter,
      label: "Twitter / X",
      color: "#0ea5e9",
      bg: "#f0f9ff",
      border: "rgba(186,230,253,0.7)",
      hoverBg: "#e0f2fe",
    },
    {
      href: `mailto:${socials.email}`,
      icon: Mail,
      label: "Email",
      color: "#be185d",
      bg: "#fce7f3",
      border: "rgba(253,186,216,0.7)",
      hoverBg: "#fce7f3",
    },
  ];

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fef3f8 0%, #f0fdf4 50%, #fefce8 100%)" }}
    >
      {/* BG blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 left-0">
          <WatercolorBlob width={350} height={250} color="#fce7f3" id="contact-bl1" />
        </div>
        <div className="absolute bottom-0 right-0">
          <WatercolorBlob width={300} height={220} color="#ecfdf5" id="contact-bl2" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <WatercolorBlob width={500} height={380} color="#fefce8" id="contact-bl3" />
        </div>
      </div>

      {/* Decorative botanicals */}
      <motion.div
        className="absolute top-10 right-10 hidden lg:block"
        animate={{ rotate: [0, 8, -5, 8, 0], y: [-3, 5, -3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Daisy size={60} color="#fda4af" centerColor="#fde68a" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-8 hidden lg:block"
        animate={{ rotate: [0, -10, 7, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <WildLeaf size={50} color="#86efac" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 left-6 hidden xl:block"
        animate={{ rotate: [-5, 6, -5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Lavender size={26} />
      </motion.div>
      <div className="absolute bottom-0 right-10 hidden xl:block opacity-40">
        <StemWithLeaves height={130} />
      </div>

      <div className="relative max-w-4xl mx-auto px-6">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 block" style={{ background: "linear-gradient(to right, transparent, #fda4af)" }} />
            <CornflowerBlue size={26} color="#93c5fd" />
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
            Let's Connect
          </h2>
          <p className="text-sm tracking-widest uppercase" style={{ color: "#9ca3af", letterSpacing: "0.2em" }}>
            plant a seed of collaboration
          </p>
        </AnimatedSection>

        {/* Contact card */}
        <AnimatedSection delay={0.15}>
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(253,186,216,0.4)",
              boxShadow: "0 20px 60px rgba(190,24,93,0.07)",
            }}
          >
            {/* Top decorative band */}
            <div
              className="h-2"
              style={{ background: "linear-gradient(90deg, #fda4af, #fde68a, #86efac, #93c5fd, #c4b5fd, #fda4af)" }}
            />

            <div className="p-8 md:p-12">
              {/* Main invite */}
              <div className="text-center mb-10">
                <motion.div
                  animate={{ rotate: [0, 8, -6, 8, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block mb-4"
                >
                  <ButtercupFlower size={48} color="#fde68a" />
                </motion.div>
                <h3
                  className="text-3xl md:text-4xl font-serif mb-4"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    color: "#1f2937",
                  }}
                >
                  Have a project in mind?
                </h3>
                <p
                  className="text-base md:text-lg max-w-xl mx-auto"
                  style={{
                    color: "#6b7280",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.1rem",
                    lineHeight: "1.75",
                  }}
                >
                  I'm always open to interesting opportunities, collaborations, and creative conversations. Don't be
                  shy — drop me a line and let's make something beautiful together.
                </p>
              </div>

              {/* Email CTA */}
              <div className="flex justify-center mb-10">
                <motion.a
                  href={`mailto:${socials.email}`}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 px-8 py-4 rounded-full text-white font-medium"
                  style={{
                    background: "linear-gradient(135deg, #be185d 0%, #9d174d 60%, #065f46 100%)",
                    boxShadow: "0 10px 30px rgba(190,24,93,0.3)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.05rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  <Send size={16} />
                  {socials.email}
                </motion.a>
              </div>

              {/* Divider with flowers */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="flex-1 h-px"
                  style={{ background: "linear-gradient(to right, transparent, rgba(253,186,216,0.5))" }}
                />
                <div className="flex items-center gap-2">
                  <TinyLeaf size={18} color="#bbf7d0" />
                  <Daisy size={22} color="#fda4af" centerColor="#fde68a" />
                  <TinyLeaf size={18} color="#bbf7d0" />
                </div>
                <div
                  className="flex-1 h-px"
                  style={{ background: "linear-gradient(to left, transparent, rgba(253,186,216,0.5))" }}
                />
              </div>

              {/* Social links grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {socialLinks.map(({ href, icon: Icon, label, color, bg, border }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                    whileHover={{ scale: 1.06, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl text-sm font-medium text-center"
                    style={{
                      background: bg,
                      border: `1px solid ${border}`,
                      color,
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "0.95rem",
                      boxShadow: `0 4px 16px ${bg}80`,
                    }}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </motion.a>
                ))}
              </div>

              {/* Location */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-2 mt-8"
                style={{ color: "#9ca3af" }}
              >
                <MapPin size={14} />
                <span
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem" }}
                >
                  Based in {personal.location}
                </span>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* Footer */}
        <AnimatedSection delay={0.4} className="mt-16 text-center">
          {/* Meadow of flowers footer decoration */}
          <motion.div
            className="flex justify-center items-end gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { comp: WildLeaf, size: 28, color: "#86efac", delay: 0 },
              { comp: Daisy, size: 34, props: { color: "#fda4af", centerColor: "#fde68a" }, delay: 0.1 },
              { comp: ButtercupFlower, size: 30, props: { color: "#fde68a" }, delay: 0.2 },
              { comp: CornflowerBlue, size: 36, props: { color: "#93c5fd" }, delay: 0.1 },
              { comp: Daisy, size: 28, props: { color: "#c4b5fd", centerColor: "#fde68a" }, delay: 0.2 },
              { comp: WildLeaf, size: 24, color: "#bbf7d0", delay: 0 },
            ].map(({ comp: Comp, size, color, props, delay }, i) => (
              <motion.div
                key={i}
                animate={{ y: [-2, 3, -2], rotate: [-3, 4, -3] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: delay + i * 0.3 }}
              >
                {color ? <Comp size={size} color={color} /> : <Comp size={size} {...props} />}
              </motion.div>
            ))}
          </motion.div>

          <div className="h-px mb-6" style={{ background: "linear-gradient(to right, transparent, rgba(253,186,216,0.5), transparent)" }} />

          <p
            className="text-sm flex items-center justify-center gap-2"
            style={{ color: "#9ca3af", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem" }}
          >
            Crafted with
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart size={13} fill="#fda4af" style={{ color: "#fda4af" }} />
            </motion.span>
            by{" "}
            <span style={{ color: "#be185d", fontWeight: 600 }}>{personal.name}</span>
          </p>

          <p
            className="text-xs mt-2"
            style={{ color: "#d1d5db", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem" }}
          >
            Wildflower Field — Portfolio Template
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
