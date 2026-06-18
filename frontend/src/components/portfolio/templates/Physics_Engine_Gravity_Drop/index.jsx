import React from "react";

export default function PhysicsEngineGravityDrop({
  portfolioData,
}) {
  const data = portfolioData || {};

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-6xl font-bold mb-4">
          {data?.personal?.name || "Physics Engine Gravity Drop"}
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl">
          {data?.personal?.tagline ||
            "Interactive Physics Based Portfolio"}
        </p>
      </section>

      {/* About */}
      <section className="py-20 px-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">About</h2>

        <p className="text-gray-300">
          {data?.personal?.bio ||
            "Portfolio powered by a gravity-based physics engine."}
        </p>
      </section>

      {/* Skills */}
      <section className="py-20 px-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">Skills</h2>

        <div className="flex flex-wrap gap-4">
          {data?.skills?.map((skill, index) => (
            <div
              key={index}
              className="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700"
            >
              {skill.name}
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="py-20 px-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">Projects</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.projects?.map((project, index) => (
            <div
              key={index}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6"
            >
              <h3 className="text-2xl font-semibold mb-3">
                {project.title}
              </h3>

              <p className="text-gray-400 text-sm">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Contact
        </h2>

        <p className="text-gray-400">
          {data?.socials?.email}
        </p>
      </section>
    </div>
  );
}