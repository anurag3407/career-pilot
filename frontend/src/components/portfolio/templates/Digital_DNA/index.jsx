import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from "framer-motion";
function DNAHelix() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="relative h-80 flex justify-center items-center overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <React.Fragment key={i}>
  <motion.div
    animate={{
      x: [0, 100, 0, -100, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay: i * 0.2,
    }}
    className="absolute w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee]"
    style={{ top: `${i * 22}px` }}
  />

  {/* DNA Strand */}
  <div
    className="absolute h-[2px] bg-white/40"
    style={{
      width: "200px",
      top: `${i * 22 + 8}px`,
    }}
  />

  <motion.div
    animate={{
      x: [0, -100, 0, 100, 0],
      rotate: [360, 180, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay: i * 0.2,
    }}
    className="absolute w-4 h-4 rounded-full bg-pink-500 shadow-[0_0_20px_#ec4899]"
    style={{ top: `${i * 22}px` }}
  />
</React.Fragment>
      ))}
    </div>
  );
}
/**
 * Digital DNA Portfolio Template
 * Category: 3D / WebGL
 * Description: Rotating DNA double-helix hero section with biotech-inspired color palette (cyan, magenta, white). Animated helix using CSS transforms and keyframes.
 */
export default function DigitalDNA() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-3xl w-full text-center">

  <DNAHelix />

  <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
    {data.personal.name}
  </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8">{data.personal.title}</p>
        <div className="p-8 border-2 border-dashed border-cyan-500/40 rounded-2xl bg-gray-900/50 backdrop-blur-sm">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
            3D / WebGL
          </span>
          <h2 className="text-2xl font-bold text-gray-200 mb-3">Digital DNA Template</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Rotating DNA double-helix hero section with biotech-inspired color palette (cyan, magenta, white). Animated helix using CSS transforms and keyframes.
          </p>
          <p className="text-cyan-400 font-semibold">Open an issue to contribute and build this template!</p>
        </div>
      </div>
            {/* Stats Section */}
      <section className="py-16 w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-4xl font-bold text-cyan-400">
              {data.stats.yearsExperience}
            </h3>
            <p className="text-gray-400 mt-2">
              Years Experience
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-4xl font-bold text-pink-400">
              {data.stats.projectsCompleted}
            </h3>
            <p className="text-gray-400 mt-2">
              Projects Completed
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl">
            <h3 className="text-4xl font-bold text-white">
              {data.stats.happyClients}
            </h3>
            <p className="text-gray-400 mt-2">
              Happy Clients
            </p>
          </div>

        </div>
      </section>
            {/* About Section */}
      <section className="py-20 w-full max-w-6xl px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400">
          About Me
        </h2>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <img
              src={data.personal.avatar}
              alt={data.personal.name || "Profile Avatar"}
              className="w-72 h-72 rounded-full object-cover border-4 border-cyan-500"
            />
          </div>

          <div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {data.personal.bio}
            </p>

            <p className="mt-6 text-cyan-400 font-semibold">
              📍 {data.personal.location}
            </p>

            <p className="mt-3 text-pink-400 italic">
              "{data.personal.tagline}"
            </p>
          </div>
        </div>
      </section>
            {/* Skills Section */}
      <section className="py-20 w-full max-w-6xl px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400">
          Skills
        </h2>

        <div className="space-y-6">
          {data.skills.map((skill, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold">{skill.name}</span>
                <span>{skill.level}%</span>
              </div>

              <div className="w-full bg-gray-800 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-pink-500 h-3 rounded-full"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              <p className="text-sm text-gray-500 mt-1">
                {skill.category}
              </p>
            </div>
          ))}
        </div>
      </section>
            {/* Projects Section */}
      <section className="py-20 w-full max-w-7xl px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400">
          Projects
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition"
            >
              <img
                src={project.image}
                alt={project.title || "Project Screenshot"}
                className="w-full h-48 object-cover"
              />

              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">
                  {project.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    Live Demo
                  </a>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-400 hover:underline"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
            {/* Experience Section */}
      <section className="py-20 w-full max-w-6xl px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400">
          Experience
        </h2>

        <div className="space-y-8">
          {data.experience.map((job, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6 rounded-xl border border-cyan-500/20"
            >
              <h3 className="text-2xl font-bold">
                {job.role}
              </h3>

              <p className="text-cyan-400">
                {job.company}
              </p>

              <p className="text-gray-500 mb-3">
                {job.period}
              </p>

              <p className="text-gray-300">
                {job.description}
              </p>
            </div>
          ))}
        </div>
      </section>
            {/* Testimonials Section */}
      <section className="py-20 w-full max-w-7xl px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-cyan-400">
          Testimonials
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {data.testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-gray-900 p-6 rounded-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={item.avatar}
                  alt={item.name || "Profile Avatar"}
                  className="w-14 h-14 rounded-full"
                />

                <div>
                  <h3 className="font-bold">
                    {item.name}
                  </h3>

                  <p className="text-cyan-400 text-sm">
                    {item.role}
                  </p>
                </div>
              </div>

              <p className="text-gray-300">
                "{item.text}"
              </p>
            </div>
          ))}
        </div>
      </section>
            {/* Contact Section */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-bold mb-10 text-cyan-400">
          Contact
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          <a
            href={data.socials.github}
            className="text-cyan-400 hover:underline"
          >
            GitHub
          </a>

          <a
            href={data.socials.linkedin}
            className="text-pink-400 hover:underline"
          >
            LinkedIn
          </a>

          <a
            href={data.socials.twitter}
            className="text-white hover:underline"
          >
            Twitter
          </a>

          <a
            href={`mailto:${data.socials.email}`}
            className="text-cyan-400 hover:underline"
          >
            Email
          </a>
        </div>
      </section>
    </div>
  );
}
