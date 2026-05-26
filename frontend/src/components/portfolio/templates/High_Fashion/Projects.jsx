import React from "react";
import { Github, ExternalLink, ArrowUpRight, Sparkles } from "lucide-react";

const projects = [
  {
    title: "Maison Noir",
    category: "Editorial Identity",
    description:
      "A refined portfolio experience shaped with bold typography, intimate spacing, and lookbook-inspired storytelling.",
    tech: ["React", "Tailwind", "Brand UI"],
  },
  {
    title: "The Archive",
    category: "Digital Campaign",
    description:
      "A monochrome campaign showcase designed with cinematic structure, subtle motion, and luxury visual balance.",
    tech: ["Responsive", "Animation", "Frontend"],
  },
  {
    title: "Atelier Édition",
    category: "Creative Direction",
    description:
      "A polished case-study presentation for designers, stylists, photographers, and high-end personal brands.",
    tech: ["Portfolio", "Luxury", "Web"],
  },
];

export default function Projects() {
  return (
    <section className="relative overflow-hidden bg-[#080808] px-6 py-32 text-[#f6f3ed] md:px-12 lg:px-20 lg:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(214,181,109,0.14),transparent_28%),radial-gradient(circle_at_90%_85%,rgba(246,243,237,0.07),transparent_26%)]" />
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#d6b56d] to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-28 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="mb-6 flex items-center gap-3 text-[#d6b56d]">
              <Sparkles className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.55em]">
                Selected Collection
              </p>
            </div>

            <h2 className="font-serif text-7xl font-light uppercase leading-[0.88] tracking-[-0.07em] md:text-9xl lg:text-[8rem]">
              Archive
            </h2>

            <div className="mt-8 h-px w-36 bg-[#d6b56d]" />
          </div>

          <p className="max-w-md text-sm leading-8 text-neutral-400 lg:justify-self-end">
            A selection of digital commissions and creative explorations
            presented through an editorial lens, where craftsmanship, structure,
            and visual refinement define every detail.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className={`group relative overflow-hidden border border-[#f6f3ed]/10 bg-[#f6f3ed]/[0.025] p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#d6b56d]/70 hover:bg-[#f6f3ed]/[0.055] ${
                index === 1 ? "lg:translate-y-16" : ""
              } ${index === 2 ? "lg:-translate-y-8" : ""}`}
            >
              <span className="pointer-events-none absolute -right-6 -top-8 font-serif text-[9rem] leading-none text-[#f6f3ed]/[0.035]">
                0{index + 1}
              </span>

              <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-[#d6b56d]/10 blur-3xl transition-all duration-700 group-hover:bg-[#d6b56d]/20" />

              <div className="relative mb-10 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.45em] text-neutral-500">
                  Collection 0{index + 1}
                </span>
                <ArrowUpRight className="h-5 w-5 text-[#d6b56d] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>

              <div className="relative mb-10 flex h-72 items-center justify-center overflow-hidden border border-[#f6f3ed]/10 bg-gradient-to-br from-[#161616] via-[#0b0b0b] to-black">
                <span className="absolute font-serif text-[10rem] font-light uppercase tracking-[-0.12em] text-[#f6f3ed]/[0.045] transition-transform duration-700 group-hover:scale-110">
                  HF
                </span>

                <div className="h-40 w-px bg-gradient-to-b from-transparent via-[#d6b56d]/70 to-transparent" />

                <div className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.45em] text-neutral-500">
                  Lookbook / {index + 1}
                </div>
              </div>

              <p className="mb-4 text-xs uppercase tracking-[0.36em] text-[#d6b56d]">
                {project.category}
              </p>

              <h3 className="mb-5 font-serif text-4xl font-light uppercase leading-none tracking-[-0.04em]">
                {project.title}
              </h3>

              <p className="mb-9 text-sm leading-7 text-neutral-400">
                {project.description}
              </p>

              <div className="mb-9 flex flex-wrap gap-2">
                {project.tech.map((item) => (
                  <span
                    key={item}
                    className="border border-[#f6f3ed]/10 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-neutral-400"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-[#f6f3ed]/10 pt-5">
                <button className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-neutral-300 transition-colors hover:text-[#d6b56d]">
                  <Github className="h-4 w-4" />
                  Code
                </button>

                <button className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-neutral-300 transition-colors hover:text-[#d6b56d]">
                  <ExternalLink className="h-4 w-4" />
                  Live
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}