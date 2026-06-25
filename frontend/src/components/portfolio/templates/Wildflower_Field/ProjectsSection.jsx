// ProjectsSection.jsx
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github } from "lucide-react";
import { Daisy, ButtercupFlower, Poppy, WildLeaf, WatercolorBlob, TinyLeaf } from "./WildflowerSVGs";

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

const techColors = {
  React: { bg: "#eff6ff", text: "#2563eb", border: "#bfdbfe" },
  "Next.js": { bg: "#f9fafb", text: "#374151", border: "#d1d5db" },
  TypeScript: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  Python: { bg: "#fefce8", text: "#b45309", border: "#fde68a" },
  TensorFlow: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  WebSocket: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  "Canvas API": { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
  WebGL: { bg: "#fdf4ff", text: "#9333ea", border: "#e9d5ff" },
  "Vue.js": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  "Rust/WASM": { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  "Node.js": { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
  PostgreSQL: { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
  Stripe: { bg: "#fdf4ff", text: "#6d28d9", border: "#ddd6fe" },
  "React Native": { bg: "#eff6ff", text: "#1d4ed8", border: "#dbeafe" },
  GraphQL: { bg: "#fdf2f8", text: "#be185d", border: "#fbcfe8" },
  MongoDB: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  OpenAI: { bg: "#f9fafb", text: "#374151", border: "#d1d5db" },
  Express: { bg: "#fefce8", text: "#b45309", border: "#fde68a" },
  MySQL: { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
  Redis: { bg: "#fff1f2", text: "#be123c", border: "#fecdd3" },
  "Three.js": { bg: "#f9fafb", text: "#374151", border: "#d1d5db" },
  "OpenAI GPT-4": { bg: "#f9fafb", text: "#374151", border: "#d1d5db" },
  Vercel: { bg: "#f9fafb", text: "#374151", border: "#d1d5db" },
};

const defaultTechStyle = { bg: "#fce7f3", text: "#be185d", border: "#fbcfe8" };

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: (index % 3) * 0.15, ease: "easeOut" }}
    >
      <motion.article
        whileHover={{ y: -8, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        className="group rounded-3xl overflow-hidden h-full flex flex-col"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(253,186,216,0.35)",
          boxShadow: "0 8px 32px rgba(190,24,93,0.06)",
        }}
      >
        {/* Image area */}
        <div className="relative overflow-hidden h-52">
          <motion.img
            src={project.image}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          {/* Overlay on hover */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            style={{ background: "rgba(190,24,93,0.55)", backdropFilter: "blur(4px)" }}
          >
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demo of ${project.title}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.5)" }}
            >
              <ExternalLink size={14} />
              Live Demo
            </motion.a>
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub repo for ${project.title}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.5)" }}
            >
              <Github size={14} />
              GitHub
            </motion.a>
          </motion.div>

          {/* Corner petal decoration */}
          <div className="absolute top-3 right-3 opacity-80">
            <motion.div
              animate={{ rotate: [0, 15, -10, 15, 0] }}
              transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
            >
              {index % 3 === 0 ? (
                <Daisy size={32} color="#fda4af" centerColor="#fde68a" />
              ) : index % 3 === 1 ? (
                <ButtercupFlower size={28} color="#fde68a" />
              ) : (
                <TinyLeaf size={26} color="#bbf7d0" />
              )}
            </motion.div>
          </div>
        </div>

        {/* Card body */}
        <div className="p-6 flex flex-col flex-1">
          <h3
            className="text-xl font-serif font-semibold mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: "#1f2937" }}
          >
            {project.title}
          </h3>

          <p
            className="text-sm leading-relaxed mb-4 flex-1"
            style={{
              color: "#6b7280",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1rem",
              lineHeight: "1.7",
            }}
          >
            {project.description}
          </p>

          {/* Tech stack chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.techStack.map((tech) => {
              const style = techColors[tech] || defaultTechStyle;
              return (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: style.bg,
                    color: style.text,
                    border: `1px solid ${style.border}`,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "0.8rem",
                  }}
                >
                  {tech}
                </span>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-auto">
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{
                background: "linear-gradient(135deg, #be185d, #9d174d)",
                boxShadow: "0 4px 12px rgba(190,24,93,0.25)",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.95rem",
              }}
            >
              <ExternalLink size={13} />
              Live Demo
            </motion.a>
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source code`}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{
                background: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(190,24,93,0.3)",
                color: "#be185d",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.95rem",
              }}
            >
              <Github size={13} />
              Code
            </motion.a>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function ProjectsSection({ data }) {
  const { projects } = data;

  return (
    <section
      id="projects"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fef3f8 0%, #fdf6f0 40%, #f0fdf4 100%)" }}
    >
      {/* BG watercolor blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0">
          <WatercolorBlob width={300} height={220} color="#fce7f3" id="proj-bl1" />
        </div>
        <div className="absolute bottom-20 right-0">
          <WatercolorBlob width={280} height={200} color="#ecfdf5" id="proj-bl2" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <WatercolorBlob width={500} height={350} color="#fefce8" id="proj-bl3" />
        </div>
      </div>

      {/* Floating botanicals */}
      <motion.div
        className="absolute top-10 right-10 hidden lg:block"
        animate={{ rotate: [0, 10, -7, 10, 0], y: [-3, 5, -3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Poppy size={58} color="#fca5a5" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-8 hidden lg:block"
        animate={{ rotate: [0, -8, 6, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <WildLeaf size={46} color="#86efac" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-12 block" style={{ background: "linear-gradient(to right, transparent, #fda4af)" }} />
            <ButtercupFlower size={26} color="#fde68a" />
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
            Featured Projects
          </h2>
          <p className="text-sm tracking-widest uppercase" style={{ color: "#9ca3af", letterSpacing: "0.2em" }}>
            things I've grown from seed
          </p>
        </AnimatedSection>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
