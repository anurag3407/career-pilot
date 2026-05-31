import React, { useEffect, useState } from "react";
import { ArrowUpRight, FolderKanban } from "lucide-react";
const projects = [
  {
    title: "FoldAI",
    description:
      "AI-powered productivity assistant with clean workflow automation and smart collaboration tools.",
    tech: ["React", "OpenAI", "Tailwind"],
    rotate: "rotate-1",
  },
  {
    title: "PaperStack",
    description:
      "Minimal task management platform inspired by origami-style organization systems.",
    tech: ["Next.js", "MongoDB", "TypeScript"],
    rotate: "-rotate-1",
  },
  {
    title: "Crease Studio",
    description:
      "Creative collaboration workspace for designers, developers, and visual thinkers.",
    tech: ["Firebase", "Framer Motion", "Node.js"],
    rotate: "rotate-2",
  },
];

export default function Projects() {
  const [visible, setVisible] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#f6f1e7] px-6 py-24 md:px-12">
      {/* Background Origami Layers */}
      <div className="absolute left-10 top-10 h-40 w-40 rotate-45 bg-[#efe6d6] border border-black/10 animate-pulse" />
      <div className="absolute bottom-10 right-10 h-52 w-52 rotate-12 bg-[#f1e3cc] border border-black/10 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#f8f4ec] opacity-40 animate-pulse" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border-2 border-black bg-white px-5 py-2 shadow-[6px_6px_0px_#000]">
            <FolderKanban size={18} />
            <span className="font-mono text-xs uppercase tracking-widest">
              Origami Portfolio
            </span>
          </div>

          <h2 className="mt-6 text-5xl md:text-6xl font-black tracking-tight text-black">
            Folded Creations
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-700 text-lg leading-relaxed">
            Every project is folded like paper — layered, intentional, and
            structured with precision to reflect creative engineering.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.title}
              onClick={() => setActiveProject(project)}
              className={`
                group relative cursor-pointer bg-white border-2 border-black p-6
                shadow-[8px_8px_0px_#000]
                transition-all duration-700
                hover:-translate-y-2 hover:rotate-0 hover:shadow-[14px_14px_0px_#000]
                [transform-style:preserve-3d]
                hover:[transform:perspective(800px)_rotateX(6deg)_rotateY(-6deg)]
                ${project.rotate}
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
              `}
            >
              {/* Fold Corner */}
              <div className="absolute top-0 right-0 h-12 w-12 bg-[#e9dcc7] border-b-2 border-l-2 border-black" />

              {/* Paper Shadow Layer */}
              <div className="absolute -bottom-3 -left-3 w-full h-full bg-[#efe6d6] border-2 border-black -z-10 opacity-80" />

              {/* Title Row */}
              <div className="flex items-start justify-between mb-5">
                <h3 className="text-2xl font-extrabold text-black">
                  {project.title}
                </h3>

                <button
                  aria-label={`Open ${project.title}`}
                  className="h-10 w-10 flex items-center justify-center border-2 border-black bg-[#f7efe3] transition-transform group-hover:rotate-12"
                >
                  <ArrowUpRight size={18} />
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs font-medium border border-black bg-[#f8f4ec] transition-all group-hover:-translate-y-[1px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* subtle fold line */}
              <div className="absolute left-0 top-0 w-full h-[1px] bg-black/10" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <button className="border-2 border-black bg-black px-10 py-4 text-white font-bold shadow-[6px_6px_0px_#cbb89d] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_#cbb89d]">
            View All Projects
          </button>
        </div>
      </div>

      {/* Modal */}
      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="relative w-[90%] max-w-lg border-2 border-black bg-[#f8f4ec] p-6 shadow-[10px_10px_0px_#000]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-2">
              {activeProject.title}
            </h2>

            <p className="text-gray-700 mb-4">
              {activeProject.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {activeProject.tech.map((t) => (
                <span
                  key={t}
                  className="border border-black px-2 py-1 text-xs"
                >
                  {t}
                </span>
              ))}
            </div>

            <button
              onClick={() => setActiveProject(null)}
              className="mt-6 border-2 border-black bg-black text-white px-4 py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
