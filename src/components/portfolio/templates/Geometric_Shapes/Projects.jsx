import React from "react";

const projects = [
  {
    title: "Polygon Portfolio",
    desc: "A modern geometric portfolio design with smooth layouts and clean responsiveness.",
    color: "from-pink-500 to-orange-400",
  },
  {
    title: "Shape Animation UI",
    desc: "Interactive animated cards using geometric backgrounds and layered effects.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Creative Dashboard",
    desc: "Dashboard UI focused on sharp edges, gradients, and futuristic styling.",
    color: "from-violet-500 to-purple-500",
  },
];

export default function Projects() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black px-6 py-20 text-white">
      
      {/* Background Shapes */}
      <div className="absolute top-10 left-10 h-32 w-32 rotate-45 bg-pink-500 opacity-20 blur-2xl"></div>
      <div className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-cyan-500 opacity-20 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 border border-white/10 rotate-12"></div>

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-6xl">
        <h2 className="mb-4 text-center text-4xl font-extrabold tracking-wide md:text-5xl">
          Geometric Projects Section
        </h2>

        <p className="mx-auto mb-14 max-w-2xl text-center text-gray-400">
          A collection of modern projects designed with geometric inspiration,
          responsive layouts, and futuristic visuals.
        </p>

        {/* Project Cards */}
        <div className="absolute top-10 left-10 w-40 h-40 rotate-45 bg-cyan-500/20 blur-3xl"></div>

<div className="absolute bottom-20 right-20 w-52 h-52 rounded-full bg-blue-500/10 blur-3xl"></div>

<div className="absolute top-1/2 left-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 rotate-12 border border-cyan-400/20"></div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-black/40 p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]"
            >
              
              {/* Decorative Shape */}
              <div
                className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${project.color} opacity-30 blur-2xl`}
              ></div>

              <div className="relative z-10">
                <div className="mb-5 h-14 w-14 rotate-12 rounded-xl border border-white/20 bg-white/10"></div>

                <h3 className="mb-3 text-2xl font-bold">
                  {project.title}
                </h3>

                <p className="text-sm leading-6 text-gray-300">
                  {project.desc}
                </p>

                <button className="mt-6 rounded-full border border-white/20 px-5 py-2 text-sm transition hover:bg-white hover:text-black">
                  View Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}