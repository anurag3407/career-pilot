import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Github, FolderGit2 } from "lucide-react";

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Projects({ data }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const projects = data?.projects ?? [];
  const projectsSection = data?.projectsSection ?? {};

  if (projects.length === 0) return null;

  return (
    <section
      ref={ref}
      className="relative w-full px-4 py-24 sm:px-6 md:py-32 lg:px-8"
    >
      {/* ── Section Header ── */}
      <motion.div
        className="mx-auto mb-16 max-w-3xl text-center md:mb-20"
        variants={titleVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-4 py-1.5 backdrop-blur-md">
          <FolderGit2 className="h-3.5 w-3.5 text-sky-200/70" />
          <span className="text-xs font-medium tracking-widest text-white/50 uppercase">
            {projectsSection.sectionLabel || "Portfolio"}
          </span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
          {projectsSection.heading || "Featured Projects"}
        </h2>

        {/* Glass underline */}
        <div className="relative mx-auto mt-5 h-px w-24 overflow-hidden rounded-full sm:w-32">
          <div className="absolute inset-0 rounded-full bg-linear-to-r from-transparent via-white/35 to-transparent" />
          <motion.div
            className="absolute inset-y-0 -left-full w-full bg-linear-to-r from-transparent via-sky-200/70 to-transparent"
            animate={{ x: ["0%", "300%"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </motion.div>

      {/* ── Projects Grid ── */}
      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8"
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {projects.map((project) => (
          <ProjectCard
            key={
              project.id ??
              project.slug ??
              `${project.title ?? "project"}-${project.githubUrl ?? ""}`
            }
            project={project}
            liveLabel={projectsSection.liveLabel}
            sourceLabel={projectsSection.sourceLabel}
          />
        ))}
      </motion.div>
    </section>
  );
}

/* ───────────────────────── Project Card ───────────────────────── */

function ProjectCard({ project, liveLabel, sourceLabel }) {
  const {
    title = "",
    description = "",
    techStack = [],
    liveUrl,
    githubUrl,
    image,
  } = project;

  return (
    <motion.div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-colors duration-500 hover:border-white/20 hover:bg-white/7"
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: "easeOut" } }}
      style={{ willChange: "transform, opacity" }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(56,189,248,0.22)",
          background:
            "radial-gradient(120% 90% at 10% 0%, rgba(56,189,248,0.14) 0%, transparent 60%)",
        }}
      />
      {/* Subtle glow on hover */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-white/8 via-transparent to-transparent" />
      </div>

      {/* ── Image Area ── */}
      <div className="relative aspect-video w-full overflow-hidden">
        {image ? (
          <motion.img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/3">
            <FolderGit2 className="h-12 w-12 text-white/10" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* Title overlay at the bottom of the image */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-4">
          <h3 className="text-lg font-semibold tracking-tight text-white drop-shadow-md sm:text-xl">
            {title}
          </h3>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="relative flex flex-1 flex-col gap-4 p-5 pt-4">
        {/* Description */}
        {description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-white/50">
            {description}
          </p>
        )}

        {/* Tech Stack Pills */}
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/8 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white/40 backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Spacer to push buttons to the bottom */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {liveUrl && (
            <motion.a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/7 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur-sm transition-colors duration-300 hover:bg-white/12 hover:text-white"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {liveLabel || "Live Demo"}
            </motion.a>
          )}

          {githubUrl && (
            <motion.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/7 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur-sm transition-colors duration-300 hover:bg-white/12 hover:text-white"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <Github className="h-3.5 w-3.5" />
              {sourceLabel || "Source Code"}
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
