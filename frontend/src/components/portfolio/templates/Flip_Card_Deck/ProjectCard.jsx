import { motion } from "framer-motion";
import { ExternalLink, GitHub } from "lucide-react";

export default function ProjectCard({ project, isFlipped, onToggle }) {
  return (
    <motion.article
      className="group perspective cursor-pointer"
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.22}
      onClick={(event) => {
        if (event.target.closest("a")) return;
        onToggle();
      }}
      onKeyDown={(event) => {
        if (event.target.closest("a")) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
    >
      <motion.div
        className="relative w-full h-96 rounded-[2rem] shadow-2xl border border-white/10 bg-slate-950"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 rounded-[2rem] overflow-hidden bg-slate-950 border border-white/10"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-0">
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/70 to-transparent" />
          </div>
          <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
            <div>
              <span className="inline-flex rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Project
              </span>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight">{project.title}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-300">{project.description}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-300">
              {project.techStack.map((tech) => (
                <span key={tech} className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-[2rem] overflow-hidden border border-cyan-500/20 bg-slate-900/95 p-6 text-slate-100"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex h-full flex-col justify-between">
            <div>
              <span className="inline-flex rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Details
              </span>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">{project.title}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-300">{project.description}</p>
              <div className="mt-6 space-y-3 text-sm text-slate-400">
                <div>
                  <span className="font-semibold text-slate-200">Stack:</span> {project.techStack.join(", ")}
                </div>
                <div>
                  <span className="font-semibold text-slate-200">Status:</span> Interactive preview available.
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Live Preview
                <ExternalLink size={16} />
              </a>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-400 hover:text-cyan-300"
              >
                View Code
                <GitHub size={16} />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
