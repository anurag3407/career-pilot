import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Briefcase,
  MapPin,
  Shuffle,
} from "lucide-react";

import data from "../../../../data/dummy_data.json";

export default function FlipCardDeck() {
  const [flippedCards, setFlippedCards] = useState({});
  const [projects, setProjects] = useState(data.projects);

  const toggleFlip = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const shuffleCards = () => {
    const shuffled = [...projects].sort(() => Math.random() - 0.5);
    setProjects(shuffled);
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-white overflow-hidden font-sans">
      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#1e3a8a22,transparent_40%),radial-gradient(circle_at_bottom,#7c3aed22,transparent_40%)]"></div>

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-6">
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src={data.personal.avatar}
          alt={data.personal.name}
          className="w-36 h-36 rounded-full border-4 border-cyan-400 shadow-2xl shadow-cyan-500/30 mb-8 object-cover"
        />

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          {data.personal.name}
        </motion.h1>

        <p className="text-xl md:text-2xl text-gray-300 mt-6">
          {data.personal.title}
        </p>

        <p className="max-w-2xl text-gray-400 mt-6 leading-relaxed">
          {data.personal.bio}
        </p>

        <div className="flex gap-5 mt-10 flex-wrap justify-center">
          <a
            href={data.socials.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition"
          >
            <Github />
          </a>

          <a
            href={data.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition"
          >
            <Linkedin />
          </a>

          <a
            href={`mailto:${data.socials.email}`}
            aria-label="Email"
            className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition"
          >
            <Mail />
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-cyan-400 mb-8">
              About Me
            </h2>

            <p className="text-gray-300 leading-relaxed mb-6">
              {data.personal.bio}
            </p>

            <div className="flex items-center gap-3 text-gray-400">
              <MapPin className="text-cyan-400" />
              <span>{data.personal.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 text-center">
              <h3 className="text-3xl font-bold text-cyan-400">
                {data.stats.yearsExperience}
              </h3>
              <p className="text-gray-400 text-sm">Years</p>
            </div>

            <div className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 text-center">
              <h3 className="text-3xl font-bold text-cyan-400">
                {data.stats.projectsCompleted}
              </h3>
              <p className="text-gray-400 text-sm">Projects</p>
            </div>

            <div className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 text-center">
              <h3 className="text-3xl font-bold text-cyan-400">
                {data.stats.happyClients}
              </h3>
              <p className="text-gray-400 text-sm">Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center text-cyan-400 mb-16">
          Skills
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {data.skills.map((skill, index) => (
            <div
              key={index}
              className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6"
            >
              <div className="flex justify-between mb-3">
                <span>{skill.name}</span>
                <span className="text-cyan-400">{skill.level}%</span>
              </div>

              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <h2 className="text-4xl font-bold text-cyan-400">
            Flip Card Projects
          </h2>

          <button
            onClick={shuffleCards}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition"
          >
            <Shuffle size={18} />
            Shuffle Deck
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              drag
              dragConstraints={{
                left: -60,
                right: 60,
                top: -60,
                bottom: 60,
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="relative h-[420px] cursor-pointer [perspective:1500px]"
              onClick={() => toggleFlip(index)}
            >
              <motion.div
                animate={{
                  rotateY: flippedCards[index] ? 180 : 0,
                }}
                transition={{ duration: 0.7 }}
                className="relative w-full h-full"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* FRONT SIDE */}
                <div
                  className="absolute inset-0 rounded-3xl overflow-hidden border border-cyan-500/20 bg-[#131c35]"
                  style={{
                    backfaceVisibility: "hidden",
                  }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-6 flex flex-col justify-between h-[calc(100%-14rem)]">
                    <div>
                      <h3 className="text-2xl font-bold text-cyan-300 mb-4">
                        {project.title}
                      </h3>

                      <p className="text-gray-400 leading-relaxed">
                        Tap card to reveal details
                      </p>
                    </div>

                    <div className="mt-6">
                      <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
                        Flip Me
                      </span>
                    </div>
                  </div>
                </div>

                {/* BACK SIDE */}
                <div
                  className="absolute inset-0 rounded-3xl border border-purple-500/20 bg-[#111827] p-6 flex flex-col justify-between"
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div>
                    <h3 className="text-2xl font-bold text-purple-300 mb-4">
                      {project.title}
                    </h3>

                    <p className="text-gray-300 leading-relaxed mb-6">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-sm bg-purple-500/10 border border-purple-500/20 text-purple-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Live
                      <ExternalLink size={18} />
                    </a>

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-500/30 hover:bg-cyan-500/10 transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Code
                      <Github size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center text-cyan-400 mb-16">
          Experience
        </h2>

        <div className="space-y-8">
          {data.experience.map((exp, index) => (
            <div
              key={index}
              className="bg-white/5 border border-cyan-500/20 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="text-cyan-400" />
                <h3 className="text-2xl font-bold">{exp.role}</h3>
              </div>

              <p className="text-cyan-300 mb-2">
                {exp.company} • {exp.period}
              </p>

              <p className="text-gray-400">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center text-cyan-400 mb-16">
          Testimonials
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {data.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/5 border border-cyan-500/20 rounded-3xl p-8"
            >
              <p className="italic text-gray-300 mb-6">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-cyan-300 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <footer className="relative z-10 border-t border-cyan-500/10 py-16 px-6 text-center">
        <h2 className="text-4xl font-bold text-cyan-400 mb-6">
          Contact
        </h2>

        <p className="text-gray-400 mb-8">
          Reach out and let's build something amazing.
        </p>

        <div className="flex justify-center gap-6">
          <a
            href={data.socials.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hover:text-cyan-400 transition"
          >
            <Github size={28} />
          </a>

          <a
            href={data.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="hover:text-cyan-400 transition"
          >
            <Linkedin size={28} />
          </a>

          <a
            href={`mailto:${data.socials.email}`}
            aria-label="Email"
            className="hover:text-cyan-400 transition"
          >
            <Mail size={28} />
          </a>
        </div>

        <p className="text-gray-500 text-sm mt-10">
          © 2026 {data.personal.name}
        </p>
      </footer>
    </div>
  );
}