import React from "react";
import { motion } from "framer-motion";
import data from "../../../../data/dummy_data.json";

export default function CeramicMinimal() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="bg-[#F6F1EB] text-[#3e3a37] min-h-screen">

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          src={data.personal.avatar}
          alt={data.personal.name}
          className="w-40 h-40 rounded-full object-cover shadow-2xl border-8 border-white"
        />

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mt-8"
        >
          {data.personal.name}
        </motion.h1>

        <p className="text-xl md:text-2xl text-[#8b6f47] mt-4">
          {data.personal.title}
        </p>

        <p className="max-w-2xl mt-6 text-lg text-[#6b5f55]">
          {data.personal.tagline}
        </p>
      </section>

      {/* ABOUT */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-8">
          About Me
        </h2>

        <div className="bg-white rounded-[32px] p-8 shadow-lg">
          <p className="leading-relaxed text-lg">
            {data.personal.bio}
          </p>

          <p className="mt-6 text-[#8b6f47] font-medium">
            📍 {data.personal.location}
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[32px] p-8 text-center shadow-lg">
            <h3 className="text-5xl font-bold text-[#c7a77f]">
              {data.stats.yearsExperience}+
            </h3>
            <p>Years Experience</p>
          </div>

          <div className="bg-white rounded-[32px] p-8 text-center shadow-lg">
            <h3 className="text-5xl font-bold text-[#c7a77f]">
              {data.stats.projectsCompleted}+
            </h3>
            <p>Projects Completed</p>
          </div>

          <div className="bg-white rounded-[32px] p-8 text-center shadow-lg">
            <h3 className="text-5xl font-bold text-[#c7a77f]">
              {data.stats.happyClients}+
            </h3>
            <p>Happy Clients</p>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-10">
          Skills
        </h2>

        <div className="flex flex-wrap gap-4">
          {data.skills.map((skill) => (
            <span
              key={skill.name}
              className="px-5 py-3 rounded-full bg-white shadow-md"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-10">
          Projects
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project) => (
            <div
              key={project.title}
              className="bg-white rounded-[32px] overflow-hidden shadow-lg"
            >
              <img
                src={project.image}
                alt={project.title}
                className="h-56 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="font-bold text-2xl mb-3">
                  {project.title}
                </h3>

                <p className="text-[#6b5f55] text-sm">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-3 py-1 rounded-full bg-[#E8DDD6]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 mt-5">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-[#c7a77f] text-white"
                  >
                    Live
                  </a>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full border border-[#c7a77f]"
                  >
                    Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-10">
          Experience
        </h2>

        <div className="space-y-6">
          {data.experience.map((job, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[32px] p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold">
                {job.role}
              </h3>

              <p className="text-[#8b6f47] font-medium">
                {job.company}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {job.period}
              </p>

              <p className="mt-4">
                {job.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-10">
          Testimonials
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {data.testimonials.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-[32px] p-8 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-5">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-14 h-14 rounded-full"
                />

                <div>
                  <h4 className="font-bold">
                    {item.name}
                  </h4>
                  <p className="text-sm text-[#8b6f47]">
                    {item.role}
                  </p>
                </div>
              </div>

              <p className="italic">
                "{item.text}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-24 text-center px-6">
        <h2 className="text-5xl font-bold mb-6">
          Let's Work Together
        </h2>

        <p className="text-lg text-[#6b5f55] mb-8">
          Open to freelance work, collaborations and opportunities.
        </p>

        <a
          href={`mailto:${data.socials.email}`}
          className="inline-block px-8 py-4 rounded-full bg-[#c7a77f] text-white font-semibold shadow-lg"
        >
          Contact Me
        </a>
      </section>
    </div>
  );
}