import { GitHub, ExternalLink, Palette } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "Color Bloom",
      description:
        "A vibrant portfolio concept inspired by watercolor splashes and artistic creativity.",
      tags: ["React", "Tailwind", "Creative UI"],
      codeUrl: "#",
      liveUrl: "#",
    },
    {
      title: "Canvas Dreams",
      description:
        "A modern interface with fluid layouts, soft gradients, and expressive visual elements.",
      tags: ["Frontend", "Responsive", "Design"],
      codeUrl: "#",
      liveUrl: "#",
    },
    {
      title: "Pastel Motion",
      description:
        "An artistic experience combining smooth interactions with watercolor-inspired visuals.",
      tags: ["Animation", "UI/UX", "Modern"],
      codeUrl: "#",
      liveUrl: "#",
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-100 via-orange-50 to-sky-100 px-6 py-20">
      
      {/* Background Paint Splashes */}
      <div className="absolute top-0 left-0 h-80 w-80 rounded-[40%] bg-pink-300/40 blur-3xl"></div>

      <div className="absolute right-0 top-40 h-96 w-96 rounded-[45%] bg-blue-300/30 blur-3xl"></div>

      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-[35%] bg-orange-200/40 blur-3xl"></div>

      {/* Heading */}
      <div className="relative z-10 mb-16 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <Palette className="h-8 w-8 text-pink-600" />

          <h2 className="text-4xl font-bold text-gray-800 md:text-5xl">
            Paint Splash Projects
          </h2>
        </div>

        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
          A collection of creative projects designed with soft watercolor
          aesthetics, fluid layouts, and expressive visuals.
        </p>
      </div>

      {/* Project Cards */}
      <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.title}
            className="group rounded-[30px] bg-white/70 p-7 shadow-xl backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Decorative Splash */}
            <div className="mb-6 h-20 w-20 rounded-[40%] bg-gradient-to-br from-pink-200 to-orange-200 opacity-70 blur-2xl"></div>

            <h3 className="mb-4 text-2xl font-semibold text-gray-800">
              {project.title}
            </h3>

            <p className="mb-6 leading-relaxed text-gray-600">
              {project.description}
            </p>

            {/* Tags */}
            <div className="mb-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-pink-100 px-4 py-1 text-sm text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} code (opens in new tab)`}
                className="flex items-center gap-2 rounded-full bg-pink-200 px-4 py-2 text-gray-800 transition hover:bg-pink-300"
              >
                <GitHub size={18} />
                Code
              </a>

              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} live demo (opens in new tab)`}
                className="flex items-center gap-2 rounded-full bg-blue-200 px-4 py-2 text-gray-800 transition hover:bg-blue-300"
              >
                <ExternalLink size={18} />
                Live
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}